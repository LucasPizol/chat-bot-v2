import { supabase } from "../../supabase";
import { User } from "../classes/User";

type UploadImage = {
  fileName: string;
  fileData: ArrayBuffer;
};

type WarrancyRow = {
  url1: string;
  url2: string;
  userId: number;
};

export class SupabaseHelper {
  static async uploadImage({ fileName, fileData }: UploadImage) {
    const { data, error } = await supabase.storage.from("Certificados").upload(fileName, fileData, {
      contentType: "image/png",
    });

    const url = supabase.storage.from("Certificados").getPublicUrl(fileName).data.publicUrl;

    return { data, error, url };
  }

  static async createWarrancyRow({ url1, url2, userId }: WarrancyRow) {
    const { data, error } = await supabase.from("warrancies").insert({
      url1,
      url2,
      userId,
    });
    return { data, error };
  }

  static async getUserWarrancyQuantity({ user }: { user: User }) {
    const { data, error } = await supabase.from("warrancies").select().eq("userId", user.id);
    if (error) return 0;

    return data.length;
  }
}
