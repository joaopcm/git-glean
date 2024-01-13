import { GithubRepoLoader } from 'langchain/document_loaders/web/github';

type IngestRepositoryInput = {
  repositoryUrl: string;
  githubAccessToken: string;
  githubBaseUrl: string;
  githubApiUrl: string;
};
type GetLoaderInput = IngestRepositoryInput;

export class GitHubService {
  constructor() {}

  private getLoader({
    repositoryUrl,
    githubAccessToken,
    githubBaseUrl,
    githubApiUrl,
  }: GetLoaderInput) {
    return new GithubRepoLoader(repositoryUrl, {
      branch: 'main',
      recursive: true,
      unknown: 'warn',
      maxConcurrency: 20,
      ignorePaths: [
        'node_modules',
        'pnpm-lock.yaml',
        'yarn.lock',
        'package-lock.json',
      ],
      accessToken: githubAccessToken || process.env.GITHUB_ACCESS_TOKEN,
      ...(!!githubApiUrl && !!githubBaseUrl
        ? {
            baseUrl: githubBaseUrl,
            apiUrl: githubApiUrl,
          }
        : {}),
    });
  }
  async ingestRepository(input: IngestRepositoryInput) {
    const loader = this.getLoader(input);

    console.time('load');
    const docs = [];
    for await (const doc of loader.loadAsStream()) {
      docs.push(doc);
    }
    console.timeEnd('load');

    console.info('loaded', docs.length, 'documents');
    return docs;
  }
}
