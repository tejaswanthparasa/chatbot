"use client"

import * as React from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Link, Undo, Redo, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { TextAlign } from "@tiptap/extension-text-align"

interface MinimalEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function MinimalEditor({ value = "", onChange, placeholder }: MinimalEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[100px] p-4',
        placeholder: placeholder || "Start typing...",
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-muted' : ''}`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-muted' : ''}`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-muted' : ''}`}
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter URL:')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-muted' : ''}`}
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="text-xs text-muted-foreground px-2">
          0/200
        </div>
      </div>
      
      {/* Editor Content */}
      <EditorContent editor={editor} />
      
      {/* Helper Text */}
      <div className="p-2 text-xs text-muted-foreground border-t bg-muted/30">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <span className="text-xs">i</span>
          </div>
          You can use this to add a dismissible notice. It will be dismissed after the user sends a message.
        </div>
      </div>
    </div>
  )
}