import Groq from 'groq-sdk';

// Initialize the singleton Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/**
 * Ask Groq a general question with an optional system prompt
 */
export async function askGroq(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: any[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: prompt });

  const response = await groq.chat.completions.create({
    messages,
    model: DEFAULT_MODEL,
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Summarize a thread given an array of messages
 */
export async function summarizeThread(messages: any[], mode: 'technical' | 'executive' = 'technical'): Promise<string> {
  const systemPrompt = mode === 'technical' 
    ? 'Summarize architectural decisions, trade-offs, and code patterns from the following thread messages.'
    : 'Translate the following thread messages into a summary focusing on business impact for non-technical stakeholders.';

  const prompt = `Here are the messages from the thread:\n\n${JSON.stringify(messages, null, 2)}\n\nPlease provide the summary.`;

  return askGroq(prompt, systemPrompt);
}

/**
 * Generate an Architecture Decision Record (ADR) or similar documentation from a thread
 */
export async function generateADR(thread: any, format: 'adr' | 'onboarding' | 'changelog' = 'adr'): Promise<string> {
  let systemPrompt = '';
  
  switch (format) {
    case 'adr':
      systemPrompt = 'Generate an Architecture Decision Record (ADR) from the provided thread messages. Format with: Title, Status, Context, Decision, Consequences.';
      break;
    case 'onboarding':
      systemPrompt = 'Generate an Onboarding Guide (how-to walkthrough for new devs) from the provided thread messages.';
      break;
    case 'changelog':
      systemPrompt = 'Generate a Changelog (what changed and why) from the provided thread messages.';
      break;
  }

  const prompt = `Here are the messages from the thread(s):\n\n${JSON.stringify(thread, null, 2)}\n\nPlease generate the requested document in Markdown format.`;

  return askGroq(prompt, systemPrompt);
}

export default groq;
