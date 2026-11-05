const { Router } = require("express");
const router = Router();
const { getTags, getTag, createTag, updateTag, deleteTag } = require("../controllers/tagControllers");
const validarSchema = require("../middlewares/validarSchema");
const tagSchema = require("../schemas/tagSchema");
const validarTagName = require("../middlewares/validarTagName");
const validarReferencia = require("../middlewares/validarReferencia");
const Tag = require("../models/tag");

router.get("/", getTags);
router.get("/:id", validarReferencia(Tag, "id", "params"), getTag);
router.post("/", validarSchema(tagSchema), validarTagName, createTag);
router.put("/:id", validarReferencia(Tag, "id", "params"), validarSchema(tagSchema), validarTagName, updateTag);
router.delete("/:id", validarReferencia(Tag, "id", "params"), deleteTag);

module.exports = router;