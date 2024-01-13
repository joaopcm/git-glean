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
  private embeddingLLM = 'sentence-transformers/msmarco-bert-base-dot-v5';
  private batchSize = 5;

  constructor() {
    this.baseUrl = 'https://api.together.xyz/v1';
    this.apiKey = process.env.TOGETHER_AI_API_KEY as string;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });
  }

  async embed(allTexts: string[]) {
    const chunkedTexts = [];
    for (let i = 0; i < allTexts.length; i += this.batchSize) {
      chunkedTexts.push(allTexts.slice(i, i + this.batchSize));
    }

    const promises = chunkedTexts.map(async (texts, index) => {
      const data = {
        model: this.embeddingLLM,
        input: texts,
      };

      const options = {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data),
      };

      console.time(`embeddings-${index}`);
      const response = await fetch(`${this.baseUrl}/embeddings`, options);
      console.timeEnd(`embeddings-${index}`);

      const result = (await response.json()) as EmbeddingsAPIResponse;
      return result.data.map((item) => item.embedding);
    });

    console.time('embeddings-general');
    const results = await Promise.all(promises);
    console.timeEnd('embeddings-general');
    return results.flat();
  }
}
