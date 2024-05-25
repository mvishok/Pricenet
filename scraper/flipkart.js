import {load} from 'cheerio';
import bent from 'bent';

const flipkart = async (q) => {
    // const headers = {
    //     "Accept": "application/json, text/plain, */*",
    //     "Accept-Encoding": "gzip, compress, deflate, br",
    //     "Connection": "close",
    //     "Host": "www.flipkart.com",
    //     "User-Agent": "axios/1.7.2"
    // }
    // const options = {
    //     headers,
    //     method: 'GET',
    //     url
    // }
    const get = bent('https://www.flipkart.com', 'GET', 'string', 200);
    const response = await get(
        q
    );
    console.log(response);
    const $ = load(response);
    const data = [];
    $('.cPHDOP').each((index, element) => {
        const title = $(element).find('.KzDlHZ').text();
        const price = $(element).find('.Nx9bqj').text();
        const rating = $(element).find('.XQDdHH').text();
        data.push({ title, price, rating });
    });
    return data;
}

export default flipkart;
//usage
//import flipkart from './flipkart.js';
//const data = await flipkart('https://www.flipkart.com/search?q=mobiles');
