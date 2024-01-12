import { NextResponse } from 'next/server';

import { VECTOR_DATABASE_FIELD_NAME } from '@/constants/vector-database';
import clientPromise from '@/lib/mongodb';

import { TogetherAIService } from '../services/togetherai';

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

  const togetherAI = new TogetherAIService();
  const queryVector = await togetherAI.embed([input]);

  const client = await clientPromise;
  const db = client.db('git_glean');
  const results = await db
    .collection('files')
    .aggregate([
      {
        $vectorSearch: {
          queryVector: queryVector[0],
          path: VECTOR_DATABASE_FIELD_NAME,
          numCandidates: 100, // this should be 10-20x the limit ↓
          limit: 10, // the number of documents to return in the results
          index: 'SemanticSearch',
        },
      },
      {
        $match: {
          'metadata.repository': repositoryUrl,
        },
      },
    ])
    .toArray();

  const formattedAnswer = results.map((result) => ({
    id: result._id,
    source: result.metadata.source,
    pageContent: result.pageContent,
  }));

  return NextResponse.json(formattedAnswer);
}
