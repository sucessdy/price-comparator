function normalizedProduct(product) {
  return {
    name: product.title,
    price: product.extracted_price,
    platform: product.source,
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    image: product.thumbnail ?? null,
    productLink: product.product_link ?? null,
    delivery: product.delivery ?? null,
    source: "serpapi",
  };
}

module.exports = normalizedProduct;
