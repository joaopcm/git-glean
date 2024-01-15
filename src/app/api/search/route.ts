import { NextResponse } from 'next/server';

import { EmbeddingsService } from '../services/embeddings';

export async function POST(request: Request) {
  try {
    const { input, repositoryUrl } = await request.json();

    if (!input || !repositoryUrl) {
      return new Response(
        'You have to provide both "input" and "repositoryUrl" to perform a semantic search.',
        {
          status: 400,
        },
      );
    }

    const embeddingsService = new EmbeddingsService();
    const results = await embeddingsService.queryEmbeddings({
      query: input,
      repository: repositoryUrl,
    });
    const formattedAnswer = results.map((result) => ({
      id: result._id,
      source: result.metadata.source,
      pageContent: result.pageContent,
    }));

    return NextResponse.json(formattedAnswer);
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
