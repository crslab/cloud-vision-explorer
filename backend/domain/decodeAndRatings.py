import os
import sys
import torch
import numpy as np
import uuid

from torchvision import transforms, utils, datasets
from torch import nn, optim
from torch.autograd import Variable
from domain.model import VAE

setattr(sys.modules['__main__'], 'VAE', VAE)
sx = 128
imgsize = sx*sx*3
nusers = 100


def sigmoid(x):
    x = x.data.numpy()
    return 1 / (1 + np.exp(-x))


def generateRatings(z):
    if type(z) is list:
        z = Variable(torch.from_numpy(np.array(z)).float())
    mu_usrs = torch.load('domain/useremb.pt', map_location='cpu')
    pred = torch.matmul(mu_usrs, z)
    pred = sigmoid(pred)
    return pred


def decode(z):
    vae = torch.load('domain/vae_ratings_bestmodel.pt', map_location='cpu')
    if type(z) is list:
        z = Variable(torch.from_numpy(np.array(z)).float())
    fixed_z = z.view(1, 256)
    reconst_z = vae.decoder(fixed_z)
    sx = 128
    reconst_images = reconst_z.view(reconst_z.size(0), 3, sx, sx)

    # build path to serve image
    img_name = str(uuid.uuid4())[:8]
    img_url_prefix = 'output/' + img_name
    local_path_prefix = './' + img_url_prefix

    utils.save_image(reconst_images, local_path_prefix + '_128.png')
    return img_url_prefix + '_128.png'
