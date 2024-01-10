import { Client, Message } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
  blob?: Blob;
}

export class PrimeiroCertificado {
  static async sendMessage({ client, message, blob }: Props) {
    client.sendMessage(
      message.from,
      `Ok! Agora me envie a foto de onde mostra a *DATA DA VENDA.* (digite 0 para cancelar)`
    );
  }
}
