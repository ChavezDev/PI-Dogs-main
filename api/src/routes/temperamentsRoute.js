const { Router } = require("express");
const getTemperaments = require("../controllers/getTemperaments");

const server = Router();

server.get("/", async (req, res) => {
  try {
    const temperamentList = await getTemperaments();
    res.status(200).json(temperamentList);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

module.exports = server;
