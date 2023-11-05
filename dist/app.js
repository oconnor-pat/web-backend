"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const app = (0, express_1.default)();
// Cors
app.use((0, cors_1.default)());
//configure env;
dotenv_1.default.config();
// Parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// PORT
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.send("<h1>Welcome To JWT Authentication </h1>");
});
// Listen for the server on PORT
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🗄️ Server Fire on http://localhost:${PORT}`);
    // Connect to Database
    try {
        const databaseURL = process.env.DATABASE_URL || "mongodb://localhost:27017/Web";
        yield mongoose_1.default.connect(databaseURL);
        console.log("🛢️ Connected To Database");
    }
    catch (error) {
        console.log("⚠️ Error connecting to database");
    }
}));
// User API to register account
app.post("/auth/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // ** Get The User Data From Body ;
        const user = req.body;
        // ** destructure the information from user;
        const { name, email, username, password } = user;
        // ** Check the email all ready exist in database or not ;
        // ** Import the user model from "./models/user";
        const EmailAlreadyExists = yield user_1.User.findOne({
            email: email,
        });
        const UsernameAlreadyExists = yield user_1.User.findOne({
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
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // ** if not create a new user ;
        // !! Don't save the password as plain text in db . I am saving just for demonstration.
        // ** You can use bcrypt to hash the plain password.
        // now create the user;
        const newUser = yield user_1.User.create({
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
    }
    catch (error) {
        // console the error to debug
        console.log(error);
        // Send the error message to the client
        res.status(400).json({
            status: 400,
            message: "Failed to create new user. Please try again",
        });
    }
}));
// User API to login
app.post("/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log("Received data from frontend - Username:", username, "Password:", password);
        // Check if the user exists in the database
        const user = yield user_1.User.findOne({ username });
        if (!user) {
            console.log("User not found in the database for username:", username);
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
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
    }
    catch (error) {
        console.log("Error logging in:", error);
        res.status(500).json({
            status: 500,
            message: "Failed to process login request",
        });
    }
}));
