"use server";
import { auth } from "@clerk/nextjs/server";

export async function getSupabaseToken() {
  const { getToken } = auth();
  return getToken({
    template: "supabase",
  });
}
