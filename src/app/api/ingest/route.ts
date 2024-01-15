import { NextResponse } from 'next/server';

import { VECTOR_DATABASE_FIELD_NAME } from '@/constants/vector-database';

import { EmbeddingsService } from '../services/embeddings';
import { GitHubService } from '../services/github';

export async function POST(request: Request) {
  try {
    const { repositoryUrl } = await request.json();

    if (!repositoryUrl) {
      return new Response(
        'You have to provide a "repositoryUrl" to ingest a repository.',
        {
          status: 400,
        },
      );
    }

    const github = new GitHubService({ repositoryUrl });
    const docs = await github.ingestRepository();

    const embeddingsService = new EmbeddingsService();
    const chunks = await embeddingsService.generateChunks(docs);
    const embeddings = await embeddingsService.generateEmbeddings(chunks);

    const chunksWithEmbeddings = chunks.map((doc, index) => ({
      ...doc,
      [VECTOR_DATABASE_FIELD_NAME]: embeddings[index],
    }));
    void embeddingsService.upsertEmbeddings(chunksWithEmbeddings);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, {
        status: 500,
      });
    }

    return new Response('Unknown error', {
      status: 500,
    });
  }
}
