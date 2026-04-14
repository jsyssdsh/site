import {
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

    const { apiKey, model: primaryModel, fallbackModels } =
      await getOpenRouterRuntimeConfig();
    if (!apiKey) {
      return Response.json(
        { error: "OPENROUTER_API_KEY is missing in .env.local/.env or runtime env." },
        { status: 500 },
      );
    }

    const modelChain = [primaryModel, ...fallbackModels].filter(
      (model, idx, arr) => model && arr.indexOf(model) === idx,
    );

    const callOpenRouter = async (model: string, maxTokens: number) =>
      fetch("https://openrouter.ai/api/v1/chat/completions", {
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
          max_tokens: maxTokens,
        }),
      });

    const attemptErrors: string[] = [];

    for (const model of modelChain) {
      const tokenPlan = [120, 72, 48];

      for (const maxTokens of tokenPlan) {
        let response = await callOpenRouter(model, maxTokens);
        let errorText = response.ok ? "" : await response.text();

        if (!response.ok && response.status === 402) {
          const affordableMatch = errorText.match(/can only afford (\d+)/i);
          const affordable = affordableMatch ? Number(affordableMatch[1]) : null;
          if (affordable && affordable > 24) {
            const emergencyTokens = Math.max(24, Math.min(64, affordable - 8));
            response = await callOpenRouter(model, emergencyTokens);
            errorText = response.ok ? "" : await response.text();
          }
        }

        if (response.ok) {
          const data = (await response.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };

          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            return Response.json({ content, model });
          }
        }

        attemptErrors.push(
          `[${model} | max_tokens=${maxTokens}] status=${response.status} ${
            errorText ? errorText.slice(0, 240) : "No content"
          }`,
        );
      }
    }

    return Response.json(
      {
        error:
          "OpenRouter 요청이 모두 실패했습니다. 잠시 후 다시 시도하거나 API 키 한도/모델 접근 권한을 확인해 주세요.",
        detail: attemptErrors.join("\n\n"),
      },
      { status: 502 },
    );
  } catch {
    return Response.json({ error: "Failed to process digital twin chat." }, { status: 500 });
  }
}
