import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Markdown } from '@tiptap/markdown';
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'right',
      }),
      Markdown.configure({
        markedOptions: {
          gfm: true, // GitHub Flavored Markdown
        },
        indentation: {
          style: 'space',
          size: 2,
        },
      }),
    ],
    content: initialContent,
    contentType: 'markdown', // Parse initial content as Markdown
    editorProps: {
      attributes: {
        dir: 'auto', // Automatically detect text direction
        lang: 'he', // Set Hebrew as the language
      },
    },
    onUpdate: ({ editor }) => {
      // Get markdown from the editor using the native Markdown extension
      const markdown = editor.getMarkdown();
      onChange(markdown);
    },
  });

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
