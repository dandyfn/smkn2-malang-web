"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo 
} from "lucide-react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    // StarterKit Tiptap v3 sudah menyertakan Underline
    extensions: [StarterKit],
    immediatelyRender: false,
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[160px] p-4 focus:outline-none text-sm text-slate-200 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-amber-500 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-950 border-b border-slate-800 p-2 text-slate-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("bold") ? "bg-amber-500/20 text-amber-400 font-bold" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("italic") ? "bg-amber-500/20 text-amber-400" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("underline") ? "bg-amber-500/20 text-amber-400" : ""}`}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        {/* Headings: H1, H2, H3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("heading", { level: 1 }) ? "bg-amber-500/20 text-amber-400 font-bold" : ""}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("heading", { level: 2 }) ? "bg-amber-500/20 text-amber-400 font-bold" : ""}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("heading", { level: 3 }) ? "bg-amber-500/20 text-amber-400 font-bold" : ""}`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("bulletList") ? "bg-amber-500/20 text-amber-400" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("orderedList") ? "bg-amber-500/20 text-amber-400" : ""}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-slate-800 transition ${editor.isActive("blockquote") ? "bg-amber-500/20 text-amber-400" : ""}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}