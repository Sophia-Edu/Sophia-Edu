import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = "Enter content...",
  height = 300
}) => {
  const handleEditorChange = (content: string) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_KEY}
      value={value}
      onEditorChange={handleEditorChange}
      init={{
        height: height,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        placeholder: placeholder,
        branding: false,
        resize: true,
        statusbar: false,
        // Ensure proper content handling
        forced_root_block: 'p',
        force_br_newlines: false,
        force_p_newlines: true,
        convert_newlines_to_brs: false,
        remove_linebreaks: false,
        // Preserve whitespace and formatting
        entity_encoding: 'raw',
        verify_html: false,
        // Remove any content length restrictions
        max_chars: 0, // No character limit
        // Disable any automatic content cleanup that might truncate
        cleanup: false,
        cleanup_on_startup: false,
        trim_span_elements: false,
        // Ensure data attributes are preserved
        valid_elements: '*[*]',
        extended_valid_elements: '*[*]'
      }}
    />
  );
};

export default RichTextEditor;
