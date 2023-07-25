from bs4 import BeautifulSoup
from lxml import etree
from re import sub
import requests

def fetchProduct(product, priceList):
    price = int(sub(r'\D', '', product.xpath('.//*[contains(concat(" ", @class, " "), " _1_WHN1 ") or contains(concat(" ", @class, " "), " _3I9_wc ")]')[0].xpath('string()')))
    if price in priceList:
        return None

    priceList.append(price)
    link = "https://www.flipkart.com" + str(product.xpath('.//a')[0].get('href'))
    name = product.xpath('.//*[contains(concat( " ", @class, " " ), " _4rR01T ") or contains(concat(" ", @class, " "), " s1Q9rs ")]')[0].text
    try:
        rating = float(product.xpath('.//*[contains(concat( " ", @class, " " ),  " _3LWZlK ")]')[0].xpath('string()'))
    except:
        rating = 0
    seller = "Flipkart"
    img = product.xpath('.//*[contains(concat( " ", @class, " " ), concat( " ", "_396cs4", " " ))]')[0].get("src")
    try:
        text = "<img height='21' src='https:" + str(product.xpath('.//*[contains(concat(" ", @class, " "), " _13J9qT ") or contains(concat(" ", @class, " "), " _32g5_j ")]//img')[0].get("src")) + "' />"
    except:
        text = ""
    freeDelivery = price>499
    return {
        "name": name,
        "price": int(price),
        "rating": rating,
        "seller": seller,
        "img": img,
        "text": text,
        "link": link,
        'freeDelivery': freeDelivery
    }

def search(q):
    url = "https://www.flipkart.com/search?q=" + q
    response = requests.get(url).content
    soup = BeautifulSoup(response, 'lxml')
    dom = etree.HTML(str(soup))
    products = dom.xpath('//*[contains(concat( " ", @class, " " ), concat( " ", "_2kHMtA", " " )) or contains(concat( " ", @class, " " ), concat( " ", "_4ddWXP", " " ))]')

    result = []
    priceList = []

    for product in products:
        product_details = fetchProduct(product, priceList)
        if product_details is not None:
            result.append(product_details)
    return result
