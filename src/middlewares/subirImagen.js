const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configurar dónde se guardarán las imágenes
const storage = multer.diskStorage({
    // Indicar la carpeta donde se almacenarán los archivos
    destination: 'uploads/posts/',

    // Generar un nombre aleatorio para evitar archivos con nombres repetidos
    filename: (req, file, cb) => {
        // Obtener la extensión del archivo original
        const extension = path.extname(file.originalname).toLowerCase();

        // Crear un nombre aleatorio y conservar la extensión
        const nombreArchivo = crypto.randomBytes(16).toString('hex') + extension;

        cb(null, nombreArchivo);
    }
});

// Comprobar qué tipos de archivos se pueden subir
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    // Rechazar los archivos que no sean de un tipo permitido
    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de imagen no permitido'));
    }
};

// Crear el middleware de Multer con las configuraciones anteriores
const subirImagen = multer({
    storage: storage,
    fileFilter: fileFilter,

    // Limitar el tamaño de cada imagen a 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = subirImagen;