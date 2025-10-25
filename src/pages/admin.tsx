import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import DiscordAuth from '../components/CMS/DiscordAuth';
import FileBrowser from '../components/CMS/FileBrowser';
import MarkdownEditor from '../components/CMS/MarkdownEditor';
import { initializeGitHubService, getGitHubService } from '../components/CMS/GitHubService';
import './admin.css';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface EditingFile {
  path: string;
  originalContent: string;
  currentContent: string;
  metadata: {
    title?: string;
    sidebar_position?: number;
  };
}

interface SubmittedPR {
  number: number;
  url: string;
  html_url: string;
  filePath: string;
  timestamp: number;
}

const REPO_OWNER = 'tgilabs';
const REPO_NAME = 'wikipedia';

export default function Admin() {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedPRs, setSubmittedPRs] = useState<SubmittedPR[]>([]);
  const [showPRStatus, setShowPRStatus] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem('discord_token');
    const savedUser = localStorage.getItem('discord_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    // Load submitted PRs from localStorage
    const savedPRs = localStorage.getItem('submitted_prs');
    if (savedPRs) {
      setSubmittedPRs(JSON.parse(savedPRs));
    }

    // Initialize GitHub service with bot token
    const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
    initializeGitHubService(REPO_OWNER, REPO_NAME, githubToken);
  }, []);

  const handleAuthSuccess = (discordUser: DiscordUser, discordToken: string) => {
    setUser(discordUser);
    setToken(discordToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('discord_user');
    setUser(null);
    setToken(null);
    setEditingFile(null);
  };

  const handleFileSelect = (filePath: string, content: string) => {
    // Parse frontmatter
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    let metadata = {};
    let bodyContent = content;

    if (match) {
      const frontmatter = match[1];
      bodyContent = match[2];

      // Parse YAML frontmatter (simple parser)
      frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          const trimmedKey = key.trim();
          
          if (trimmedKey === 'title') {
            metadata[trimmedKey] = value.replace(/['"]/g, '');
          } else if (trimmedKey === 'sidebar_position') {
            metadata[trimmedKey] = parseInt(value, 10);
          }
        }
      });
    }

    setEditingFile({
      path: filePath,
      originalContent: content,
      currentContent: bodyContent,
      metadata,
    });
  };

  const handleContentChange = (newContent: string) => {
    if (editingFile) {
      setEditingFile({
        ...editingFile,
        currentContent: newContent,
      });
    }
  };

  const handleMetadataChange = (field: string, value: any) => {
    if (editingFile) {
      setEditingFile({
        ...editingFile,
        metadata: {
          ...editingFile.metadata,
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async () => {
    if (!editingFile || !user) return;

    setIsSaving(true);

    try {
      // Reconstruct the file with frontmatter
      let finalContent = '';
      
      if (Object.keys(editingFile.metadata).length > 0) {
        finalContent = '---\n';
        
        if (editingFile.metadata.title) {
          finalContent += `title: "${editingFile.metadata.title}"\n`;
        }
        
        if (editingFile.metadata.sidebar_position !== undefined) {
          finalContent += `sidebar_position: ${editingFile.metadata.sidebar_position}\n`;
        }
        
        finalContent += '---\n\n';
      }
      
      finalContent += editingFile.currentContent;

      const github = getGitHubService();
      const fileName = editingFile.path.split('/').pop() || 'file';
      
      const pr = await github.submitChange(
        editingFile.path,
        finalContent,
        `Update ${fileName} via CMS`,
        `📝 CMS Edit: ${editingFile.metadata.title || fileName}`,
        `### שינוי שבוצע על ידי ${user.username} דרך CMS\n\n**קובץ:** ${editingFile.path}\n**כותרת:** ${editingFile.metadata.title || 'ללא כותרת'}\n\n---\n\nשינוי זה בוצע באמצעות מערכת ניהול התוכן המותאמת אישית עם אימות Discord.`,
        user.username
      );

      // Save PR info
      const newPR: SubmittedPR = {
        number: pr.number,
        url: pr.url,
        html_url: pr.html_url,
        filePath: editingFile.path,
        timestamp: Date.now(),
      };

      const updatedPRs = [...submittedPRs, newPR];
      setSubmittedPRs(updatedPRs);
      localStorage.setItem('submitted_prs', JSON.stringify(updatedPRs));

      // Show success and PR status
      setShowPRStatus(true);
      alert(`✅ השינויים נשלחו בהצלחה!\n\nPull Request #${pr.number} נוצר.\nהמתן לאישור של מנהל המאגר.`);
      
      // Clear editor
      setEditingFile(null);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('❌ שגיאה בשליחת השינויים. אנא נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckPRStatus = async (prNumber: number) => {
    try {
      const github = getGitHubService();
      const status = await github.getPullRequestStatus(prNumber);
      
      let statusText = '';
      if (status.merged) {
        statusText = '✅ אושר ומוזג';
      } else if (status.state === 'closed') {
        statusText = '❌ נסגר';
      } else if (status.state === 'open') {
        statusText = '⏳ ממתין לאישור';
      }
      
      alert(`סטטוס PR #${prNumber}: ${statusText}\n\nלינק: ${status.html_url}`);
    } catch (error) {
      console.error('Failed to check PR status:', error);
      alert('שגיאה בבדיקת הסטטוס');
    }
  };

  if (!user || !token) {
    return <DiscordAuth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Layout title="מערכת ניהול תוכן" description="ערוך קבצי Markdown">
      <div className="cms-container">
        <div className="cms-header">
          <div className="cms-header-content">
            <h1>מערכת ניהול תוכן</h1>
            <div className="user-info">
              <img
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={user.username}
                className="user-avatar"
              />
              <span className="user-name">{user.username}</span>
              <button onClick={handleLogout} className="logout-button">
                התנתק
              </button>
              <button 
                onClick={() => setShowPRStatus(!showPRStatus)} 
                className="pr-status-button"
              >
                <i className="fas fa-code-branch"></i> PRs שלי ({submittedPRs.length})
              </button>
            </div>
          </div>
        </div>

        {showPRStatus && submittedPRs.length > 0 && (
          <div className="pr-status-panel">
            <h3>Pull Requests שלך</h3>
            <div className="pr-list">
              {submittedPRs.slice().reverse().map((pr) => (
                <div key={pr.number} className="pr-item">
                  <div className="pr-info">
                    <strong>PR #{pr.number}</strong>
                    <span className="pr-file">{pr.filePath}</span>
                    <span className="pr-time">
                      {new Date(pr.timestamp).toLocaleString('he-IL')}
                    </span>
                  </div>
                  <div className="pr-actions">
                    <button onClick={() => handleCheckPRStatus(pr.number)}>
                      בדוק סטטוס
                    </button>
                    <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                      פתח ב-GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="cms-main">
          <div className="cms-sidebar">
            <FileBrowser
              onFileSelect={handleFileSelect}
              repoOwner={REPO_OWNER}
              repoName={REPO_NAME}
            />
          </div>

          <div className="cms-editor">
            {editingFile ? (
              <>
                <div className="editor-header">
                  <div className="file-path">
                    <i className="fas fa-file-alt"></i>
                    <span>{editingFile.path}</span>
                  </div>
                  <button 
                    onClick={handleSubmit} 
                    className="submit-button"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> שומר...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> שלח לאישור
                      </>
                    )}
                  </button>
                </div>

                <div className="metadata-section">
                  <div className="metadata-field">
                    <label>כותרת:</label>
                    <input
                      type="text"
                      value={editingFile.metadata.title || ''}
                      onChange={(e) => handleMetadataChange('title', e.target.value)}
                      placeholder="כותרת הדף"
                    />
                  </div>
                  <div className="metadata-field">
                    <label>מיקום בתפריט:</label>
                    <input
                      type="number"
                      value={editingFile.metadata.sidebar_position || ''}
                      onChange={(e) => handleMetadataChange('sidebar_position', parseInt(e.target.value) || undefined)}
                      placeholder="מספר"
                    />
                  </div>
                </div>

                <MarkdownEditor
                  initialContent={editingFile.currentContent}
                  onChange={handleContentChange}
                />
              </>
            ) : (
              <div className="editor-placeholder">
                <i className="fas fa-folder-open" style={{ fontSize: '4rem', opacity: 0.3 }}></i>
                <p>בחר קובץ מהרשימה כדי להתחיל לערוך</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
