import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to mongo`);
    }catch (error){
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

export default connectDB;