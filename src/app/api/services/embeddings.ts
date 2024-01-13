import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { VECTOR_DATABASE_FIELD_NAME } from '@/constants/vector-database';
import clientPromise from '@/lib/mongodb';

import { TogetherAIService } from './togetherai';

type GetTextSplitterInput = Document[];
type GenerateChunksInput = GetTextSplitterInput;
type GenerateEmbeddingsInput = Document[];
type UpsertEmbeddingsInput = {
  pageContent: string;
  metadata: Record<string, any>;
  [VECTOR_DATABASE_FIELD_NAME]: number[];
}[];
type QueryEmbeddingsInput = {
  query: string;
  repository: string;
};

export class EmbeddingsService {
  private chunkSize = 256;
  private chunkOverlap = 32;
  private togetherAIService: TogetherAIService;

  constructor() {
    this.togetherAIService = new TogetherAIService();
  }

  private async getTextSplitter(documents: GetTextSplitterInput) {
    return new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap,
    });
  }

  private transformContent(content: string) {
    return content.replace(/\n/g, ' ');
  }

  async generateChunks(documents: GenerateChunksInput) {
    const splitter = await this.getTextSplitter(documents);
    const chunks = await splitter.splitDocuments(documents);
    return chunks;
  }

  async generateEmbeddings(chunks: GenerateEmbeddingsInput) {
    const embeddings = await this.togetherAIService.embed(
      chunks.map((chunk) => this.transformContent(chunk.pageContent)),
    );
    return embeddings;
  }

  async upsertEmbeddings(documentsWithEmbeddings: UpsertEmbeddingsInput) {
    const client = await clientPromise;
    const db = client.db('git_glean');

    const repository = documentsWithEmbeddings[0].metadata.repository;

    const repositoryAlreadyLoaded = await db.collection('files').findOne({
      'metadata.repository': repository,
    });

    if (!!repositoryAlreadyLoaded) {
      await db.collection('files').deleteMany({
        'metadata.repository': repository,
      });
    }

    await db.collection('files').insertMany(documentsWithEmbeddings);
  }

  async queryEmbeddings({ query, repository }: QueryEmbeddingsInput) {
    const client = await clientPromise;
    const db = client.db('git_glean');

    const queryVector = await this.togetherAIService.embed([query]);
    const results = await db
      .collection('files')
      .aggregate([
        {
          $vectorSearch: {
            queryVector: queryVector[0],
            path: VECTOR_DATABASE_FIELD_NAME,
            numCandidates: 1000, // this should be 10-20x the limit ↓
            limit: 100, // the number of documents to return in the results
            index: 'SemanticSearch',
          },
        },
        {
          $match: {
            'metadata.repository': repository,
          },
        },
      ])
      .toArray();

    const resultsBySource: Record<string, (typeof results)[0]> = {};
    results.forEach((result) => {
      if (!resultsBySource[result.metadata.source]) {
        resultsBySource[result.metadata.source] = result;
      }
    });
    const resultsBySourceArray = Object.values(resultsBySource).slice(0, 10);
    return resultsBySourceArray;
  }
}
