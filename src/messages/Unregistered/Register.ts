import { Client, Message } from "whatsapp-web.js";

interface Props {
  client: Client;
  message: Message;
}

export class Register {
  static async sendMessage({ client, message }: Props) {
    client.sendMessage(
      message.from, `Olá, bem vindo às ações promocionais Moura. Verifiquei em nossa base que você não tem cadastro nas nossas ações.

*Digite seu nome para iniciar:*`
    );
  }
}
