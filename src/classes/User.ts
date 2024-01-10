import { MessageMedia } from "whatsapp-web.js";
import { supabase } from "../../supabase";
import { decode } from "base64-arraybuffer";
import { SupabaseHelper } from "../helper/SupabaseHelper";

export class User {
  id: number | null;
  number: string;
  cpf: string;
  name: string;
  cnpj: string;
  chatLevel: string;
  blob1: MessageMedia | null;
  blob2: MessageMedia | null;

  constructor(id: number | null, number: string, cpf: string, name: string, cnpj: string, chatLevel: string) {
    this.id = id;
    this.cpf = cpf;
    this.number = number;
    this.name = name;
    this.cnpj = cnpj;
    this.chatLevel = chatLevel;
    this.blob1 = null;
    this.blob2 = null;
  }

  async register() {
    const { data, error } = await supabase
      .from("user")
      .insert({
        number: this.number,
        cnpj: this.cnpj,
        name: this.name,
        cpf: this.cpf,
      })
      .select();

    return { data, error };
  }

  async cadastrarCertificado() {
    if (!this.blob1 || !this.blob2) return { data: {}, error: "Ocorreu um erro" };

    const fileName1 = `${this.cpf} - ${this.name} - ${Math.ceil(Math.random() * 30000)}`;
    const fileName2 = `${this.cpf} - ${this.name} - ${Math.ceil(Math.random() * 30000)}`;

    const firstImageContent = await SupabaseHelper.uploadImage({ fileName: fileName1, fileData: decode(this.blob1.data) });
    const secondImageContent = await SupabaseHelper.uploadImage({ fileName: fileName2, fileData: decode(this.blob2.data) });

    const { data, error } = await SupabaseHelper.createWarrancyRow({
      url1: firstImageContent.url,
      url2: secondImageContent.url,
      userId: this.id!,
    });

    return { data, error };
  }

  clearOperations() {
    this.blob1 = null;
    this.blob2 = null;
    this.chatLevel = "Autenticado";
  }
}
