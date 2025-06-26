import { CIQClient } from '../src/client';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CIQClient', () => {
  const apiKey = 'test-key';
  const baseUrl = 'https://fake-ciq.com';

  const mockHttp = {
    get: jest.fn(),
    post: jest.fn(),
    defaults: { headers: { common: {} } },
  };

  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockHttp as any);
    jest.clearAllMocks();
  });

  test('getDesignTimeWorkflow returns JSON', async () => {
    mockHttp.get.mockResolvedValue({ data: { content: 'workflow-json' } });

    const client = new CIQClient(apiKey, baseUrl);
    const result = await client.getDesignTimeWorkflow();

    expect(result).toEqual({ content: 'workflow-json' });
    expect(mockHttp.get).toHaveBeenCalledWith('/workflow/design');
  });

  test('runWorkflow returns wf_id', async () => {
    mockHttp.post.mockResolvedValue({ data: { wf_id: '12345' } });

    const client = new CIQClient(apiKey, baseUrl);
    const wfId = await client.runWorkflow({ input: 'data' });

    expect(wfId).toBe('12345');
    expect(mockHttp.post).toHaveBeenCalledWith('/workflow/run', {
      input: 'data',
    });
  });

  test('getWorkflowStatus returns status', async () => {
    mockHttp.get.mockResolvedValue({ data: { status: 'COMPLETED' } });

    const client = new CIQClient(apiKey, baseUrl);
    const status = await client.getWorkflowStatus('wf-123');

    expect(status.status).toBe('COMPLETED');
    expect(mockHttp.get).toHaveBeenCalledWith('/workflow/status/wf-123');
  });

  test('waitForCompletion resolves when status is COMPLETED', async () => {
    mockHttp.get
      .mockResolvedValueOnce({ data: { status: 'RUNNING' } })
      .mockResolvedValueOnce({ data: { status: 'COMPLETED' } });

    const client = new CIQClient(apiKey, baseUrl);
    const result = await client.waitForCompletion('wf-abc', 10);

    expect(result.status).toBe('COMPLETED');
    expect(mockHttp.get).toHaveBeenCalledTimes(2);
  });
});
