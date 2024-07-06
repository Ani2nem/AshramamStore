import asyncHandler from "../middlewares/asyncHandler.js";
import Product from '../models/productModel.js';

const addProduct = asyncHandler(async (req, res) => {
    try {
        const {name, description, price, category, quantity, brand, image} = req.fields;

        // Validate
        switch (true){
            case !name:
                return res.json({error: "Name is required!"})
            case !description:
                return res.json({error: "Description is required!"})
            case !price:
                return res.json({error: "Price is required!"})
            case !category:
                return res.json({error: "Category is required!"})
            case !quantity:
                return res.json({error: "Quantity is required!"})
            case !brand:
                return  res.json({error: "Brand is required!"})
            case !image:
                return  res.json({error: "Image is required!"})
        }

        const product = new Product({...req.fields});
        await product.save();
        res.json({product});

    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
});


const updateProduct = asyncHandler(async (req, res) => {
    try {

        const {name, description, price, category, quantity, brand, image} = req.fields;

        // Validate
        switch (true){
            case !name:
                return res.json({error: "Name is required!"})
            case !description:
                return res.json({error: "Description is required!"})
            case !price:
                return res.json({error: "Price is required!"})
            case !category:
                return res.json({error: "Category is required!"})
            case !quantity:
                return res.json({error: "Quantity is required!"})
            case !brand:
                return  res.json({error: "Brand is required!"})
            case !image:
                return  res.json({error: "Image is required!"})
        }

        const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields}, {new: true});
        await product.save();
        res.json(product);
        
    } catch (error) {
        res.status(400).json(error.message);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({product: product});
    } catch (error) {
        res.status(500).json(error.message);
    }
});


const fetchProducts = asyncHandler(async (req, res) => {
    try {
        const pageSize = 6
        const keyword = req.query.keyword? {name: {$regex: req.query.keyword, $options: "i"}} : {};
        const count = await Product.countDocuments({...keyword})
        const products = await Product.find({...keyword}).limit(pageSize);

        res.json({
              products,
              page: 1,
              pages: Math.ceil(count / pageSize), 
              hasMore: false
            });

    } catch (error) {
        res.status(500).json(error.message);
    }
});


const fetchProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product){
            return res.json(product);
        } else {
            res.status(404);
            throw new Error("Product Not Found");
        }
        
    } catch (error) {
        console.log(error);
        res.status(404).json(error.message);
    }
});


const fetchAllProducts = asyncHandler(async (req, res) => {
    try {

        const products = await Product.find({}).populate('category').limit(12).sort({createdAt: -1})

        res.json(products);

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});


const addProductReview = asyncHandler(async (req, res) => {
        try {
            const {rating, comment} = req.body;
            const product = await Product.findById(req.params.id);
            
            if (product){
                const alreadyReviewed = product.reviews.find( r => r.user.toString() === req.user._id.toString());

                if (alreadyReviewed){
                    res.status(400)
                    throw new Error('Product already reviewed')
                } 

                const review = {
                    name: req.user.username,
                    rating: Number(rating),
                    comment, 
                    user: req.user._id,
                }
                product.reviews.push(review);
                product.numReviews = product.reviews.length
                product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

                await product.save()
                res.status(201).json({message: "Review added!"})
            } else {
                res.status(404);
                throw new Error("Product not found!");
            }
        } catch (error) {
            res.status(400).json(error.message)
        }
});


const fetchTopProducts = asyncHandler(async (req, res) => {
        try {
            const products = await Product.find({}).sort({rating: -1}).limit(4);
            res.json(products)
            
        } catch (error) {
            res.staus(400).json(error.message)
        }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find().sort({_id: -1}).limit(5);
        res.json(products)
    } catch (error) {
        res.staus(400).json(error.message)
    }
});

export {addProduct, updateProduct, deleteProduct, fetchProducts, fetchProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts};