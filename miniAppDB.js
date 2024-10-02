const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

class MiniAppDB {
  constructor(app, newClientDetecter) {
    this.initApp();
    this._db = admin.firestore();
    this.handleSubmitRequest(app, newClientDetecter);
    this.handleCancelOrderRequest(app);
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

  handleCancelOrderRequest(app) {
    app.post("/cancelorder", async (req, res) => {
      try {
        const orderId = req.body.orderId;

        // Ensure that orderId is provided
        if (!orderId) {
          return res.status(400).send("orderId is required.");
        }

        // Get the reference to the collection
        const dataCollection = this.db.collection("Data"); // Use collection method of Admin SDK

        // Create a query for the documents with the matching orderId
        const querySnapshot = await dataCollection
          .where("orderId", "==", orderId)
          .get(); // Use where and get method

        if (querySnapshot.empty) {
          console.log(`No document found with orderId: ${orderId}`);
          return res
            .status(404)
            .send(`No document found with orderId: ${orderId}`);
        }

        // Loop through all matching documents and delete each one (if multiple exist)
        const deletePromises = []; // Array to hold delete promises
        querySnapshot.forEach((documentSnapshot) => {
          const docRef = dataCollection.doc(documentSnapshot.id); // Get document reference
          deletePromises.push(docRef.delete()); // Add delete promise to the array
          console.log(`Document with orderId: ${orderId} is being deleted.`);
        });

        // Wait for all delete operations to complete
        await Promise.all(deletePromises);

        console.log(`Document(s) with orderId: ${orderId} has been deleted.`);
        res
          .status(200)
          .send(`Document(s) with orderId: ${orderId} has been deleted.`);
      } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).send("Internal server error");
      }
    });
  }

  handleSubmitRequest(app, newClientDetecter) {
    app.post("/submit", async (req, res) => {
      try {
        const docRef = this.db.collection("Data").doc();
        const data = Object.assign({}, req.body, {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          orderId: generateOrderId(req.body.email),
        });
        console.log(data.orderId);
        await docRef.set(data);

        res.status(200).json({ message: "Data saved successfully!" });
        this.sendAdminEmail(data);
        console.log(data);
        this.sendUserEmail(data.email, data.orderId, data.service);
        if (data.service !== "Basic" && data.service !== "Advanced") {
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

  sendUserEmail(email, orderId, service) {
    console.log(email);
    console.log(orderId);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const CancelationLink = `https://karta-pobytu-rejestracja.web.app/cancelorder?=${orderId}`;
    const msg1 = `Спасибо! <br>Ваш заказ принят, дата записи будет известна не позднее следующей пятницы. Данные подачи будут отправлены  вам на ваш адрес имейл вместе с фактурой для оплаты. <br>Перейдите по ссылке чтобы отменить запись: ${CancelationLink}`;
    const msg2 = `Спасибо!<br>Ваш заказ принят, дата записи будет известна не позднее следующей пятницы. Данные подачи будут отправлены  вам на ваш адрес имейл вместе с фактурой для оплаты.<br>Наши юристы свяжутся с вами в течении 15 минут. <br>Перейдите по ссылке чтобы отменить запись: ${CancelationLink}`;
    const msg = service !== "Basic" && service !== "Advanced" ? msg2 : msg1;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your registration was successful",
      html: msg,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }

  sendAdminEmail(data) {
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

  generateOrderId(email) {
    // Create a SHA-256 hash of the user's email
    const emailHash = crypto.createHash("sha256").update(email).digest("hex");

    // Get the current timestamp
    const timestamp = Date.now();

    // Combine the email hash and the timestamp to create the order ID
    const orderId = `${emailHash}-${timestamp}`;

    return orderId;
  }

  get db() {
    return this._db;
  }
}
module.exports = MiniAppDB;
