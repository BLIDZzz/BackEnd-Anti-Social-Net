require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path"); 
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");
const YAML = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const app = express();

const PORT = process.env.PORT || 3000;
const COMMENT_MAX_AGE_MONTHS = Number(process.env.COMMENT_MAX_AGE_MONTHS);

const swaggerDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, 'swagger', 'swagger.yaml'), 'utf8')
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.locals.commentMaxAgeMonths = COMMENT_MAX_AGE_MONTHS;

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no está definido en el archivo .env");
}

if (!Number.isInteger(COMMENT_MAX_AGE_MONTHS) || COMMENT_MAX_AGE_MONTHS <= 0) {
        throw new Error("COMMENT_MAX_AGE_MONTHS debe ser un número entero positivo en el archivo .env");
}

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
