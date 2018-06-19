"""A module defining Sample resource.

Author: Teekayu Klongtruajrok
"""
from .business_logic import vae_logic
from flask_restful import Resource, reqparse
from flask import request, send_from_directory
import json
import os


class VaeRatings(Resource):
    """Sample resource to test hosting an REST API."""

    def __init__(self):
        self.content = request.get_json()
        self.embed = self.content['z']

    def post(self):
        result = json.dumps(vae_logic.get_ratings(self.embed).tolist())
        return(result)


class VaeImg(Resource):
    """Sample resource to test hosting an REST API."""

    def __init__(self):
        self.content = request.get_json()
        self.embed = self.content['z']

    def post(self):
        result = json.dumps(vae_logic.get_image(self.embed))
        return(result)
