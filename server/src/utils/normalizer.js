function normalizedProduct(product) {
  return {
    name: product.title,
    price: product.extracted_price,
    platform: product.source,
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    image: product.thumbnail,
    url: product.product_link,
    delivery: product.delivery ?? null,
  };
}

module.exports = normalizedProduct;