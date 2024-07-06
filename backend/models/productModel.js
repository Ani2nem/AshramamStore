import mongoose, { mongo } from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId


const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, {timestamps: true},
);




const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    image: {
        type: String, 
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

    brand: {
        type: String,
        required: true,
    },

    category: {
        type: ObjectId, 
        required: true,
        ref: "Category",
    },

    description: {
        type: String,
        required: true
    },

    reviews: [reviewSchema],

    ratings: {
        type: Number, 
        required: true, 
        default: 0
    },

    numReviews: {
        type: Number, 
        required: true, 
        default: 0
    },

    price: {
        type: Number,
        required: true,
        default: 0,
    },

    countInStock:{
        type: Number,
        required: true,
        default: 0,
    },
}, {timestamps: true});


const Product = mongoose.model('Product', productSchema);
export default Product