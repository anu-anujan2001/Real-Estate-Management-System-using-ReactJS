const Product = require('../models/product.model');
const asyncHandler = require('express-async-handler');
const Review = require('../models/review.model');
const uploadToCloudinary = require('../lib/uploadToCloudinary');
const mongoose = require("mongoose");


// create a new product
const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, description, price, category, brand, stock, sku, isFeatured, isActive, variants } = req.body;
        
        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({ message: "Name, description, price, and category are required" });
        }

        if(sku) {
            const existingProduct = await Product.findOne({ sku: sku.trim() });
            if (existingProduct) {
                return res.status(400).json({ message: "SKU must be unique. A product with this SKU already exists." });
            }
        }

        let uploadedImages = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'product_images');
                uploadedImages.push(result.secure_url);
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(400).json({ message: "At least one product image is required" });
        }

        let parsedVariants = [];
        if (variants) {
            const variantData =
                typeof variants === "string" ? JSON.parse(variants) : variants;

            if (Array.isArray(variantData)) {
                parsedVariants = variantData.map((variant) => ({
                size: variant.size?.trim() || "",
                color: variant.color?.trim() || "",
                stock: Number(variant.stock) || 0,
                price:
                    variant.price !== undefined && variant.price !== null
                    ? Number(variant.price)
                    : undefined,
                }));
            }
        }

        const totalVariantStock = parsedVariants.reduce(
            (total, item) => total + (item.stock || 0),
            0
        );

         const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            category: category.trim(),
            brand: brand?.trim() || "",
            images: uploadedImages,
            stock:
                parsedVariants.length > 0
                ? totalVariantStock
                : stock !== undefined
                ? Number(stock)
                : 0,
            sku: sku?.trim() || undefined,
            variants: parsedVariants,
            isFeatured:
                isFeatured === "true" || isFeatured === true ? true : false,
            isActive: isActive === "false" || isActive === false ? false : true,
         });
        
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500);
        new Error("Server error creating product");
    }
});


// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async (req, res) => {
  try {
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
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };
    if (sort === "rating_desc") sortOption = { rating: -1 };

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber);

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNumber),
      currentPage: pageNumber,
      products,
    });
  } catch (error) {
      res.status(500);
      new Error("Server error fetching products");
  }
});

// GET SINGLE PRODUCT
const getSingleProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500);
    new Error("Server error fetching product");
  }
});

// UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (req.body.sku) {
      const skuExists = await Product.findOne({
        sku: req.body.sku.trim(),
        _id: { $ne: id },
      });

      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: "SKU already exists",
        });
      }
    }

    let uploadedImages = [...product.images];

    if (req.files && req.files.length > 0) {
      uploadedImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "products");
        uploadedImages.push(result.secure_url);
      }
    }

    let parsedVariants = product.variants;

    if (req.body.variants) {
      const variantData =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;

      if (Array.isArray(variantData)) {
        parsedVariants = variantData.map((variant) => ({
          size: variant.size?.trim() || "",
          color: variant.color?.trim() || "",
          stock: Number(variant.stock) || 0,
          price:
            variant.price !== undefined && variant.price !== null
              ? Number(variant.price)
              : undefined,
        }));
      }
    }

    const totalVariantStock = Array.isArray(parsedVariants)
      ? parsedVariants.reduce((total, item) => total + (item.stock || 0), 0)
      : 0;

    product.name = req.body.name ? req.body.name.trim() : product.name;
    product.description = req.body.description
      ? req.body.description.trim()
      : product.description;
    product.price =
      req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.category = req.body.category
      ? req.body.category.trim()
      : product.category;
    product.brand =
      req.body.brand !== undefined ? req.body.brand.trim() : product.brand;
    product.images = uploadedImages;
    product.sku = req.body.sku ? req.body.sku.trim() : product.sku;
    product.variants = parsedVariants;

    if (parsedVariants.length > 0) {
      product.stock = totalVariantStock;
    } else if (req.body.stock !== undefined) {
      product.stock = Number(req.body.stock);
    }

    if (req.body.isFeatured !== undefined) {
      product.isFeatured =
        req.body.isFeatured === "true" || req.body.isFeatured === true;
    }

    if (req.body.isActive !== undefined) {
      product.isActive =
        req.body.isActive === "true" || req.body.isActive === true;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500);
    new Error("Server error fetching product");
  }
});

// DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
});

// GET FEATURED PRODUCTS
const getFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch featured products",
    });
  }
});

// GET PRODUCTS BY CATEGORY
const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category: { $regex: `^${category}$`, $options: "i" },
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category products",
    });
  }
});

// TOGGLE FEATURED STATUS
const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return res.status(200).json({
      success: true,
      message: product.isFeatured
        ? "Product marked as featured"
        : "Product removed from featured",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle featured status",
    });
  }
});

// TOGGLE ACTIVE STATUS
const toggleActiveStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    return res.status(200).json({
      success: true,
      message: product.isActive
        ? "Product activated successfully"
        : "Product deactivated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle product status",
    });
  }
});



module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getProductsByCategory,
    toggleFeaturedProduct,
    toggleActiveStatus,
};
