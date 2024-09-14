const TelegramBot = require("node-telegram-bot-api");
const CONSTANT = require("./constants");

class ClientMiniAppBot {
  constructor() {
    this._token = process.env.TELEGRAM_BOT_TOKEN;
    this._bot = new TelegramBot(this.token, { polling: true });

    this.onCommands();
  }

  onCommands() {
    this.bot.onText(/\/start/, (msg) => this.onStart(msg));
    this.bot.onText(/\/help/, (msg) => this.onHelp(msg));
    this.bot.on("message", (msg) => this.onMessage(msg));
  }

  onStart = (msg) => {
    const chatId = msg.chat.id;
    const userInfo = {
      date: new Date(msg.date * 1000),
      contact: msg.contact,
      location: msg.location,
    };
    const userData = Object.assign({}, msg.from, userInfo);
    console.log(JSON.stringify(userData, null, 2));
    this.bot.sendMessage(chatId, CONSTANT.MSG.START(), CONSTANT.APP_BTN);
  };

  onHelp = (msg) => {
    this.bot.sendMessage(msg.chat.id, CONSTANT.MSG.HELP, CONSTANT.APP_BTN);
  };

  onMessage = (msg) => {
    const commands = ["/start", "/help"];
    if (!commands.find((e) => e == msg.text.toLowerCase())) {
      this.bot.sendMessage(msg.chat.id, CONSTANT.MSG.HELP, CONSTANT.APP_BTN);
    }
  };

  get bot() {
    return this._bot;
  }

  get token() {
    return this._token;
  }
}

module.exports = ClientMiniAppBot;
