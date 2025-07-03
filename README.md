# Node TypeScript SDK for RAG (Retrieval Augmented Generation)

![](banner.png)
[![npm](https://img.shields.io/npm/v/@ninebit/ciq)](https://www.npmjs.com/package/@ninebit/ciq)
[![downloads](https://img.shields.io/npm/dm/@ninebit/ciq)](https://www.npmjs.com/package/@ninebit/ciq)
[![build](https://img.shields.io/github/actions/workflow/status/NineBit-Computing/ciq-js-client/ci.yml?branch=main)](https://github.com/NineBit-Computing/ciq-js-client/actions)
[![license](https://img.shields.io/npm/l/@ninebit/ciq)](https://github.com/NineBit-Computing/ciq-js-client/blob/main/LICENSE)
![typescript](https://img.shields.io/badge/types-TypeScript-blue)
![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![husky](https://img.shields.io/badge/husky-enabled-brightgreen?logo=git&logoColor=white)

## 🔗 @ninebit/ciq

**Official Node.js SDK for interacting with [NineBit CIQ](https://ciq.ninebit.in?utm_source=npm)** — a Retrieval-Augmented Generation (RAG) workflow orchestration platform for secure, private, rapid prototyping of AI/ML ideas using enterprise data and open-source models.

## 🚀 Features

- Retrieval-Augmented Generation (RAG)
  Perform semantic search and intelligent query answering using hybrid retrieval techniques.
- Flexible Query Interface
  Send queries with configurable similarity thresholds and top_k result tuning.
- Callback Support for Asynchronous Workflows
  Pass in callbacks to handle results or errors once workflows complete — ideal for event-driven applications.
- Workflow Polling with Timeout Control
  Monitor long-running workflows with built-in polling, status checking, and customizable timeouts.
- Simple, Extensible API
  Clean, Pythonic interfaces with support for both synchronous returns and optional callbacks.
- Error-Handled Execution Flow
  Graceful handling of task failures, timeouts, and unexpected states with descriptive exceptions.
- Logging Support
  Integrated logging for easy debugging and transparency during polling or querying.

## 📦 Installation

```bash
npm install @ninebit/ciq
```

## 🔧 Quickstart (Node.js)

```ts
//  Use import for ESM
import { CIQClient } from '@ninebit/ciq';

//  Use require() for CommonJS
const { CIQClient } = require('@ninebit/ciq');

const apiKey = process.env.API_KEY || '';
const client = new CIQClient(apiKey);

async function runExample() {
  try {
    await client.ingestFile('files/eco101.pdf');
    const query = 'Your Query String?';
    const response = await client.ragQuery(query);
    console.log('Query response is ', response);
  } catch (error) {
    console.error('Error in CIQ:', error);
  }
}

runExample();
```

## 🔐 Authentication - You’ll Need an API Key

If you’re using the Freemium CIQ setup, you’ll just need to register at our web app and grab your API key. It’s quick, and no credit card is required.

You can sign up here [NineBit CIQ](https://ciq.ninebit.in?utm_source=npm)

## 🧪 Running Tests

```
npm run test
npm run test:coverage
```

## 🛠 Developer Setup

If you're contributing to this SDK, see DEVELOPER.md for full setup, linting, formatting, and test instructions.

## 📄 API Reference

| Method                   | Description                                                                     |
| ------------------------ | ------------------------------------------------------------------------------- |
| `ingestFile(file_path)`  | Reads and uploads a PDF or DOCX file to the backend for processing.             |
| `ragQuery(query_string)` | Performs a Retrieval-Augmented Generation (RAG) query using the provided input. |

## ⚙️ Configuration

| Option    | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `apiKey`  | string | ✅       | Your CIQ API Key                    |
| `baseUrl` | string | ❌       | Optional (default: CIQ backend URL) |

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome! Please check DEVELOPER.md and ensure:

- Tests pass
- Lint/format clean
- Coverage is not broken

## 📬 Questions?

Email us at support@ninebit.in or visit [NineBit Computing](https://ninebit.in?utm_source=npm)

© NineBit Computing, 2025
