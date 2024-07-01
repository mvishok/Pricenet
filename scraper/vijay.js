import bent from 'bent';

const vijay = async (q) => {
    const post = bent('https://www.vijaysales.com/searchpagenew.aspx', 'POST', 'json', 200, {
        "accept": "application/json, text/javascript, * / *; q=0.01",
        "accept-language": "en-US,en;q=0.5",
        "content-type": "application/json;charset=UTF-8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "x-requested-with": "XMLHttpRequest"
    });
    const response = await post('/loadProductsUnbxdapi', {
        "pageNo": 1,
        "SearchData": q,
        "MinPriceData": "*",
        "MaxPriceData": "*",
        "FilterData": "",
        "URLData": "",
        "isDefault": "true",
        "SortBy": "0",
        "inStock": "false"
    });
    
    const results = response.d.prdlist
    const data = [];

    for (const result of results){
        data.push({
            "title": result.title,
            "link": result.productUrl,
            "rating": 404,
            "price": result.sellingPrice,
            "freeDelivery": true,
            "desc": `${result.brand} · ${result.category} · ${result.subCategory} · ${result.offerAvailable}`,
            "img": result.imageURL,
            "trust": false
        });
    }

    return data;
}
export default vijay;