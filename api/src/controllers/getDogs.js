const axios = require("axios");
const { Dog, Temperament } = require("../db");
require("dotenv").config();
const { API_DOGS } = process.env;

const getDogsFromApi = async () => {
  console.log("paso por aqui");
  try {
    const { data } = await axios.get(API_DOGS);

    let dogList = await data.map((dog) => {
      let weight = dog.weight.metric.split("-")[0];
      let height = dog.height.metric.split("-")[0];
      let temperamentsList = dog.hasOwnProperty("temperament")
        ? dog.temperament.split(".").map((temp) => temp.trim())
        : "";

      let reorderDog = {
        id: dog.id,
        name: dog.name,
        weight: Number(weight),
        height: Number(height),
        temperaments: temperamentsList,
        life_span: dog.life_span,
        bred_for: dog.bred_for,
        image: dog.image.url,
        from: "API_DOGS",
      };

      return reorderDog;
    });

    return dogList;
  } catch (error) {
    console.error("getDogsFromApi: ", error.message);
  }
};

const getDogsFromBD = async () => {
  try {
    const dogsDB = await Dog.findAll({
      include: {
        model: Temperament,
        through: {
          attributes: [],
        },
      },
    });

    if (dogsDB.length > 0) {
      const dogsList = await dogsDB.map((dog) => {
        const temperamentList = dog.temperaments.map((temp) => temp.name);
        const reorderDog = {
          id: dog.id,
          name: dog.name,
          weight: dog.weight,
          height: dog.height,
          temperaments: temperamentList,
          life_span: dog.life_span,
          bred_for: dog.bred_for,
          image: dog.image,
          from: "DB",
        };

        return reorderDog;
      });
      return dogsList;
    } else {
      return [];
    }
  } catch (error) {
    console.error("getDogsFromBD: ", error.message);
  }
};

const getAllDogs = async (nameDog) => {
  console.log("si llegamos aqui");
  const dogsFromApi = await getDogsFromApi();
  const dogsFromDB = await getDogsFromBD();

  const allDogs = [...dogsFromApi, ...dogsFromDB];

  return nameDog
    ? allDogs.filter((dog) => {
        return dog.name.toLowerCase().search(nameDog.toLowerCase()) >= 0;
      })
    : allDogs;
};

const getDogByRaza = async (idRaza) => {
  try {
    const dogs = await getAllDogs();
    const dog = dogs.find((dog) => dog.id.toString() === idRaza.toString());
    return dog || false;
  } catch (error) {
    console.error("geDogByRaza: ", error.message);
  }
};

const createNewDog = async (objetDog) => {
  console.log(objetDog);

  const { name, height, weight, temperament, life_span, image, bred_for } =
    objetDog;

  try {
    const newDog = await Dog.create({
      name,
      height,
      weight,
      life_span,
      image,
      bred_for,
    });

    temperament.length
      ? temperament.map(async (temp) => {
          const temperament = await Temperament.findOne({
            attributes: ["id"],
            where: { name: temp },
          });

          await newDog.addTemperament(temperament.id);
        })
      : [];
    return newDog;
  } catch (error) {
    console.error("createNewDog: ", error.message);
  }
};

const deleteDog = async (id) => {
  try {
    const dogDestroy = await Dog.destroy({
      where: {
        id,
      },
      force: true,
    });
    return dogDestroy;
  } catch (error) {
    console.error("deleteDog: ", error.message);
  }
};

module.exports = { getAllDogs, getDogByRaza, createNewDog, deleteDog };
