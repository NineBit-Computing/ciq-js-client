import axios, { AxiosInstance } from 'axios';
import https from 'https';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs';
import { formatError } from './utils';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

export class CIQClient {
  private apiKey: string;
  private baseUrl: string;
  private http: AxiosInstance;

  private static CIQ_HOST = 'https://datahub.ninebit.in';

  constructor(apiKey: string, baseUrl: string = CIQClient.CIQ_HOST) {
    if (!apiKey) throw new Error('API key is required');
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
      httpsAgent: agent,
    });
  }

  /**
   * Trigger a new workflow execution
   */
  async triggerWorkflow(payload: any): Promise<string> {
    try {
      const response = await this.http.post(
        '/workflow-service/trigger_workflow',
        payload,
      );
      return response.data.content;
    } catch (error) {
      this.handleError(error, 'triggerWorkflow');
    }
  }

  /**
   * Get the status and result of a running workflow
   */
  async getWorkflowStatus(wfId: string): Promise<any> {
    try {
      const response = await this.http.get(
        `/workflow-service/rt/workflows/${wfId}`,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'getWorkflowStatus');
    }
  }

  private handleError(error: any, context: string): never {
    const msg = `[CIQClient:${context}] ${error?.message || 'Unknown error'}`;
    console.error(msg);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Response:', error.response.data);
    }
    throw error;
  }

  /**
   * Polls for completion of a running workflow
   */
  async waitForCompletion(
    wfId: string,
    intervalMs: number = 2000,
    onComplete?: (err: string, result?: any) => void,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getWorkflowStatus(wfId);
          const currentState = status?.content?.status;

          if (currentState === 'success') {
            console.info(`Wofkflow ${wfId} state: ${currentState}`);
            if (onComplete) onComplete('', status.result);
            return resolve(status.result);
          } else if (currentState === 'FAILED' || currentState === 'error') {
            console.error(`Wofkflow ${wfId} state: ${currentState}`);
            if (onComplete) onComplete('Wofkflow failed');
            return reject('Wofkflow failed');
          } else {
            console.info(
              `[waitForCompletion] Wofkflow ${wfId} state: ${currentState}`,
            );
            setTimeout(poll, intervalMs);
          }
        } catch (err) {
          console.error(
            `[waitForCompletion] Error while polling status ${wfId} : ${err}`,
          );
          return reject(err);
        }
      };

      poll();
    });
  }

  async ingestFile(
    file: string,
    associatedFileName?: string,
    callback?: (err: string, result: any) => void,
  ) : Promise<any> {
    try {
      let filename: string;

      if (typeof file === 'string') {
        filename = file;
      } else {
        filename = associatedFileName || 'unknown';
      }

      const objectName = path.basename(filename);
      const contentType = mime.lookup(filename) || 'application/octet-stream';

      // Step 1: Request pre-signed URL from backend
      const presignedResponse = await this.http.post(
        '/workflow-service/generate-presigned-url',
        {
          object_name: objectName,
          content_type: contentType,
        },
      );

      const presignedUrl: string = presignedResponse.data.url;

      // Step 2: Upload file to MinIO using PUT
      let data: Buffer;
      // if (typeof file === 'string') {
      data = fs.readFileSync(file);
      // } else {
      //   if (file.seek) file.seek(0); // optional; only if custom object supports it
      //   data = await file.arrayBuffer ? Buffer.from(await file.arrayBuffer()) : Buffer.from(await file.read());
      // }

      const uploadResponse = await axios.put(presignedUrl, data, {
        headers: {
          'Content-Type': contentType,
        },
        httpsAgent: agent,
      });

      if (uploadResponse.status === 200) {
        console.info('Success: ingestFile');
        if (callback) callback('', { objectName });
        return { objectName };
      } else {
        console.error(
          `Error: ingestFile: ${uploadResponse.status} - ${uploadResponse.statusText}`,
        );
        return false;
      }
    } catch (error) {
      console.error(`Error: ingestFile: ${formatError(error)}}`);
      throw new Error('Error: ingestFile');
    }
  }

  async ragConsumeFile(
    file: string,
    associatedFileName?: string,
    callback?: (err: string, result: any) => void,
  ): Promise<void> {
    try {
      const { objectName } = await this.ingestFile(file, associatedFileName, callback);

      // Step 1: Trigger workflow
      const workspace = this.http.defaults.headers['X-API-Key'];
      const payload = {
        workflow: 'rag-consumer',
        file_path: objectName,
        workspace: workspace,
      };
      const wfId = await this.triggerWorkflow(payload);
      await this.waitForCompletion(wfId);
      if (callback)
        callback('', {
          run_id: wfId,
          workspace: workspace,
        });
    } catch (error) {
      console.error(`Error: triggerWorkflow: ${formatError(error)}}`);
      throw new Error('Error: triggerWorkflow');
    }
  }

  async ragQuery(
    query: string,
    euclideanThreshold: number = 0.9,
    topK: number = 6,
    callback?: (err: string, result?: any) => void,
  ): Promise<void> {
    const workspace = this.http.defaults.headers['X-API-Key'];
    const payload = {
      workflow: 'rag-query',
      rag_query: query,
      workspace: workspace,
      euclidean_threshold: euclideanThreshold,
      top_k: topK,
    };
    try {
      const wfId = await this.triggerWorkflow(payload);
      const response = await this.waitForCompletion(wfId);
      console.info('Success: ragQuery');
      if (callback) {
        callback('', response);
      } else {
        return response;
      }
    } catch (ex) {
      console.error(`Error: ragQuery: ${formatError(ex)}}`);
      if (callback) {
        callback(formatError(ex));
      } else {
        throw new Error('Error: ragQuery');
      }
    }
  }

  async processInvoice(
    file: string,
    associatedFileName?: string,
    callback?: (err: string, result: any) => void,
  ): Promise<void> {
    try {
      const { objectName } = await this.ingestFile(file, associatedFileName, callback);

      // Step 1: Trigger workflow
      const workspace = this.http.defaults.headers['X-API-Key'];
      const payload = {
        "workflow": "invoice-processor",
        "file_path": objectName
      };

      const wfId = await this.triggerWorkflow(payload);
      const response = await this.waitForCompletion(wfId);
      if (callback) {
        callback('', response);
      } else {
        return response;
      }
    } catch (error) {
      console.error(`Error: triggerWorkflow: ${formatError(error)}}`);
      throw new Error('Error: triggerWorkflow');
    }
  }
}
