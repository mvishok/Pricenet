from flask import Flask, render_template, request
from html import escape
import query
import sqlite3
from json import dumps
#from autocorrect import Speller
#Spell = Speller()

app = Flask(__name__)

conn = sqlite3.connect(":memory:", check_same_thread=False)
cursor = conn.cursor()
conn.execute("CREATE TABLE cache (query TEXT PRIMARY KEY, result TEXT)")

@app.route("/autocomplete", methods=['GET'])
def autocomplete():
    term = request.args.get('term', '')

    cursor = conn.cursor()
    words = term.split()
    query_params = ['%' + word + '%' for word in words]
    query = "SELECT DISTINCT query FROM cache WHERE " + " AND ".join(["query LIKE ?"] * len(words))

    cursor.execute(query, query_params)
    results = [row[0] for row in cursor.fetchall()]
    cursor.close()

    return dumps(results)

@app.route("/")
def home():
    getQuery = request.args.get('query')
    if getQuery is None:
        placeholderText = "Enter product name"
        getQuery = ""
        results = []
        qSpell = False
    else:
        placeholderText = escape(getQuery)
        results = query.search(cursor, dumps, escape(getQuery))
        qSpell = ""  # Spell(getQuery)
        if qSpell == getQuery:
            qSpell = False
    return render_template('index.html', query=getQuery, placeholder=placeholderText, results=results, qSpell=qSpell)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)