module.exports = {
	config: {
		name: "un",
		version: "1.1",
		author: "Siam",
		countDown: 5,
		role: 1,
		shortDescription: "unsend bot message",
		longDescription: "reply to bot message to delete it",
		category: "utility"
	},

	onStart: async function ({ message, event, api, threadsData }) {

		const threadData = await threadsData.get(event.threadID);
		const adminIDs = threadData.adminIDs || [];

		if (!adminIDs.some(item => item.id == event.senderID)) {
			return message.reply("❌ Only admin can use this command");
		}

		if (!event.messageReply)
			return message.reply("❌ Reply to bot message");

		const msgReply = event.messageReply;

		if (msgReply.senderID != api.getCurrentUserID())
			return message.reply("❌ Only bot messages can be removed");

		try {
			await api.unsendMessage(msgReply.messageID);
		} catch (e) {
			return message.reply("❌ Failed to remove message");
		}
	}
};
