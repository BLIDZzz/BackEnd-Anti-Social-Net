const Post = require('../models/post');
const Comment = require('../models/comment');

// Obtener todas las publicaciones
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};

// Obtener una publicacion por su ID
const getPostById = async (req, res) => {
    try {
        return res.status(200).json(req.post);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno del servidor'
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

module.exports = {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
};