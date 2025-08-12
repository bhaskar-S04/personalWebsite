require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);




const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});




app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMessage = new Message({name, email, message});
    await newMessage.save();
    res.status(200).json({message: "Message received and saved!"});
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({error: "Database error"});
  }
});


app.get("/messages", async (req, res)=> {
  try {
    const message = await Message.find().sort({date: -1});
    res.json(messages);
  }catch(err){
    console.error("Error fetching messages:", err);
    res.status(500).json({error: "Failed to fetch messages"});
  }
});



app.get("/", (req, res) => {
  res.send("Server is working!");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
