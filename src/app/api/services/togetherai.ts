import { EMBEDDING_MODEL_NAME } from '@/constants/embeddings';

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
  private batchSize = 25;

  constructor() {
    this.baseUrl = 'https://api.together.xyz/v1';
    this.apiKey = process.env.TOGETHER_AI_API_KEY as string;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  private async processBatch(texts: string[], index: number) {
    const data = {
      model: EMBEDDING_MODEL_NAME,
      input: texts,
    };
    const options = {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    };
    const response = await fetch(`${this.baseUrl}/embeddings`, options);

    if (!response.ok) {
      console.error(await response.json());
      throw new Error(`Could not generate embeddings for batch ${index + 1}`);
    }

    const result = (await response.json()) as EmbeddingsAPIResponse;
    return result.data.map((item) => item.embedding);
  }

  async embed(allTexts: string[]) {
    const chunkedTexts = [];
    for (let i = 0; i < allTexts.length; i += this.batchSize) {
      chunkedTexts.push(allTexts.slice(i, i + this.batchSize));
    }

    console.info(`Generating ${chunkedTexts.length} batches of embeddings`);
    const promises = chunkedTexts.map(
      (texts, index, array) =>
        new Promise<number[][]>((resolve, reject) => {
          setTimeout(
            async () => {
              try {
                const result = await this.processBatch(texts, index);
                resolve(result);
              } catch (err) {
                reject(err);
              }
            },
            (2000 / array.length) * index,
          );
        }),
    );
    console.time(`${chunkedTexts.length} batches of embeddings took`);
    const results = await Promise.all(promises);
    console.timeEnd(`${chunkedTexts.length} batches of embeddings took`);

    return results.flat();
  }
}
