import express from "express";
import dotenv from "dotenv";
import initApp from "./src/initApp.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
initApp(app, express);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT} `);
});
