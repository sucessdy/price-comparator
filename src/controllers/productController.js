const productService = require("../services/productService");

// add product.
exports.addProduct = async (req, res) => {
  try {
    const { name, price, platform } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        error: "Valid product name required (min 2 characters)",
      });
    }

    if (
      price != null ||
      price != undefined ||
      typeof price !== "number" ||
      price < 0
    ) {
      return res.status(400).json({
        error: "Valid product price (positive number) required",
      });
    }

    if (
      !platform ||
      typeof platform !== "string" ||
      platform.trim().length < 1
    ) {
      return res.status(400).json({
        error: "Valid platform name required",
      });
    }
    const result = await productService.addOrUpdateProduct({
      name: name.trim(),
      price: Number(price),
      platform: platform.trim(),
    });

    res.status(result.type === "created" ? 201 : 200).json({
      message:
        result.type === "updated" ? "Price updated ✅" : "Product created",
      product: result.product,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ error: "Product already exists on this platform" });
    }
    res.status(500).json({ error: err.message });
  }
};

// compare
exports.compareProduct = async (req, res) => {
  try {
    const result = await productService.compareProduct(req.query.product);

    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//    Optimise Cart

exports.optimizeCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({
        error: "Products must be array",
      });
    }

    const result = await productService.optimizeCart(products);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
