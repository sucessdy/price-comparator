
const productRepository = require("../../repositories/productRepository") ; 

function createOffer(data) {
  return {
    name: data.name,
    platform: data.platform,
    price: data.price,
    delivery: data.delivery ?? null,
    rating: data.rating ?? null,
    reviews: data.reviews ?? null,
    productLink: data.productLink ?? data.url ?? null,
    image: data.image ?? null,
    source: data.source,
  };
}

async function getMongoOffers (names) { 
    const products = await productRepository.findByNames(names) ; 
    return products.map((product) => 
    createOffer({
        name : product.name, 
        platform : product.platform, 
        price : product.price, 
        source: "mongodb"
    }))
}

module.exports = {
  createOffer,
  getMongoOffers
};



