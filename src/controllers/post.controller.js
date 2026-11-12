const { client } = require('../config/redis');
const Post = require('../models/post');
const Comment = require('../models/comment');

// Obtener todas las publicaciones con sus tags y comentarios visibles
const getAllPosts = async (req, res) => {
    try {
        // Si los posts están en la caché, responder desde Redis
        const cache = await client.get('posts');
        if (cache) {
            return res.status(200).json(JSON.parse(cache));
        }
        // Obtener todas las publicaciones y completar los datos de sus tags
        const posts = await Post.find().populate('tags', 'name');

        // Recorrer las publicaciones para obtener sus comentarios
        const postsConComentarios = await Promise.all(
            posts.map(async (post) => {

                // Buscar los comentarios asociados a esta publicación
                const comentarios = await Comment.find({
                    post: post._id
                }).populate('user', 'nickName');

                // Filtrar los comentarios que todavía son visibles
                const comentariosVisibles = comentarios.filter(
                    comentario => comentario.isVisible
                );

                // Devolver la publicación junto con sus comentarios
                return {
                    ...post.toObject(),
                    comments: comentariosVisibles
                };
            })
        );
        
        // Guardar el resultado en la caché por 60 segundos
        await client.set('posts', JSON.stringify(postsConComentarios), { EX: 60 });
        return res.status(200).json(postsConComentarios);

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al obtener las publicaciones'
        });
    }
};

// Obtener una publicación por ID, incluyendo sus tags y comentarios visibles
const getPostById = async (req, res) => {
    try {
        // Obtener los tags asociados a la publicación
        const post = await req.post.populate('tags', 'name');

        // Buscar los comentarios asociados a esta publicación
        const comentarios = await Comment.find({
            post: post._id
        }).populate('user', 'nickName');

        // Filtrar los comentarios que todavía son visibles
        const comentariosVisibles = comentarios.filter(
            comentario => comentario.isVisible
        );

        // Devolver la publicación junto con sus comentarios
        return res.status(200).json({
            ...post.toObject(),
            comments: comentariosVisibles
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al obtener la publicación'
        });
    }
};

// Crear una publicacion
const createPost = async (req, res) => {
    try {
        const { description, user } = req.body;

        const post = await Post.create({
            description,
            user
        });

        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar una publicacion
const updatePost = async (req, res) => {
    try {
        req.post.description = req.body.description;

        await req.post.save();

        return res.status(200).json(req.post);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar una publicacion
const deletePost = async (req, res) => {
    try {
        // Eliminar los comentarios asociados a la publicación
        await Comment.deleteMany({
            post: req.post._id
        });

        // Eliminar la publicación y sus imágenes embebidas
        await req.post.deleteOne();

        return res.status(200).json({
            message: 'La publicación fue eliminada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Asociar un tag a una publicación
const agregarTagPost = async (req, res) => {
    try {
        const { tagId } = req.body;

        // Comprobar si el tag ya está asociado a la publicación
        const yaExiste = req.post.tags.some(
            tag => tag.toString() === tagId
        );

        if (yaExiste) {
            return res.status(400).json({
                message: 'El tag ya está asociado a esta publicación'
            });
        }

        // Agregar el ID del tag al array de la publicación
        req.post.tags.push(tagId);

        // Guardar los cambios en MongoDB
        await req.post.save();

        return res.status(201).json({
            message: 'Tag asociado correctamente a la publicación',
            tags: req.post.tags
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al asociar el tag'
        });
    }
};

// Quitar un tag de una publicación
const eliminarTagPost = async (req, res) => {
    try {
        const { tagId } = req.params;

        // Buscar la posición del tag dentro del array
        const indice = req.post.tags.findIndex(
            tag => tag.toString() === tagId
        );

        // Comprobar si el tag está asociado a la publicación
        if (indice === -1) {
            return res.status(404).json({
                message: 'El tag no está asociado a esta publicación'
            });
        }

        // Eliminar el tag del array
        req.post.tags.splice(indice, 1);

        // Guardar los cambios en MongoDB
        await req.post.save();

        return res.status(200).json({
            message: 'Tag eliminado correctamente de la publicación',
            tags: req.post.tags
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor al eliminar el tag'
        });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    agregarTagPost,
    eliminarTagPost
};