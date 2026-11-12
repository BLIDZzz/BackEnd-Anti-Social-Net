const fs = require('fs');
const path = require('path');

// Agregar una imagen mediante una URL
const createPostImage = async (req, res) => {
    try {
        const { url } = req.body;

        // Agregar la URL al array de imágenes de la publicación
        req.post.images.push({ url });

        // Guardar los cambios en MongoDB
        await req.post.save();

        // Obtener la imagen que acabamos de agregar
        const imagen = req.post.images[req.post.images.length - 1];

        return res.status(201).json(imagen);

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al agregar la imagen'
        });
    }
};

// Agregar una imagen a una publicación
const uploadPostImage  = async (req, res) => {
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

// Eliminar una imagen de una publicación
const deletePostImage = async (req, res) => {
    try {
        // Comprobar si la imagen es un archivo almacenado localmente
        const esImagenLocal = req.imagen.url.startsWith('/uploads/posts/');

        // Eliminar la imagen del array de la publicación
        req.imagen.deleteOne();

        // Guardar los cambios en MongoDB
        await req.post.save();

        // Si es una imagen local, eliminar también el archivo físico
        if (esImagenLocal) {
            const rutaImagen = path.join(
                __dirname,
                '..',
                'uploads',
                'posts',
                path.basename(req.imagen.url)
            );

            try {
                await fs.promises.unlink(rutaImagen);
            } catch (errorArchivo) {
                if (errorArchivo.code !== 'ENOENT') {
                    console.error('No se pudo eliminar la imagen:', errorArchivo);
                }
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
    uploadPostImage,
    deletePostImage
};