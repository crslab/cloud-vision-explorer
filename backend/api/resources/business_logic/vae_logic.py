"""A module defining sample business logic.

Author: Teekayu Klongtruajrok
"""
from domain.decodeAndRatings import decode, generateRatings

class VaeLogic:
    """VAE logic to decode z and get ratings for z."""
    
    def get_image(self, z):
        return decode(z) 
        
    def get_ratings(self, z):
        return generateRatings(z) 
    