import torch
import torch.nn as nn

class Model(nn.Module):
    def __init__(self, brawler_emb_dim, initial_brawler_embedding, map_emb_dim, initial_map_embedding, num_heads, num_layers, dim_feedforward):
        super(Model, self).__init__()
        self.brawler_embedding = initial_brawler_embedding
        self.map_embedding = initial_map_embedding

        encoder_layer = nn.TransformerEncoderLayer(
            d_model = brawler_emb_dim + map_emb_dim,
            nhead=num_heads,
            dim_feedforward=dim_feedforward
        )

        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.fc = nn.Linear((brawler_emb_dim + map_emb_dim) * 6, 1, bias=False)
        self.sigmoid = nn.Sigmoid()

        self._reset_parameters()

    def _reset_parameters(self):
        for layer in self.transformer_encoder.layers:
            if hasattr(layer, 'self_attn'):
                layer.self_attn.in_proj_bias.data.fill_(0)
                layer.self_attn.out_proj.bias.data.fill_(0)
            if hasattr(layer, 'linear1'):
                layer.linear1.bias.data.fill_(0)
            if hasattr(layer, 'linear2'):
                layer.linear2.bias.data.fill_(0)

    def forward(self, x):
        brawlers, map = torch.split(x, [6, 1], dim=1)

        map_embedding = self.map_embedding(map).repeat(1, 6, 1)  # Repeat to match the number of brawlers
        brawler_embedding = self.brawler_embedding(brawlers)

        embeddings = torch.cat([map_embedding, brawler_embedding], dim=2)

        embeddings = embeddings.permute(1, 0, 2)  # Transformer expects (seq_len, batch_size, brawler_emb_dim)
        transformer_output = self.transformer_encoder(embeddings)
        transformer_output = transformer_output.permute(1, 0, 2)  # Back to (batch_size, seq_len, brawler_emb_dim)
        flattened_output = transformer_output.reshape(transformer_output.size(0), -1)
        output = self.fc(flattened_output)
        return self.sigmoid(output)