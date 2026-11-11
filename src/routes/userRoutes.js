const { Router } = require("express");
const router = Router();
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/userControllers");
const validarSchema = require("../middlewares/validarSchema");
const userSchema = require("../schemas/userSchema");
const validarReferencia = require("../middlewares/validarReferencia");
const User = require("../models/user");
const validarNickName = require("../middlewares/validarNickName");
const followSchema = require("../schemas/followSchema");
const { followUser, unfollowUser, getFollowers, getFollowing } = require("../controllers/followControllers");

router.get("/", getUsers);
router.get("/:id", validarReferencia(User, "id", "params"), getUser);
router.post("/", validarSchema(userSchema), validarNickName, createUser);
router.put("/:id", validarReferencia(User, "id", "params"), validarSchema(userSchema), validarNickName, updateUser);
router.delete("/:id", validarReferencia(User, "id", "params"), deleteUser);
router.post("/:id/follow", validarReferencia(User, "id", "params"), validarSchema(followSchema), validarReferencia(User, "followerId"), followUser);
router.delete("/:id/unfollow", validarReferencia(User, "id", "params"), validarSchema(followSchema), validarReferencia(User, "followerId"), unfollowUser);
router.get("/:id/followers", validarReferencia(User, "id", "params"), getFollowers);
router.get("/:id/following", validarReferencia(User, "id", "params"), getFollowing);

module.exports = router;