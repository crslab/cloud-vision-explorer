import os
import sys
import torch
import numpy as np
from torchvision import transforms, utils, datasets
from torch import nn, optim
from torch.autograd import Variable

sx = 128
imgsize = sx*sx*3
nusers = 100


class VAE(nn.Module):
    def __init__(self, image_size=imgsize, h_dim=600, z_dim=256):
        super(VAE, self).__init__()
        self.encoder = nn.Sequential(
            nn.Linear(image_size, h_dim*2),
            nn.ReLU(),  # nn.LeakyReLU(0.2),
            nn.Linear(h_dim*2, int(h_dim*1.5)),
            nn.ReLU(),  # nn.LeakyReLU(0.2),
            nn.Linear(int(h_dim*1.5), h_dim),
            nn.ReLU(),  # nn.LeakyReLU(0.2),
            nn.Linear(h_dim, z_dim*2))  # 2 for mean and variance.

        self.decoder = nn.Sequential(
            nn.Linear(z_dim, h_dim),
            nn.ReLU(),
            nn.Linear(h_dim, int(h_dim*1.5)),
            nn.ReLU(),
            nn.Linear(int(h_dim*1.5), h_dim*2),
            nn.ReLU(),
            nn.Linear(h_dim*2, image_size),
            nn.Sigmoid())

        self.useremb = nn.Embedding(nusers, z_dim)

    def reparameterize(self, mu, log_var):
        """"z = mean + eps * sigma where eps is sampled from N(0, 1)."""
        eps = to_var(torch.randn(mu.size(0), mu.size(1)))
        z = mu + eps * torch.exp(log_var/2)    # 2 for convert var to std
        return z

    def getReconImg(self, imgs):
        h = self.encoder(imgs)
        mu, log_var = torch.chunk(h, 2, dim=1)  # mean and log variance.
        z = self.reparameterize(mu, log_var)
        reconimgs = self.decoder(z)
        return reconimgs, mu, log_var

    def reconImgFromEmb(self, zs):
        reconimgs = self.decoder(zs)
        return reconimgs

    def getUserEmb(self, uidxs):
        return self.useremb(uidxs)

    def getImgEmb(self, imgs):
        h = self.encoder(imgs)
        mu, log_var = torch.chunk(h, 2, dim=1)  # mean and log variance.
        z = self.reparameterize(mu, log_var)
        return z, mu, log_var

    def forward(self, imgs, uids):
        h = self.encoder(imgs)
        mu, log_var = torch.chunk(h, 2, dim=1)  # mean and log variance.
        z = self.reparameterize(mu, log_var)
        reconimgs = self.decoder(z)

        # get user embeddings
        usz = self.useremb(uids)
        pratings = (z*usz).sum(1)

        return reconimgs, usz, pratings, mu, log_var

    def sample(self, z):
        return self.decoder(z)
