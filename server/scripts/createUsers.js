const mg = require("mongoose");
const db = require("../config/dbConnection");
const sampleUsers = require("../json-data/sample-users.json");
const User = require("../models/User");
const crypto = require("crypto"); // Import crypto module for hashing

db.connect();

// Function to hash passwords using SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Hash passwords in the sampleUsers array
const hashedUsers = sampleUsers.map((user) => {
  return {
    ...user,
    password: hashPassword(user.password), // Hash the password
  };
});

(async () => {
  try {
    User.insertMany(hashedUsers)
      .then(function (docs) {
        console.log("All user data are saved to the database", docs);
        mg.connection.close();
      })
      .catch(function (err) {
        console.error("Error Occurred: ", err.message);
      });
  } catch (err) {
    console.error("Error saving user data: ", err.message);
    mg.connection.close();
  }
})();
