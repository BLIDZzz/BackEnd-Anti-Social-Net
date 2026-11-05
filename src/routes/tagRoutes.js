const { Router } = require("express");
const router = Router();
const { getTags, createTag } = require("../controllers/tagControllers");
const validarSchema = require("../middlewares/validarSchema");
const tagSchema = require("../schemas/tagSchema");
const validarTagName = require("../middlewares/validarTagName");

router.get("/", getTags);
router.post("/", validarSchema(tagSchema), validarTagName, createTag);

module.exports = router;