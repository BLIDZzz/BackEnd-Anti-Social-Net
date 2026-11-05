const Tag = require("../models/tag");

const validarTagName = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existente = await Tag.findOne({ name });

    if (existente && existente._id.toString() !== req.params.id) {
      return res.status(400).json({
        message: `El tag ${name} ya existe`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar el tag" });
  }
};

module.exports = validarTagName;