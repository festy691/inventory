const url = require("url");
const path = require("path");
const cloudinary = require('../../../config/cloudinary');
const fs = require('fs');

const ProductModel = require("../product/product.model");
const SaleModel = require("./sales.model");

module.exports =  {
    async createSale(req,res){
        try {
            let Sale = new SaleModel();

            let data = req.body;

            if (!data.customer) return res.status(400).send({"error":"customer is required"});
            if (!data.agent) return res.status(400).send({"error":"agent is required"});
            if (!data.quantity) return res.status(400).send({"error":"quantity is required"});
            if (!data.product) return res.status(400).send({"error":"product is required"});

            const quantity = data.quantity;
            const product = data.product;
            
            let oldData = await ProductModel.findOne({_id:product});
            if (!oldData) return res.status(404).send({"error":"Item not found"});
            
            Sale.customer = data.customer;
            Sale.agent = data.agent;
            Sale.quantity = quantity;
            Sale.product = data.product;

            await Sale.save((err, docs)=>{
                if (!err){
                    oldData.quantity = oldData.quantity - quantity;
                    oldData.save((err, docs)=>{
                        if (!err){
                            oldData.quantity = oldData.quantity - quantity;
                           
                            return res.status(200).send({"success":"Sale added to stock"});
                        }
                        else{
                            return res.status(400).send({"error":err});
                        }
                    });
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getOneSale(req,res){
        try {
            SaleModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Sale not found"});
                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('agent', '_id name image phonenumber email').populate('product', '_id name price');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getAllSales(req,res){
        try {
            SaleModel.find((err, docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('agent', '_id name image phonenumber email').populate('product', '_id name price');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async findAllPaginate(req,res){
        try {
            const {page,perPage} = req.query;
            const options = {
                page: parseInt(page,10) || 1,
                limit: parseInt(perPage,10) || 10,
                sort: {date: -1}
            }
            await SaleModel.paginate({},options,(err, docs)=>{
                if(!err){
                    if (docs) return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async deleteSale(req,res){
        try {
            SaleModel.findOne(({_id: req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Item not found"});

                    doc.remove((err, docs)=>{
                        if (!err){
                            if (doc.image) destroy(nameFromUri(doc.image)).catch((result)=>{
                                console.log(result);
                            });
                            return res.status(200).send({"success":"Item deleted"});
                        }
                        else{
                            return res.status(400).send({"error":err});
                        }
                    });
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    }
}

function nameFromUri(myurl){
    let parsed = url.parse(myurl);
    let image = path.basename(parsed.pathname);
    return "images/"+path.parse(image).name
}

async function destroy(file) {
    await cloudinary.delete(file);
}
