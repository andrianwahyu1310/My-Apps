import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, "../data/users.json");

const isMongoAvailable = () => mongoose.connection.readyState === 1;

const readUsersFromFile = async () => {
    try {
        const rawData = await fs.readFile(usersFilePath, "utf-8");
        const parsed = JSON.parse(rawData);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        if (err.code === "ENOENT") {
            await fs.writeFile(usersFilePath, "[]", "utf-8");
            return [];
        }
        throw err;
    }
};

const writeUsersToFile = async (users) => {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
};

// ========================================
// USER SERVICES
// ========================================

export const findUserByUsername = async (username) => {
    if (!username) return null;

    if (!isMongoAvailable()) {
        const users = await readUsersFromFile();
        return users.find((user) => user.username === username) || null;
    }

    return User.findOne({ username });
};

export const findUserById = async (id) => {
    if (!id) return null;

    if (!isMongoAvailable()) {
        const users = await readUsersFromFile();
        const user = users.find((item) => item._id === id);
        return user ? { ...user, _id: user._id } : null;
    }

    // Mencegah error jika ID bukan Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
    }

    return User.findById(id).select(
        "_id username theme status createdAt"
    );
};

export const createUser = async (
    username,
    password,
    theme = "dark",
    status = "Anggota Aktif"
) => {
    if (!isMongoAvailable()) {
        const users = await readUsersFromFile();
        const newUser = {
            _id: crypto.randomUUID(),
            username,
            password,
            theme,
            status,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsersToFile(users);
        return newUser;
    }

    return User.create({
        username,
        password,
        theme,
        status
    });
};

export const updateUserTheme = async (username, theme) => {
    if (!username) return null;

    if (!isMongoAvailable()) {
        const users = await readUsersFromFile();
        const userIndex = users.findIndex((item) => item.username === username);

        if (userIndex === -1) return null;

        users[userIndex].theme = theme;
        await writeUsersToFile(users);
        
        const { password, ...safeUser } = users[userIndex];
        return safeUser;
    }

    return User.findOneAndUpdate(
        { username },
        { theme },
        { new: true }
    ).select("-password");
};

// ========================================
// MIGRASI JSON KE MONGO
// ========================================

export const migrateUsersFromJson = async () => {
    try {
        const rawData = await fs.readFile(usersFilePath, "utf-8");
        const users = JSON.parse(rawData);

        if (!Array.isArray(users) || users.length === 0) return;
        if (!isMongoAvailable()) return;

        let imported = 0;

        for (const user of users) {
            if (!user.username || !user.password) continue;

            const existing = await User.findOne({ username: user.username });
            if (existing) continue;

            await User.create({
                username: user.username,
                password: user.password,
                theme: user.theme || "dark",
                status: user.status || "Anggota Aktif"
            });

            imported++;
        }

        if (imported > 0) {
            console.log(`✅ Migrasi ${imported} user ke MongoDB berhasil.`);
        }
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("❌ Error Migrasi JSON:", err.message);
        }
    }
};