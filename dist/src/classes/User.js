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
exports.User = void 0;
const supabase_1 = require("../../supabase");
const base64_arraybuffer_1 = require("base64-arraybuffer");
const SupabaseHelper_1 = require("../helper/SupabaseHelper");
class User {
    constructor(id, number, cpf, name, cnpj, chatLevel) {
        this.id = id;
        this.cpf = cpf;
        this.number = number;
        this.name = name;
        this.cnpj = cnpj;
        this.chatLevel = chatLevel;
        this.blob1 = null;
        this.blob2 = null;
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from("user")
                .insert({
                number: this.number,
                cnpj: this.cnpj,
                name: this.name,
                cpf: this.cpf,
            })
                .select();
            return { data, error };
        });
    }
    cadastrarCertificado() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.blob1 || !this.blob2)
                return { data: {}, error: "Ocorreu um erro" };
            const fileName1 = `${this.cpf} - ${this.name} - ${Math.ceil(Math.random() * 30000)}`;
            const fileName2 = `${this.cpf} - ${this.name} - ${Math.ceil(Math.random() * 30000)}`;
            const firstImageContent = yield SupabaseHelper_1.SupabaseHelper.uploadImage({ fileName: fileName1, fileData: (0, base64_arraybuffer_1.decode)(this.blob1.data) });
            const secondImageContent = yield SupabaseHelper_1.SupabaseHelper.uploadImage({ fileName: fileName2, fileData: (0, base64_arraybuffer_1.decode)(this.blob2.data) });
            const { data, error } = yield SupabaseHelper_1.SupabaseHelper.createWarrancyRow({
                url1: firstImageContent.url,
                url2: secondImageContent.url,
                userId: this.id,
            });
            return { data, error };
        });
    }
    clearOperations() {
        this.blob1 = null;
        this.blob2 = null;
        this.chatLevel = "Autenticado";
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map