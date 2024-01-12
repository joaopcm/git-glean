type EmbeddingsAPIResponse = {
  object: 'list';
  data: {
    object: 'embedding';
    embedding: number[];
    index: number;
  }[];
  model: string;
  request_id: string;
};

export class TogetherAIService {
  private baseUrl: string;
  private apiKey: string;
  private headers: Headers;

  constructor() {
    this.baseUrl = 'https://api.together.xyz/v1';
    this.apiKey = process.env.TOGETHER_AI_API_KEY as string;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  async embed(texts: string[]) {
    const data = {
      // list of all the available embeddings models → https://docs.together.ai/docs/embedding-models
      model: 'sentence-transformers/msmarco-bert-base-dot-v5',
      input: texts,
    };

    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    };

    console.time('embeddings');
    const response = await fetch(`${this.baseUrl}/embeddings`, options);
    console.timeEnd('embeddings');
    const result = (await response.json()) as EmbeddingsAPIResponse;
    return result.data.map((item) => item.embedding);
  }
}
