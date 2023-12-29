import { Client, Message } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
}

export class CNPJ {
  static async sendMessage({ client, message }: Props) {
    client.sendMessage(message.from, `Certo, agora me diga o CNPJ de sua revenda.`);
  }
}
