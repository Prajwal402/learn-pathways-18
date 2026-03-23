import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log(process.env);
  throw new Error("Missing env vars");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { count, error } = await supabase.from('lectures').select('*', { count: 'exact', head: true });
  console.log("Total lectures in DB:", count);
  if (error) console.error(error);
}
check();
