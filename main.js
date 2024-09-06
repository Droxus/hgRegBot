require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const CONSTANT = require("./constants");

const app = express();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userInfo = {
    date: new Date(msg.date * 1000),
    contact: msg.contact,
    location: msg.location,
  };
  const userData = Object.assign({}, msg.from, userInfo);
  console.log(JSON.stringify(userData, null, 2));
  bot.sendMessage(chatId, CONSTANT.MSG.START, CONSTANT.APP_BTN);
});

bot.onText(/\/help/, (msg) =>
  bot.sendMessage(msg.chat.id, CONSTANT.MSG.HELP, CONSTANT.APP_BTN)
);

const commands = ["/start", "/help"];
bot.on("message", (msg) => {
  if (!commands.find((e) => e == msg.text.toLowerCase()))
    bot.sendMessage(msg.chat.id, CONSTANT.MSG.HELP, CONSTANT.APP_BTN);
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
