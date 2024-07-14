
//with MIME typing

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'database', 'nlp_test_data.db');

// Setup the database
let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory with correct headers
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/test', (req, res) => {
    res.send('Server is working!');
});

app.post('/submit-demographics', (req, res) => {
    console.log('Received request for /submit-demographics');

    const { consent, fluent, age, geographic_location, first_language, dialect, dialect_specify } = req.body;
    
    if (consent !== 'yes') {
        return res.send('You must consent to continue with the study.');
    }

    const userId = Math.floor(Math.random() * 1000000);

    const dialectValue = dialect === 'yes' ? dialect_specify : 'N/A';

    const insertDemographics = `INSERT INTO "Demographic Information" (UserID, Fluent, Age, GeographicLocation, FirstLanguage, Dialect) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(insertDemographics, [userId, fluent.toUpperCase(), age, geographic_location, first_language, dialectValue], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.redirect(`/intermediate?userId=${userId}`);
    });
});

app.get('/intermediate', (req, res) => {
    if (!req.query.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'intermediate.html'));
});

app.get('/game', (req, res) => {
    if (!req.query.userId) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, 'game.html'));
});

app.post('/submit-game', (req, res) => {
    const { userId, response1, response2, letter, response3, response4, response5, sentiment_label } = req.body;

    const insertResponses = `INSERT INTO "Textual Responses" (USERID, response1, response2, letter, response3, response4, response5, sentiment_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(insertResponses, [userId, response1, response2, letter, response3, response4, response5, sentiment_label], function(err) {
        if (err) {
            return console.log(err.message);
        }
        res.send('Thanks for playing!');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



