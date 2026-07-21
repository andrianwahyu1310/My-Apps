import {
    getAllTools,
    getToolById
} from "../services/toolsServices.js";

export const getTools = async (req, res) => {
    try {

        const tools = await getAllTools(req.app.locals.toolsFile);

        res.json(tools);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Gagal memuat daftar peralatan hitung."
        });

    }
};

export const getMainTool = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const tool = await getToolById(
            req.app.locals.toolsFile,
            id
        );

        if (!tool) {
            return res.status(404).json({
                success: false,
                message: "Alat hitung tidak terdaftar!"
            });
        }

        res.json(tool);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Gagal memproses data alat."
        });

    }
};