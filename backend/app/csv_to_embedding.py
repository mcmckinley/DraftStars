# Read embeddings from a .csv file; convert them to a pytorch pretrained embedding
import torch
import pandas as pd 

def csv_to_embedding(path_to_csv):
    data = pd.read_csv(path_to_csv).to_numpy(dtype='float32')

    embedding = torch.from_numpy(data).float()

    return torch.nn.Embedding.from_pretrained(embedding)