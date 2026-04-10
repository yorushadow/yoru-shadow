module.exports = {
	config: {
		name: "un",
		version: "1.2",
		author: "Siam",
		countDown: 5,
		role: 0,
		shortDescription: "unsend bot message",
		longDescription: "reply to bot message to delete it",
		category: "utility"
	},

	onStart: async function ({ message, event, api }) {

		// 🔥 only YOU (owner)
		const owners = ["61556603392377"]; // তোমার UID

		if (!owners.includes(event.senderID)) {
			return message.reply("❌ Only owner can use this");
		}

		// ❌ reply না করলে
		if (!event.messageReply)
			return message.reply("❌ Reply to bot message");

		const msgReply = event.messageReply;

		// ❌ শুধু bot message delete হবে
		if (msgReply.senderID != api.getCurrentUserID())
			return message.reply("❌ Only bot messages can be removed");

		try {
			await api.unsendMessage(msgReply.messageID);
		} catch (e) {
			return message.reply("❌ Failed to remove message");
		}
	}
};
