import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'twoj_super_tajny_klucz')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
