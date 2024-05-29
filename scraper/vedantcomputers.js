import {load} from 'cheerio';
import bent from 'bent';

const vedantcomputers = async (q) => {
    
    const get = bent('https://www.vedantcomputers.com/index.php?route=product/search&search=', 'GET', 'string', 200);    
    const response = await get(
        q
    );

    const $ = load(response);
    const data = [];
    $('.product-thumb').each((index, element) => {
        const title = $(element).find('.caption').find('.name').text()
        if (!title || title == '') return;
        const link = $(element).find('.caption').find('a').attr('href')
        if (!link || link == '') return;
        const rating = parseFloat($(element).find('.fa.fa-stack').length);
        const price = parseInt($(element).find('.price-new').text().replace(/[^0-9.]/g, '').split('.')[0]);
        if (!price  || price == '') return;
        const desc = "No description available.";
        const img = $(element).find("img").attr("data-src");
        let trust = false;

        data.push({ 
            "title": title,
            "link": `${link}`,
            "rating": rating,
            "price": price,
            "freeDelivery": true,
            "desc": desc,
            "img": `${img}`,
            "trust": trust
        });
    });
    return data;
}

export default vedantcomputers;