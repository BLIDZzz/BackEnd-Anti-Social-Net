const User = require("../models/user");

const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;

    if (id === followerId) {
      return res.status(400).json({ message: "Un usuario no puede seguirse a sí mismo" });
    }

    const follower = await User.findById(followerId);

    for (let i = 0; i < follower.following.length; i++) {
      if (follower.following[i].toString() === id) {
        return res.status(400).json({ message: "El usuario ya sigue a este usuario" });
      }
    }

    follower.following.push(id);
    await follower.save();

    res.status(200).json({ message: "Usuario seguido" });
  } catch (error) {
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { followerId } = req.body;

    const follower = await User.findById(followerId);

    const nuevosFollowing = [];
    for (let i = 0; i < follower.following.length; i++) {
      if (follower.following[i].toString() !== id) {
        nuevosFollowing.push(follower.following[i]);
      }
    }

    if (nuevosFollowing.length === follower.following.length) {
      return res.status(400).json({ message: "El usuario no sigue a este usuario" });
    }

    follower.following = nuevosFollowing;
    await follower.save();

    res.status(200).json({ message: "Dejó de seguir al usuario" });
  } catch (error) {
    res.status(500).json({ message: "Error al dejar de seguir al usuario" });
  }
};

module.exports = {
  followUser,
  unfollowUser,
};