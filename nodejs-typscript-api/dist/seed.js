"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const program = new commander_1.Command();
program
    .command("import")
    .description("Import planets, species, and people from Star Wars Api to Mysql")
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planetsResponse = yield axios_1.default.get("https://swapi.dev/api/planets");
        const speciesResponse = yield axios_1.default.get("https://swapi.dev/api/species");
        const planetsSwapi = planetsResponse.data.results;
        const speciesSwapi = speciesResponse.data.results;
        // Import planets ---------------------------------------------
        for (const planetSwapi of planetsSwapi) {
            const peopleUrls = planetSwapi.residents;
            if (!peopleUrls)
                continue;
            const people = yield Promise.all(peopleUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield axios_1.default.get(url);
                return response.data;
            })));
            const planetid = parseInt(planetSwapi.url.split("/").filter(Boolean).pop());
            yield prisma.planets.create({
                data: {
                    id: planetid,
                    name: planetSwapi.name,
                    climate: planetSwapi.climate,
                    terrain: planetSwapi.terrain,
                    population: planetSwapi.population,
                    residents: {
                        create: people.map((person) => {
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
            if (!peopleUrls)
                continue; // skip if memberUrls is undefined      
            const people = yield Promise.all(peopleUrls.map((url) => __awaiter(void 0, void 0, void 0, function* () {
                const response = yield axios_1.default.get(url);
                return response.data;
            })));
            const specieid = parseInt(specieSwapi.url.split("/").filter(Boolean).pop());
            const create = yield prisma.species.create({
                data: {
                    id: specieid,
                    name: specieSwapi.name,
                    classification: specieSwapi.classification,
                    averageHeight: specieSwapi.average_height || null,
                    averageLifespan: specieSwapi.average_lifespan || null,
                    language: specieSwapi.language,
                    homeworld: specieSwapi.homeworld,
                    people: {
                        create: people.map((person) => {
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
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}));
program.parse(process.argv);
