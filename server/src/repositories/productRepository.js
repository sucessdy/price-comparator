const Product = require("../models/productModel");

class ProductRepository {
  /**
   * Find product by name and platform
   * @param {string} name - Product name
   * @param {string} platform - Platform name
   * @returns {Promise<Object|null>} Product or null
   */
  async findByNameAndPlatform(name, platform) {
    return Product.findOne({
      name: name.trim().toLowerCase(),
      platform: platform.trim().toLowerCase(),
    });
  }

  /**
   * Find all products by name (for comparison)
   * @param {string} name - Product name
   * @returns {Promise<Array>} Array of products
   */
  async findByName(name) {
    return Product.find({
      name: name.trim().toLowerCase(),
    });
  }

  /**
   * Find multiple products by names (for cart optimization)
   * @param {Array<string>} names - Array of product names
   * @returns {Promise<Array>} Array of products
   */
  async findByNames(names) {
    const normalizedNames = names.map(name => name.trim().toLowerCase());
    return Product.find({
      name: { $in: normalizedNames },
    });
  }

  /**
   * Create new product
   * @param {Object} data - Product data { name, price, platform }
   * @returns {Promise<Object>} Created product
   */
  async create(data) {
    return Product.create({
      name: data.name.trim().toLowerCase(),
      price: data.price,
      platform: data.platform.trim().toLowerCase(),
      priceHistory: [],
    });
  }

  /**
   * Update product price and push to history
   * @param {string} name - Product name
   * @param {string} platform - Platform name
   * @param {number} newPrice - New price
   * @param {number} oldPrice - Old price (for history)
   * @returns {Promise<Object>} Updated product
   */
  async updatePriceWithHistory(name, platform, newPrice, oldPrice) {
    return Product.findOneAndUpdate(
      { 
        name: name.trim().toLowerCase(),
        platform: platform.trim().toLowerCase(),
      },
      {
        $set: { price: newPrice },
        $push: {
          priceHistory: {
            price: oldPrice,
            date: new Date(),
          },
        },
      },
      {
        upsert: true,
    returnDocument: 'after' 
      }
    );
  }

  /**
   * Get all unique platforms that have a product
   * @returns {Promise<Array>} Array of platform names
   */
  async getAllPlatforms() {
    return Product.distinct("platform");
  }

  /**
   * Get price history for a product on a platform
   * @param {string} name 
   * @param {string} platform 
   * @returns {Promise<Array>}
   */

  
  async getPriceHistory(name, platform) {
    const product = await Product.findOne({
      name: name.trim().toLowerCase(),
      platform: platform.trim().toLowerCase(),
    });
    return product ? product.priceHistory : [];
  }

  /**
   * Delete product (for testing/admin)
   * @param {string} name - Product name
   * @param {string} platform - Platform name
   * @returns {Promise<Object>} Deletion result
   */
  async deleteProduct(name, platform) {
    return Product.findOneAndDelete({
      name: name.trim().toLowerCase(),
      platform: platform.trim().toLowerCase(),
    });
  }

  /**
   * Bulk insert products (for seeding)
   * @param {Array} products - Array of product objects
   * @returns {Promise<Array>} Inserted products
   */
  async bulkCreate(products) {
    return Product.insertMany(products);
  }

  /**
   * Clear all products (for testing)
   * @returns {Promise<Object>} Deletion result
   */
  async clearAll() {
    return Product.deleteMany({});
  }

  async  findByCategory( category, budget){ 
return Product.find({
  category : category.toLowerCase(), 
 price : { $lte: budget }
})

  }
}

module.exports = new ProductRepository();