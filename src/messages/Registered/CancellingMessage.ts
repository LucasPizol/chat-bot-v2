import { Client, Message } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
}

export class CancellingMessage {
  static async sendMessage({ client, message }: Props) {
    client.sendMessage(message.from, "Cancelando...");
    client.sendMessage(
      message.from,
      `Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`
    );
  }
}
