require("dotenv").config();

const LINK = "https://hadgroup.web.app/";

const CONSTANT = {
  START_MSG: `
Бот позволяющий осуществить запись на подачу документов на 
временный побыт в Мазовецком Воевудстве (Варшава)
Регистрация, на данный момент, проходит на середину октября 
(дата обновляется каждую неделю - на одну неделю)
Более 800 записей в неделю
Оплата только постфактум (после получения даты регистрации)

Стоимость записи при наличии заполненых внесков 50 злотых 
Стоимость записи вместе с заполнением внесков 100 злотых
Стоимость полного сопровождения вашего дела от 1500 злотых
`,
  HELP_MSG: `Click button to run the app: `,
};
const TelegramBot = require("node-telegram-bot-api");

// Replace 'YOUR_TOKEN' with your actual bot token
const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// Command to start the bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const languageCode = msg.from.language_code;

  console.log(languageCode);
  // bot.sendMessage(chatId, CONSTANT.START_MSG);
  bot.sendMessage(chatId, CONSTANT.START_MSG, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Launch App",
            web_app: { url: LINK }, // Replace with your web app URL
          },
        ],
      ],
    },
  });
});

// Command to help the user
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, CONSTANT.HELP_MSG, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Launch App",
            web_app: { url: LINK }, // Replace with your web app URL
          },
        ],
      ],
    },
  });
});

// Echo any text messages
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  if (
    msg.text.toLowerCase() !== "/start" &&
    msg.text.toLowerCase() !== "/help"
  ) {
    bot.sendMessage(chatId, msg.text);
  }
});
