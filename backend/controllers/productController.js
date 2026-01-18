const Product = require("../models/Product");

// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image, countInStock } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({ message: "All fields required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      countInStock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
