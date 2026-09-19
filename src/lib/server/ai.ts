type AiTripSummaryInput = {
  region: string;
  recipeTitle: string;
  places: string[];
};

const fallbackSummary = ({ region, recipeTitle, places }: AiTripSummaryInput) =>
  `${region}의 ${recipeTitle} 흐름을 바탕으로 ${places.join(', ')}를 잇는 포항 하루`;

export const generateTripSummary = async (input: AiTripSummaryInput) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openAiKey && !geminiKey) {
    return {
      connected: false,
      source: 'fallback',
      summary: fallbackSummary(input),
    };
  }

  if (!openAiKey && geminiKey) {
    return generateGeminiTripSummary(input, geminiKey);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              '너는 포항 전용 여행 서비스 POING의 추천 문구를 작성한다. 과장 없이 짧고 선명한 한국어 한 문장으로 작성한다.',
          },
          {
            role: 'user',
            content: JSON.stringify(input),
          },
        ],
        max_output_tokens: 120,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI ${response.status}`);
    }

    const data = (await response.json()) as {
      output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }>;
    };
    const summary = data.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === 'output_text')
      .map((item) => item.text ?? '')
      .join(' ')
      .trim();

    return {
      connected: Boolean(summary),
      source: summary ? 'OpenAI Responses API' : 'POING 기본 문장',
      summary: summary || fallbackSummary(input),
    };
  } catch {
    if (geminiKey) {
      return generateGeminiTripSummary(input, geminiKey);
    }

    return {
      connected: false,
      source: 'fallback',
      summary: fallbackSummary(input),
    };
  }
};

const generateGeminiTripSummary = async (input: AiTripSummaryInput, key: string) => {
  try {
    const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `POING 포항 여행 추천 문구를 한국어 한 문장으로 작성해줘. 과장 없이 짧게. 데이터: ${JSON.stringify(input)}`,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const summary = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join(' ').trim();
    return {
      connected: Boolean(summary),
      source: summary ? 'Gemini API' : 'POING 기본 문장',
      summary: summary || fallbackSummary(input),
    };
  } catch {
    return {
      connected: false,
      source: 'fallback',
      summary: fallbackSummary(input),
    };
  }
};
