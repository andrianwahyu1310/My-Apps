const protectAPI = (req, res, next) => {
    if (req.session?.isLoggedIn && req.session?.userId) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Akses ditolak. Silakan login."
    });
};

export { protectAPI };
export default protectAPI;