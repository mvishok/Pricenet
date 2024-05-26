import {load} from 'cheerio';
import bent from 'bent';

const shopclues = async (q) => {
    const get = bent('https://www.shopclues.com/search?q=', 'GET', 'string', 200);
    const response = await get(q);
    const $ = load(response);
    const data = [];

    $('.column.col3.search_blocks').each((index, element) => {
        const title = $(element).find('h2').text();
        if (!title || title == '') return;
        const link = $(element).find('a').attr('href');
        if (!link || link == '') return;
        const rating = 404;
        const price = parseInt($(element).find('.p_price').text().match(/\d+/g).join(''));
        if (!price  || price == '') return;
        let freeDelivery = false;
        if ($(element).find('.shipping').text().toLowerCase().includes("free")){
            freeDelivery = true;
        }
        const desc = $(element).find('.prd_discount').text();
        const img = $(element).find('img').attr('src');
        const trust = false;
        
        data.push({ 
            "title": title,
            "link": `https:${link}`,
            "rating": rating,
            "price": price,
            "freeDelivery": freeDelivery,
            "desc": desc,
            "img": img,
            "trust": trust
        });
    });
    return data;
}

export default shopclues;