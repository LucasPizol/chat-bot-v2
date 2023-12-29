import { Client, LocalAuth } from "whatsapp-web.js";
import { supabase } from "./supabase";
import { Register } from "./src/messages/Unregistered/Register";
import qrcode from "qrcode-terminal";
import { User } from "./src/classes/User";
import { SendMessage } from "./src/helper/SendMessage";

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
    if (message.from !== "553537132922@c.us" && message.from !== "553591029025@c.us" && message.from !== "553588121669@c.us") return;

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

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("ready");
  start();
});
client.initialize();
