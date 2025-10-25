import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import DiscordAuth from '../components/CMS/DiscordAuth';
import FileBrowser from '../components/CMS/FileBrowser';
import { initializeGitHubService, getGitHubService } from '../components/CMS/GitHubService';
import { REPO_CONFIG } from '../components/CMS/utils';
import { useHistory } from '@docusaurus/router';
import './dashboard.css';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email?: string;
}

interface SubmittedPR {
  number: number;
  url: string;
  html_url: string;
  filePath: string;
  timestamp: number;
}

// Access environment variables through window object
const getEnvVar = (key: string): string => {
  if (typeof window !== 'undefined') {
    return (window as any).env?.[key] || '';
  }
  return '';
};

export default function Dashboard() {
  const history = useHistory();
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
    const githubToken = getEnvVar('GITHUB_TOKEN');
    initializeGitHubService(REPO_CONFIG.owner, REPO_CONFIG.name, githubToken);
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
  };

  const handleFileSelect = (filePath: string, content: string) => {
    // Navigate to editor with the file path as query parameter
    history.push(`/dashboard/editor?file=${encodeURIComponent(filePath)}`);
  };

  const handleCreateNew = () => {
    // Navigate to editor without file path to create new
    history.push('/dashboard/editor');
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
    <Layout title="לוח בקרה" description="ניהול תוכן">
      <div className="cms-container">
        <div className="cms-header">
          <div className="cms-header-content">
            <h1>לוח בקרה</h1>
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
          <div className="dashboard-welcome">
            <h2>ברוך הבא למערכת ניהול התוכן</h2>
            <p>בחר קובץ קיים לעריכה או צור דף חדש</p>
            <button onClick={handleCreateNew} className="create-new-button">
              <i className="fas fa-plus"></i> צור דף חדש
            </button>
          </div>

          <div className="cms-sidebar">
            <FileBrowser onFileSelect={handleFileSelect} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
