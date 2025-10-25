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
    sidebar_label?: string;
    description?: string;
    sidebar_position?: number;
    [key: string]: any; // Allow any other frontmatter fields
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
  const [newFolder, setNewFolder] = useState('');
  const [createInSubfolder, setCreateInSubfolder] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('discord_user');
    if (!savedUser) {
      history.push('/dashboard');
      return;
    }

    setUser(JSON.parse(savedUser));

    // Check for existing branch in session
    const savedBranch = sessionStorage.getItem('current_edit_branch');
    if (savedBranch) {
      setCurrentBranch(savedBranch);
    }

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
      
      // Build path with optional subfolder
      if (createInSubfolder && newFolder.trim()) {
        // Validate folder name
        if (!/^[a-zA-Z0-9_-]+$/.test(newFolder.trim())) {
          alert('❌ שם תיקייה לא חוקי. השתמש רק באותיות אנגליות, מספרים, מקף ומקף תחתון');
          return;
        }
        finalPath = `${REPO_CONFIG.allowedPath}/${newFolder.trim()}/${fileName}`;
      } else {
        finalPath = `${REPO_CONFIG.allowedPath}/${fileName}`;
      }
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
      
      // Check if we're continuing an existing editing session
      let branchName = currentBranch;
      let pr: any;
      
      if (branchName) {
        // Continue editing on existing branch
        try {
          await github.updateFile(
            finalPath,
            finalContent,
            branchName,
            `${action} ${fileName} via CMS`
          );
          
          alert(`✅ הקובץ ${fileName} נוסף לעריכה הקיימת!\n\nתוכל להמשיך לערוך קבצים נוספים באותה עריכה.`);
          
          // Navigate back to dashboard to select another file
          history.push('/dashboard');
          return;
        } catch (error) {
          console.error('Failed to update on existing branch:', error);
          // Branch might not exist anymore, create a new one
          branchName = null;
          setCurrentBranch(null);
          sessionStorage.removeItem('current_edit_branch');
        }
      }
      
      // Create new branch and PR
      const timestamp = Date.now();
      branchName = `cms-edit/${user.username}/${timestamp}`;
      
      pr = await github.submitChange(
        finalPath,
        finalContent,
        `${action} ${fileName} via CMS`,
        `📝 CMS ${action}: ${editingFile.metadata.title || fileName}`,
        `### שינוי שבוצע על ידי ${user.username} דרך CMS\n\n**פעולה:** ${action === 'Create' ? 'יצירת קובץ חדש' : 'עדכון קובץ'}\n**קובץ:** ${finalPath}\n**כותרת:** ${editingFile.metadata.title || 'ללא כותרת'}\n\n---\n\nשינוי זה בוצע באמצעות מערכת ניהול התוכן המותאמת אישית עם אימות Discord.`,
        user.username
      );

      // Save branch for continued editing
      setCurrentBranch(branchName);
      sessionStorage.setItem('current_edit_branch', branchName);

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

      const continueEditing = window.confirm(
        `✅ השינויים נשלחו בהצלחה!\n\nPull Request #${pr.number} נוצר.\n\n` +
        `האם תרצה להמשיך לערוך קבצים נוספים באותה עריכה?\n` +
        `(כל הקבצים ייכללו באותו PR)`
      );
      
      if (continueEditing) {
        // Navigate back to dashboard to select another file
        history.push('/dashboard');
      } else {
        // Clear the branch session and go back
        setCurrentBranch(null);
        sessionStorage.removeItem('current_edit_branch');
        history.push('/dashboard');
      }
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
                  <label>
                    <input
                      type="checkbox"
                      checked={createInSubfolder}
                      onChange={(e) => setCreateInSubfolder(e.target.checked)}
                      style={{ marginLeft: '8px' }}
                    />
                    צור בתיקיית משנה
                  </label>
                </div>
                
                {createInSubfolder && (
                  <div className="field">
                    <label>שם תיקייה חדשה:</label>
                    <input
                      type="text"
                      value={newFolder}
                      onChange={(e) => setNewFolder(e.target.value)}
                      placeholder="my-folder"
                    />
                    <small>התיקייה תיווצר ב-docs/community/ (אם לא קיימת)</small>
                  </div>
                )}
                
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
              <label>כותרת (title):</label>
              <input
                type="text"
                value={editingFile.metadata.title || ''}
                onChange={(e) => handleMetadataChange('title', e.target.value)}
                placeholder="כותרת הדף המלאה"
              />
            </div>
            <div className="metadata-field">
              <label>תווית בסרגל (sidebar_label):</label>
              <input
                type="text"
                value={editingFile.metadata.sidebar_label || ''}
                onChange={(e) => handleMetadataChange('sidebar_label', e.target.value)}
                placeholder="שם קצר לתפריט"
              />
            </div>
            <div className="metadata-field full-width">
              <label>תיאור (description):</label>
              <textarea
                value={editingFile.metadata.description || ''}
                onChange={(e) => handleMetadataChange('description', e.target.value)}
                placeholder="תיאור הדף למנועי חיפוש"
                rows={2}
              />
            </div>
            <div className="metadata-field">
              <label>מיקום בתפריט (sidebar_position):</label>
              <input
                type="number"
                value={editingFile.metadata.sidebar_position || ''}
                onChange={(e) => handleMetadataChange('sidebar_position', parseInt(e.target.value) || undefined)}
                placeholder="מספר"
              />
            </div>
          </div>

          {currentBranch && (
            <div className="editing-session-banner">
              <i className="fas fa-code-branch"></i>
              <span>ממשיך עריכה קיימת - כל הקבצים ייכללו באותו PR</span>
              <button 
                onClick={() => {
                  if (window.confirm('האם לסיים את העריכה המרובה ולחזור למצב רגיל?')) {
                    setCurrentBranch(null);
                    sessionStorage.removeItem('current_edit_branch');
                  }
                }}
                className="end-session-button"
              >
                סיים עריכה
              </button>
            </div>
          )}

          <MarkdownEditor
            initialContent={editingFile.currentContent}
            onChange={handleContentChange}
          />
        </div>
      </div>
    </Layout>
  );
}
