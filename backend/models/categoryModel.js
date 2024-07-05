import mongoose from "mongoose";

const categoryScheme = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32,
        unique: true,
    }
})

export default mongoose.model('Category', categoryScheme);