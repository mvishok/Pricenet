import {load} from 'cheerio';
import bent from 'bent';

const flipkart = async (q) => {
    const get = bent('https://www.flipkart.com', 'GET', 'string', 200);
    const response = await get(
        q
    );
    const $ = load(response);
    const data = [];
    $('.slAVV4').each((index, element) => {
        const title = $($(element).find('a').get(1)).attr('title');
        if (!title || title == '') return;
        const link = $(element).find('a').attr('href');
        if (!link || link == '') return;
        const rating = parseFloat($(element).find('.XQDdHH').text());
        const price = parseInt($(element).find('.Nx9bqj').text().match(/\d+/g).join(''));
        if (!price  || price == '') return;
        let freeDelivery = false;
        if ($(element).find('.yiggsN').text().toLowerCase().includes("free delivery")){
            freeDelivery = true;
        }
        const desc = $(element).find('.NqpwHC').text();
        const img = $(element).find('img').attr('src');

        data.push({ 
            "title": title,
            "link": `https://www.flipkart.com${link}`,
            "rating": rating,
            "price": price,
            "freeDelivery": freeDelivery,
            "desc": desc,
            "img": img
        });
    });
    $('.cPHDOP').each((index, element) => {
        const title = $(element).find('.KzDlHZ').text();
        if (!title || title == '') return;
        const link = $(element).find('a').attr("href");
        if (!link || link == '') return;
        const rating = parseFloat($(element).find('.XQDdHH').text());
        const price = parseInt($(element).find('.Nx9bqj').text().match(/\d+/g).join(''));
        if (!price  || price == '') return;
        let freeDelivery = false;
        if ($(element).find('.yiggsN').text().toLowerCase().includes("free delivery")){
            freeDelivery = true;
        }
        const desc = $(element).find('._6NESgJ').find('li').map((index, element) => $(element).text().trim()).get().join(", ")
        const img = $(element).find('img').attr('src');

        data.push({ 
            "title": title,
            "link": `https://www.flipkart.com${link}`,
            "rating": rating,
            "price": price,
            "freeDelivery": freeDelivery,
            "desc": desc,
            "img": img
        });
    });
    return data;
}

export default flipkart;