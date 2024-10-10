function getRegPeriod() {
  const currentDate = new Date();
  const msInDay = 86400000; // 1000 * 60 * 60 * 24

  const msAfterMonday = msInDay * (currentDate.getDay() - 1);
  const msInlastMonday = currentDate.getTime() - msAfterMonday;

  const msInWeek = 604800000; // msInDay * 7
  const msInFiveWeeks = 3024000000; // msInWeek * 5

  const msInFirstDayOfPeriod = msInlastMonday + msInFiveWeeks;
  const msInLastDayOfPeriod = msInFirstDayOfPeriod + msInWeek - msInDay;

  const period = {
    start: new Date(msInFirstDayOfPeriod),
    end: new Date(msInLastDayOfPeriod),
  };

  return period;
}

function normailzeDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");

  return `${day}.${month}.${year}`;
}

function getNormalizedPeriod() {
  const period = getRegPeriod();
  return `${normailzeDate(period.start)} - ${normailzeDate(period.end)}`;
}

const CONSTANT = {
  MSG: {
    START: () => {
      const normalizedPeriod = getNormalizedPeriod();

      return `Бот для записи на <b>подачу документов на временный побыт</b> в Мазовецком Воеводстве (📍Варшава)
 -------------------------------------
📝Регистрация на данный момент проходит на <u>5 недель вперед</u>

✅Более 800 записей в неделю

💵<b>Оплата</b> производится <b>только постфактум</b> (<i>после получения даты регистрации</i>)
 -------------------------------------
🖌<b>Запись</b> при наличии заполненых внесков - <b>50 злотых</b> 

🖌<b>Запись</b> вместе с заполнением внесков - <b>100 злотых</b>

🖌<b>Полное сопровождение</b> вашего дела - начиная от <b>1500 злотых</b>

(Нажмите на кнопку снизу, чтобы сделать запись или связаться с нами)
`;
    },
    HELP: `Нажмите на кнопку снизу, чтобы сделать запись или связаться с нами`,
  },
  APP_BTN: {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Сделать запись",
            web_app: { url: "https://karta-pobytu-rejestracja.web.app/" },
          },
        ],
      ],
    },
  },
};
module.exports = CONSTANT;
