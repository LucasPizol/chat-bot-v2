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
      `Ok!, agora me envie a foto de trás de seu certificado. (digite 0 para cancelar)`
    );
  }
}
