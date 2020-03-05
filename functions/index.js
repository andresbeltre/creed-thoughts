const functions = require("firebase-functions")
const admin = require("firebase-admin")
const firebase = require("firebase")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const firebaseConfig = {
  apiKey: "AIzaSyAsPBHbD5fVlV7d4ftm3M0OC4H675XmUoY",
  authDomain: "creed-thoughts-e5d5d.firebaseapp.com",
  databaseURL: "https://creed-thoughts-e5d5d.firebaseio.com",
  projectId: "creed-thoughts-e5d5d",
  storageBucket: "creed-thoughts-e5d5d.appspot.com",
  messagingSenderId: "783709070697",
  appId: "1:783709070697:web:ddf6025e0cdfd718f289f8",
  measurementId: "G-Z50MYX2L4D"
}

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extendend: true
  })
)

require("./routes/thoughtRoutes")(app)

admin.initializeApp()
firebase.initializeApp(firebaseConfig)
exports.api = functions.https.onRequest(app)
