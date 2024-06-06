require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let uniqueRandomNumbers = [];
let peopleInGroup = [];

let count = 0;

while (uniqueRandomNumbers.length < 8) {
  const randomNumber = Math.floor(Math.random() * 8) + 1;
  if (!uniqueRandomNumbers.includes(randomNumber)) {
    uniqueRandomNumbers.push(randomNumber);
  }
}
console.log(uniqueRandomNumbers);
bot.onText(/Hi|hi|Hey|hey/i, (msg) => {
  const chatId = msg.chat.id;
  const message = `
  Welcome ${msg.chat.username}, 
Click the button to get your number
      `;

  const menuOptions = [
    [
      { text: "", callback_data: "transactENaira" },
      { text: "Get Number", callback_data: "sendNumber" },
    ],
  ];

  const menuMarkup = {
    reply_markup: {
      inline_keyboard: menuOptions,
    },
  };

  bot.sendMessage(chatId, message, menuMarkup);
});


// Handle callback queries
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const userId = query.from.id;

  if (data === "sendNumber") {
    // Check if the user has already received a number
    const userExists = peopleInGroup.some((person) => person.userId === userId);

    if (userExists) {
      bot.sendMessage(chatId, "You have already received a number.");
    } else if (count < uniqueRandomNumbers.length) {
      const replyMessage = `Congrats ${query.message.chat.username}!, you got a random number: "${uniqueRandomNumbers[count]}" `;

      // Add user ID and chosen number to peopleInGroup
      peopleInGroup.push({
        userId: userId,
        username: query.from.username,
        chosenNumber: uniqueRandomNumbers[count],
      });

      count++;

      bot.sendMessage(chatId, replyMessage);
    } else {
      bot.sendMessage(chatId, "Sorry, all numbers have been distributed.");
    }
  }

  console.log(peopleInGroup);
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Polling error:", error.code); // => 'EFATAL'
});
