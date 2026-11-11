const redis = require("redis");

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on("error", (error) => {
  console.error("Error de Redis:", error);
});

const connectRedis = async () => {
  await client.connect();
  console.log("Redis conectado exitosamente");
};

module.exports = { client, connectRedis };