import mongoose from "mongoose";

export const connectDB = async () => {
    // await mongoose.connect('mongodb+srv://proj_db_user:invoice123@cluster0.htu6gtu.mongodb.net/InvoiceAI')
    await mongoose.connect('mongodb+srv://maddy1997ac_db_user:invoice123@cluster0.gq8aigs.mongodb.net/InvoiceAI')
    .then(() => {console.log("DB Connected")})
} 