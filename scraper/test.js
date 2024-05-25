import flipkart from "./flipkart.js"

const data = await flipkart('/search?q=mobiles\r\n');
console.log(data);