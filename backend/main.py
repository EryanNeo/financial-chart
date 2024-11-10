from config import app
from pymongo import MongoClient
from flask import jsonify

mongo = MongoClient('mongodb://localhost:27017')

@app.route('/')
def index():
    return 'Hello World!'

@app.route('/data/<script>/<date>')
def data(script,date):
    data = (mongo[script]['5Minute'].find_one({'date': date}))  #{'_id': ObjectId('2024-01-01')}
    if 'candles' in data:
        data = data['candles']
    # for item in data:
    #     item['time'] += 19800
    return jsonify((data))
    
if __name__=='__main__':
    app.run(debug = True)

