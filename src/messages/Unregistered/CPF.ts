import { Client, Message, Buttons } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
}

export class CPF {
  static async sendMessage({ client, message }: Props) {
    client.sendMessage(message.from, `Ótimo, ${message.body} agora me diga seu CPF (usaremos apenas afim de não duplicação)`);
  }
}
