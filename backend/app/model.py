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
            dim_feedforward=dim_feedforward,
            batch_first=True  # Set batch_first to True
        )

        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.fc = nn.Linear((brawler_emb_dim + map_emb_dim) * 6, 1)  # Assuming 3 characters per match
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        brawlers, map = torch.split(x, [6, 1], dim=1)

        map_embedding = self.map_embedding(map).repeat(1, 6, 1)  # Repeat to match the number of brawlers
        brawler_embedding = self.brawler_embedding(brawlers)

        embeddings = torch.cat([map_embedding, brawler_embedding], dim=2)

        # No need to permute the embeddings now
        transformer_output = self.transformer_encoder(embeddings)
        # No need to permute the transformer_output now
        flattened_output = transformer_output.reshape(transformer_output.size(0), -1)
        output = self.fc(flattened_output)
        return self.sigmoid(output)

traits_per_brawler = 40
brawler_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/8_6/brawler_embeddings_V7_5.pt"))
traits_per_map = 10
map_embedding = nn.Embedding.from_pretrained(torch.load("app/pytorch/8_6/map_embeddings_V7_5.pt"))
num_heads = 2
num_layers = 2
dim_feedforward = 64


# 1. Create a 'Neutral Brawler'. This is an average of all existing brawlers.
n = torch.mean(brawler_embedding.weight, dim=0)
brawler_embedding.weight[33] = n


model = Model(traits_per_brawler, brawler_embedding, traits_per_map, map_embedding, num_heads, num_layers, dim_feedforward)
model.load_state_dict(torch.load("app/pytorch/8_6/BMV7_5.pt"))
model.eval()


