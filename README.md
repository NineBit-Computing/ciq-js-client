# 🔗 ciq-js-client

**Official Node.js SDK for interacting with [NineBit CIQ](https://ciq.ninebit.in)** — a secure, enterprise-grade orchestration platform for AI/ML workflows and rapid prototyping with your data.

---

## 🚀 Features

- Simple SDK to interact with CIQ’s API via REST
- Designed for enterprise-grade data workflows
- Supports:
  - Fetching design-time workflow
  - Triggering workflows
  - Polling workflow status (with async wait support)
- Built with TypeScript
- Includes CLI & fully tested with Jest

---

## 📦 Installation

```bash
npm install ninebit-ciq
```

## 🔧 Usage (Node.js)

```ts
import { CIQClient } from 'ninebit-ciq';

const client = new CIQClient({
  apiKey: 'YOUR_API_KEY',
});

(async () => {
  const design = await client.getDesignTimeWorkflow();
  console.log('Workflow design:', design);

  const wfId = await client.runWorkflow({ input: 'your data here' });

  const status = await client.getWorkflowStatus(wfId);
  console.log('Current status:', status);
})();
```

## 🔁 Usage with Callback (Async Wait)

```ts
await client.waitForCompletion(wfId, 1000, (status) => {
  console.log('Status changed:', status.status);
});
```

## 🧪 Running Tests

```
npm run test
npm run test:coverage
```

## 🛠 Developer Setup

If you're contributing to this SDK, see DEVELOPER.md for full setup, linting, formatting, and test instructions.

## 📄 API Reference

| Method                                          | Description                       |
| ----------------------------------------------- | --------------------------------- |
| `getDesignTimeWorkflow()`                       | Fetch workflow design (JSON)      |
| `runWorkflow(input)`                            | Trigger workflow, returns `wf_id` |
| `getWorkflowStatus(wf_id)`                      | Check current status or result    |
| `waitForCompletion(wf_id, interval, onUpdate?)` | Poll until completion             |

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

Email us at support@ninebit.in or visit ciq.ninebit.in

© NineBit Computing, 2025
