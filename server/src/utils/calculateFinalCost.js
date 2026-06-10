function calculateFinalCost(
  productCost,
  config
) {
  let total = productCost;

  total += config.platformFee;

  if (
    productCost <
    config.freeDeliveryAbove
  ) {
    total += config.deliveryFee;
  }

  return total;
}

module.exports =
  calculateFinalCost;