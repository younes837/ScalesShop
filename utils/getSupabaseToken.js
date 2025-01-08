import { auth } from "@clerk/nextjs/server";

export const getSupabaseToken = async () => {
  const { getToken } = auth();

  // Get JWT from Clerk
  const token = await getToken({
    template: "supabase",
  });

  return token;
};
