import { Client, Message } from "whatsapp-web.js";
import { User } from "../classes/User";
import { Register } from "../messages/Unregistered/Register";
import { CPF } from "../messages/Unregistered/CPF";
import { CNPJ } from "../messages/Unregistered/CNPJ";
import { Autenticado } from "../messages/Registered/Autenticado";
import { PrimeiroCertificado } from "../messages/Registered/PrimeiroCertificado";
import { SegundoCertificado } from "../messages/Registered/SegundoCertificado";
import { CancellingMessage } from "../messages/Registered/CancellingMessage";

interface Props {
  client: Client;
  message: Message;
  user: User;
  users?: User[];
}

export class SendMessage {
  static async sendUnauthMessage({ client, message, user, users }: Props) {
    switch (user.chatLevel) {
      case "Inicial":
        user.chatLevel = "Registrando Nome";
        await Register.sendMessage({ client, message });
        break;
      case "Registrando Nome":
        user.name = message.body;
        user.chatLevel = "Registrando CPF";
        await CPF.sendMessage({ client, message });
        break;
      case "Registrando CPF":
        user.cpf = message.body;
        user.chatLevel = "Registrando Usuário";
        await CNPJ.sendMessage({ client, message });
        break;
      case "Registrando Usuário":
        user.cnpj = message.body;
        user.chatLevel = "Autenticado";
        client.sendMessage(
          message.from,
          `Ótimo, você foi cadastrado. Digite agora uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`
        );
        const { data } = await user.register();
        user.id = data![0].id;
        users?.push(user);
    }
  }

  static async sendAuthMessage({ client, message, user }: Props) {
    const lvl = user.chatLevel;
    if (lvl === "Autenticado") {
      await Autenticado.sendMessage({ client, message, user });
      return;
    }

    if (lvl === "Enviando primeiro certificado.") {
      if (Number(message.body) === 0 && !message.hasMedia) {
        CancellingMessage.sendMessage({ client, message });
        user.clearOperations();
        return;
      }

      if (message.hasMedia) {
        const blob = await message.downloadMedia();
        if (!blob.mimetype.includes("image")) {
          await client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
          return;
        }

        user.chatLevel = "Enviando segundo certificado.";
        user.blob1 = blob;
        await PrimeiroCertificado.sendMessage({ client, message });
        return;
      }

      await client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
      return;
    }

    if (lvl === "Enviando segundo certificado.") {
      if (Number(message.body) === 0 && !message.hasMedia) {
        CancellingMessage.sendMessage({ client, message });
        user.clearOperations();
        return;
      }
      if (message.hasMedia) {
        const blob = await message.downloadMedia();
        if (!blob.mimetype.includes("image")) {
          await client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
          return;
        }
        if (user.blob1?.data === blob.data) {
          await client.sendMessage(message.from, "Atenção, você está cadastrando duas imagens idênticas. Favor revisar");
          return;
        }

        user.chatLevel = "Autenticado";
        user.blob2 = blob;
        await SegundoCertificado.sendMessage({ client, message });
        const { error } = await user.cadastrarCertificado();

        if (error) {
          await client.sendMessage(message.from, "Ocorreu um erro, tente novamente");
        }
        return;
      }

      await client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
    }
  }
}
