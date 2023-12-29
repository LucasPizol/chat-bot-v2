import { Client, Message } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
  blob?: Blob;
}

export class SegundoCertificado {
  static async sendMessage({ client, message, blob }: Props) {
    client.sendMessage(
      message.from,
      `Ok! Seu certificado foi cadastrado e será analisado.

Digite uma das opções para prosseguir:
1 - Cadastrar novo certificado,
2 - Consultar quantidade de certificados.`
    );
  }
}
