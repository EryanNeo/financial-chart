from pymongo import MongoClient
import pandas as pd

mongo = MongoClient('mongodb://localhost:27017')
mongo['script']['data'].insert_many(pd.read_csv('data.csv').to_dict(orient='records'))