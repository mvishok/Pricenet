import flipkart from './flipkart.js';
import shopclues from './shopclues.js';
import { mode } from 'mathjs';

function sortRelevancy(results, q) {
    const queryWords = q.toLowerCase().split(' ');
    
    results = results.filter(item => {
        const itemWords = item.title.toLowerCase().split(' ');
        return queryWords.length > 0 && queryWords.every(word => itemWords.some(itemWord => itemWord.includes(word)));
    });

    let minPrice, maxPrice, avgPrice;

    try{
        avgPrice = results.filter(item => 'price' in item).map(item => parseFloat(item.price));
        if (typeof mode(avgPrice) === 'number') {
            avgPrice = mode(avgPrice);
            minPrice = avgPrice - parseInt(avgPrice * 0.2);
            maxPrice = avgPrice + parseInt(avgPrice * 0.2);
        } else {
            avgPrice = avgPrice.reduce((a, b) => a + b, 0) / avgPrice.length;
            minPrice = avgPrice - parseInt(avgPrice * 0.4);
            maxPrice = avgPrice + parseInt(avgPrice * 0.4);
        }
    } catch (e) {
        avgPrice = results.length > 0 ? results[0].price : 0;
        minPrice = avgPrice - parseInt(avgPrice * 0.4);
        maxPrice = avgPrice + parseInt(avgPrice * 0.4);
    }

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

async function search(q) {
    try {
        const [sp, fp] = await Promise.all([
            shopclues(q),
            flipkart(q)
        ]);
        return sortRelevancy([...fp, ...sp], q)
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default search;