const fs = require('fs');
const path = require('path');

// Agregar una imagen a una publicación
const createPostImage = async (req, res) => {
    try {
        // Comprobar que se haya recibido un archivo
        if (!req.file) {
            return res.status(400).json({
                message: 'No se proporcionó ninguna imagen'
            });
        }

        // Obtener la ruta de la imagen guardada por Multer
        const url = '/uploads/posts/' + req.file.filename;

        // Agregar la imagen al array de imágenes de la publicación
        req.post.images.push({ url });

        // Guardar los cambios en MongoDB
        await req.post.save();

        // Obtener la imagen que acabamos de agregar
        const imagen = req.post.images[req.post.images.length - 1];

        return res.status(201).json(imagen);

    } catch (error) {
        // Si MongoDB falla, eliminar el archivo que Multer había guardado
        if (req.file) {
            const rutaImagen = path.join(
                process.cwd(),
                'uploads',
                'posts',
                req.file.filename
            );

            try {
                await fs.promises.unlink(rutaImagen);
            } catch (errorArchivo) {
                // Si no se pudo eliminar el archivo, no ocultar el error original
                console.error('No se pudo eliminar el archivo:', errorArchivo);
            }
        }

        return res.status(500).json({
            message: 'Error interno del servidor al subir la imagen'
        });
    }
};

module.exports = {
    createPostImage
};


// Eliminar una imagen de una publicacion

const deletePostImage = async (req, res) => {
    try {
        // Obtener la ruta del archivo que queremos eliminar
        const rutaImagen = path.join(
            process.cwd(),
            'uploads',
            'posts',
            path.basename(req.imagen.url)
        );

        // Eliminar la imagen del array de la publicación
        req.imagen.deleteOne();

        // Guardar los cambios en MongoDB
        await req.post.save();

        // Eliminar el archivo físico del servidor
        try {
            await fs.promises.unlink(rutaImagen);
        } catch (errorArchivo) {
            // Si el archivo ya no existe, no es necesario hacer nada
            if (errorArchivo.code !== 'ENOENT') {
                console.error('No se pudo eliminar la imagen:', errorArchivo);
            }
        }

        return res.status(200).json({
            message: 'La imagen fue eliminada correctamente'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al eliminar la imagen'
        });
    }
};

module.exports = {
    createPostImage,
    deletePostImage
};