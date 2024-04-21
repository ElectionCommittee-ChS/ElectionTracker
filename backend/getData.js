const fetch = require("node-fetch-native");
const fs = require("node:fs").promises;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
require("dotenv").config();

const mecenatId = process.env.MECENAT_ID;
const sessionId = process.env.SESSION_ID;

async function getData() {
	const url = "https://karvalet.se/Vote";
	const cookies = {
		"mecenat.id": mecenatId,
		"ASP.NET_SessionId": sessionId,
	};

	const response = await fetch(url, {
		headers: {
			Cookie: Object.entries(cookies)
				.map(([k, v]) => `${k}=${v}`)
				.join("; "),
		},
	});
	const body = await response.text();
	const dom = new JSDOM(body);
	let data = Array.from(dom.window.document.querySelectorAll("td"))
		.map((td) => td.textContent)
		.filter((text) => text !== "Röster");

	// remove "Section","Votes",
	if (data[0] === "Section" && data[1] === "Votes") {
		data.shift();
		data.shift();
	}

	// check if data is empty
	if (data.length === 0) {
		console.error("Error: data is empty, using default data")

		data = [
			"A",
			"0",
			"D",
			"0",
			"DS",
			"0",
			"E",
			"0",
			"F",
			"0",
			"GS",
			"0",
			"H",
			"0",
			"I",
			"0",
			"IT",
			"0",
			"K",
			"0",
			"KfKb",
			"0",
			"M",
			"0",
			"Sjö",
			"0",
			"TD",
			"0",
			"Utomlandsstuderande",
			"0",
			"V",
			"0",
			"Z",
			"0",
		];
	}

	await fs.writeFile("./data.json", JSON.stringify(data));

	return data;
}
module.exports = getData;