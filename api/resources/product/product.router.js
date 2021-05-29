const express = require('express');
const productController = require('./product.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const productRouter = express.Router();
module.exports = productRouter;

productRouter.route('/')
    .post(protect, authorize('admin'), upload.single('image'),productController.createProduct)
    .get(productController.getAllProducts);

productRouter.route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), productController.updateProduct)
    .get(productController.getOneProduct)
    .delete(protect, authorize('admin'), productController.deleteProduct);

productRouter.route('/updatepics/:id').put(protect,productController.updateProductImage);

productRouter.route('/paginate/products')
    .get(productController.findAllPaginate);