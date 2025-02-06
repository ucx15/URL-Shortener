const express = require('express');
const cors = require('cors');


const HOST = "localhost";
const PORT = 5500;
const URL = `http://${HOST}:${PORT}`;

// App
const app = express();
app.use(
	cors({
		origin: '*', credentials: true
	})
)

app.use(express.json());
app.use(express.static('public'));



app.listen(5500, () => {
	console.log(`Frontend server is running on ${URL}`);
});