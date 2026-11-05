const { Router } = require("express");
const router = Router();
const { getUsers, createUser } = require("../controllers/userControllers");
const validarSchema = require("../middlewares/validarSchema");
const userSchema = require("../schemas/userSchema");

router.get("/", getUsers);
router.post("/", validarSchema(userSchema), createUser);

module.exports = router;