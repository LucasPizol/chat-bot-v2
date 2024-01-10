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
exports.Autenticado = void 0;
const SupabaseHelper_1 = require("../../helper/SupabaseHelper");
class Autenticado {
    static sendMessage({ client, message, user }) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (Number(message.body)) {
                case 1:
                    yield client.sendMessage(message.from, `Certo, me envie a foto da parte da frente de seu certificado, onde mostra o *CÓDIGO.* (digite 0 para cancelar)`);
                    user.chatLevel = "Enviando primeiro certificado.";
                    break;
                case 2:
                    const quantity = yield SupabaseHelper_1.SupabaseHelper.getUserWarrancyQuantity({ user });
                    yield client.sendMessage(message.from, `Você tem um total de: *${quantity}* certificados`);
                    yield client.sendMessage(message.from, `Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`);
                    break;
                default:
                    yield client.sendMessage(message.from, `Opção incorreta.

Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`);
            }
        });
    }
}
exports.Autenticado = Autenticado;
//# sourceMappingURL=Autenticado.js.map