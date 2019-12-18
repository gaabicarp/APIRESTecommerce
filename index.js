const express = require("express");
const cors = require("cors");
const app = express();
require("./functions/database")
require("dotenv").config();

//Middlewares
app.use(cors());
app.use(express.json());

//Rutas
app.use("/productos", require("./routes/routerProductos"));





app.listen(process.env.PORT, () => console.log("Escuchando puerto " + process.env.PORT))