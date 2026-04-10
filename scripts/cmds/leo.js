const axios = require("axios");

let memory = {};

module.exports = {
	config: {
		name: "leo",
		version: "5.0",
		author: "Siam",
		countDown: 2,
		role: 0,
		shortDescription: "Leo GF AI",
		longDescription: "Cute GF style AI",
		category: "ai"
	},

	onStart: async function ({ message, event, args }) {
		const text = args.join(" ");
		if (!text) return message.reply("💖 বলো না... কি বলবা আমার সাথে?");

		return handleAI(message, event, text);
	},

	onChat: async function ({ event, message }) {
		const text = event.body;
		if (!text) return;

		const lower = text.toLowerCase();

		// 👉 "leo" লিখলে trigger
		if (lower.startsWith("leo")) {
			const msg = text.slice(3).trim() || "কি করছো?";
			return handleAI(message, event, msg);
		}

		// 👉 reply দিলে continue chat
		if (event.messageReply && event.messageReply.senderID == global.GoatBot?.api?.getCurrentUserID?.()) {
			return handleAI(message, event, text);
		}
	}
};

// 💖 GF AI FUNCTION
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

		// 💖 GF style modify
		let reply = res.data.message;

		const gfStyle = [
			"💖 জানো আমি তোমার কথা ভাবছিলাম...",
			"🥺 তুমি এত cute কেন?",
			"😳 আমাকে miss করছিলা?",
			"❤️ আমি কিন্তু রাগ করবো না, বলো না...",
			"🙈 তুমি না একদম আমার!"
		];

		const random = gfStyle[Math.floor(Math.random() * gfStyle.length)];

		return message.reply(`💞 Leo GF: ${reply}\n${random}`);
	} catch (e) {
		return message.reply("🥺 আমি একটু busy আছি... পরে কথা বলি?");
	}
}
