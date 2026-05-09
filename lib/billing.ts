/**
 * ContextVault — Billing & Cost Utility
 * Estimates token costs for different AI models based on current market rates.
 */

import { AiModel } from "@/generated/prisma/client";

interface ModelPricing {
  prompt: number; // per 1M tokens
  completion: number; // per 1M tokens
}

const PRICING: Record<AiModel, ModelPricing> = {
  [AiModel.GPT_4O]: { prompt: 5.0, completion: 15.0 },
  [AiModel.GPT_4_TURBO]: { prompt: 10.0, completion: 30.0 },
  [AiModel.GPT_4]: { prompt: 30.0, completion: 60.0 },
  [AiModel.GPT_3_5_TURBO]: { prompt: 0.5, completion: 1.5 },
  [AiModel.CLAUDE_3_OPUS]: { prompt: 15.0, completion: 75.0 },
  [AiModel.CLAUDE_3_SONNET]: { prompt: 3.0, completion: 15.0 },
  [AiModel.CLAUDE_3_HAIKU]: { prompt: 0.25, completion: 1.25 },
  [AiModel.CLAUDE_2]: { prompt: 8.0, completion: 24.0 },
  [AiModel.GEMINI_PRO]: { prompt: 0.5, completion: 1.5 },
  [AiModel.GEMINI_ULTRA]: { prompt: 2.0, completion: 6.0 },
  [AiModel.LLAMA_3]: { prompt: 0.0, completion: 0.0 }, // Assuming self-hosted or open
  [AiModel.MISTRAL_LARGE]: { prompt: 4.0, completion: 12.0 },
  [AiModel.OTHER]: { prompt: 0.0, completion: 0.0 },
};

/**
 * Calculate the estimated cost of an interaction.
 * @returns Cost in USD
 */
export function estimateCost(
  model: AiModel,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = PRICING[model] || PRICING[AiModel.OTHER];
  const promptCost = (promptTokens / 1_000_000) * pricing.prompt;
  const completionCost = (completionTokens / 1_000_000) * pricing.completion;
  
  return Number((promptCost + completionCost).toFixed(6));
}

/**
 * Formats a cost value for display.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}
