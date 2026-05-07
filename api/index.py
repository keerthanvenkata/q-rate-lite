import sys
import os

# Add the backend folder to the Python path so it can find its modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from backend.main import app
