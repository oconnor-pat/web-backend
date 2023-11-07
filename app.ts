import express from "express";
import { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/user";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const app: Application = express();

// Cors
app.use(cors());

//configure env;
dotenv.config();

// Parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// PORT
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.send("<h1>Welcome To JWT Authentication </h1>");
});

// Listen for the server on PORT
app.listen(PORT, async () => {
  console.log(`🗄️ Server Fire on http://localhost:${PORT}`);

  // Connect to Database
  try {
    const databaseURL =
      process.env.DATABASE_URL || "mongodb://localhost:27017/Web";
    await mongoose.connect(databaseURL);
    console.log("🛢️ Connected To Database");
  } catch (error) {
    console.log("⚠️ Error connecting to database");
  }
});

// User API to register account
app.post("/auth/register", async (req, res) => {
  try {
    // ** Get The User Data From Body ;
    const user = req.body;

    // ** destructure the information from user;
    const { name, email, username, password } = user;

    // ** Check the email all ready exist in database or not ;
    // ** Import the user model from "./models/user";
    const EmailAlreadyExists = await User.findOne({
      email: email,
    });

    const UsernameAlreadyExists = await User.findOne({
      username: username,
    });

    // Condition if the email exists to send a response to the client;
    if (EmailAlreadyExists) {
      res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
      return;
    }

    // Condition if the user exists to send a response to the client;
    if (UsernameAlreadyExists) {
      res.status(400).json({
        status: 400,
        message: "Username already in use",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ** if not create a new user ;
    // !! Don't save the password as plain text in db . I am saving just for demonstration.
    // ** You can use bcrypt to hash the plain password.
    // now create the user;
    const newUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // Send the newUser as response;
    res.status(200).json({
      status: 201,
      success: true,
      message: " User created Successfully",
      user: newUser,
    });
  } catch (error) {
    // console the error to debug
    console.log(error);
    // Send the error message to the client
    res.status(400).json({
      status: 400,
      message: "Failed to create new user. Please try again",
    });
  }
});

// User API to login
app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(
      "Received data from frontend - Username:",
      username,
      "Password:",
      password
    );

    // Check if the user exists in the database
    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found in the database for username:", username);

      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    // Set up proper password hashing library like bcrypt
    // to compare the hashed password from the database with the provided password.
    if (!passwordMatch) {
      console.log("Password mismatch for username:", username);

      return res.status(401).json({
        status: 401,
        message: "Incorrect password",
      });
    }

    // Login successful
    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Error logging in:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to process login request",
    });
  }
});
