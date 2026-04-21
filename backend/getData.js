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
	const rawData = Array.from(dom.window.document.querySelectorAll("td"))
		.map((td) => td.textContent);

	let data = {};
	// the data is in the format "A", "47", "AE", "3", etc. so we loop through the array and check if the next element is a number, if it is we add it to the data object
	// maybe it would be better to also have a valid list of keys
	for (let i = 0; i < rawData.length - 1; i++) {
		if (/^\d+$/.test(rawData[i + 1])) {
			data[rawData[i]] = Number.parseInt(rawData[i + 1]);
			i++;
		}
	}

	// check if data is empty
	if (data.length === 0) {
		console.error("Error: data is empty, using default data");

		data = {
			A: 0,
			AE: 0,
			D: 0,
			DS: 0,
			E: 0,
			Exchange: 0,
			F: 0,
			GS: 0,
			H: 0,
			I: 0,
			IT: 0,
			K: 0,
			KfKb: 0,
			M: 0,
			Sjö: 0,
			TB: 0,
			TD: 0,
			Utomlandsstuderande: 0,
			V: 0,
			Z: 0,
		};
	}

	await fs.writeFile("./data.json", JSON.stringify(data));

	return data;
}
module.exports = getData;
