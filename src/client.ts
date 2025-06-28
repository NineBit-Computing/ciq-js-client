import axios, { AxiosInstance } from 'axios';

export class CIQClient {
  private apiKey: string;
  private baseUrl: string;
  private http: AxiosInstance;

  private static CIQ_HOST = "https://datahub.ninebit.in"

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
    });
  }

  /**
   * Get the design-time workflow structure
   */
  async getDesignTimeWorkflow(): Promise<any> {
    try {
      const response = await this.http.get('/workflow/design');
      return response.data;
    } catch (error) {
      this.handleError(error, 'getDesignTimeWorkflow');
    }
  }

  /**
   * Trigger a new workflow execution
   */
  async runWorkflow(payload: any): Promise<string> {
    try {
      const response = await this.http.post('/workflow/run', payload);
      return response.data.wf_id;
    } catch (error) {
      this.handleError(error, 'runWorkflow');
    }
  }

  /**
   * Get the status and result of a running workflow
   */
  async getWorkflowStatus(wfId: string): Promise<any> {
    try {
      const response = await this.http.get(`/workflow/status/${wfId}`);
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
    onComplete?: (result: any) => void,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getWorkflowStatus(wfId);
          const currentState = status?.status;

          if (currentState === 'COMPLETED' || currentState === 'FAILED') {
            if (onComplete) onComplete(status);
            return resolve(status);
          } else {
            setTimeout(poll, intervalMs);
          }
        } catch (err) {
          console.error(
            `[waitForCompletion] Error while polling status: ${err}`,
          );
          return reject(err);
        }
      };

      poll();
    });
  }

  async uploadFileToMinio(
    file: File | Blob,
    bucketName: string,
    objectName: string,
    contentType?: string
  ): Promise<boolean> {
    try {
      // Infer content type if not provided
      if (!contentType && file instanceof File) {
        contentType = file.type || "application/octet-stream";
      } else {
        contentType = contentType || "application/octet-stream";
      }

      // Step 1: Request pre-signed URL from backend
      const presignedResponse = await this.http.post("/generate-upload-url", {
        bucket_name: bucketName,
        object_name: objectName,
        content_type: contentType,
      });

      const presignedUrl: string = presignedResponse.data.url;

      // Step 2: Upload file to MinIO using PUT
      const uploadResponse = await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });

      if (uploadResponse.status === 200) {
        console.info("✅ File uploaded successfully.");
        return true;
      } else {
        console.error(
          `❌ Upload failed: ${uploadResponse.status} - ${uploadResponse.statusText}`
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return false;
    }
  }

}
