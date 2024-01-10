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
exports.Register = void 0;
class Register {
    static sendMessage({ client, message }) {
        return __awaiter(this, void 0, void 0, function* () {
            client.sendMessage(message.from, `Olá, bem vindo às ações promocionais Moura. Verifiquei em nossa base que você não tem cadastro nas nossas ações.

*Digite seu nome para iniciar:*`);
        });
    }
}
exports.Register = Register;
//# sourceMappingURL=Register.js.map