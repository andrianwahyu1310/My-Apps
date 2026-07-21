import fs from "fs/promises";
import { TOOLS_FILE } from "../config/path.js";

export const getAllTools = async (filePath) => {
    const raw = await fs.readFile(filePath || TOOLS_FILE, "utf-8");
    return JSON.parse(raw);
};

export const getToolById = async (filePath, id) => {
    const tools = await getAllTools(filePath);
    return tools.find(tool => tool.id === id);
};