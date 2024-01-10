import { Client, LocalAuth } from "whatsapp-web.js";
import { supabase } from "../supabase";
import { User } from "./classes/User";
import { SendMessage } from "./helper/SendMessage";
import express, { Response } from "express";
import QRCode from "qrcode";

const app = express();
app.set("view engine", "ejs");
app.set("views", "./src/views");

let isSessionActive = false;
let qr_code = "";

app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth(),
});

const registeringUsers: User[] = [];
const users: User[] = [];

supabase
  .from("user")
  .select()
  .then(({ data }) => {
    data?.map((user) => {
      users.push(new User(user.id, user.number, user.cpf, user.name, user.cnpj, "Autenticado"));
    });
  });

const start = async () => {
  client.on("message", async (message) => {
    const user = users.findIndex((user) => user.number === message.from);

    if (user === -1) {
      const registeringUser = registeringUsers.find((user: User) => user.number === message.from);
      if (!registeringUser) {
        const newUser = new User(null, message.from, "", "", "", "Inicial");
        registeringUsers.push(newUser);
        await SendMessage.sendUnauthMessage({ client, message, user: newUser });
        return;
      }

      await SendMessage.sendUnauthMessage({ client, message, user: registeringUser, users });

      return;
    }

    await SendMessage.sendAuthMessage({ client, message, user: users[user] });
  });
};

app.get("/", async (req, res) => {
  if (!isSessionActive) {
    isSessionActive = true;
    console.log("a")
    await client.initialize();
  }

  return res.render("index", {
    qr_code,
  });
});

app.listen(3000, () => {
  console.log("Server started");
});

client.on("authenticated", () => {
  isSessionActive = true;
  start();
});

client.on("qr", async (qr) => {
  const qr_code_img = await QRCode.toDataURL(qr);
  qr_code = qr_code_img;
});
