const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const Product = require("./models/product.model");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedProducts = async () => {
  try {
    await connectDB();

    const filePath = path.join(
      __dirname,
      "data",
      "sample_100_products_atlas.json",
    );

    const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    await Product.deleteMany();
    console.log("Existing products removed");

    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
