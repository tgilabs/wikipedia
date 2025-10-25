import React, { useState, useEffect } from 'react';
import './FileBrowser.css';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileItem[];
}

interface FileBrowserProps {
  onFileSelect: (filePath: string, content: string) => void;
  repoOwner: string;
  repoName: string;
}

export default function FileBrowser({ onFileSelect, repoOwner, repoName }: FileBrowserProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['docs']));

  useEffect(() => {
    loadFileStructure();
  }, []);

  const loadFileStructure = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const structure = await fetchGitHubTree(repoOwner, repoName, 'Production', 'docs');
      setFiles(structure);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGitHubTree = async (
    owner: string,
    repo: string,
    branch: string,
    path: string
  ): Promise<FileItem[]> => {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch repository structure');
    }

    const data = await response.json();
    const items: FileItem[] = [];

    for (const item of data) {
      if (item.type === 'dir') {
        items.push({
          name: item.name,
          path: item.path,
          type: 'folder',
          children: [],
        });
      } else if (item.name.endsWith('.md')) {
        items.push({
          name: item.name,
          path: item.path,
          type: 'file',
        });
      }
    }

    return items.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
  };

  const toggleFolder = async (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
      
      // Load folder contents if not already loaded
      const folder = findFolder(files, folderPath);
      if (folder && (!folder.children || folder.children.length === 0)) {
        try {
          const children = await fetchGitHubTree(repoOwner, repoName, 'Production', folderPath);
          folder.children = children;
          setFiles([...files]);
        } catch (err) {
          console.error('Failed to load folder:', err);
        }
      }
    }
    
    setExpandedFolders(newExpanded);
  };

  const findFolder = (items: FileItem[], path: string): FileItem | null => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findFolder(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFileClick = async (file: FileItem) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.path}?ref=Production`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      const content = atob(data.content); // Decode base64 content
      
      onFileSelect(file.path, content);
    } catch (err) {
      console.error('Failed to load file:', err);
      alert('שגיאה בטעינת הקובץ');
    }
  };

  const renderFileTree = (items: FileItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.path} style={{ marginRight: `${level * 20}px` }}>
        {item.type === 'folder' ? (
          <>
            <div
              className="file-browser-item folder"
              onClick={() => toggleFolder(item.path)}
            >
              <i className={`fas fa-chevron-${expandedFolders.has(item.path) ? 'down' : 'left'}`}></i>
              <i className="fas fa-folder" style={{ margin: '0 8px', color: '#ffa500' }}></i>
              <span>{item.name}</span>
            </div>
            {expandedFolders.has(item.path) && item.children && (
              <div className="folder-contents">
                {renderFileTree(item.children, level + 1)}
              </div>
            )}
          </>
        ) : (
          <div
            className="file-browser-item file"
            onClick={() => handleFileClick(item)}
          >
            <i className="fas fa-file-alt" style={{ marginLeft: '8px', color: '#4a90e2' }}></i>
            <span>{item.name}</span>
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="file-browser">
        <div className="file-browser-header">
          <h3>קבצים</h3>
        </div>
        <div className="file-browser-loading">טוען...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-browser">
        <div className="file-browser-header">
          <h3>קבצים</h3>
        </div>
        <div className="file-browser-error">
          <p>שגיאה: {error}</p>
          <button onClick={loadFileStructure}>נסה שוב</button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-browser">
      <div className="file-browser-header">
        <h3>קבצים</h3>
        <button onClick={loadFileStructure} className="refresh-button" title="רענן">
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      <div className="file-browser-tree">
        {renderFileTree(files)}
      </div>
    </div>
  );
}
