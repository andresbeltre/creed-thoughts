const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./API/database");
const {
  linkScraper,
  postScraper,
  getThoughts,
  getPost
} = require("./thought-scraper");
const firebaseConfig = {
  apiKey: "AIzaSyAsPBHbD5fVlV7d4ftm3M0OC4H675XmUoY",
  authDomain: "creed-thoughts-e5d5d.firebaseapp.com",
  databaseURL: "https://creed-thoughts-e5d5d.firebaseio.com",
  projectId: "creed-thoughts-e5d5d",
  storageBucket: "creed-thoughts-e5d5d.appspot.com",
  messagingSenderId: "783709070697",
  appId: "1:783709070697:web:ddf6025e0cdfd718f289f8",
  measurementId: "G-Z50MYX2L4D"
};

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extendend: true
  })
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/thoughts/all", async (req, res) => {
  try {
    const thoughts = await db.getAllThoughts();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/thoughts/populate", async (req, res) => {
  const body = await getThoughts();
  const links = linkScraper(body);
  const db = []
  links.forEach(link => {
    let post = await getPost(link)
    let scrapedPost = postScraper(post)
    db.push(scrapedPost)
  })
});

app.post("/thoughts/new", async (req, res) => {
  try {
    const thought = {
      message: req.body.message,
      createdAt: Date.now()
    };
    await db.createThought(thought);
    return res.status(201).json({ success: true, thought: thought.message });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/thoughts/update", async (req, res) => {
  try {
    const thought = {
      message: req.body.message,
      updatedAt: Date.now()
    };
    await db.updateThought(req.body.uid, thought);
    return res.status(200).json({ success: true, thought });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/thoughts/delete", async (req, res) => {
  try {
    const thoughtID = {
      uid: req.body.uid,
      deteledAt: Date.now()
    };
    await db.deleteThought(req.body.uid);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

admin.initializeApp();
firebase.initializeApp(firebaseConfig);
exports.api = functions.https.onRequest(app);
