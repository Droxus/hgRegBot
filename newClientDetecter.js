const TelegramBot = require("node-telegram-bot-api");
const CONSTANT = require("./constants");

class NewClientDetecter {
  constructor() {
    this._token = process.env.TELEGRAM_BOT_DETECTOR_TOKEN;
    this._bot = new TelegramBot(this.token, { polling: true });
  }

  sendMessage = (msg) => {
    this.bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg);
  };

  get bot() {
    return this._bot;
  }

  get token() {
    return this._token;
  }
}

module.exports = NewClientDetecter;
