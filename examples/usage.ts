import { config } from 'dotenv';
import { CIQClient } from '../src/client';

config(); // Loads API key from .env if available
let client: CIQClient;
try {
  const apiKey = process.env.API_KEY || '';
  client = new CIQClient(apiKey);
  console.log("CIQClient initialised success");
} catch (ex) {
  console.error("Could not initialise CIQClient");
}


async function runExample() {
  try {
    await client.ingestFile("examples/files/eco101.pdf");
    const query = "When was India’s first official census operation undertaken?"
    const response = await client.ragQuery(query)
    console.log("Query response is ", response);
  } catch (error) {
    console.error('Error in CIQ example:', error);
  }
}

runExample();
