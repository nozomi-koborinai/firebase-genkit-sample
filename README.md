![genkit-logo-dark](https://github.com/user-attachments/assets/e2fcf30c-4b59-4040-9692-78ec787fae3d#gh-dark-mode-only 'Genkit')
![genkit-logo](https://github.com/user-attachments/assets/4875ba20-032b-4055-bc0f-9e4241a9e40b#gh-light-mode-only 'Genkit')

# genkit-sample

A sample project demonstrating AI applications using Firebase Cloud Run functions (2nd generation) and Genkit v1.8.0. 
This sample specifically utilizes the **Genkit JS SDK**. Genkit also offers SDKs for Go and Python, which are not covered in this particular project.

## 🚀 Features

- Basic Genkit Flow Example (helloGenkitFlow)
- Image Analysis (Google AI)
- Web Content Analysis (Google AI)
- Chat Message Generation (Google AI & Firestore)
- Image Generation (Vertex AI)
- Google Maps Integration (via Genkit MCP)
- Genkit MCP Server Sample

## 📁 Project Structure

```plain
firebase-genkit-sample/
├── .github/
│ └── workflows/          # CI/CD Pipelines sample
├── prompts/              # AI prompt templates
├── src/
│ ├── genkit-flows/       # AI flow implementations (e.g., analyzeImageFlow, helloGenkitFlow)
│ ├── mcp/
│ │ ├── client/           # MCP client implementations (e.g., mapsClient)
│ │ └── server/           # MCP server implementations (e.g., genkitMCP)
│ ├── tools/              # Custom Genkit tools (e.g., getCurrentTime, webLoader)
│ ├── genkit.ts           # Genkit secrets/telemetry/logging configuration
│ └── index.ts            # Firebase Functions deployment entry point
└── terraform/            # Terraform configuration for infrastructure setup (not directly related to Genkit, but used for setting up the overall Firebase project infrastructure)
```

## 🛠 Quick Start

0. Install Genkit CLI

```bash
npm i -g genkit
```

1. Install dependencies

```bash
npm install
```

2. Set environment variables

```bash
export GCLOUD_PROJECT="your-google-cloud-project-id"
export GOOGLE_GENAI_API_KEY="your-api-key"
export GENKIT_ENV="dev"
export GOOGLE_MAPS_API_KEY="your-maps-api-key"
```

3. Start Genkit emulator for development

```bash
npm start
```

4. Deploy to Cloud Run functions (2nd generation)

```bash
firebase deploy --only functions
```

(Note: While this example focuses on Cloud Run functions for Firebase (2nd Gen), Genkit flows are highly portable. They can be deployed to various Node.js environments, including Google Cloud Run directly, or any other platform that supports Node.js execution.)

## 📚 Articles

### English

- [Orchestrating Firebase and AI: 8 Genkit Architecture Patterns](https://medium.com/@nozomi-koborinai/orchestrating-firebase-and-ai-8-genkit-architecture-patterns-12e44db40345)
- [How to Develop Firebase Genkit Functions](https://medium.com/@nozomi-koborinai/how-to-develop-firebase-genkit-functions-2677b386a227)
- [Getting Started with AI Image Generation Apps on Flutter, Genkit, and Imagen 3](https://medium.com/@nozomi-koborinai/getting-started-with-ai-image-generation-apps-on-flutter-genkit-and-imagen-3-9a83c63cbdf3)
- [Extending Your AI Application with Genkit MCP](https://medium.com/@nozomi-koborinai/extending-your-ai-application-with-genkit-mcp-475d7533ca9e)
- [Genkit vs Agent Development Kit (ADK): Choosing the Right Google‑Backed AI Framework](https://medium.com/@nozomi-koborinai/genkit-vs-agent-development-kit-adk-choosing-the-right-google-backed-ai-framework-1744b73234ac)

### Japanese

- [Firebase & AI のオーケストレーションを実現！Genkit アーキテクチャ 8 選](https://zenn.dev/nozomi_cobo/articles/genkit-architecture)
- [Firebase Genkit Functions 開発のすゝめ](https://zenn.dev/nozomi_cobo/articles/genkit-emulator-suite)
- [Flutter × Genkit × Imagen 3 で始める AI 画像生成アプリ開発入門](https://zenn.dev/nozomi_cobo/articles/flutter-genkit-imagen)
- [Genkit MCP を使った AI アプリケーションの外部拡張](https://zenn.dev/nozomi_cobo/articles/start-genkit-mcp)
- [Genkit vs Agent Development Kit (ADK): Google 製 AI フレームワークの違いと使い分け](https://zenn.dev/nozomi_cobo/articles/genkit-agent-development-kit)
