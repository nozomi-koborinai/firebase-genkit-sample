# firebase-genkit-sample

## Article
- [English](https://medium.com/@kobofender/orchestrating-firebase-and-ai-8-genkit-architecture-patterns-12e44db40345)
- [Japanese](https://zenn.dev/nozomi_cobo/articles/genkit-architecture)

## Directory Structure

```plain
firebase-genkit-sample/
├── functions/
│ ├── src/
│ │ ├── genkit-functions/
│ │ └── utils/
│ └── prompts/
├── terraform/
└── README.md
```

## Key Directories and Files

- `functions/`: Contains Cloud Run Functions for Firebase code
  - `src/genkit-functions/`: Genkit function implementations
  - `src/utils/`: Utility functions and helpers
  - `prompts/`: AI prompt templates
- `terraform/`: Terraform configuration for infrastructure setup (not directly related to Genkit, but used for setting up the overall Firebase project infrastructure)
- `README.md`: This file, providing an overview of the project
