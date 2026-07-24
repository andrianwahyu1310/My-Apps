import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Atlas berhasil terhubung.");
        return true; // <-- Tambahkan ini agar mengembalikan nilai true
    } catch (err) {
        console.error("❌ Gagal terhubung ke MongoDB:", err.message);
        process.exit(1);
    }
};

export default connectDB;