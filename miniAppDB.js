const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

class MiniAppDB {
  constructor(app, newClientDetecter) {
    this.initApp();
    this._db = admin.firestore();
    this.handleSubmitRequest(app, newClientDetecter);
  }

  initApp() {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(
          Buffer.from(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
            "base64"
          ).toString("utf-8")
        )
      ),
    });
  }

  handleSubmitRequest(app, newClientDetecter) {
    app.post("/submit", async (req, res) => {
      try {
        const docRef = this.db.collection("Data").doc();
        const data = Object.assign({}, req.body, {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        await docRef.set(data);

        res.status(200).json({ message: "Data saved successfully!" });
        this.sendEmail(data);
        if (req.body.service !== "Basic" && req.body.service !== "Advanced") {
          const services = {
            Basic: "Временный побыт, Только запись",
            Advanced: "Временный побыт, Запись и Заполнение внесков",
            Ultra: "Временный побыт, Полное сопровождение вашего дела",
            Others: "Другие услуги",
          };

          newClientDetecter.sendMessage(
            `Внимание!\nНовый клиент\n
Услуга: ${services[data.service] ?? "Неизвестно"}\n
Имя: ${data.name + " " + data.surname ?? "Неизвестно"}\n
Телефон: ${data.phone ?? "Неизвестно"}\n
Почта: ${data.email ?? "Неизвестно"}\n
\nВсе данные:\n
${JSON.stringify(data, null, 2)}
`
          );
        }
      } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
  }

  sendEmail(data) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const services = {
      Basic: "Временный побыт, Только запись",
      Advanced: "Временный побыт, Запись и Заполнение внесков",
      Ultra: "Временный побыт, Полное сопровождение вашего дела",
      Others: "Другие услуги",
    };

    const msg = `Внимание!\nНовый клиент\n
Услуга: ${services[data.service] ?? "Неизвестно"}\n
Имя: ${data.name + " " + data.surname ?? "Неизвестно"}\n
Телефон: ${data.phone ?? "Неизвестно"}\n
Почта: ${data.email ?? "Неизвестно"}\n
\nВсе данные:\n
${JSON.stringify(data, null, 2)}
`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SEND_TO_EMAIL,
      subject: "New Client: Karta Pobytu - Rejestracja",
      text: msg,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  get db() {
    return this._db;
  }
}
module.exports = MiniAppDB;
