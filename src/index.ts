#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// Pollinations AI API endpoints
const POLLINATIONS_IMAGE_API = "https://image.pollinations.ai/prompt";
const POLLINATIONS_TEXT_API = "https://text.pollinations.ai";

interface GenerateImageArgs {
  prompt: string;
  width?: number;
  height?: number;
  seed?: number;
  model?: string;
  nologo?: boolean;
  enhance?: boolean;
}

interface GenerateTextArgs {
  prompt: string;
  model?: string;
  seed?: number;
  temperature?: number;
  max_tokens?: number;
  system?: string;
}

// Create MCP server instance
const server = new Server(
  {
    name: "pollinations-ai",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Define available tools
const tools: Tool[] = [
  {
    name: "generate_image",
    description:
      "Generate an image using Pollinations AI. Creates stunning AI-generated images from text prompts. Returns a URL to the generated image.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The text prompt describing the image to generate",
        },
        width: {
          type: "number",
          description: "Image width in pixels (default: 1024)",
          default: 1024,
        },
        height: {
          type: "number",
          description: "Image height in pixels (default: 1024)",
          default: 1024,
        },
        seed: {
          type: "number",
          description: "Random seed for reproducible results (optional)",
        },
        model: {
          type: "string",
          description:
            "Model to use: flux, flux-realism, flux-anime, flux-3d, turbo (default: flux)",
          enum: ["flux", "flux-realism", "flux-anime", "flux-3d", "turbo"],
          default: "flux",
        },
        nologo: {
          type: "boolean",
          description: "Remove Pollinations watermark (default: true)",
          default: true,
        },
        enhance: {
          type: "boolean",
          description: "Enhance the prompt automatically (default: false)",
          default: false,
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "generate_text",
    description:
      "Generate text using Pollinations AI language models. Supports various models including OpenAI, Mistral, and more. Returns generated text response.",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The text prompt or question",
        },
        model: {
          type: "string",
          description: "Model to use (default: openai)",
          enum: [
            "openai",
            "mistral",
            "mistral-large",
            "claude-3.5-sonnet",
            "llama-3.3-70b",
            "qwen-2.5-coder-32b",
            "searchgpt",
          ],
          default: "openai",
        },
        seed: {
          type: "number",
          description: "Random seed for reproducible results (optional)",
        },
        temperature: {
          type: "number",
          description: "Temperature for randomness (0.0 to 2.0, default: 0.7)",
          default: 0.7,
          minimum: 0,
          maximum: 2,
        },
        max_tokens: {
          type: "number",
          description: "Maximum number of tokens to generate (optional)",
        },
        system: {
          type: "string",
          description: "System message to set context (optional)",
        },
      },
      required: ["prompt"],
    },
  },
  {
    name: "get_available_models",
    description:
      "Get a list of all available models for image and text generation on Pollinations AI",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Handle list_tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle call_tool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_image": {
        const imageArgs = (args || {}) as unknown as GenerateImageArgs;
        const {
          prompt,
          width = 1024,
          height = 1024,
          seed,
          model = "flux",
          nologo = true,
          enhance = false,
        } = imageArgs;

        if (!prompt) {
          throw new Error("Prompt is required");
        }

        // Build URL with parameters
        const encodedPrompt = encodeURIComponent(prompt);
        const params = new URLSearchParams({
          width: width.toString(),
          height: height.toString(),
          model: model,
          nologo: nologo.toString(),
          enhance: enhance.toString(),
        });

        if (seed !== undefined) {
          params.append("seed", seed.toString());
        }

        const imageUrl = `${POLLINATIONS_IMAGE_API}/${encodedPrompt}?${params.toString()}`;

        // Test if URL is accessible
        const response = await fetch(imageUrl, { method: "HEAD" });
        if (!response.ok) {
          throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  imageUrl: imageUrl,
                  prompt: prompt,
                  width: width,
                  height: height,
                  model: model,
                  seed: seed,
                  message:
                    "Image generated successfully! Use the imageUrl to display or download the image.",
                },
                null,
                2,
              ),
            },
            {
              type: "image",
              data: imageUrl,
              mimeType: "image/jpeg",
            },
          ],
        };
      }

      case "generate_text": {
        const textArgs = (args || {}) as unknown as GenerateTextArgs;
        const {
          prompt,
          model = "openai",
          seed,
          temperature = 0.7,
          max_tokens,
          system,
        } = textArgs;

        if (!prompt) {
          throw new Error("Prompt is required");
        }

        // Build request body
        const requestBody: any = {
          messages: [
            ...(system ? [{ role: "system", content: system }] : []),
            { role: "user", content: prompt },
          ],
          model: model,
          temperature: temperature,
        };

        if (seed !== undefined) {
          requestBody.seed = seed;
        }

        if (max_tokens !== undefined) {
          requestBody.max_tokens = max_tokens;
        }

        // Make request to Pollinations text API
        const response = await fetch(POLLINATIONS_TEXT_API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate text: ${response.statusText}`);
        }

        const text = await response.text();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  response: text,
                  model: model,
                  prompt: prompt,
                  seed: seed,
                  temperature: temperature,
                },
                null,
                2,
              ),
            },
          ],
        };
      }

      case "get_available_models": {
        const models = {
          image_models: [
            {
              name: "flux",
              description: "High-quality general purpose image generation",
            },
            {
              name: "flux-realism",
              description: "Photorealistic image generation",
            },
            {
              name: "flux-anime",
              description: "Anime and manga style images",
            },
            {
              name: "flux-3d",
              description: "3D rendered style images",
            },
            {
              name: "turbo",
              description: "Fast image generation with good quality",
            },
          ],
          text_models: [
            {
              name: "openai",
              description: "OpenAI GPT models (default)",
            },
            {
              name: "mistral",
              description: "Mistral AI model",
            },
            {
              name: "mistral-large",
              description: "Mistral Large model for complex tasks",
            },
            {
              name: "claude-3.5-sonnet",
              description: "Anthropic Claude 3.5 Sonnet",
            },
            {
              name: "llama-3.3-70b",
              description: "Meta Llama 3.3 70B",
            },
            {
              name: "qwen-2.5-coder-32b",
              description: "Qwen 2.5 Coder 32B - specialized for coding",
            },
            {
              name: "searchgpt",
              description: "Search-augmented generation model",
            },
          ],
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(models, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: errorMessage,
            },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pollinations AI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
