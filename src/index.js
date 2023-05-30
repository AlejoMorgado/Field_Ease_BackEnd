

const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = process.env.PORT || 3000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'santimorgado12',
    database: 'fieldease'
});

const moment = require('moment-timezone');
app.use(express.json());

app.post('/api/sensorsData', (req, res) => {
    const { air_temperature, air_humidity, floor_sensor1, floor_sensor2 } = req.body;

    if (!air_temperature || !air_humidity || !floor_sensor1 || !floor_sensor2) {
        res.status(400).send('Invalid data');
        return;
    }

    const actual_date = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    const sql = 'INSERT INTO sensors  VALUES (?, ?, ? , ?, ?)';
    connection.query(sql, [actual_date, air_temperature, air_humidity,floor_sensor1, floor_sensor2 ], (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
            return;
        }
        console.log(`Data successfully inserted: ${actual_date}, ${air_temperature}, ${air_humidity}, ${floor_sensor1}, ${floor_sensor2}`);
        res.sendStatus(200);
    });
});

app.get('/api/data', (req, res) => {
    const sql = 'SELECT * FROM sensors';

    connection.query(sql, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
            return;
        }

        res.json(results); 
    });
});

app.get('/api/updatedData', (req, res) => {
    const sql = 'SELECT * FROM sensors ORDER BY actual_date DESC  LIMIT 10;'; 

    connection.query(sql, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send(error);
            return;
        }

        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});