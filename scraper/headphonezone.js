import {load} from 'cheerio';
import bent from 'bent';

const headphonezone = async (q) => {
    
    const get = bent('https://www.headphonezone.in/search?type=product&q=', 'GET', 'string', 200);    
    const response = await get(
        q
    );

    const $ = load(response);
    const data = [];
    $('product-card').each((index, element) => {
        const title = $(element).find('a').text();
        if (!title || title == '') return;
        const link = $(element).find('a').attr('href');
        if (!link || link == '') return;
        const rating = parseFloat($(element).find('.jdgm-prev-badge__stars').attr("data-score"));
        const price = parseInt($(element).find('sale-price').text().match(/\d+/g).join(''));
        if (!price  || price == '') return;
        const desc = $(element).find('.subtitle.center').text();
        const img = $(element).find('img').attr('src');
        let trust = false;

        data.push({ 
            "title": title,
            "link": `https://www.headphonezone.in${link}`,
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

export default headphonezone;