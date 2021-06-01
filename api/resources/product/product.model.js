const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let ProductSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    brand : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default : null
    },
    quantity : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true
    },
    agent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    dateRestocked : {
        type : Date,
    },
    expireDate : {
        type : Date,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

ProductSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Product", ProductSchema);