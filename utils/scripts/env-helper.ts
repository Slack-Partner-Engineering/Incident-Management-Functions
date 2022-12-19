//run with "deno run ./utils/scripts/env-helper.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config();

for (const [key, value] of Object.entries(env)) {
  const cmd = ["hermes", "var", "add", key, value];
  const p = Deno.run({
    cmd: cmd,
  });
  await p.status();
}
