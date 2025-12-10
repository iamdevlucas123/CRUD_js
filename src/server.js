require("dotenv").config();
const express = require("express");
const usersRouter = require("./routes/users_routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
