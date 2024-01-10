"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = void 0;
const Register_1 = require("../messages/Unregistered/Register");
const CPF_1 = require("../messages/Unregistered/CPF");
const CNPJ_1 = require("../messages/Unregistered/CNPJ");
const Autenticado_1 = require("../messages/Registered/Autenticado");
const PrimeiroCertificado_1 = require("../messages/Registered/PrimeiroCertificado");
const SegundoCertificado_1 = require("../messages/Registered/SegundoCertificado");
const CancellingMessage_1 = require("../messages/Registered/CancellingMessage");
class SendMessage {
    static sendUnauthMessage({ client, message, user, users }) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (user.chatLevel) {
                case "Inicial":
                    user.chatLevel = "Registrando Nome";
                    yield Register_1.Register.sendMessage({ client, message });
                    break;
                case "Registrando Nome":
                    user.name = message.body;
                    user.chatLevel = "Registrando CPF";
                    yield CPF_1.CPF.sendMessage({ client, message });
                    break;
                case "Registrando CPF":
                    user.cpf = message.body;
                    user.chatLevel = "Registrando Usuário";
                    yield CNPJ_1.CNPJ.sendMessage({ client, message });
                    break;
                case "Registrando Usuário":
                    user.cnpj = message.body;
                    user.chatLevel = "Autenticado";
                    client.sendMessage(message.from, `Ótimo, você foi cadastrado. Pedirei sempre duas fotos, uma do código e uma da data de venda da bateria, favor seguir as instruções.
Digite agora uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`);
                    const { data } = yield user.register();
                    user.id = data[0].id;
                    users === null || users === void 0 ? void 0 : users.push(user);
            }
        });
    }
    static sendAuthMessage({ client, message, user }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const lvl = user.chatLevel;
            if (lvl === "Autenticado") {
                yield Autenticado_1.Autenticado.sendMessage({ client, message, user });
                return;
            }
            if (lvl === "Enviando primeiro certificado.") {
                if (Number(message.body) === 0 && !message.hasMedia) {
                    CancellingMessage_1.CancellingMessage.sendMessage({ client, message });
                    user.clearOperations();
                    return;
                }
                if (message.hasMedia) {
                    const blob = yield message.downloadMedia();
                    if (!blob.mimetype.includes("image")) {
                        yield client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
                        return;
                    }
                    user.chatLevel = "Enviando segundo certificado.";
                    user.blob1 = blob;
                    yield PrimeiroCertificado_1.PrimeiroCertificado.sendMessage({ client, message });
                    return;
                }
                yield client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
                return;
            }
            if (lvl === "Enviando segundo certificado.") {
                if (Number(message.body) === 0 && !message.hasMedia) {
                    CancellingMessage_1.CancellingMessage.sendMessage({ client, message });
                    user.clearOperations();
                    return;
                }
                if (message.hasMedia) {
                    const blob = yield message.downloadMedia();
                    if (!blob.mimetype.includes("image")) {
                        yield client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
                        return;
                    }
                    if (((_a = user.blob1) === null || _a === void 0 ? void 0 : _a.data) === blob.data) {
                        yield client.sendMessage(message.from, "Atenção, você está cadastrando duas imagens idênticas. Favor revisar");
                        return;
                    }
                    user.chatLevel = "Autenticado";
                    user.blob2 = blob;
                    yield SegundoCertificado_1.SegundoCertificado.sendMessage({ client, message });
                    const { error } = yield user.cadastrarCertificado();
                    if (error) {
                        yield client.sendMessage(message.from, "Ocorreu um erro, tente novamente");
                    }
                    return;
                }
                yield client.sendMessage(message.from, "Atenção, o arquivo não é uma imagem");
            }
        });
    }
}
exports.SendMessage = SendMessage;
//# sourceMappingURL=SendMessage.js.map