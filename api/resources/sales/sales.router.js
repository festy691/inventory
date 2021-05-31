const express = require('express');
const saleController = require('./sales.controller');
const upload = require('../../../config/multer');
const { protect, authorize } = require('../user/auth');

const saleRouter = express.Router();
module.exports = saleRouter;

saleRouter.route('/')
    .post(protect, upload.single('image'),saleController.createSale)
    .get(saleController.getAllSales);

saleRouter.route('/:id')
    .get(saleController.getOneSale)
    .delete(protect, authorize('admin'), saleController.deleteSale);

saleRouter.route('/paginate/sales')
    .get(saleController.findAllPaginate);