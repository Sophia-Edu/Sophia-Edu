import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, List, Space, Popconfirm, Upload, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { uploadFileToCloudinary } from '../../utils/helperFunction';
import tutorRequests from '../../requests/tutor.request';
import RichTextEditor from '../RichTextEditor';

interface Lesson {
  id?: number;
  title: string;
  content: string;
  additional_resources?: string | File;
  media_file?: string | File;
  order?: number;
}

interface ModuleItem {
  id?: number;
  name?: string;
  title?: string;
  description?: string;
  additional_resources?: string | File;
  media_file?: string | File;
  order?: number;
  is_template?: boolean;
  data?: Lesson[]; // lessons
  data_entries_count?: number; // number of lessons from API (fallback to data.length)
}

const ModuleManager: React.FC<{
  modules: ModuleItem[];
  setModules: (m: ModuleItem[]) => void;
  courseId?: number | string;
  onModuleCreated?: () => void | Promise<void>;
}> = ({ modules, setModules, courseId, onModuleCreated }) => {
  const [visible, setVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [loadingList, setLoadingList] = useState(false);
  const [uploadingModuleMedia, setUploadingModuleMedia] = useState(false);
  const [uploadingModuleResources, setUploadingModuleResources] = useState(false);
  const [uploadingLessonFiles, setUploadingLessonFiles] = useState<{[key: string]: boolean}>({});

  // Note: creation is handled via the modal shown by the Manage Modules button below
  const openNew = () => {
    setEditingIndex(null);
    form.resetFields();
    form.setFieldsValue({ data: [] });
    setVisible(true);
  };

  const openEdit = (index: number) => {
    const mod = modules[index];
    setEditingIndex(index);
    form.setFieldsValue({ ...mod });
    setVisible(true);
  };

  // Fetch existing modules helper with deduplication
  const loadModules = async (forceRefresh = false) => {
    try {
      setLoadingList(true);
      let list: any[] = [];
      if (courseId != null) {
        try {
          const res: any = await tutorRequests.getModules(Number(courseId));
          // Normalize possible shapes
          const root = res?.data ?? res;
          if (Array.isArray(root)) list = root;
          else if (Array.isArray(root?.modules)) list = root.modules;
          else if (Array.isArray(root?.items)) list = root.items;
          else if (Array.isArray(root?.data)) list = root.data;
        } catch (e) {
          // fallback to global list if course-based fails
          list = await tutorRequests.listModules();
        }
      } else {
        list = await tutorRequests.listModules();
      }
      // Normalize into ModuleItem[] expected by UI
      const normalized: ModuleItem[] = (Array.isArray(list) ? list : []).map((m: any, idx: number) => {
        const id = m?.id ?? m?.module_id ?? m?.moduleId ?? undefined;
        const name = m?.name ?? m?.title ?? `Module ${idx + 1}`;
        const title = m?.title ?? m?.name ?? name;
        const description = m?.description ?? m?.brief ?? '';
        const order = m?.order ?? (idx + 1);
        const is_template = m?.is_template ?? m?.isTemplate ?? false;
        // lessons could be in m.data or m.lessons or m.contents
        const lessonsSrc = Array.isArray(m?.data)
          ? m.data
          : Array.isArray(m?.lessons)
          ? m.lessons
          : Array.isArray(m?.contents)
          ? m.contents
          : [];
        const data = lessonsSrc.map((d: any, i: number) => ({
          id: d?.id ?? d?.lesson_id ?? undefined,
          title: d?.title ?? d?.name ?? `Lesson ${i + 1}`,
          content: d?.content ?? d?.body ?? '',
          additional_resources: d?.additional_resources ?? d?.resources ?? null,
          media_file: d?.media_file ?? d?.media ?? null,
          order: d?.order ?? (i + 1),
        }));
        const data_entries_count = m?.data_entries_count ?? m?.lessons_count ?? (Array.isArray(data) ? data.length : 0);
        return { id, name, title, description, order, is_template, data, data_entries_count };
      });
      
      // Deduplicate modules by ID to prevent duplicates
      const existingIds = new Set(modules?.map(m => m.id).filter(Boolean) || []);
      const uniqueNormalized = normalized.filter(m => !m.id || !existingIds.has(m.id));
      
      // Only update if we have new modules or if it's a force refresh
      if (forceRefresh || normalized.length > 0) {
        if (forceRefresh) {
          // Complete replacement on refresh
          setModules(normalized);
        } else if (!modules || modules.length === 0) {
          // Initial load when no modules exist
          setModules(normalized);
        } else if (uniqueNormalized.length > 0) {
          // Add only new unique modules
          setModules([...modules, ...uniqueNormalized]);
        }
      }
    } catch (err) {
      console.error('Failed to load modules list', err);
      message.error('Failed to load modules from server');
    } finally {
      setLoadingList(false);
    }
  };

  // Single useEffect for initial module loading on mount or courseId change
  useEffect(() => {
    if (!modules || modules.length === 0) {
      loadModules();
    }
  }, [courseId]);

  const removeModule = (index: number) => {
    const moduleToRemove = modules[index];
    // If module has server id, attempt delete on backend
    if (moduleToRemove?.id) {
      tutorRequests.deleteModule(moduleToRemove.id)
        .then(() => {
          const copy = [...modules];
          copy.splice(index, 1);
          copy.forEach((m, i) => (m.order = i + 1));
          setModules(copy);
          message.success('Module removed');
        })
        .catch((err) => {
          console.error('Failed to delete module', err);
          message.error('Failed to delete module');
        });
    } else {
      const copy = [...modules];
      copy.splice(index, 1);
      copy.forEach((m, i) => (m.order = i + 1));
      setModules(copy);
      message.success('Module removed');
    }
  };

  const handleUploadField = async (file: File, field: string) => {
    try {
      // Set loading state based on field type
      if (field === 'media_file') {
        setUploadingModuleMedia(true);
      } else if (field === 'additional_resources') {
        setUploadingModuleResources(true);
      }
      
      const res = await uploadFileToCloudinary(file, file.type.startsWith('image/') ? 'image' : 'auto');
      // set form field
      form.setFieldsValue({ [field]: res });
      message.success('Uploaded successfully');
    } catch (err) {
      console.error(err);
      message.error('Upload failed');
    } finally {
      // Clear loading state
      if (field === 'media_file') {
        setUploadingModuleMedia(false);
      } else if (field === 'additional_resources') {
        setUploadingModuleResources(false);
      }
    }
  };

  const handleLessonFile = async (file: File, lessonIndex: number, field: string) => {
    const uploadKey = `${lessonIndex}-${field}`;
    try {
      // Set loading state for this specific lesson and field
      setUploadingLessonFiles(prev => ({ ...prev, [uploadKey]: true }));
      
      const res = await uploadFileToCloudinary(file, file.type.startsWith('image/') ? 'image' : 'auto');
      const current = form.getFieldsValue() as { data?: Lesson[] };
      const data: Lesson[] = current.data || [];
      data[lessonIndex] = data[lessonIndex] || { title: '', content: '', order: lessonIndex + 1 };
      if (field === 'media_file') data[lessonIndex].media_file = res;
      else data[lessonIndex].additional_resources = res;
      form.setFieldsValue({ data });
      message.success('Uploaded successfully');
    } catch (err) {
      console.error(err);
      message.error('Upload failed');
    } finally {
      // Clear loading state for this specific lesson and field
      setUploadingLessonFiles(prev => {
        const updated = { ...prev };
        delete updated[uploadKey];
        return updated;
      });
    }
  };

  const onSave = async () => {
    try {
      const values = await form.validateFields();
      const copy = [...modules];
      const item: ModuleItem = {
        ...values,
        order: values.order ?? (editingIndex !== null ? modules[editingIndex].order : modules.length + 1),
        data: (values.data || []).map((d: any, i: number) => ({ ...d, order: d.order ?? i + 1 }))
      };
      
      let serverSuccess = true;
      let errorMessage = '';

      // Persist to backend if possible
      const extractModuleId = (resp: any) => {
        const createdModule = resp?.data?.modules?.[0] || resp?.data || null;
        return createdModule?.id || createdModule?.module_id || createdModule?.moduleId || null;
      };

      if (editingIndex === null) {
        try {
          // Format payload according to backend expectations for creation
          const createPayload = {
            modules: [{
              name: item.name || item.title,
              description: item.description || '',
              order: item.order || (modules.length + 1),
              is_template: item.is_template !== undefined ? item.is_template : true,
              data: (item.data || []).map((lesson: any, idx: number) => ({
                title: lesson.title || '',
                content: lesson.content || '',
                additional_resources: lesson.additional_resources || null,
                media_file: lesson.media_file || null,
                order: lesson.order || (idx + 1)
              }))
            }]
          };
          
          const resp: any = await tutorRequests.createCourseModule(createPayload);
          const id = extractModuleId(resp);
          if (id) item.id = id;
          copy.push(item);
        } catch (err: any) {
          console.error('Failed to create module on server', err);
          serverSuccess = false;
          errorMessage = err.message || 'Failed to create module on server';
          // Still add locally so user doesn't lose data
          copy.push(item);
        }
      } else {
        const existing = modules[editingIndex];
        if (existing?.id) {
          try {
            // Format payload according to backend expectations
            const updatePayload = {
              name: item.name || item.title,
              description: item.description || '',
              order: item.order || (editingIndex + 1),
              is_template: item.is_template !== undefined ? item.is_template : true,
              data: (item.data || []).map((lesson: any, idx: number) => ({
                title: lesson.title || '',
                content: lesson.content || '',
                additional_resources: lesson.additional_resources || null,
                media_file: lesson.media_file || null,
                order: lesson.order || (idx + 1)
              }))
            };
            
            await tutorRequests.updateModule(existing.id, updatePayload);
            copy[editingIndex] = { ...existing, ...item };
          } catch (err: any) {
            console.error('Failed to update module on server', err);
            serverSuccess = false;
            errorMessage = err.message || 'Failed to update module on server';
            copy[editingIndex] = { ...existing, ...item };
          }
        } else {
          // No server id yet, create instead
          try {
            // Format payload according to backend expectations for creation
            const createPayload = {
              modules: [{
                name: item.name || item.title,
                description: item.description || '',
                order: item.order || (editingIndex + 1),
                is_template: item.is_template !== undefined ? item.is_template : true,
                data: (item.data || []).map((lesson: any, idx: number) => ({
                  title: lesson.title || '',
                  content: lesson.content || '',
                  additional_resources: lesson.additional_resources || null,
                  media_file: lesson.media_file || null,
                  order: lesson.order || (idx + 1)
                }))
              }]
            };
            
            const resp: any = await tutorRequests.createCourseModule(createPayload);
            const createdModule = resp?.data?.modules?.[0] || resp?.data || null;
            if (createdModule) item.id = createdModule.id || createdModule.module_id || createdModule.moduleId;
            copy[editingIndex] = item;
          } catch (err: any) {
            console.error('Failed to create module on server', err);
            serverSuccess = false;
            errorMessage = err.message || 'Failed to create module on server';
            copy[editingIndex] = item;
          }
        }
      }

      // reindex module orders
      copy.forEach((m, i) => (m.order = i + 1));
      setModules(copy);
      setVisible(false);
      
      // Refresh the module list from server after successful save
      if (serverSuccess) {
        message.success('Module saved successfully');
        // Auto-refresh to ensure we have the latest data from server
        loadModules(true);
        // Notify parent component that a module was created/updated
        if (onModuleCreated) {
          try {
            await onModuleCreated();
          } catch (err) {
            console.error('Error in onModuleCreated callback:', err);
          }
        }
      } else {
        message.error(`Failed to save module: ${errorMessage}`);
      }
    } catch (err) {
      // validation errors
      message.error('Please check all required fields');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Button onClick={openNew} icon={<PlusOutlined/>}>
          Manage Modules{modules && modules.length ? ` (${modules.length})` : ''}
        </Button>
        <Button onClick={() => loadModules(true)} loading={loadingList}>Refresh</Button>
      </div>

      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
        <List
          dataSource={modules}
          locale={{ emptyText: 'No modules yet' }}
          loading={loadingList}
          renderItem={(item, idx) => (
            <List.Item
              className="hover:bg-gray-50 transition-colors"
              actions={[
                <Button key="edit" type="link" icon={<EditOutlined/>} onClick={() => openEdit(idx)}>Edit</Button>,
                <Popconfirm key="del" title="Delete module?" onConfirm={() => removeModule(idx)}>
                  <Button type="link" danger icon={<DeleteOutlined/>}>Delete</Button>
                </Popconfirm>
              ]}
            >
              <div className="w-full">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name || item.title || `Module ${idx + 1}`}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-[#581A57]">
                        Lessons: {item.data_entries_count ?? (Array.isArray(item.data) ? item.data.length : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <Modal
        title={editingIndex === null ? 'Create Module' : 'Edit Module'}
        open={visible}
        onCancel={() => { setVisible(false); setEditingIndex(null); }}
        onOk={onSave}
        width={900}
        style={{ maxHeight: '80vh' }}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" initialValues={{ data: [] }}>
          <Form.Item label="Module Name" name="name" rules={[{ required: true, message: 'Name required' }]}>
            <Input placeholder="Module name" />
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Module Media" name="media_file">
            <Upload beforeUpload={(file) => { handleUploadField(file as File, 'media_file'); return Upload.LIST_IGNORE; }} maxCount={1}>
              <Button icon={<UploadOutlined />} loading={uploadingModuleMedia} disabled={uploadingModuleMedia}>
                {uploadingModuleMedia ? 'Uploading...' : 'Upload Media'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Additional Resources" name="additional_resources">
            <Upload beforeUpload={(file) => { handleUploadField(file as File, 'additional_resources'); return Upload.LIST_IGNORE; }} maxCount={1}>
              <Button icon={<UploadOutlined />} loading={uploadingModuleResources} disabled={uploadingModuleResources}>
                {uploadingModuleResources ? 'Uploading...' : 'Upload Resources'}
              </Button>
            </Upload>
          </Form.Item>

          <Form.List name="data">
            {(fields, { add, remove }) => (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Lessons</div>
                  <Button size="small" onClick={() => add({ title: '', content: '', order: fields.length + 1 })} icon={<PlusOutlined/>} style={{ backgroundColor: '#581A57', borderColor: '#581A57', color: 'white' }}>Add Lesson</Button>
                </div>

                <div className="max-h-96 overflow-y-auto border border-gray-100 rounded-md p-2">
                  {fields.map((field, idx) => (
                    <div key={field.key} className="border border-gray-200 p-3 mb-3 rounded-md bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-sm text-gray-700">Lesson {idx + 1}</h5>
                        <Button size="small" danger onClick={() => remove(field.name)} icon={<DeleteOutlined/>}>Remove</Button>
                      </div>
                      
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Form.Item label="Title" name={[field.name, 'title']} rules={[{ required: true, message: 'Title required' }]} className="mb-2">
                          <Input placeholder={`Enter title for lesson ${idx + 1}`} />
                        </Form.Item>
                        
                        <Form.Item label="Content" name={[field.name, 'content']} className="mb-2">
                          <RichTextEditor 
                            placeholder={`Enter content for lesson ${idx + 1}...`}
                            height={150}
                          />
                        </Form.Item>
                        
                        <div className="flex gap-2 flex-wrap">
                          <Upload beforeUpload={(file) => { handleLessonFile(file as File, idx, 'media_file'); return Upload.LIST_IGNORE; }} maxCount={1}>
                            <Button 
                              size="small"
                              icon={<UploadOutlined/>} 
                              loading={uploadingLessonFiles[`${idx}-media_file`]} 
                              disabled={uploadingLessonFiles[`${idx}-media_file`]}
                            >
                              {uploadingLessonFiles[`${idx}-media_file`] ? 'Uploading...' : 'Media'}
                            </Button>
                          </Upload>
                          <Upload beforeUpload={(file) => { handleLessonFile(file as File, idx, 'additional_resources'); return Upload.LIST_IGNORE; }} maxCount={1}>
                            <Button 
                              size="small"
                              icon={<UploadOutlined/>} 
                              loading={uploadingLessonFiles[`${idx}-additional_resources`]} 
                              disabled={uploadingLessonFiles[`${idx}-additional_resources`]}
                            >
                              {uploadingLessonFiles[`${idx}-additional_resources`] ? 'Uploading...' : 'Resources'}
                            </Button>
                          </Upload>
                        </div>
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ModuleManager;
