"""A module defining core Flask app and routes.

Author: Teekayu Klongtruajrok
"""
import os
from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
from flask_restful import Api
from .resources import VaeRatings, VaeImg

app = Flask(__name__)
cors = CORS(app, resources={"/*": {"origins": "http://localhost:3000"}})
api = Api(app)

api.add_resource(VaeRatings, '/api/VaeHistogram')
api.add_resource(VaeImg, '/api/VaeImg')


@app.route('/output/<path:filename>')
@cross_origin()
def send_output(filename):
    print("Called send_output")
    output_folder = os.path.join(os.getcwd(), 'output/')
    print(output_folder)
    return send_from_directory(output_folder, filename, cache_timeout=-1)
