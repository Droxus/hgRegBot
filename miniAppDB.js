const admin = require("firebase-admin");

class MiniAppDB {
  constructor(app) {
    this.initApp();
    this._db = admin.firestore();
    this.handleSubmitRequest(app);
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

  handleSubmitRequest(app) {
    app.post("/submit", async (req, res) => {
      try {
        const docRef = this.db.collection("Data").doc();
        await docRef.set(
          Object.assign({}, req.body, {
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          })
        );

        res.status(200).json({ message: "Data saved successfully!" });
      } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
  }

  get db() {
    return this._db;
  }
}
module.exports = MiniAppDB;
