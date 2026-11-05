const Tag = require("../models/tag");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los tags" });
  }
};

const createTag = async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el tag" });
  }
};

const getTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el tag" });
  }
};

const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el tag" });
  }
};

module.exports = {
  getTags,
  getTag,
  createTag,
  updateTag,
};