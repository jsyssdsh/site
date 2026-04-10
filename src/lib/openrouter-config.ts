import { promises as fs } from "node:fs";
import path from "node:path";

type KeyValue = Record<string, string>;
export const DEFAULT_OPENROUTER_MODEL =
  "anthropic/claude-opus-4.6-fast";

function parseEnvLike(content: string): KeyValue {
  return content.split("\n").reduce<KeyValue>((acc, rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return acc;

    const idx = line.indexOf("=");
    if (idx <= 0) return acc;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    acc[key] = value;
    return acc;
  }, {});
}

async function readEnvFile(filePath: string): Promise<KeyValue> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseEnvLike(raw);
  } catch {
    return {};
  }
}

export async function getOpenRouterRuntimeConfig() {
  const projectRoot = path.join(process.cwd(), "..");
  const emvVars = await readEnvFile(path.join(projectRoot, ".emv"));
  const envVars = await readEnvFile(path.join(projectRoot, ".env"));

  const apiKey =
    process.env.OPENROUTER_API_KEY ??
    emvVars.OPENROUTER_API_KEY ??
    envVars.OPENROUTER_API_KEY;

  const model =
    process.env.OPENROUTER_MODEL ??
    emvVars.OPENROUTER_MODEL ??
    envVars.OPENROUTER_MODEL ??
    DEFAULT_OPENROUTER_MODEL;

  return { apiKey, model };
}
