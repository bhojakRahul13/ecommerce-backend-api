const { Op } = require("sequelize");
const Product = require("../models/Product");

const createProduct = async (data) => {
  const existingProduct = await Product.findOne({
    where: {
      name: data.name.trim(),
    },
  });

  if (existingProduct) {
    const error = new Error("Product already exists");
    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create(data);

  return product;
};

const getProducts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  const allowedSortFields = ["name", "price", "stock", "created_at"];
  const sortBy = allowedSortFields.includes(query.sortBy)
    ? query.sortBy
    : "created_at";

  const sortOrder = (query.sortOrder || "DESC").toUpperCase();

  const where = {};

  if (query.search) {
    where.name = {
      [Op.like]: `%${query.search.trim()}%`,
    };
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit,
    offset,
    order: [[sortBy, sortOrder]],
  });

  return {
    products: rows,
    pagination: {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  };
};

const getProductById = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const updateProduct = async (id, data) => {
  if (Object.keys(data).length === 0) {
    const error = new Error("At least one field is required for update");
    error.statusCode = 400;
    throw error;
  }
  const product = await Product.findByPk(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.name) {
    const existingProduct = await Product.findOne({
      where: {
        name: data.name,
      },
    });

    if (existingProduct && existingProduct.id !== product.id) {
      const error = new Error("Product already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  const { name, description, price, stock, image_url } = data;

  await product.update({
    name,
    description,
    price,
    stock,
    image_url,
  });

  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await product.destroy();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
