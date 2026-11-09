require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path"); 
const connectDB = require("./config/database");

// 1. Importación de Rutas
const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");
const YAML = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const commentRoutes = require("./routes/comment.routes");

// 2. Validaciones tempranas de variables de entorno
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI no está definido en el archivo .env");
}

const COMMENT_MAX_AGE_MONTHS = Number(process.env.COMMENT_MAX_AGE_MONTHS);
if (!Number.isInteger(COMMENT_MAX_AGE_MONTHS) || COMMENT_MAX_AGE_MONTHS <= 0) {
  throw new Error("COMMENT_MAX_AGE_MONTHS debe ser un número entero positivo en el archivo .env");
}

const app = express();
const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, 'swagger', 'swagger.yaml'), 'utf8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.locals.commentMaxAgeMonths = COMMENT_MAX_AGE_MONTHS;

// 3. Middlewares globales (¡SIEMPRE antes de las rutas!)
app.use(express.json());

// 4. Montaje de Rutas
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.use("/comments", commentRoutes);

// 5. Función de inicio del servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();