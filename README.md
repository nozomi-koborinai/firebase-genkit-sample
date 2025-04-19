# firebase-genkit-sample

A sample project demonstrating AI applications using Firebase Cloud Run functions (2nd generation) and Genkit 1.0.

## 🚀 Features

- Image Analysis (Google AI)
- Web Content Analysis (Google AI)
- Chat Message Generation (Google AI & Firestore)
- Image Generation (Vertex AI)
- Google Maps Integration (via Genkit MCP)

## 📁 Project Structure

```plain
firebase-genkit-sample/
├── .github/
│ └── workflows/          # CI/CD Pipelines sample
├── prompts/              # AI prompt templates
├── src/
│ ├── genkit-flows/       # AI flow implementations
│ ├── mcp/
│ │ └── client/           # MCP client implementations
│ ├── genkit.ts           # Genkit configuration
│ └── index.ts            # Deploy Functions
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

## 📝 Important Notes

- This project uses Genkit 1.0, which has significant API changes from earlier versions
- Flows are defined using `ai.defineFlow()` instead of the legacy `onFlow` method
- Firebase Functions integration is done via `onCallGenkit`

## 📚 Articles

### English

- [Orchestrating Firebase and AI: 8 Genkit Architecture Patterns](https://medium.com/@nozomi-koborinai/orchestrating-firebase-and-ai-8-genkit-architecture-patterns-12e44db40345)
- [How to Develop Firebase Genkit Functions](https://medium.com/@nozomi-koborinai/how-to-develop-firebase-genkit-functions-2677b386a227)
- [Getting Started with AI Image Generation Apps on Flutter, Genkit, and Imagen 3](https://medium.com/@nozomi-koborinai/getting-started-with-ai-image-generation-apps-on-flutter-genkit-and-imagen-3-9a83c63cbdf3)

### Japanese

- [Firebase & AI のオーケストレーションを実現！Genkit アーキテクチャ 8 選](https://zenn.dev/nozomi_cobo/articles/genkit-architecture)
- [Firebase Genkit Functions 開発のすゝめ](https://zenn.dev/nozomi_cobo/articles/genkit-emulator-suite)
- [Flutter × Genkit × Imagen 3 で始める AI 画像生成アプリ開発入門](https://zenn.dev/nozomi_cobo/articles/flutter-genkit-imagen)
