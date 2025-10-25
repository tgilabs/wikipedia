import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import MarkdownEditor from '../../components/CMS/MarkdownEditor';
import { getGitHubService } from '../../components/CMS/GitHubService';
import { useHistory, useLocation } from '@docusaurus/router';
import './editor.css';

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

export default function Editor() {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileFolder, setNewFileFolder] = useState('docs/');

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('discord_user');
    if (!savedUser) {
      history.push('/dashboard');
      return;
    }

    setUser(JSON.parse(savedUser));

    // Check if we're editing an existing file
    const params = new URLSearchParams(location.search);
    const filePath = params.get('file');

    if (filePath) {
      loadFile(filePath);
    } else {
      // Creating a new file
      setEditingFile({
        path: '',
        originalContent: '',
        currentContent: '',
        metadata: {
          title: '',
          sidebar_position: undefined,
        },
      });
      setIsLoading(false);
    }
  }, [location.search]);

  const loadFile = async (filePath: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=Production`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      const content = atob(data.content);

      // Parse frontmatter
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
      const match = content.match(frontmatterRegex);

      let metadata = {};
      let bodyContent = content;

      if (match) {
        const frontmatter = match[1];
        bodyContent = match[2];

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
    } catch (error) {
      console.error('Failed to load file:', error);
      alert('שגיאה בטעינת הקובץ');
      history.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
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

    // If creating a new file, validate the path
    let finalPath = editingFile.path;
    if (!finalPath) {
      if (!newFilePath.trim()) {
        alert('אנא הזן שם קובץ');
        return;
      }
      
      // Ensure .md extension
      let fileName = newFilePath.trim();
      if (!fileName.endsWith('.md')) {
        fileName += '.md';
      }
      
      finalPath = `${newFileFolder}${fileName}`;
    }

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
      const fileName = finalPath.split('/').pop() || 'file';
      const action = editingFile.path ? 'Update' : 'Create';
      
      const pr = await github.submitChange(
        finalPath,
        finalContent,
        `${action} ${fileName} via CMS`,
        `📝 CMS ${action}: ${editingFile.metadata.title || fileName}`,
        `### שינוי שבוצע על ידי ${user.username} דרך CMS\n\n**פעולה:** ${action === 'Create' ? 'יצירת קובץ חדש' : 'עדכון קובץ'}\n**קובץ:** ${finalPath}\n**כותרת:** ${editingFile.metadata.title || 'ללא כותרת'}\n\n---\n\nשינוי זה בוצע באמצעות מערכת ניהול התוכן המותאמת אישית עם אימות Discord.`,
        user.username
      );

      // Save PR info
      const submittedPRs = JSON.parse(localStorage.getItem('submitted_prs') || '[]');
      const newPR: SubmittedPR = {
        number: pr.number,
        url: pr.url,
        html_url: pr.html_url,
        filePath: finalPath,
        timestamp: Date.now(),
      };

      submittedPRs.push(newPR);
      localStorage.setItem('submitted_prs', JSON.stringify(submittedPRs));

      alert(`✅ השינויים נשלחו בהצלחה!\n\nPull Request #${pr.number} נוצר.\nהמתן לאישור של מנהל המאגר.`);
      
      // Navigate back to dashboard
      history.push('/dashboard');
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('❌ שגיאה בשליחת השינויים. אנא נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    history.push('/dashboard');
  };

  if (isLoading) {
    return (
      <Layout title="טוען..." description="עורך תוכן">
        <div className="editor-loading">
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem' }}></i>
          <p>טוען קובץ...</p>
        </div>
      </Layout>
    );
  }

  if (!editingFile) {
    return null;
  }

  return (
    <Layout title={editingFile.path ? 'ערוך קובץ' : 'קובץ חדש'} description="עורך תוכן">
      <div className="editor-container">
        <div className="editor-header">
          <div className="editor-title">
            {editingFile.path ? (
              <>
                <i className="fas fa-file-alt"></i>
                <span>{editingFile.path}</span>
              </>
            ) : (
              <>
                <i className="fas fa-file-plus"></i>
                <span>קובץ חדש</span>
              </>
            )}
          </div>
          <div className="editor-actions">
            <button onClick={handleCancel} className="cancel-button">
              <i className="fas fa-times"></i> ביטול
            </button>
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
        </div>

        <div className="editor-content">
          {!editingFile.path && (
            <div className="new-file-section">
              <h3>פרטי קובץ חדש</h3>
              <div className="new-file-fields">
                <div className="field">
                  <label>תיקייה:</label>
                  <select 
                    value={newFileFolder} 
                    onChange={(e) => setNewFileFolder(e.target.value)}
                  >
                    <option value="docs/">docs/</option>
                    <option value="docs/community/">docs/community/</option>
                    <option value="docs/gaming/roblox/">docs/gaming/roblox/</option>
                    <option value="docs/legal/discord/">docs/legal/discord/</option>
                    <option value="docs/legal/perfume/">docs/legal/perfume/</option>
                    <option value="docs/legal/roblox/">docs/legal/roblox/</option>
                    <option value="docs/legal/website/">docs/legal/website/</option>
                    <option value="docs/legal/workway/">docs/legal/workway/</option>
                    <option value="docs/platforms/workway/">docs/platforms/workway/</option>
                  </select>
                </div>
                <div className="field">
                  <label>שם קובץ:</label>
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="my-page.md"
                  />
                </div>
              </div>
            </div>
          )}

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
        </div>
      </div>
    </Layout>
  );
}
