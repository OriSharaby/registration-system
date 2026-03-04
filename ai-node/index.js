const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/random-toast", (req, res) => {
  const messages = [
    "נרשמת בהצלחה! איזה כיף לראות אותך פה 😄",
    "ברוך הבא! בוא נתחיל 🎉",
    "ההרשמה הושלמה! עכשיו אפשר להתקדם 🚀",
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];
  res.json({ message });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`AI service listening on http://localhost:${PORT}`);
});