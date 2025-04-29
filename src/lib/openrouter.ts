const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenRouter API key');
}

export type StreamData = {
  id: string;
  model: string;
  choices: {
    delta: {
      content?: string;
    };
    index: number;
    finish_reason: string | null;
  }[];
};

export async function* streamResponse(messages: any[], model: string) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Personal AI Assistant',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(error)}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

      try {
        const dataString = trimmedLine.replace(/^data: /, '');
        const data = JSON.parse(dataString) as StreamData;
        yield data;
      } catch (error) {
        console.error('Error parsing OpenRouter stream data:', error);
      }
    }
  }
}

export const DEFAULT_MODELS: any[] = [
  {
    id: 'microsoft/mai-ds-r1:free',
    name: 'Microsoft MAI-DS-r1',
    provider: 'Microsoft',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'qwen/qwen2.5-vl-32b-instruct:free',
    name: 'Qwen 2.5 VL 32B',
    provider: 'Qwen',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    provider: 'DeepSeek',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'featherless/qwerky-72b:free',
    name: 'Qwerky 72B',
    provider: 'Featherless',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'mistralai/mistral-small-3.1-24b-instruct:free',
    name: 'Mistral Small 3.1',
    provider: 'Mistral',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'deepseek/deepseek-r1-zero:free',
    name: 'DeepSeek R1 Zero',
    provider: 'DeepSeek',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'qwen/qwq-32b:free',
    name: 'QWQ 32B',
    provider: 'Qwen',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'thudm/glm-4-32b:free',
    name: 'GLM-4 32B',
    provider: 'THUDM',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'agentica-org/deepcoder-14b-preview:free',
    name: 'DeepCoder 14B',
    provider: 'Agentica',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'nvidia/llama-3.3-nemotron-super-49b-v1:free',
    name: 'Nemotron Super 49B',
    provider: 'NVIDIA',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
    name: 'Nemotron Nano 8B',
    provider: 'NVIDIA',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    name: 'Nemotron Ultra 253B',
    provider: 'NVIDIA',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'meta-llama/llama-4-maverick:free',
    name: 'Llama 4 Maverick',
    provider: 'Meta',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'meta-llama/llama-4-scout:free',
    name: 'Llama 4 Scout',
    provider: 'Meta',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'deepseek/deepseek-v3-base:free',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  },
  {
    id: 'huggingfaceh4/zephyr-7b-beta:free',
    name: 'Zyphra',
    provider: 'HuggingFace',
    contextLength: 32000,
    inputPrice: 0,
    outputPrice: 0,
  }
];