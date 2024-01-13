import { NextResponse } from 'next/server';

import { VECTOR_DATABASE_FIELD_NAME } from '@/constants/vector-database';

import { EmbeddingsService } from '../services/embeddings';
import { GitHubService } from '../services/github';

export async function POST(request: Request) {
  try {
    const { repositoryUrl, githubAccessToken, githubBaseUrl, githubApiUrl } =
      await request.json();

    if (!repositoryUrl) {
      return new Response(
        'You have to provide a "repositoryUrl" to ingest a repository.',
        {
          status: 400,
        },
      );
    }

    const github = new GitHubService();
    const docs = await github.ingestRepository({
      repositoryUrl,
      githubAccessToken,
      githubBaseUrl,
      githubApiUrl,
    });

    const embeddingsService = new EmbeddingsService();
    const chunks = await embeddingsService.generateChunks(docs);
    const embeddings = await embeddingsService.generateEmbeddings(chunks);

    const chunksWithEmbeddings = chunks.map((doc, index) => ({
      ...doc,
      [VECTOR_DATABASE_FIELD_NAME]: embeddings[index],
    }));
    await embeddingsService.upsertEmbeddings(chunksWithEmbeddings);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
