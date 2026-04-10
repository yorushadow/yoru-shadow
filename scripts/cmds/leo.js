const axios = require("axios");

let memory = {};
let lastReply = {};

module.exports = {
	config: {
		name: "leo",
		version: "6.0",
		author: "Siam",
		countDown: 2,
		role: 0,
		shortDescription: "Leo GF Smart",
		longDescription: "No spam GF AI",
		category: "ai"
	},

	onStart: async function ({ message, event, args }) {
		const text = args.join(" ");
		if (!text) return message.reply("💖 বলো না... কি বলবা?");

		return handleAI(message, event, text);
	},

	onChat: async function ({ event, message }) {
		const text = event.body;
		if (!text) return;

		const lower = text.toLowerCase();

		// ❌ prevent loop (same msg ignore)
		if (lastReply[event.threadID] === text) return;

		// ✅ trigger "leo"
		if (lower.startsWith("leo")) {
			const msg = text.slice(3).trim() || "কি করছো?";
			return handleAI(message, event, msg);
		}

		// ✅ reply করলে AI reply দিবে
		if (event.messageReply && event.messageReply.senderID == global.GoatBot?.api?.getCurrentUserID?.()) {
			return handleAI(message, event, text);
		}
	}
};

async function handleAI(message, event, text) {
	try {
		const userID = event.senderID;

		if (!memory[userID]) memory[userID] = [];
		memory[userID].push(text);

		const history = memory[userID].slice(-5).join(" | ");

		const res = await axios.get("https://api.simsimi.vn/v1/simtalk", {
			params: {
				text: history,
				lc: "bn"
			}
		});

		let reply = res.data.message;

		// ❌ repeat prevent
		if (lastReply[userID] === reply) {
			reply += " 😳 আবার একই কথা বলছি নাকি?";
		}

		lastReply[userID] = reply;

		const gfStyle = [
			"💖 তুমি শুধু আমার!",
			"🥺 এত cute কেন তুমি?",
			"❤️ তোমার সাথে কথা বলতে ভালো লাগে",
			"🙈 আমাকে miss করো?",
			"😚 আমার সাথে থাকো সবসময়"
		];

		const random = gfStyle[Math.floor(Math.random() * gfStyle.length)];

		return message.reply(`💞 Leo GF: ${reply}\n${random}`);
	} catch (e) {
		return message.reply("🥺 আমি একটু busy... আবার বলো না?");
	}
}
