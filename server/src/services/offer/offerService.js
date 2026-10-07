
const productRepository = require("../../repositories/productRepository") ; 


function createOffer(data) {
  return {

    name: data.name ?? null,
    platform: data.platform ?? data.sourceName ?? "Unknown",
    sourceName: data.sourceName ?? null,
    productKey: data.productKey ?? null,
    price: data.price ?? null,
    oldPrice: data.oldPrice ?? null,
    delivery: data.delivery ?? null,
    rating: data.rating ?? null,
    reviews: data.reviews ?? null,
    shoppingProductId: data.shoppingProductId ?? null,  
    productLink: data.productLink ?? data.url ?? null,
    image: data.image ?? null,
    multipleSources: data.multipleSources ?? false,
    tag: data.tag ?? null,
    badge: data.badge ?? null,
    sourceIcon: data.sourceIcon ?? null,
    immersiveProductPageToken:
      data.immersiveProductPageToken ?? null,
    source: data.source ?? null,
    reason: data.reason ?? undefined,
    brand: data.brand ?? undefined,
  };
} 


async function getMongoOffers (names) { 
    const products = await productRepository.findByNames(names) ; 
    return products.map((product) => 
    createOffer({
        name : product.name, 
        platform : product.platform, 
        price : product.price, 
        productKey : product.productKey , 
        source: "mongodb"
    }))
}

module.exports = {
  createOffer,
  getMongoOffers
};


