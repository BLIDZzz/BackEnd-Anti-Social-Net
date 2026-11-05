require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;
const COMMENT_MAX_AGE_MONTHS = Number(process.env.COMMENT_MAX_AGE_MONTHS);

app.use(express.json());
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
