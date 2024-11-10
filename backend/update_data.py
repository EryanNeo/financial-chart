from pymongo import MongoClient
import json

mongo = MongoClient('mongodb://localhost:27017')

def write_json(data,file):
    with open(file,'w') as f:
        f.write(json.dumps(data,indent=4))
        
def read_json(file):
    with open(file, 'r') as f:
        return json.load(f)
    
database_name = '../frontend/public/database.json'
documents_name = '../frontend/public/documents.json'

write_json(mongo.list_database_names(),database_name)

documents = list(map(lambda x: x['date'],mongo['ADANIENT']['5Minute'].find()))
write_json(documents,documents_name)