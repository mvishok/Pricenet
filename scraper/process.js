import flipkart from './flipkart.js';
import shopclues from './shopclues.js';
import { mode } from 'mathjs';

async function search(q) {
    try {
        const [sp, fp] = await Promise.all([
            shopclues(q),
            flipkart(q)
        ]);
        return [...fp, ...sp];
    } catch (e) {
        console.error(e);
        return [];
    }
}
    
function sortRelevancy(results, q) {
    const queryWords = q.toLowerCase().split(' ');
    
    results = results.filter(item => {
        const itemWords = item.title.toLowerCase().split(' ');
        return queryWords.length > 0 && queryWords.every(word => itemWords.some(itemWord => itemWord.includes(word)));
    });

    let avgPrice = 0;
    try{
        avgPrice = Math.floor(mode(results.filter(item => 'price' in item).map(item => parseFloat(item.price))));
    } catch (e) {
        avgPrice = results.length > 0 ? results[0].price : 0;
    }

    const minPrice = avgPrice - parseInt(avgPrice * 0.2);
    const maxPrice = avgPrice + parseInt(avgPrice * 0.2);

    results.sort((a, b) => {
        const priceA = parseInt(a['price'] || 0);
        const priceB = parseInt(b['price'] || 0);
        const ratingA = -parseFloat(a['rating'] || 0);
        const ratingB = -parseFloat(b['rating'] || 0);
      
        if (priceA !== priceB) {
            return priceA - priceB;
        } else {
            return ratingA - ratingB;
        }
    });

    results = results.filter(result => {
        const price = parseInt(result['price']);
        return minPrice <= price && price <= maxPrice;
    });
    
    return results;
}

const results = await search("moto g32");
console.log(sortRelevancy(results, "moto g32"));