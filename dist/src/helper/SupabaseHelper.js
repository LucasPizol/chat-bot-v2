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
exports.SupabaseHelper = void 0;
const supabase_1 = require("../../supabase");
class SupabaseHelper {
    static uploadImage({ fileName, fileData }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase.storage.from("Certificados").upload(fileName, fileData, {
                contentType: "image/png",
            });
            const url = supabase_1.supabase.storage.from("Certificados").getPublicUrl(fileName).data.publicUrl;
            return { data, error, url };
        });
    }
    static createWarrancyRow({ url1, url2, userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase.from("warrancies").insert({
                url1,
                url2,
                userId,
            });
            return { data, error };
        });
    }
    static getUserWarrancyQuantity({ user }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase.from("warrancies").select().eq("userId", user.id);
            if (error)
                return 0;
            return data.length;
        });
    }
}
exports.SupabaseHelper = SupabaseHelper;
//# sourceMappingURL=SupabaseHelper.js.map