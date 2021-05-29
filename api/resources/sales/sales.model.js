const mongoose = require('mongoose');
const mongosePaginate = require('mongoose-paginate');

let SaleSchema = new mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    products : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Product',
        required : true
    },
    agent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

SaleSchema.plugin(mongosePaginate);
module.exports = mongoose.model("Sales", SaleSchema);