# Developer Guide — @ninebit/ciq Client

This document provides handy commands and tips for developers working on the Node.js TypeScript client.

---

## 🛠️ Setup & Install Dependencies

```bash
npm install
```

## 🔍 Linting & Formatting

Check lint errors:

```
npm run lint

```

Fix lint and format issues automatically:

```
npm run format:fix
```

Check if files are properly formatted (Prettier):

```
npm run format
```

## ✅ Type Checking

Run TypeScript compiler in check-only mode (no output files):
npm run type-check

## 🧪 Testing

Run all tests:

```
npm test
```

Run tests with coverage report:

```
npm run test:coverage
```

Run tests and enforce minimum coverage threshold:

```
npm run check-coverage
```

## 🔄 Git Hooks & Pre-commit

Pre-commit hook automatically runs:

- Linting & auto-fix on staged files
- Formatting with Prettier on staged files
- Full type check
- Tests with coverage enforcement

To manually run all pre-commit checks (without committing):

```
npm run lint && npm run format && npm run type-check && npm run check-coverage
```

## Publish

```
npm publish --access public
```

## 📁 Useful Configuration Files

- .eslintrc.json — ESLint rules and setup
- .prettierrc — Prettier formatting rules
- tsconfig.json — TypeScript compiler options
- jest.config.js — Jest test runner config
- .husky/ — Git hooks powered by Husky
- .lintstagedrc or lint-staged config in package.json

🚀 Tips

- Use your IDE/Editor integration for ESLint & Prettier for real-time feedback
- Run npm run format:fix before commits to avoid formatting conflicts
- Keep tests and coverage passing before pushing your changes

## Happy coding! 🚀
