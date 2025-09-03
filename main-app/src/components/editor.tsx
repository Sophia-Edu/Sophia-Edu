import { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Form } from 'antd';
import type { FormItemProps } from 'antd/es/form';

interface RichTextEditorProps extends FormItemProps {
    name: string;
    label: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ name, label, ...formItemProps }) => {
    const [wordCount, setWordCount] = useState<number>(0);
    const form = Form.useFormInstance();

    const handleEditorChange = (content: string, editor: any) => {
        // Update form value
        form.setFieldsValue({ [name]: content });

        // Update word count
        const text = editor.getContent({ format: 'text' });
        setWordCount(text.trim() ? text.split(/\s+/).length : 0);
    };

    return (
        <Form.Item label={label} name={name} {...formItemProps}>
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_KEY}
                init={{
                    height: 300,
                    menubar: true,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | bold italic backcolor | \
                   alignleft aligncenter alignright alignjustify | \
                   bullist numlist outdent indent | removeformat | help | wordcount',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
                onEditorChange={handleEditorChange}
            />
            <div style={{ color: '#666', marginTop: 8 }}>
                Word count: {wordCount}
            </div>
        </Form.Item>
    );
};