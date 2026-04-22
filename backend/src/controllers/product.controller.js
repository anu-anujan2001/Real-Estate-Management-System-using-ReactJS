const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../lib/uploadToCloudinary");

// HELPER: Parse Variants
const parseVariants = (variants) => {
  if (!variants) return [];

  const data = typeof variants === "string" ? JSON.parse(variants) : variants;

  if (!Array.isArray(data)) return [];

  return data.map((v) => ({
    size: v.size?.trim() || "",
    color: v.color?.trim() || "",
    stock: Number(v.stock) || 0,
    price:
      v.price !== undefined && v.price !== null ? Number(v.price) : undefined,
  }));
};

// CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    stock,
    sku,
    isFeatured,
    isActive,
    variants,
  } = req.body;

  if (!name || !description || price === undefined || !category) {
    return res.status(400).json({
      message: "Name, description, price, and category are required",
    });
  }

  if (price < 0) {
    return res.status(400).json({ message: "Price cannot be negative" });
  }

  if (sku) {
    const existing = await Product.findOne({ sku: sku.trim() });
    if (existing) {
      return res.status(400).json({ message: "SKU already exists" });
    }
  }

  // 🔹 Upload Images
  let uploadedImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "product_images");
      uploadedImages.push(result.secure_url);
    }
  }

  if (uploadedImages.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  // 🔹 Variants
  const parsedVariants = parseVariants(variants);

  const totalVariantStock = parsedVariants.reduce(
    (total, item) => total + (item.stock || 0),
    0,
  );

  const product = await Product.create({
    name: name?.trim(),
    description: description?.trim(),
    price: Number(price),
    category: category?.trim(),
    brand: brand?.trim() || "",
    images: uploadedImages,
    stock: parsedVariants.length > 0 ? totalVariantStock : Number(stock) || 0,
    sku: sku?.trim() || undefined,
    variants: parsedVariants,
    isFeatured: isFeatured === "true" || isFeatured === true,
    isActive: isActive === "false" || isActive === false ? false : true,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// 🔹 GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    brand,
    featured,
    active,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = { $regex: `^${category}$`, $options: "i" };
  }

  if (brand) {
    query.brand = { $regex: `^${brand}$`, $options: "i" };
  }

  if (featured === "true") query.isFeatured = true;
  if (featured === "false") query.isFeatured = false;

  if (active === "true") query.isActive = true;
  if (active === "false") query.isActive = false;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "name_asc") sortOption = { name: 1 };
  if (sort === "name_desc") sortOption = { name: -1 };

  const pageNumber = Math.max(1, Number(page));
  const limitNumber = Math.max(1, Number(limit));
  const skip = (pageNumber - 1) * limitNumber;

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  res.status(200).json({
    success: true,
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limitNumber),
    currentPage: pageNumber,
  });
});

// 🔹 GET SINGLE PRODUCT
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // 🔹 SKU check
  if (req.body.sku) {
    const exists = await Product.findOne({
      sku: req.body.sku.trim(),
      _id: { $ne: id },
    });

    if (exists) {
      return res.status(400).json({ message: "SKU already exists" });
    }
  }

  // ✅ 🔹 FIXED IMAGE HANDLING

  // 1. get images user kept
  let existingImages = [];

  if (req.body.existingImages) {
    try {
      existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
    } catch (err) {
      return res.status(400).json({ message: "Invalid existingImages format" });
    }
  }

  // 2. upload new images
  let newImages = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "products");
      newImages.push(result.secure_url);
    }
  }

  // 3. final images = kept + new
  product.images = [...existingImages, ...newImages];

  // 🔹 Variants
  const parsedVariants = req.body.variants
    ? parseVariants(req.body.variants)
    : product.variants;

  const totalVariantStock = parsedVariants.reduce(
    (total, item) => total + (item.stock || 0),
    0,
  );

  // 🔹 Update fields
  product.name = req.body.name?.trim() || product.name;
  product.description = req.body.description?.trim() || product.description;
  product.price =
    req.body.price !== undefined ? Number(req.body.price) : product.price;
  product.category = req.body.category?.trim() || product.category;
  product.brand =
    req.body.brand !== undefined ? req.body.brand.trim() : product.brand;

  product.sku = req.body.sku?.trim() || product.sku;
  product.variants = parsedVariants;

  // 🔹 Smart stock logic
  product.stock =
    parsedVariants.length > 0
      ? totalVariantStock
      : req.body.stock !== undefined
        ? Number(req.body.stock)
        : product.stock;

  if (req.body.isFeatured !== undefined) {
    product.isFeatured =
      req.body.isFeatured === "true" || req.body.isFeatured === true;
  }

  if (req.body.isActive !== undefined) {
    product.isActive =
      req.body.isActive === "true" || req.body.isActive === true;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// 🔹 DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// 🔹 TOGGLE FEATURED
const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.isFeatured = !product.isFeatured;
  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

// 🔹 TOGGLE ACTIVE
const toggleActiveStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.isActive = !product.isActive;
  await product.save();

  res.status(200).json({
    success: true,
    product,
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleFeaturedProduct,
  toggleActiveStatus,
};
