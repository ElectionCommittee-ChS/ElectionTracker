const getData = require("./getData.js");
const express = require("express");
const fs = require("node:fs");
const cron = require("node-cron");
const app = express();
const port = process.env.PORT || 3000;
const year = new Date().getFullYear();

let data;
getData().then((result) => {
	data = result;
});

// read history from ./history/year.json
let history = {};
fs.readFile(`./history/${year}.json`, "utf8", (err, jsonString) => {
	if (err) {
		console.error("Error reading file from disk:", err);
		console.log("Creating new history file");

		// create the file if it doesn't exist
		fs.writeFile(`./history/${year}.json`, "{}", (err) => {
			if (err) {
				console.error("Error writing file to disk:", err);
			}
		});

		return;
	}
	try {
		history = JSON.parse(jsonString);
	} catch (err) {
		console.error("Error parsing JSON string:", err);
	}
});

// update data every 5 minutes
setInterval(
	() => {
		getData().then((result) => {
			data = result;
		});
	},
	5 * 60 * 1000,
);

// save the data to a file every hour
cron.schedule("0 0 * * * *", () => {
	console.log("Saving data to file");
	history[new Date().toISOString()] = data;

	fs.writeFile(`./history/${year}.json`, JSON.stringify(history), (err) => {
		if (err) {
			console.error("Error writing file to disk:", err);
		}
	});
});

app.use(express.static("../frontend/dist/"));

app.get("/data.json", (req, res) => {
	res.json(data);
});

app.get("/history.json", (req, res) => {
	res.json(history);
});

app.get("/total", (req, res) => {
	let total = 0;
	for (const key in data) {
		total += data[key];
	}

	res.send(total.toString());
});

app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));
