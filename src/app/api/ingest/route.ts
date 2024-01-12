import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { NextResponse } from 'next/server';

import { VECTOR_DATABASE_FIELD_NAME } from '@/constants/vector-database';
import clientPromise from '@/lib/mongodb';

import { TogetherAIService } from '../services/togetherai';

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

    const loader = new GithubRepoLoader(repositoryUrl, {
      branch: 'main', // could be dynamic
      recursive: true,
      unknown: 'warn',
      maxConcurrency: 10,
      ignorePaths: [
        // could be dynamic
        'node_modules',
        'pnpm-lock.yaml',
        'yarn.lock',
        'package-lock.json',
      ],
      accessToken: githubAccessToken || process.env.GITHUB_ACCESS_TOKEN,
      // in order to load enterprise repos, we provide the base and api url
      ...(!!githubApiUrl && !!githubBaseUrl
        ? {
            baseUrl: githubBaseUrl,
            apiUrl: githubApiUrl,
          }
        : {}),
    });

    // stream the documents in a memory-efficient manner
    const docs = [];
    for await (const doc of loader.loadAsStream()) {
      const text = `Repository: ${doc.metadata.repository}
File: ${doc.metadata.source}

File content:
\`\`\`
${doc.pageContent}
\`\`\``;

      docs.push({
        ...doc,
        text,
      });
    }

    console.log('loaded', docs.length, 'documents');
    const togetherAI = new TogetherAIService();
    const embeddings = await togetherAI.embed(docs.map((doc) => doc.text));
    const docsWithEmbeddings = docs.map((doc, index) => ({
      ...doc,
      [VECTOR_DATABASE_FIELD_NAME]: embeddings[index],
    }));

    const client = await clientPromise;
    const db = client.db('git_glean');

    const repositoryAlreadyLoaded = await db
      .collection('files')
      .findOne({ 'metadata.repository': docs[0].metadata.repository });

    if (!!repositoryAlreadyLoaded) {
      await db.collection('files').deleteMany({
        'metadata.repository': docs[0].metadata.repository,
      });
    }

    await db.collection('files').insertMany(docsWithEmbeddings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}
