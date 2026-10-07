function normalizedProduct(product) {
  return {
    // -----------------------------
    // Product identity
    // -----------------------------
    name: product.title ?? null,

    // Google Shopping's product identifier.
    // Useful for tracking the returned shopping result,
    // but do NOT treat it as an exact retailer SKU.
    shoppingProductId: product.product_id ?? null,

    // -----------------------------
    // Offer / store information
    // -----------------------------
    sourceName: product.source ?? null,
    platform: resolvePlatform({
      sourceName: product.source,
      productLink: product.product_link ?? product.link,
    }) ?? product.source ?? "Unknown",


    price: product.extracted_price ?? null,

    oldPrice: product.extracted_old_price ?? null,

    delivery: product.delivery ?? null,

    // -----------------------------
    // Product quality signals
    // -----------------------------
    rating: product.rating ?? null,

    reviews: product.reviews ?? null,

    // -----------------------------
    // Links / images
    // -----------------------------
    image: product.thumbnail ?? product.serpapi_thumbnail ?? null,

    productLink:
      product.product_link ??
      product.link ??
      null,

    // Google Shopping may provide an immersive
    // product-page token for deeper product details.
    immersiveProductPageToken:
      product.immersive_product_page_token ?? null,

    // -----------------------------
    // Offer metadata
    // -----------------------------
    multipleSources: product.multiple_sources ?? false,

    tag: product.tag ?? null,

    badge: product.badge ?? null,

    sourceIcon: product.source_icon ?? null,

    // -----------------------------
    // Internal source tracking
    // -----------------------------
    source: "serpapi",
  };
}

function resolvePlatform(product) {
  const text = [
    product.sourceName,
    product.productLink,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("amazon.in") || text.includes("amazon")) {
    return "amazon";
  }

  if (text.includes("flipkart")) {
    return "flipkart";
  }

  if (text.includes("zepto")) {
    return "zepto";
  }

  if (text.includes("blinkit")) {
    return "blinkit";
  }

  if (text.includes("bigbasket")) return "bigbasket";
  if (text.includes("jiomart")) return "jiomart";
  if (text.includes("croma")) return "croma";
  if (text.includes("myntra")) return "myntra";
  if (text.includes("ajio")) return "ajio";
  if (text.includes("reliance digital")) return "reliance digital";
  if (text.includes("vijay sales")) return "vijay sales";
  if (text.includes("tatacliq") || text.includes("tata cliq")) return "tatacliq";
  if (text.includes("paytm mall")) return "paytm mall";
  if (text.includes("shopclues")) return "shopclues";
  if (text.includes("snapdeal")) return "snapdeal";
  if (text.includes("meesho")) return "meesho";

  return null;
}

module.exports = normalizedProduct;
