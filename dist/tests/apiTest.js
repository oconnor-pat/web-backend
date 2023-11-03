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
const node_fetch_1 = __importDefault(require("node-fetch"));
const registrationData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword',
};
const apiUrl = 'http://localhost:8000'; // Update the URL to match your API endpoint
function registerUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${apiUrl}/auth/register`, {
                method: 'POST',
                body: JSON.stringify(registrationData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const responseData = yield response.json();
            if (response.ok) {
                console.log('User registration successful:', responseData);
            }
            else {
                console.error('User registration failed:', responseData);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
registerUser();
