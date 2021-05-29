const express = require('express');
const userRouter  = require('./resources/user');
const imageRouter  = require('./resources/image');
const authRouter  = require('./resources/auth');
const productRouter  = require('./resources/product');
const saleRouter  = require('./resources/sales');

const restRouter = express.Router();

module.exports =  restRouter;

restRouter.use('/users', userRouter);
restRouter.use('/authenticate', authRouter);
restRouter.use('/images', imageRouter);
restRouter.use('/products', productRouter);
restRouter.use('/sales', productRouter);