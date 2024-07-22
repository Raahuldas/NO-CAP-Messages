import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}
const connection: connectionObject = {}

const dbConnect = async (): Promise<void> => {

    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`,{});
        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected Successfully");

    } catch (error) {
        console.error("Error while connecting Database",error);
        process.exit(1)
    }
}

export default dbConnect;