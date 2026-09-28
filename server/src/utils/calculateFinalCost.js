function calculateFinalCost(productCost, config) {
  const platformFee = config.platformFee || 0;
  const deliveryFee = config.deliveryFee || 0;
  const freeDeliveryAbove = config.freeDeliveryAbove ?? Infinity;

  const freeDeliveryApplied = productCost >= freeDeliveryAbove;

  let total = productCost + platformFee;

  if (!freeDeliveryApplied) {
    total += deliveryFee;
  }

  return {
    total,
    breakdown: {
      productCost,
      deliveryFee: freeDeliveryApplied ? 0 : deliveryFee,
      platformFee,
      freeDeliveryApplied,
    },
  };
}

module.exports = calculateFinalCost;