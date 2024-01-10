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
exports.CancellingMessage = void 0;
class CancellingMessage {
    static sendMessage({ client, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            client.sendMessage(message.from, "Cancelando...");
            client.sendMessage(message.from, `Digite uma das opções para prosseguir:
1 - Cadastrar certificado,
2 - Consultar quantidade de certificados.`);
        });
    }
}
exports.CancellingMessage = CancellingMessage;
//# sourceMappingURL=CancellingMessage.js.map