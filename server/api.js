const express = require("express");
const {
	JsonDatabase
} = require("wio.db");
const {
	Client,
	GatewayIntentBits,
	Partials
} = require("discord.js");
var client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	],
	partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.ThreadMember, Partials.User],
});

const db = new JsonDatabase({
	databasePath: "./databases/myJsonDatabase.json"
});
const app = express();

var tokenError = false;

(async () => {
	try {
		await client.login(`${db.get("token")}`);
	} catch {
		tokenError = true;
	}
})();

app.use(express.json());

app.get("/token", (req, res) => {
	let token = db.get("token") || "";

	res.status(200).send({
		token,
		tokenError,
		tokenLogin: (!!client.user)
	});
});

app.post("/token", async (req, res) => {
	db.set("token", req.body.token);
	tokenError = false;
	client.destroy();
	client = new Client({
		intents: [
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildBans,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildPresences
		],
		partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.ThreadMember, Partials.User],
	});
	try {
		await client.login(`${req.body.token}`);
	} catch {
		tokenError = true;
	}
	res.sendStatus(200);
});

app.get("/guilds", (req, res) => {
	let guilds = client.guilds.cache.map(r => r).map(r => ({
		id: r.id,
		name: r.name
	}));

	res.status(200).send({
		guilds
	});
});

app.get("/guild", (req, res) => {
	let guild = db.get("guild");
	guild = client.guilds.cache.get(guild);
	guild = {
		name: guild.name,
		id: guild.id
	};

	res.status(200).send({
		guild
	});
});

app.post("/guild", (req, res) => {
	db.set("guild", req.body.guild);

	res.sendStatus(200);
});

app.get("/channels", (req, res) => {
	let channels = client.guilds.cache.get(db.get("guild")).channels.cache.filter(c => c.type == 0).map(r => r).map(r => ({
		name: r.name,
		id: r.id
	}));

	res.status(200).send({
		channels
	});
});

app.post("/message", async (req, res) => {
	try {
		await client.channels.cache.get(req.body.channel).send({
			content: `${req.body.text}`
		});
		await res.sendStatus(200);
	} catch {
		await res.sendStatus(300);
	};
});

app.get("/kufurEngelClosedChannels", async (req, res) => {
	let channels = await db.get("kufurEngelClosedChannels") || [];

	res.status(200).send({
		channels
	});
});

app.post("/kufurEngelClosedChannels", async (req, res) => {
	await db.push("kufurEngelClosedChannels", {
		id: req.body.channel,
		name: client.channels.cache.get(req.body.channel).name
	});

	res.status(200).send();
});

app.delete("/kufurEngelClosedChannels", async (req, res) => {
	await db.pull("kufurEngelClosedChannels", (element, index, array) => element.id == req.body.channel, true)
	res.status(200).send();
});


app.get("/kufurEngel", async (req, res) => {
	let open = await db.get("kufurEngel") || false;

	res.status(200).send({
		open
	});
});

app.post("/kufurEngel", async (req, res) => {
	let open = await db.get("kufurEngel");

	if (!open) await db.set("kufurEngel", true);
	else await db.set("kufurEngel", false);

	res.status(200).send();
});


//BOT
client.on("messageCreate", async (message) => {
	if (message.guild.id != db.get("guild")) return false;

	let kufurEngelOpen = await db.get("kufurEngel");
	let kufurEngelClosedChannels = await db.get("kufurEngelClosedChannels") || [];
	let kufurliste = ["aq", "amk", "sik", "sg", "oç"];

	if (kufurEngelOpen && !kufurEngelClosedChannels.map(a => a.id).includes(message.channel.id) && kufurliste.some(k => message.content.toLowerCase().split(" ").includes(k))) {
		try {
			await message.delete();
		} catch {
			console.log("Mesajı silerken hata aldım.");
		}
	};
});

module.exports = app;