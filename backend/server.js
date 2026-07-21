import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";

import connectDB from "./config/database.js";
import { migrateUsersFromJson } from "./services/userServices.js";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
    try {
        const connected = await connectDB();
        if (connected) {
            await migrateUsersFromJson();
        }

        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Gagal menjalankan server");
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    startServer();
}

export default app;