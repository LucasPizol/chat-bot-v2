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
const whatsapp_web_js_1 = require("whatsapp-web.js");
const supabase_1 = require("../supabase");
const User_1 = require("./classes/User");
const SendMessage_1 = require("./helper/SendMessage");
const express_1 = __importDefault(require("express"));
const qrcode_1 = __importDefault(require("qrcode"));
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "./src/views");
let isSessionActive = false;
let qr_code = "";
app.use(express_1.default.json());
const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth(),
});
const registeringUsers = [];
const users = [];
supabase_1.supabase
    .from("user")
    .select()
    .then(({ data }) => {
    data === null || data === void 0 ? void 0 : data.map((user) => {
        users.push(new User_1.User(user.id, user.number, user.cpf, user.name, user.cnpj, "Autenticado"));
    });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const user = users.findIndex((user) => user.number === message.from);
        if (user === -1) {
            const registeringUser = registeringUsers.find((user) => user.number === message.from);
            if (!registeringUser) {
                const newUser = new User_1.User(null, message.from, "", "", "", "Inicial");
                registeringUsers.push(newUser);
                yield SendMessage_1.SendMessage.sendUnauthMessage({ client, message, user: newUser });
                return;
            }
            yield SendMessage_1.SendMessage.sendUnauthMessage({ client, message, user: registeringUser, users });
            return;
        }
        yield SendMessage_1.SendMessage.sendAuthMessage({ client, message, user: users[user] });
    }));
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isSessionActive) {
        isSessionActive = true;
        console.log("a");
        yield client.initialize();
    }
    return res.render("index", {
        qr_code,
    });
}));
app.listen(3000, () => {
    console.log("Server started");
});
client.on("authenticated", () => {
    isSessionActive = true;
    start();
});
client.on("qr", (qr) => __awaiter(void 0, void 0, void 0, function* () {
    const qr_code_img = yield qrcode_1.default.toDataURL(qr);
    qr_code = qr_code_img;
}));
//# sourceMappingURL=app.js.map