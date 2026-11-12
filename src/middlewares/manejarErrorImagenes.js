const multer = require('multer');

// Middleware para manejar los errores producidos durante las peticiones
const manejarErrores = (error, req, res, next) => {

    // Comprobar si el error fue producido por Multer
    if (error instanceof multer.MulterError) {

        // Comprobar si la imagen superó el tamaño permitido
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'La imagen no puede superar los 5 MB'
            });
        }

        // Manejar otros errores de Multer
        return res.status(400).json({
            message: 'Error al subir la imagen'
        });
    }

    // Comprobar si el formato de archivo no está permitido
    if (error.message === 'Formato de imagen no permitido') {
        return res.status(400).json({
            message: error.message
        });
    }

    // Pasar cualquier otro error al siguiente middleware de errores
    next(error);
};

module.exports = manejarErrores;