import { NextResponse } from 'next/server';

import { EmbeddingsService } from '../services/embeddings';

export async function POST(request: Request) {
  const { input, repositoryUrl } = await request.json();

  if (!input || !repositoryUrl) {
    return new Response(
      'You have to provide both "input" and "repositoryUrl" to perform a semantic search.',
      {
        status: 400,
      },
    );
  }

  const embeddingService = new EmbeddingsService();
  const results = await embeddingService.queryEmbeddings({
    query: input,
    repository: repositoryUrl,
  });
  const formattedAnswer = results.map((result) => ({
    id: result._id,
    source: result.metadata.source,
    pageContent: result.pageContent,
  }));

  return NextResponse.json(formattedAnswer);
}
