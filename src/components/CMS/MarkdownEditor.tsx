import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function MarkdownEditor({ initialContent, onChange }: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Get markdown from the editor
      const html = editor.getHTML();
      onChange(convertToMarkdown(html));
    },
  });

  const convertToMarkdown = (html: string): string => {
    // Basic HTML to Markdown conversion
    let markdown = html;
    
    // Remove wrapping <p> tags if they exist
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // Headings
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n');
    
    // Bold and italic
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');
    
    // Links
    markdown = markdown.replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');
    
    // Images
    markdown = markdown.replace(/<img src="(.*?)" alt="(.*?)".*?>/g, '![$2]($1)');
    markdown = markdown.replace(/<img src="(.*?)".*?>/g, '![]($1)');
    
    // Lists
    markdown = markdown.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      return content.replace(/<li>(.*?)<\/li>/g, '- $1\n');
    });
    markdown = markdown.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      let counter = 1;
      return content.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`);
    });
    
    // Code blocks
    markdown = markdown.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n');
    markdown = markdown.replace(/<code>(.*?)<\/code>/g, '`$1`');
    
    // Blockquotes
    markdown = markdown.replace(/<blockquote>(.*?)<\/blockquote>/gs, (match, content) => {
      return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n';
    });
    
    // Clean up extra newlines
    markdown = markdown.replace(/\n{3,}/g, '\n\n');
    
    return markdown.trim();
  };

  const setLink = () => {
    const url = window.prompt('הזן URL:');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('הזן URL של התמונה:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="markdown-editor">
      <div className="editor-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="מודגש (Ctrl+B)"
        >
          <i className="fas fa-bold"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="נטוי (Ctrl+I)"
        >
          <i className="fas fa-italic"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="קו חוצה"
        >
          <i className="fas fa-strikethrough"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="כותרת 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="כותרת 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          title="כותרת 3"
        >
          H3
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="רשימה"
        >
          <i className="fas fa-list-ul"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="רשימה ממוספרת"
        >
          <i className="fas fa-list-ol"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="ציטוט"
        >
          <i className="fas fa-quote-right"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="הוסף קישור"
        >
          <i className="fas fa-link"></i>
        </button>
        <button
          onClick={addImage}
          title="הוסף תמונה"
        >
          <i className="fas fa-image"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="בלוק קוד"
        >
          <i className="fas fa-code"></i>
        </button>
        
        <div className="toolbar-divider"></div>
        
        <button
          onClick={() => editor.chain().focus().undo().run()}
          title="בטל (Ctrl+Z)"
          disabled={!editor.can().undo()}
        >
          <i className="fas fa-undo"></i>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          title="בצע שוב (Ctrl+Shift+Z)"
          disabled={!editor.can().redo()}
        >
          <i className="fas fa-redo"></i>
        </button>
      </div>
      
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}
