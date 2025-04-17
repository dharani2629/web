const express = require("express");
const path = require("path");
const admin = require("firebase-admin");

const app = express();
// Middleware to parse JSON data

// Initialize Firebase
const serviceAccount = require("./key.json"); // Replace with your actual file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Firestore database instance

// Serve login.html when /login route is hit
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Serve register.html when /register route is hit
app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "register.html"));
});

// Home route
app.get("/", function (req, res) {
  res.send("<h1>Hello World</h1>");
});

// User Registration (GET request to store user data in Firestore)
app.get("/registersubmit", function (req, res) {
  var fullname = req.query.fullname;
  var email = req.query.email;
  var password = req.query.password;
  var confirmpassword = req.query.confirmpassword;
  db.collection("username")
    .add({
      fullname: fullname,
      email: email,
      password: password,
      confirmpassword: confirmpassword,
    })
    .then(() => {
      res.send("Registration successful, please Login");
    });
});

// User Login (Check credentials in Firestore using GET)
app.get("/loginsubmit", function (req, res) {
  var email = req.query.email;
  var password = req.query.password;
  db.collection("username")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        res.send("Login Successful");
      } else {
        res.send("Invalid Email or Password");
      }
    });
});
// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
