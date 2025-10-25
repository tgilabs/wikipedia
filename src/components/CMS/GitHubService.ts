import { Octokit } from '@octokit/rest';

interface PRResult {
  number: number;
  url: string;
  html_url: string;
  state: string;
}

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(owner: string, repo: string, githubToken?: string) {
    this.owner = owner;
    this.repo = repo;
    
    // Use a personal access token if provided (for creating PRs)
    // Otherwise, create unauthenticated client (for reading public repos)
    this.octokit = new Octokit({
      auth: githubToken,
    });
  }

  /**
   * Create a new branch from the base branch
   */
  async createBranch(branchName: string, baseBranch: string = 'Production'): Promise<void> {
    // Get the SHA of the base branch
    const { data: refData } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${baseBranch}`,
    });

    // Create a new branch
    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: refData.object.sha,
    });
  }

  /**
   * Update a file in a branch
   */
  async updateFile(
    filePath: string,
    content: string,
    branchName: string,
    commitMessage: string
  ): Promise<void> {
    // Get the current file to get its SHA (required for updating)
    let sha: string | undefined;
    try {
      const { data: fileData } = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path: filePath,
        ref: branchName,
      });

      if ('sha' in fileData) {
        sha = fileData.sha;
      }
    } catch (err) {
      // File doesn't exist, that's okay for new files
      sha = undefined;
    }

    // Update or create the file
    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path: filePath,
      message: commitMessage,
      content: btoa(unescape(encodeURIComponent(content))), // Encode to base64
      branch: branchName,
      sha,
    });
  }

  /**
   * Create a pull request
   */
  async createPullRequest(
    title: string,
    body: string,
    headBranch: string,
    baseBranch: string = 'Production'
  ): Promise<PRResult> {
    const { data } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head: headBranch,
      base: baseBranch,
    });

    return {
      number: data.number,
      url: data.url,
      html_url: data.html_url,
      state: data.state,
    };
  }

  /**
   * Get the status of a pull request
   */
  async getPullRequestStatus(prNumber: number): Promise<{
    state: string;
    merged: boolean;
    mergeable: boolean | null;
    html_url: string;
  }> {
    const { data } = await this.octokit.pulls.get({
      owner: this.owner,
      repo: this.repo,
      pull_number: prNumber,
    });

    return {
      state: data.state,
      merged: data.merged,
      mergeable: data.mergeable,
      html_url: data.html_url,
    };
  }

  /**
   * Complete workflow: Create branch, update file, and create PR
   */
  async submitChange(
    filePath: string,
    content: string,
    commitMessage: string,
    prTitle: string,
    prBody: string,
    discordUsername: string
  ): Promise<PRResult> {
    // Generate a unique branch name
    const timestamp = Date.now();
    const branchName = `cms-edit/${discordUsername}/${timestamp}`;

    try {
      // Step 1: Create branch
      await this.createBranch(branchName);

      // Step 2: Update the file
      await this.updateFile(filePath, content, branchName, commitMessage);

      // Step 3: Create pull request
      const pr = await this.createPullRequest(
        prTitle,
        prBody,
        branchName,
        'Production'
      );

      return pr;
    } catch (error) {
      console.error('Failed to submit change:', error);
      throw error;
    }
  }
}

// Singleton instance that can be configured
let githubService: GitHubService | null = null;

export function initializeGitHubService(owner: string, repo: string, githubToken?: string) {
  githubService = new GitHubService(owner, repo, githubToken);
  return githubService;
}

export function getGitHubService(): GitHubService {
  if (!githubService) {
    throw new Error('GitHubService not initialized. Call initializeGitHubService first.');
  }
  return githubService;
}
