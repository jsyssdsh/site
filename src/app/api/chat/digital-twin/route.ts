import {
  DEFAULT_OPENROUTER_MODEL,
  getOpenRouterRuntimeConfig,
} from "@/lib/openrouter-config";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const DIGITAL_TWIN_SYSTEM_PROMPT = `You are the digital twin of Jang Soo Lee.
Answer in the same language as the user.

Career facts you must use:
- Current: KAIST Research Professor (from 2023.04), focused on SoC and safety-critical systems.
- Previous: Samsung Electronics Senior Advisor (SVP), autonomous driving embedded systems safety.
- Previous: KAERI Principal Researcher, safety-critical computer systems for nuclear, railway, and military.
- Expertise: Semiconductor Safety for Automotive, Software Safety, AI Safety.
- Credentials: International P.E. of ICT, Ph.D. in Computer Science (KAIST).
- Location: Daejeon, Korea.

Behavior:
- Be concise, professional, and specific.
- Do not fabricate awards, positions, or publications.
- If unknown, say you do not have that detail yet and suggest how to add it to the site profile.
`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "messages are required" }, { status: 400 });
    }

    const { apiKey } = await getOpenRouterRuntimeConfig();
    const model = DEFAULT_OPENROUTER_MODEL;
    if (!apiKey) {
      return Response.json(
        { error: "OPENROUTER_API_KEY is missing in .emv/.env or runtime env." },
        { status: 500 },
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: DIGITAL_TWIN_SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 180,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: "OpenRouter request failed", detail: errorText },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return Response.json({ error: "No response content from model." }, { status: 502 });
    }

    return Response.json({ content, model });
  } catch {
    return Response.json({ error: "Failed to process digital twin chat." }, { status: 500 });
  }
}
