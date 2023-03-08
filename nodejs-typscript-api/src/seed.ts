import { Command } from "commander";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const program = new Command();

program
  .command("import")
  .description("Import planets, species, and people from Star Wars Api to Mysql")
  .action(async () => {
    try {
      const planetsResponse = await axios.get("https://swapi.dev/api/planets");
      const speciesResponse = await axios.get("https://swapi.dev/api/species");

      const planetsSwapi = planetsResponse.data.results;
      const speciesSwapi = speciesResponse.data.results;


      // Import planets ---------------------------------------------
      for (const planetSwapi of planetsSwapi) {
        const peopleUrls = planetSwapi.residents;
        if (!peopleUrls) continue; // skip if peopleUrls is undefined
        const people = await Promise.all(
          peopleUrls.map(async (url: string) => {
            const response = await axios.get(url);
            return response.data;
          })
        );

        //to get planet ID as given by Swapi
        const planetid = parseInt(planetSwapi.url.split("/").filter(Boolean).pop());

        // Create planets in db
        await prisma.planets.create({
          data: {
            id: planetid,
            name: planetSwapi.name,
            climate: planetSwapi.climate,
            terrain: planetSwapi.terrain,
            population: planetSwapi.population,
            residents: {
              create: people.map((person: any) => {
                //to get people ID as given by Swapi
                const personId = parseInt(person.url.split("/").filter(Boolean).pop());
                return {
                  id: personId,
                  name: person.name,
                  height: person.height,
                  mass: person.mass,
                  hair_color: person.hair_color,
                  skin_color: person.skin_color,
                  eye_color: person.eye_color,
                  birth_year: person.birth_year,
                  gender: person.gender
                };
              }),
            }
          },
        });
        console.log(`Planet ${planetSwapi.name} imported successfully.`);
      }

      // Import species---------------------------------------------
      for (const specieSwapi of speciesSwapi) {

        const peopleUrls = specieSwapi.people;
        if (!peopleUrls) continue; // skip if peopleUrls is undefined      
        const people = await Promise.all(
          peopleUrls.map(async (url: string) => {
            const response = await axios.get(url);
            return response.data;
          })
        );

        //to get specie ID as given by Swapi
        const specieid = parseInt(specieSwapi.url.split("/").filter(Boolean).pop());
        // Create species in db
        await prisma.species.create({
          data: {
            id: specieid,
            name: specieSwapi.name,
            classification: specieSwapi.classification,
            averageHeight: specieSwapi.average_height || null,
            averageLifespan: specieSwapi.average_lifespan || null,
            language: specieSwapi.language,
            homeworld: specieSwapi.homeworld,
            people: {
              create: people.map((person: any) => {                
                //to get people ID as given by Swapi
                const personSpecieId = parseInt(person.url.split("/").filter(Boolean).pop());
                return {
                  id: personSpecieId,
                  name: person.name,
                  height: person.height,
                  mass: person.mass,
                  hair_color: person.hair_color,
                  skin_color: person.skin_color,
                  eye_color: person.eye_color,
                  birth_year: person.birth_year,
                  gender: person.gender
                };
              }),
            }
          },
        });
        console.log(`Specie ${specieSwapi.name} imported successfully.`);
      }        
      console.log("Data imported successfully!");
      process.exit();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
