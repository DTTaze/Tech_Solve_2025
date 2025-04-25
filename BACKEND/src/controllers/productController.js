const productService = require("../services/productService");

const handleUploadProduct = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const productData = req.body;
    const images = req.files;

    const product = await productService.createProduct(
      productData,
      user_id,
      images
    );

    return res.success("Product uploaded successfully", product);
  } catch (error) {
    return res.error(500, "Failed to upload product", error.message);
  }
};

const handleGetAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    return res.success("Products retrieved successfully", products);
  } catch (error) {
    return res.error(500, "Failed to fetch products", error.message);
  }
};

const handleGetAllAvailableProducts = async (req, res) => {
  try {
    const products = await productService.getAllAvailableProducts();
    return res.success("Available products retrieved successfully", products);
  } catch (error) {
    return res.error(500, "Failed to fetch available products", error.message);
  }
};

const handleGetProductByIdUser = async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const products = await productService.getProductByIdUser(user_id);
    return res.success("Your products retrieved successfully", products);
  } catch (error) {
    return res.error(500, "Failed to fetch your products", error.message);
  }
};

const handleUpdateProduct = async (req, res) => {
  try {
    const product_id = Number(req.params.id);
    const productData = req.body;
    const images = req.files;

    const updatedProduct = await productService.updateProduct(
      product_id,
      productData,
      images
    );

    return res.success("Product updated successfully", updatedProduct);
  } catch (error) {
    return res.error(500, "Failed to update product", error.message);
  }
};

const handleDeleteProduct = async (req, res) => {
  try {
    const product_id = Number(req.params.id);
    const message = await productService.deleteProduct(product_id);
    return res.success("Product deleted successfully", message);
  } catch (error) {
    return res.error(500, "Failed to delete product", error.message);
  }
};

const handleUpdateProductByPublicId = async (req, res) => {
  try {
    const public_id = req.params.public_id;
    const productData = req.body;
    const images = req.files;

    const updatedProduct = await productService.updateProductByPublicId(
      public_id,
      productData,
      images
    );

    return res.success("Product updated successfully", updatedProduct);
  } catch (error) {
    return res.error(500, "Failed to update product", error.message);
  }
};

module.exports = {
  handleUploadProduct,
  handleGetAllProducts,
  handleGetProductByIdUser,
  handleGetAllAvailableProducts,
  handleUpdateProduct,
  handleUpdateProductByPublicId,
  handleDeleteProduct,
};
