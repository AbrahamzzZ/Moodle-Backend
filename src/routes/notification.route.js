import express from "express";
import admin from "../config/firebase.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const { token } = req.body;

    const message = {
      token,
      notification: {
        title: "Prueba Firebase",
        body: "Notificación enviada desde el backend",
      },
    };

    const response = await admin.messaging().send(message);

    res.json({
      ok: true,
      response,
    });
  } catch (error) {
    console.error("Error Firebase:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
