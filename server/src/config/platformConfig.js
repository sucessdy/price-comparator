const platformConfig = {
  blinkit: {
    deliveryFee: 25,
    platformFee: 8,
    freeDeliveryAbove: 150,
  },

  bigbasket: {
    deliveryFee: 30,
    platformFee: 5,
    freeDeliveryAbove: 500,
  },

  amazon: {
    deliveryFee: 40,
    platformFee: 0,
    freeDeliveryAbove: 500,
  },

  flipkart: {
    deliveryFee: 40,
    platformFee: 0,
    freeDeliveryAbove:120,
  },

  croma: {
    deliveryFee: 50,
    platformFee: 0,
    freeDeliveryAbove: 2000,
  },
};

module.exports = platformConfig;