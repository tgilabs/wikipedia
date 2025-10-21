import { Octokit } from '@octokit/rest';

class GitHubService {
  private octokit: Octokit | null = null;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor() {
    this.owner = process.env.GITHUB_OWNER || 'tgilabs';
    this.repo = process.env.GITHUB_REPO || 'wikipedia';
    this.branch = process.env.GITHUB_BRANCH || 'Production';
  }

  initialize(token: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async listFiles(path: string = 'docs'): Promise<any[]> {
    if (!this.octokit) {
      throw new Error('GitHub service not initialized. Please provide a token.');
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      });

      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async getFileContent(path: string): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub service not initialized. Please provide a token.');
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: path,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        throw new Error('Path is a directory, not a file');
      }

      if (response.data.type === 'file' && response.data.content) {
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }

      throw new Error('Unable to read file content');
    } catch (error) {
      console.error('Error getting file content:', error);
      throw error;
    }
  }

  async updateFile(
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('GitHub service not initialized. Please provide a token.');
    }

    try {
      // Get current file SHA if not provided
      if (!sha) {
        const currentFile = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: path,
          ref: this.branch,
        });

        if (Array.isArray(currentFile.data) || currentFile.data.type !== 'file') {
          throw new Error('Invalid file path');
        }

        sha = currentFile.data.sha;
      }

      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: path,
        message: message,
        content: Buffer.from(content).toString('base64'),
        sha: sha,
        branch: this.branch,
      });
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  async createFile(path: string, content: string, message: string): Promise<void> {
    if (!this.octokit) {
      throw new Error('GitHub service not initialized. Please provide a token.');
    }

    try {
      await this.octokit.repos.createOrUpdateFileContents({
        owner: this.owner,
        repo: this.repo,
        path: path,
        message: message,
        content: Buffer.from(content).toString('base64'),
        branch: this.branch,
      });
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }

  async deleteFile(path: string, message: string, sha?: string): Promise<void> {
    if (!this.octokit) {
      throw new Error('GitHub service not initialized. Please provide a token.');
    }

    try {
      // Get current file SHA if not provided
      if (!sha) {
        const currentFile = await this.octokit.repos.getContent({
          owner: this.owner,
          repo: this.repo,
          path: path,
          ref: this.branch,
        });

        if (Array.isArray(currentFile.data) || currentFile.data.type !== 'file') {
          throw new Error('Invalid file path');
        }

        sha = currentFile.data.sha;
      }

      await this.octokit.repos.deleteFile({
        owner: this.owner,
        repo: this.repo,
        path: path,
        message: message,
        sha: sha,
        branch: this.branch,
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

export const githubService = new GitHubService();
