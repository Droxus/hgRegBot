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

(Нажмите на кнопку снизу, чтобы сделать запись или связаться с нами)
`,
  HELP_MSG: `Нажмите на кнопку снизу, чтобы сделать запись или связаться с нами`,
};

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const languageCode = msg.from.language_code; // language code
  console.log(languageCode);
  bot.sendMessage(chatId, CONSTANT.START_MSG, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Сделать запись",
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
            text: "Сделать запись",
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
    bot.sendMessage(chatId, CONSTANT.HELP_MSG, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Сделать запись",
              web_app: { url: LINK }, // Replace with your web app URL
            },
          ],
        ],
      },
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
