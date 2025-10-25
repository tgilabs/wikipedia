import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import MarkdownEditor from '../../components/CMS/MarkdownEditor';
import { getGitHubService } from '../../components/CMS/GitHubService';
import {
  decodeBase64UTF8,
  parseFrontmatter,
  buildFrontmatter,
  isPathAllowed,
  validateFileName,
  REPO_CONFIG,
} from '../../components/CMS/utils';
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

export default function Editor() {
  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [editingFile, setEditingFile] = useState<EditingFile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newFilePath, setNewFilePath] = useState('');

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
      // Validate that the file is in the allowed folder
      if (!isPathAllowed(filePath)) {
        alert('❌ ניתן לערוך רק קבצים בתיקיית Community');
        history.push('/dashboard');
        return;
      }
      loadFile(filePath);
    } else {
      // Creating a new file - default to community folder
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
        `https://api.github.com/repos/${REPO_CONFIG.owner}/${REPO_CONFIG.name}/contents/${filePath}?ref=${REPO_CONFIG.branch}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      const content = decodeBase64UTF8(data.content);

      // Use shared frontmatter parser
      const { metadata, body } = parseFrontmatter(content);

      setEditingFile({
        path: filePath,
        originalContent: content,
        currentContent: body,
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

      // Validate file name
      if (!validateFileName(fileName)) {
        alert('❌ שם קובץ לא חוקי. השתמש רק באותיות אנגליות, מספרים, מקף ומקף תחתון');
        return;
      }
      
      // Only allow creation in community folder
      finalPath = `${REPO_CONFIG.allowedPath}/${fileName}`;
    }

    // Double-check the path is allowed
    if (!isPathAllowed(finalPath)) {
      alert('❌ ניתן לערוך רק קבצים בתיקיית Community');
      return;
    }

    setIsSaving(true);

    try {
      // Use shared frontmatter builder
      const frontmatter = buildFrontmatter(editingFile.metadata);
      const finalContent = frontmatter + editingFile.currentContent;

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
              <p className="folder-info">
                <i className="fas fa-info-circle"></i> הקובץ ייווצר בתיקייה: <strong>docs/community/</strong>
              </p>
              <div className="new-file-fields">
                <div className="field">
                  <label>שם קובץ:</label>
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    placeholder="my-page.md"
                  />
                  <small>השתמש רק באותיות אנגליות, מספרים, מקף (-) ומקף תחתון (_)</small>
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
