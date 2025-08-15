import { config } from 'dotenv';
import { CIQClient } from '../src/client';

config(); // Loads API key from .env if available
let client: CIQClient;
try {
  console.log('API_KEY exists:', Boolean(process.env.API_KEY));
  const apiKey = process.env.API_KEY || '';
  client = new CIQClient(apiKey);
  console.log('CIQClient initialised success');
} catch (ex) {
  console.error('Could not initialise CIQClient', ex);
  process.exit(1);
}

async function runRAGExample() {
  try {
    await client.ragConsumeFile('assets/eco101.pdf');
    const query =
      'When was India’s first official census operation undertaken?';
    const response = await client.ragQuery(query);
    console.log('Query response is ', response);
  } catch (error) {
    console.error('Error in CIQ example:', error);
    process.exit(1);
  }
}

async function runInvoiceProcessingExample() {
  try {
    const response = await client.processInvoice('assets/SupplyTech_1.pdf');
    console.log('Invoice processing response is ', response);
  } catch (error) {
    console.error('Error in CIQ example:', error);
    process.exit(1);
  }
}

async function runExamples() {
  await runRAGExample();
  console.log('RAG Example run successfully!');
  await runInvoiceProcessingExample();
  console.log('Invoice Processing Example run successfully!');
}

runExamples();
