import Category from '../models/categoryModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import categoryModel from '../models/categoryModel.js';
import mongoose from "mongoose"; 

const createCategory = asyncHandler(async (req, res) => {
    try {
        const {name} = req.body;
        console.log(name);
        if (!name){
            return res.json({error: "name is required!"});
        }
        const exsitingCategory = await categoryModel.findOne({name});
        if (exsitingCategory){
            return res.json({error: "Category already exists!"})
        }

        const category = await new Category({name}).save();
        res.json(category);
        
    }catch (error) {
        return res.status(400).json(error);
    }
});



const updateCategory = asyncHandler(async (req, res) =>{
    try{
        const {name} = req.body;
        const {categoryId} = req.params;
    
        const category = await categoryModel.findOne({_id: categoryId});    

        if (!category){
            return res.status(404).json({error: "Category not found!"});
        }
        category.name = name;
        const updatedCategory = await category.save()

        res.status(200).json(updatedCategory);

        
    } catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: "Invalid Category ID" });
        }

        const removedCategory = await Category.findByIdAndDelete(categoryId);

        if (!removedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted successfully", removedCategory });
    } catch (error) {
        res.status(500).json({ error: "Problem occurred deleting category", details: error.message });
    }
});


const getCategories = asyncHandler(async (req, res) => {
    try {
        const all = await Category.find({});
        res.json(all);
        
    } catch (error) {
        res.status(400).json({message: message})
    }
});


const readCategory = asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryDetails = await Category.findOne({_id: categoryId});  
        res.status(200).json(categoryDetails);
    } catch (error) {
        res.status(404).json("Category Not found!")
    }
});


export {createCategory, updateCategory, deleteCategory, getCategories, readCategory};