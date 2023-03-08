import express, { Request, Response } from 'express';
import mysql from 'mysql';

const app = express();

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'starwars',
});

// Get People
app.get('/people', (req, res) => {

  connection.query('SELECT * FROM people', (error, results) => {
    if (error) {
      console.error(error);
    } else {
      res.status(200).json(results);
    }
  });
});

// Get People by name
app.get('/people/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  connection.query(`SELECT * FROM people WHERE name = ?`, [name], (error, results) => {
    if (error) {
      console.error(error);
    } else {
      res.status(200).json(results);
    }
  });
});

// Get People by name
app.get('/people/:name', async (req: Request, res: Response) => {
  const name = req.params.name;
  connection.query(`SELECT * FROM people WHERE name = ?`, [name], (error, results) => {
    if (error) {
      console.error(error);
    } else {
      res.status(200).json(results);
    }
  });
});

  app.listen(3000, () => {
    console.log('Server is running: http://localhost:3000');
  });
  