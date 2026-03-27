const aiService = require("../services/ai.service")


module.exports.getReview = async (req, res) => {
    try {
        const code = req.body.code;

        if (!code || typeof code !== 'string' || code.trim() === '') {
            return res.status(400).json({ error: "Code prompt is required and cannot be empty." });
        }

        const response = await aiService(code);
        res.send(response);
    } catch (error) {
        console.error("AI Controller Error:", error.message);
        res.status(500).json({ error: "Failed to generate AI review. Please try again later." });
    }
}