import { Client, Message } from "whatsapp-web.js";
import { SupabaseHelper } from "../../helper/SupabaseHelper";
import { User } from "../../classes/User";

interface Props {
  client: Client;
  message: Message;
  user: User;
}

export class Autenticado {
  static async sendMessage({ client, message, user }: Props) {
    switch (Number(message.body)) {
      case 1:
        await client.sendMessage(message.from, `Certo, me envie a foto da parte da frente de seu certificado. (digite 0 para cancelar)`);
        user.chatLevel = "Enviando primeiro certificado.";
        break;
      case 2:
        const quantity = await SupabaseHelper.getUserWarrancyQuantity({ user });
        await client.sendMessage(message.from, `Você tem um total de: *${quantity}* certificados`);
        await client.sendMessage(
          message.from,
          `Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`
        );
        break;

      default:
        await client.sendMessage(
          message.from,
          `Opção incorreta.

Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`
        );
    }
  }
}
