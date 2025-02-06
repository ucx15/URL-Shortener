const crypto = require('crypto');

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();


// Constants
const HOST = "localhost";
const FRONTEND_PORT = 5500;
const BACKEND_PORT  = 3000;

const HOST_URL          = `http://${HOST}:${BACKEND_PORT}`;
const FRONTEND_HOST_URL = `http://${HOST}:${FRONTEND_PORT}`;

const DB_NAME = "database.db";

const CODE_LENGTH = 6;


// Vars
const db = new sqlite3.Database(DB_NAME);
const app = express();
app.use(
	cors({
		origin: '*', credentials: true
	})
)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



function makeTables() {
	const query = `CREATE TABLE IF NOT EXISTS urls (
		code TEXT NOT NULL PRIMARY KEY,
		url TEXT NOT NULL
	)`;

	db.run(query, (err) => {
		if (err) { console.error(err);}
	});
	console.log('Tables Loaded!');
}
makeTables();


// TODO: add timestamp to decrease collision chances, although it's already very low
function generateCode(inp) {
    const hash = crypto.createHash('sha256').update(inp).digest('hex');

	let code = '';

	for (let i=0; i<CODE_LENGTH; i++) {
		code += hash[Math.floor(Math.random() * hash.length)];
	}
	return code;
}


function isURLinDB(url, callback) {
    const query = `SELECT * FROM urls WHERE url = ?`;
    db.get(query, url, (err, row) => {
        if (err) {
            console.error(err);
            callback(false);
        } else {
            callback(!!row); // Returns `true` if found, otherwise `false`
        }
    });
}


function addURLtoDB(url, code) {
	const query = `INSERT INTO urls (url, code) VALUES (?, ?)`;
	db.get(query, url, code, (err) => {
		if (err) {
			console.error(err);
		}
		console.log(`Add  "${url}" -> ${code}`);
	});
}


function getCodeFromDB(url, callback) {
    const query = `SELECT code FROM urls WHERE url = ?`;
    db.get(query, [url], (err, row) => {
        if (err) {
            console.error(err);
            callback(null);
        } else {
			console.log(`FETCH code  ${row.code} -> "${url}"`);
            callback(row ? row.code : null);
        }
    });
}


function getURLFromDB(code, callback) {
    const query = `SELECT url FROM urls WHERE code = ?`;
    db.get(query, [code], (err, row) => {
        if (err) {
            console.error(err);
            callback(null);
        } else {
            callback(row ? row.url : null);
        }
    });
}


// Routes
app.post('/gen', (req, res) => {
	const { url } = req.body;

	if (!url) {
		return res.status(400);
	}

	isURLinDB(url, (exists) => {
		if (!exists) {
			let code = generateCode(url);
			addURLtoDB(url, code);

			const tiny_url = `${HOST_URL}/${code}`;

			res.json({ 'tiny_url': tiny_url });
			console.log(`GENERATE "${url}" -> ${code}`);
		}

		else {
			getCodeFromDB(url, code => {
				if (code) {
					const tiny_url = `${HOST_URL}/${code}`;
					res.json({ 'tiny_url': tiny_url });
					console.log(`LOOKUP "${url}" -> ${code}`);
				}
				else {
					res.status(500).json({ error: "Could not retrieve code" });
				}
			});
		}

	});

});


app.get('/:code', (req, res) => {
	const { code } = req.params;

	let failed = false;

	if (code === 'favicon.ico') {
		return res.status(400);
	}

	if ( !code || code.length !== CODE_LENGTH) {
		failed = true;
	}

	getURLFromDB(code, (url) => {
        if (!url) {
            console.error(`ERROR: code not found! REDIRECT ${code} -> ?`);
            return res.redirect(FRONTEND_HOST_URL);
        }

        if (!url.startsWith('http')) {
            url = "https://" + url;
        }

        console.log(`REDIRECT ${code} -> "${url}"`);
        res.redirect(url);
    });
});


app.get('/', (req, res) => {
	res.send('Tiny URL Backend');
});


// Server
app.listen(BACKEND_PORT, () => {
	console.log(`Server is running on port ${BACKEND_PORT}`);
});
