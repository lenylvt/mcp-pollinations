# Pollinations AI MCP Server

[![smithery badge](https://smithery.ai/badge/@pollinations/mcp-server)](https://smithery.ai/server/@pollinations/mcp-server)
[![npm version](https://badge.fury.io/js/%40pollinations%2Fmcp-server.svg)](https://www.npmjs.com/package/@pollinations/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A Model Context Protocol (MCP) server that provides access to [Pollinations AI](https://pollinations.ai/) for generating stunning images and text using various AI models.

## Features

- 🎨 **Image Generation**: Create high-quality images from text prompts
- 📝 **Text Generation**: Generate text with multiple language models
- 🎭 **Multiple Models**: Support for various specialized models (realistic, anime, 3D, etc.)
- 🔧 **Customizable**: Control dimensions, seeds, temperature, and more
- 🚀 **Fast & Free**: Powered by Pollinations AI's free API

## Quick Start

### Install with Smithery

```bash
npx @smithery/cli install @pollinations/mcp-server --client claude
```

### Manual Setup for Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pollinations": {
      "command": "npx",
      "args": ["-y", "@pollinations/mcp-server"]
    }
  }
}
```

Then restart Claude Desktop.

## Available Tools

### 1. generate_image
Generate AI images from text descriptions.

**Example:**
```
Generate a realistic mountain landscape at sunset, 1920x1080
```

### 2. generate_text
Generate text using AI language models.

**Example:**
```
Use the qwen-2.5-coder model to write a Python function
```

### 3. get_available_models
Get a list of all available models.

## Available Models

### Image Models
- **flux** - High-quality general purpose
- **flux-realism** - Photorealistic images
- **flux-anime** - Anime/manga style
- **flux-3d** - 3D rendered style
- **turbo** - Fast generation

### Text Models
- **openai** - OpenAI GPT models
- **mistral** / **mistral-large** - Mistral AI
- **claude-3.5-sonnet** - Anthropic Claude
- **llama-3.3-70b** - Meta Llama
- **qwen-2.5-coder-32b** - Coding specialist
- **searchgpt** - Web-search enabled

## Usage Examples

### Create a Portrait
```
Generate a professional headshot with studio lighting using flux-realism model
```

### Generate Code
```
Use qwen-2.5-coder to write a function that calculates fibonacci numbers
```

### Research
```
Use searchgpt to find the latest AI developments in 2024
```

## Development

```bash
# Clone the repository
git clone https://github.com/lenylvt/mcp-pollinations.git
cd mcp-pollinations

# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Resources

- [Pollinations AI](https://pollinations.ai/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Smithery](https://smithery.ai/)

## Support

- GitHub Issues: [Create an issue](https://github.com/lenylvt/mcp-pollinations/issues)
- Discord: [Join Smithery Discord](https://smithery.ai/discord)

---

Made with 🌸 by Pollinations AI
