import mongoose from "mongoose";

const connectDB = async() => {
    console.log(process.env.MONGO_URI)
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);

        console.log("DataBase Connected :", connect.connection.host);
    } catch (error) {
        console.error("err", error);
    }
}

export default connectDB;