import { promises as fs } from "node:fs";
import path from "node:path";

type KeyValue = Record<string, string>;
export const DEFAULT_OPENROUTER_MODEL =
  "anthropic/claude-opus-4.6-fast";
export const DEFAULT_OPENROUTER_FALLBACK_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-4o-mini",
];

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

function parseModelList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function getOpenRouterRuntimeConfig() {
  const projectRoot = process.cwd();
  const envLocalVars = await readEnvFile(path.join(projectRoot, ".env.local"));
  const envVars = await readEnvFile(path.join(projectRoot, ".env"));

  const apiKey =
    process.env.OPENROUTER_API_KEY ??
    envLocalVars.OPENROUTER_API_KEY ??
    envVars.OPENROUTER_API_KEY;

  const model =
    process.env.OPENROUTER_MODEL ??
    envLocalVars.OPENROUTER_MODEL ??
    envVars.OPENROUTER_MODEL ??
    DEFAULT_OPENROUTER_MODEL;

  const fallbackModelsRaw =
    process.env.OPENROUTER_FALLBACK_MODELS ??
    envLocalVars.OPENROUTER_FALLBACK_MODELS ??
    envVars.OPENROUTER_FALLBACK_MODELS;

  const fallbackModels = parseModelList(fallbackModelsRaw);

  return {
    apiKey,
    model,
    fallbackModels:
      fallbackModels.length > 0 ? fallbackModels : DEFAULT_OPENROUTER_FALLBACK_MODELS,
  };
}
