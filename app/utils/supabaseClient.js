import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

// Test the connection
supabase.storage.listBuckets().then(({ data, error }) => {
  if (error) {
    console.error("Supabase storage connection error:", error);
  } else {
    console.log(
      "Available buckets:",
      data?.map((b) => b.name)
    );
  }
});

export default supabase;
