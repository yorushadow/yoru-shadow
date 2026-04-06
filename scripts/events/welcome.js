const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "welcome",
    version: "1.5",
    author: "Shiyam",
    category: "events"
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    try {
      const { threadID } = event;
      const addedUsers = event.logMessageData.addedParticipants;

      const threadInfo = await api.getThreadInfo(threadID);
      const groupName = threadInfo.threadName;
      const memberCount = threadInfo.participantIDs.length;

      for (const user of addedUsers) {
        const userName = user.fullName;
        const userID = user.userFbId;

        if (userID == api.getCurrentUserID()) return;

        const time = moment().tz("Asia/Dhaka").format("hh:mm A");

        const msg = `✨━━━━━━━━━━━━━━━━━━━━✨
🌸🌸🌸 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗢𝗨𝗥 𝗚𝗥𝗢𝗨𝗣 🌸🌸🌸
✨━━━━━━━━━━━━━━━━━━━━✨

👋 Hello ${userName} !

🏡 Group: ${groupName}
👥 You are member no: ${memberCount}

💫 Stay active & enjoy your time
⏰ Join Time: ${time}

⚠️ Follow group rules
💬 Be friendly with everyone

✨━━━━━━━━━━━━━━━━━━━━✨`;

        api.sendMessage({
          body: msg,
          mentions: [{
            tag: userName,
            id: userID
          }]
        }, threadID);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
