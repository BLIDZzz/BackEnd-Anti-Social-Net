const User = require("../models/user");

const validarNickName = async (req, res, next) => {
  try {
    const { nickName } = req.body;
    const existente = await User.findOne({ nickName });

    if (existente && existente._id.toString() !== req.params.id) {
      return res.status(400).json({
        message: `El nickName ${nickName} ya está en uso`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar el nickName" });
  }
};

module.exports = validarNickName;