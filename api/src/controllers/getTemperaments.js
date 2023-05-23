const axios = require("axios");
const { Temperament } = require("../db");

require("dotenv").config();

const { API_DOGS } = process.env;

const getTemperaments = async () => {
  try {
    const temperamentsFromBase = await Temperament.findAll();

    if (temperamentsFromBase.length > 0) {
      return [...temperamentsFromBase].sort();
    } else {
      const temperamentsFromApi = new Set();

      const { data } = await axios.get(API_DOGS);

      data.forEach((dog) => {
        if (dog.temperament) {
          const temperamentList = dog.temperament
            .split(",")
            .map((temp) => temp.trim());
          temperamentList.forEach((temp) => temperamentsFromApi.add(temp));
        }
      });

      const temperamentListSort = Array.from(temperamentsFromApi).sort();

      const temperamentLisObjet = temperamentListSort.map((temp) => {
        return {name: temp}
      })

      const temperamentIsert = await Temperament.bulkCreate(temperamentLisObjet)

      return temperamentIsert;
    }
  } catch (error) {
    console.error("getTemperament: ", error.message);
  }
};

module.exports = getTemperaments;
