"""Database connection helper for MongoDB"""
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection URL
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DB_NAME = os.getenv('MONGODB_DB_NAME', 'autoapply_db')

# Global database client and instance
client = None
db = None


def connect_db():
    """Connect to MongoDB"""
    global client, db
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        db = client[DB_NAME]
        print(f'✓ Connected to MongoDB: {DB_NAME}')
        return db
    except ConnectionFailure as e:
        print(f'✗ MongoDB connection failed: {e}')
        print(f'  Make sure MongoDB is running on {MONGODB_URI}')
        return None


def get_db():
    """Get database instance"""
    global db
    if db is None:
        connect_db()
    return db


def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print('✓ Disconnected from MongoDB')


def get_collection(collection_name):
    """Get a specific collection"""
    database = get_db()
    if database is not None:
        return database[collection_name]
    print(f'[Database] ERROR: Could not access collection "{collection_name}" - database is None')
    return None
