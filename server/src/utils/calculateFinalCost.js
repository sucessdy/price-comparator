// server/src/utils/calculateFinalCost.js
function calculateFinalCost(productCost, config) {
  let total = productCost;
  

  total += config.platformFee || 0;
  
  if (productCost < (config.freeDeliveryAbove || Infinity)) {
    total += config.deliveryFee || 0;
  }
  
  return {
    total: total,
    breakdown: {
      productCost: productCost,
      deliveryFee: productCost < config.freeDeliveryAbove ? (config.deliveryFee || 0) : 0,
      platformFee: config.platformFee || 0,
      freeDeliveryApplied: productCost >= (config.freeDeliveryAbove || Infinity)
    }
  };
}


module.exports = calculateFinalCost;