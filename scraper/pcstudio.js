import {load} from 'cheerio';
import bent from 'bent';

const pcstudio = async (q) => {
    
    const get = bent('https://www.pcstudio.in/?post_type=product&s=', 'GET', 'string', 200);    
    const response = await get(
        q
    );

    const $ = load(response);
    const data = [];
    $('.jet-woo-products__item.jet-woo-builder-product.jet-woo-thumb-with-effect').each((index, element) => {
        const title = $(element).find('a:eq(1)').text();
        if (!title || title == '') return;
        const link = $(element).find('a:eq(1)').attr('href');
        if (!link || link == '') return;
        const price = parseInt($(element).find('bdi:last').text().split('.')[0].match(/\d+/g).join(''));
        if (!price  || price == '') return;
        const desc = "No description available.";
        const img = $(element).find('img').attr('src')
        let trust = false;

        data.push({ 
            "title": title,
            "link": `${link}`,
            "rating": 404,
            "price": price,
            "freeDelivery": true,
            "desc": desc,
            "img": `${img}`,
            "trust": trust
        });
    });
    return data;
}

export default pcstudio;