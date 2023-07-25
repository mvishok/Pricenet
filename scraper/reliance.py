from bs4 import BeautifulSoup
from lxml import etree
import requests

def fetchProduct(product, priceList):
    price = product.xpath('.//a//div//div[2]//div//div//div//span[2]')[0].xpath('string()').replace(',', '').split('.')[0]
    if price in priceList:
        return None

    priceList.append(price)
    link = "https://www.reliancedigital.in/" + str(product.xpath('.//a')[0].get('href'))
    name = product.xpath('.//p[@class="sp__name"][1]')[0].text
    rating = len(product.xpath('.//li//i[contains(@class, "fa fa-star")]')) + (0.5 * len(product.xpath('.//li//i[contains(@class, "fa fa-star-half-o")]')))
    seller = "Reliance Digital"
    img = "https://www.reliancedigital.in/" + str(product.xpath(".//img[1]")[0].get("data-srcset"))
    text = "<img src='static/assets/img/reliance.png' style='height:15px;width:110px' />" if product.xpath('.//a//div//div[2]//div[2]')[0].xpath('string()')=="offers available" else ""
    freeDelivery = True
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
    url = "https://www.reliancedigital.in/search?q=" + q
    response = requests.get(url).content
    soup = BeautifulSoup(response, 'lxml')
    dom = etree.HTML(str(soup))
    products = dom.xpath('//div[2]/ul/li/div')

    result = []
    priceList = []

    for product in products:
        product_details = fetchProduct(product, priceList)
        if product_details is not None:
            result.append(product_details)

    return result
