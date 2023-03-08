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
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const app = (0, express_1.default)();
// MySQL bağlantısı
const connection = mysql_1.default.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'starwars',
});
// connection.connect((error) => {
//   if (error) {
//     console.error('MySQL couldnt connect:', error);
//   } else {
//     console.log('MySQL successfully connected.');
//   }
// });
// Get People
app.get('/people', (req, res) => {
    // MySQL sorgusu
    connection.query('SELECT * FROM people', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Veritabanına erişim sağlanamadı.');
        }
        else {
            res.status(200).json(results);
        }
    });
});
app.get('/people/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.params.name;
    connection.query(`SELECT * FROM people WHERE name = ?`, [name], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Veritabanına erişim sağlanamadı.');
        }
        else {
            res.status(200).json(results);
        }
    });
}));
app.listen(3000, () => {
    console.log('Sunucu calisiyor: http://localhost:3000');
});
