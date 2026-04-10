const axios = require("axios");

let memory = {};

module.exports = {
	config: {
		name: "leo",
		version: "4.0",
		author: "Siam",
		countDown: 2,
		role: 0,
		shortDescription: "Leo AI",
		longDescription: "Call 'leo' to chat",
		category: "ai"
	},

	// 🔥 command (!leo hi)
	onStart: async function ({ message, event, args }) {
		const text = args.join(" ");
		if (!text) return message.reply("🤖 কি বলবা?");

		return handleAI(message, event, text);
	},

	// 🔥 auto reply system
	onChat: async function ({ event, message }) {
		const text = event.body;
		if (!text) return;

		const lower = text.toLowerCase();

		// 👉 "leo" লিখলে trigger
		if (lower.startsWith("leo")) {
			const msg = text.slice(3).trim() || "কি বলবা?";
			return handleAI(message, event, msg);
		}

		// 👉 bot message এ reply দিলে
		if (event.messageReply && event.messageReply.senderID == event.senderID) return;

		if (event.messageReply && event.messageReply.senderID == global.GoatBot?.api?.getCurrentUserID?.()) {
			return handleAI(message, event, text);
		}
	}
};

// 🔥 AI function
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

		return message.reply(`🤖 Leo: ${res.data.message}`);
	} catch (e) {
		return message.reply("❌ Leo এখন ব্যস্ত...");
	}
        }
