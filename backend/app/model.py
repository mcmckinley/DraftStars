import torch
import torch.nn as nn

from .config import *

from .csv_to_embedding import csv_to_embedding

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
    

traits_per_brawler = 44
traits_per_map = 10
num_heads = 2
num_layers = 4
dim_feedforward = 128

empty_brawler_embedding = nn.Embedding.from_pretrained(torch.zeros(len(brawlers), traits_per_brawler))
empty_map_embedding = nn.Embedding.from_pretrained(torch.zeros(len(maps), traits_per_map))

example_brawler = 0

model = Model(traits_per_brawler, empty_brawler_embedding, traits_per_map, empty_map_embedding, num_heads, num_layers, dim_feedforward)
model.load_state_dict(torch.load(path_to_model, weights_only=True))

#print('NEUTRAL BRAWLER')
#print(model.brawler_embedding.weight[33])

#for name, param in model.named_parameters():
#    print(f' {name}: {param}')

#n = torch.mean(adjusted_brawler_embedding.weight, dim=0)
#adjusted_brawler_embedding.weight[33] = n

with torch.no_grad():
    adjusted_map_embedding = csv_to_embedding(path_to_map_embeddings)
    adjusted_brawler_embedding = csv_to_embedding(path_to_brawler_embeddings)

    # 'Neutral' brawler; represents the averages of all other brawlers. 
    # Used as a placeholder during higher-order decisons.
    n = torch.mean(adjusted_brawler_embedding.weight, dim=0)
    adjusted_brawler_embedding.weight[33] = n

    model.brawler_embedding.weight.copy_(adjusted_brawler_embedding.weight)
    model.map_embedding = adjusted_map_embedding

    # print('shelly weight:', model.brawler_embedding.weight[0])
    print('Model has been loaded and is ready for inference.')

model.eval()