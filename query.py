import threading
from scraper import flipkart, reliance, shopclues
from statistics import mode, StatisticsError

def sort_relevancy(results, q):
    query_words = q.lower().split()  # Split the query into individual words
    results = [
        item for item in results
        if all( any(word == item_word.lower() for item_word in item["name"].lower().split()) for word in query_words) and len(query_words) > 0
    ]
    if len(results) == 0:
        return None

    try: avgPrice = int(mode(float(item['price']) for item in results if 'price' in item))
    except StatisticsError: avgPrice = results[0]['price']
    minPrice = avgPrice - int(20 / 100 * avgPrice)
    maxPrice = avgPrice + int(20 / 100 * avgPrice)
    results = sorted(results, key=lambda x: (int(x.get('price', 0)), -float(x.get('rating', 0))))
    results = [result for result in results if minPrice <= int(result['price']) <= maxPrice]

    return results

def search(cursor, dumps, q):
    cursor.execute("SELECT result FROM cache WHERE query = ?", (q,))
    cached_result = cursor.fetchone()
    if cached_result:
        return cached_result[0]  # Return the cached result

    fp = []
    rp = []
    sp = []

    def flipkart_search():
        nonlocal fp
        fp = flipkart.search(q)

    def reliance_search():
        nonlocal rp
        rp = reliance.search(q)

    def shopclues_search():
        nonlocal sp
        sp = shopclues.search(q)

    threads = [
        threading.Thread(target=flipkart_search),
        threading.Thread(target=reliance_search),
        threading.Thread(target=shopclues_search)
    ]

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()
    
    results = fp + rp + sp
    results = sort_relevancy(results, q)

    cursor.execute("INSERT INTO cache (query, result) VALUES (?, ?)", (q, dumps(results)))

    return results