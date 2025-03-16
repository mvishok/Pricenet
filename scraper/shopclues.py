from bs4 import BeautifulSoup
from lxml import etree
import requests

def process_product(product, priceList):

    try:
        price = product.xpath('.//span[@class="p_price"]')[0].text.replace('₹', '').replace(',', '').strip()
        if price in priceList:
            return None
        priceList.append(price)

        link = "https:" + str(product.xpath('.//a')[0].get('href'))
        name = product.xpath('.//h2')[0].text
        seller = "ShopClues"
        img = str(product.xpath(".//img[1]")[0].get("data-img"))
        freeDelivery = True if product.xpath("//div[@class='shipping']//span")[0].text == "Free Shipping" else False

        return {
            "name": name,
            "price": int(price),
            "rating": 0,
            "seller": seller,
            "img": img,
            "text": '',
            "link": link,
            'freeDelivery': freeDelivery
        }
    except:
        return {
            "name": "",
            "price": 0,
            "rating": 0.0,
            "seller": "",
            "img": "",
            "text": "",
            "link": "",
            'freeDelivery': False,
        }

def search(q):
    url = "https://www.shopclues.com/search?q=" + q
    response = requests.get(url).content
    soup = BeautifulSoup(response, 'lxml')
    dom = etree.HTML(str(soup))
    products = dom.xpath('//*[contains(concat( " ", @class, " " ), concat( " ", "search_blocks", " " ))]')

    priceList = []
    result = []

    for product in products:
        product_data = process_product(product, priceList)
        if product_data is not None:
            result.append(product_data)

    return result