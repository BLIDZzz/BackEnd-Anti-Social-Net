const { Router } = require("express");
const router = Router();
const { getUsers, getUser, createUser } = require("../controllers/userControllers");
const validarSchema = require("../middlewares/validarSchema");
const userSchema = require("../schemas/userSchema");
const validarReferencia = require("../middlewares/validarReferencia");
const User = require("../models/user");
const validarNickName = require("../middlewares/validarNickName");

router.get("/", getUsers);
router.get("/:id", validarReferencia(User, "id", "params"), getUser);
router.post("/", validarSchema(userSchema), validarNickName, createUser);

module.exports = router;