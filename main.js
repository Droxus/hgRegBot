require("dotenv").config();

const LINK = "https://www.wikipedia.org/";

const CONSTANT = {
  START_MSG: `
[EN] Bot allowing to make an appointment for submitting documents
for temporary residence in Mazowieckie Voivodeship (Warsaw)
Registration is currently scheduled for mid-October 
(date is updated every week - for one week)
More than 800 appointments per week
Payment only post factum (after receiving the registration date)

The cost of an appointment with completed forms is 50 PLN
The cost of an appointment together with filling in forms is 100 PLN
The cost of full support of your case from 1500 PLN

[PL] Bot umożliwiający umówienie się na złożenie dokumentów na
 pobyt czasowy w województwie mazowieckim (Warszawa)
Rejestracja jest obecnie zaplanowana na połowę października 
(data aktualizowana co tydzień - na tydzień)
Ponad 800 wizyt tygodniowo
Płatność tylko post factum (po otrzymaniu daty rejestracji)

Koszt wizyty z wypełnionymi formularzami to 50 zł
Koszt wizyty wraz z wypełnieniem formularzy to 100 zł
Koszt pełnego wsparcia Twojej sprawy od 1500 zł

[RU] Бот позволяющий осуществить запись на подачу документов на 
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
