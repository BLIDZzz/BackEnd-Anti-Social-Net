const manejarErrores = (error, req, res, next) => {
  // El body no es un JSON válido
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
  }

  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
};

module.exports = manejarErrores;