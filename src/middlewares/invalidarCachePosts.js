const { client } = require("../config/redis");

const invalidarCachePosts = async (req, res, next) => {
  try {
    if (req.method !== "GET") {
      await client.del("posts");
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = invalidarCachePosts;