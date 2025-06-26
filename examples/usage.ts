import { config } from 'dotenv';
import { CIQClient } from '../src';

config(); // Loads API key from .env if available

const apiKey = process.env.CIQ_API_KEY || '';
const client = new CIQClient(apiKey);

async function runExample() {
  try {
    // 1. Get design-time workflow
    const design = await client.getDesignTimeWorkflow();
    console.log('Design-time workflow:', design);

    // 2. Trigger workflow
    const wfId = await client.runWorkflow({ input: 'example' });
    console.log('Triggered workflow ID:', wfId);

    // 3A. Option 1: Wait until completed (blocking)
    console.log('Waiting for workflow to complete...');
    const finalStatus = await client.waitForCompletion(wfId);
    console.log('Final status (sync):', finalStatus);

    // 3B. Option 2: Background polling with callback
    // client.waitForCompletion(wfId, 3000, (result) => {
    //   console.log("Final status (callback):", result);
    // });
  } catch (error) {
    console.error('Error in CIQ client usage:', error);
  }
}

runExample();
