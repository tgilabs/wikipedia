import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { githubService } from '../../services/github';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import styles from './cms.module.css';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha?: string;
}

export default function CMS(): React.ReactElement {
  const { user, loading, login, logout } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('docs');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (user && githubToken) {
      loadFiles(currentPath);
    }
  }, [user, githubToken, currentPath]);

  const handleSetToken = (token: string) => {
    setGithubToken(token);
    githubService.initialize(token);
    setShowTokenInput(false);
    setStatusMessage('GitHub token configured successfully!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const loadFiles = async (path: string) => {
    try {
      const fileList = await githubService.listFiles(path);
      const mappedFiles: FileItem[] = fileList.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type === 'dir' ? 'dir' : 'file',
        sha: file.sha,
      }));
      setFiles(mappedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setStatusMessage('Error loading files. Check your GitHub token.');
    }
  };

  const handleFileSelect = async (file: FileItem) => {
    if (file.type === 'dir') {
      setCurrentPath(file.path);
      setSelectedFile(null);
      return;
    }

    try {
      const content = await githubService.getFileContent(file.path);
      setFileContent(content);
      setEditedContent(content);
      setSelectedFile(file);
    } catch (error) {
      console.error('Error loading file:', error);
      setStatusMessage('Error loading file content.');
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsSaving(true);
    try {
      const message = `Update ${selectedFile.name} via CMS`;
      await githubService.updateFile(
        selectedFile.path,
        editedContent,
        message,
        selectedFile.sha
      );
      setStatusMessage('File saved successfully!');
      setFileContent(editedContent);
      // Refresh file list
      await loadFiles(currentPath);
    } catch (error) {
      console.error('Error saving file:', error);
      setStatusMessage('Error saving file. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/');
    if (pathParts.length > 1) {
      pathParts.pop();
      setCurrentPath(pathParts.join('/'));
    }
  };

  if (loading) {
    return (
      <Layout title="CMS" description="Content Management System">
        <div className={styles.container}>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="CMS Login" description="Login to CMS">
        <div className={styles.container}>
          <div className={styles.loginContainer}>
            <h1>מערכת ניהול תוכן (CMS)</h1>
            <p>התחבר עם Discord כדי להתחיל לערוך את התיעוד</p>
            <button onClick={login} className={styles.loginButton}>
              <i className="fab fa-discord"></i> התחבר עם Discord
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="CMS Dashboard" description="Edit documentation">
      <div className={styles.cmsContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>מערכת ניהול תוכן</h1>
            <div className={styles.userInfo}>
              <span>שלום, {user.name || user.email}</span>
              <button onClick={logout} className={styles.logoutButton}>
                התנתק
              </button>
            </div>
          </div>
          {!githubToken && (
            <div className={styles.tokenWarning}>
              <p>נדרש GitHub Personal Access Token לעריכת קבצים</p>
              <button 
                onClick={() => setShowTokenInput(!showTokenInput)}
                className={styles.configButton}
              >
                הגדר Token
              </button>
            </div>
          )}
          {showTokenInput && (
            <div className={styles.tokenInput}>
              <input
                type="password"
                placeholder="הכנס GitHub Personal Access Token"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSetToken((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(`.${styles.tokenInput} input`) as HTMLInputElement;
                  if (input.value) {
                    handleSetToken(input.value);
                  }
                }}
                className={styles.saveButton}
              >
                שמור
              </button>
            </div>
          )}
          {statusMessage && (
            <div className={styles.statusMessage}>{statusMessage}</div>
          )}
        </header>

        <div className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h2>קבצים</h2>
              {currentPath !== 'docs' && (
                <button onClick={navigateUp} className={styles.backButton}>
                  ← חזור
                </button>
              )}
            </div>
            <div className={styles.currentPath}>📁 {currentPath}</div>
            <div className={styles.fileList}>
              {files.map((file) => (
                <div
                  key={file.path}
                  className={`${styles.fileItem} ${
                    selectedFile?.path === file.path ? styles.selected : ''
                  }`}
                  onClick={() => handleFileSelect(file)}
                >
                  <span className={styles.fileIcon}>
                    {file.type === 'dir' ? '📁' : '📄'}
                  </span>
                  <span className={styles.fileName}>{file.name}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className={styles.editorArea}>
            {selectedFile ? (
              <>
                <div className={styles.editorHeader}>
                  <h2>{selectedFile.name}</h2>
                  <div className={styles.editorActions}>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || editedContent === fileContent}
                      className={styles.saveButton}
                    >
                      {isSaving ? 'שומר...' : 'שמור שינויים'}
                    </button>
                  </div>
                </div>
                <div className={styles.editorContent}>
                  <MarkdownEditor
                    content={editedContent}
                    onChange={setEditedContent}
                  />
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>בחר קובץ מהרשימה כדי להתחיל לערוך</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}
