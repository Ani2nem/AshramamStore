import express from 'express';
import formidable from 'express-formidable';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';
import checkId from '../middlewares/checkId.js'

import { addProduct, updateProduct, deleteProduct, fetchProducts, fetchProductById, fetchAllProducts, addProductReview, fetchTopProducts, fetchNewProducts,filteredProducts } from '../controllers/productController.js';

const router = express.Router();


router.route('/').get(fetchProducts).
post(authenticate, authorizeAdmin, formidable(), addProduct);

router.route('/allproducts').get(fetchAllProducts);
router.route('/:id/reviews').post( authenticate, authorizeAdmin,  checkId , addProductReview);

router.get('/top', fetchTopProducts);
router.get('/new', fetchNewProducts);
router.route('/filtered-products').post(filteredProducts);

router.route('/:id').put(authenticate, authorizeAdmin, formidable(), updateProduct)
.delete(authenticate, authorizeAdmin, formidable(), deleteProduct)
.get(fetchProductById)


export default router;