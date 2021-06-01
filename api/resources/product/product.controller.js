const url = require("url");
const path = require("path");
const cloudinary = require('../../../config/cloudinary');
const fs = require('fs');

const ProductModel = require("./product.model");

module.exports =  {
    async createProduct(req,res){
        try {
            let Product = new ProductModel();

            let data = req.body;

            if (!data.name) return res.status(400).send({"error":"name is required"});
            if (!data.price) return res.status(400).send({"error":"price is required"});
            if (!data.description) return res.status(400).send({"error":"description is required"});
            if (!data.quantity) return res.status(400).send({"error":"quantity is required"});
            if (!data.expireDate) return res.status(400).send({"error":"expireDate is required"});
            if (!data.brand) return res.status(400).send({"error":"brand is required"});
            if (!data.agent) return res.status(400).send({"error":"agent is required"});

            Product.name = data.name;
            Product.price = data.price;
            Product.description = data.description;
            Product.quantity = data.quantity;
            Product.expireDate = data.expireDate;
            Product.brand = data.brand;
            Product.agent = data.agent;

            await Product.save((err, docs)=>{
                if (!err){
                    return res.status(200).send({"success":"Product added to stock"});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async updateProductImage(req,res){
        try {
            const Product = await ProductModel.findOne(({_id:req.params.id}));

            if(!Product) return res.status(404).send({"error":'Product not found'});

            let data = req.body;

            if(!data.image) return res.status(400).send({"error":'Image cannot be null'});

            Product.image = data.image;

            await Product.save(({_id:req.params.id}),(err, docs)=>{
                if (!err){
                    return res.status(200).send({"success":"Image updated"});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async updateProduct(req,res){
        try {

            let data = req.body;
            console.log(data);

            const Product = await ProductModel.findOne({_id : req.params.id});

            if (!Product) return res.status(404).send({"error":'Product not found'});

            if(data.name) Product.name = data.name;
            if(data.price) Product.price = data.price;
            if(data.description) Product.description = data.description;
            if(data.quantity) Product.quantity = data.quantity;
            if(data.brand) Product.brand = data.brand;

            await Product.save((err, doc)=>{
                if (!err){
                    return res.status(200).send({"success":`Stock updated`});
                }
                else{
                    return res.status(400).send({"error":err});
                }
            });

        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getOneProduct(req,res){
        try {
            ProductModel.findOne(({_id : req.params.id}),(err, doc)=>{
                if(!err){
                    if (!doc)
                        return res.status(404).send({"error":"Product not found"});
                    return res.status(200).send(doc);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('agent', '_id name image phonenumber email');
        } catch (err) {
            return res.status(400).send({"error":err});
        }
    },

    async getAllProducts(req,res){
        try {
            ProductModel.find((err, docs)=>{
                if(!err){
                    return res.status(200).send(docs);
                }
                else{
                    return res.status(400).send({"error":err});
                }
            }).populate('agent', '_id name image phonenumber email');
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
            await ProductModel.paginate({},options,(err, docs)=>{
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

    async deleteProduct(req,res){
        try {
            ProductModel.findOne(({_id: req.params.id}),(err, doc)=>{
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
