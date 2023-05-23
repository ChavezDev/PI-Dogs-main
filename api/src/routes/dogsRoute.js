const { Router } = require("express");
const {
  getAllDogs,
  getDogByRaza,
  createNewDog,
  deleteDog
} = require("../controllers/getDogs");

const server = Router();

server.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const dogs = await getAllDogs(name);
    res.status(200).json(dogs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.get("/:idRaza", async (req, res) => {
  try {
    const { idRaza } = req.params;
    const dog = await getDogByRaza(idRaza);
    res.status(200).json(dog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.post("/", async (req, res) => {
  try {
    const { name, height, weight } = req.body;
    if (!name || !height || !weight) {
      res.status(400).send("Se necesita completar todos los campos");
    } else {
      const dog = await createNewDog(req.body);
      res.status(200).json(dog);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

server.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params
        const dogDestroy = await deleteDog(id)
        res.status(200).json(dogDestroy);
	} catch (error) {
		res.status(400).send(error.message)
	}
})


module.exports = server;
