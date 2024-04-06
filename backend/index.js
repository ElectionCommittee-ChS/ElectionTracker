const getData = require("./getData.js");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let data;
getData().then((result) => {
	data = result;
});

// update data every 15 minutes
setInterval(
	() => {
		getData().then((result) => {
			data = result;
		});
	},
	15 * 60 * 1000,
);

app.use(express.static("../frontend/dist/"));

app.get("/data.json", (req, res) => {
	res.json(data);
});

app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));
