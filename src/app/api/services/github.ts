import { Document } from '@langchain/core/documents';

import {
  DIRECTORIES_TO_IGNORE,
  SIZE_LIMIT,
  SUPPORTED_PROGRAMMING_LANGUAGES,
} from '@/constants/file-filtering';

type GitHubAPIRepositoryResponse = {
  default_branch: string;
};
type GitHubAPITreeResponse = {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size?: number;
    url: string;
  }[];
};

type GitHubServiceInput = {
  repositoryUrl: string;
};
type GetRequestHeadersInput = {
  accept?: string;
};
type FilterTreeInput = GitHubAPITreeResponse['tree'];
type ProcessBlobsInput = {
  owner: string;
  repo: string;
  tree: GitHubAPITreeResponse['tree'];
  concurrency?: number;
};

export class GitHubService {
  apiBaseUrl = 'https://api.github.com';
  repositoryUrl: string;

  constructor({ repositoryUrl }: GitHubServiceInput) {
    this.repositoryUrl = repositoryUrl;
  }

  private getRequestHeaders({ accept }: GetRequestHeadersInput) {
    return {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      Accept: accept || 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'GitGlean',
    };
  }

  private extractRepositoryInfo() {
    const [owner, repo] = this.repositoryUrl.split('/').slice(-2);
    return { owner, repo };
  }

  private async findDefaultBranch() {
    const { owner, repo } = this.extractRepositoryInfo();
    const response = await fetch(`${this.apiBaseUrl}/repos/${owner}/${repo}`, {
      headers: this.getRequestHeaders({}),
    });

    if (!response.ok) {
      console.error(await response.json());
      throw new Error(`Could not fetch repository info for ${owner}/${repo}.`);
    }

    const result = (await response.json()) as GitHubAPIRepositoryResponse;
    return result.default_branch;
  }

  private filterTree(tree: FilterTreeInput) {
    const result = tree.filter((entry) => {
      // Check file extension
      if (
        !SUPPORTED_PROGRAMMING_LANGUAGES.some((extension) =>
          entry.path.endsWith(extension),
        )
      )
        return false;

      // Check directory
      if (DIRECTORIES_TO_IGNORE.some((dir) => entry.path.includes(`/${dir}/`)))
        return false;

      // Check size
      if (entry.size !== undefined && entry.size > SIZE_LIMIT) return false;

      // Check type
      return entry.type === 'blob';
    });
    console.info(
      `Filtered ${tree.length} files down to ${result.length} files`,
    );

    return result;
  }

  private async processBlobs({
    owner,
    repo,
    tree,
    concurrency = 50,
  }: ProcessBlobsInput) {
    let activePromises = 0;
    let index = 0;
    const files: Document[] = [];

    return new Promise<Document[]>((resolve, reject) => {
      const processNext = async () => {
        if (index === tree.length) {
          if (activePromises === 0) resolve(files);
          return;
        }

        const entry = tree[index++];
        activePromises++;
        try {
          const response = await fetch(
            `${this.apiBaseUrl}/repos/${owner}/${repo}/contents/${entry.path}`,
            {
              headers: this.getRequestHeaders({
                accept: 'application/vnd.github.raw',
              }),
            },
          );

          files.push(
            new Document({
              pageContent: await response.text(),
              metadata: {
                source: entry.path,
                repository: this.repositoryUrl,
              },
            }),
          );
        } catch (err) {
          reject(err);
          // TODO: add retry logic
        }

        activePromises--;
        processNext();
      };

      for (let i = 0; i < Math.min(concurrency, tree.length); i++)
        processNext();
    });
  }

  async ingestRepository() {
    console.time('Ingesting repository took');
    const { owner, repo } = this.extractRepositoryInfo();
    const defaultBranch = await this.findDefaultBranch();

    const response = await fetch(
      `${this.apiBaseUrl}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      {
        headers: this.getRequestHeaders({}),
      },
    );

    if (!response.ok) {
      console.error(await response.json());
      throw new Error(
        `Could not fetch repository tree for ${owner}/${repo} on branch ${defaultBranch}.`,
      );
    }

    const result = (await response.json()) as GitHubAPITreeResponse;
    const tree = this.filterTree(result.tree);
    const blobs = await this.processBlobs({
      owner,
      repo,
      tree,
    });
    console.timeEnd('Ingesting repository took');
    return blobs;
  }
}
