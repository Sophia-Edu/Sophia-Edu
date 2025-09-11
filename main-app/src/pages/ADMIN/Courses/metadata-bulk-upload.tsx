import React, { useState } from 'react';
import {
  Button,
  Card,
  Upload,
  message,
  Table,
  Typography,
  Space,
  Alert,
  Progress,
  Divider,
} from 'antd';
import {
  DownloadOutlined,
  FileExcelOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import DashboardLayout from '../../DashboardLayout';
import adminRequests from '../../../requests/admin.request';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface BulkUploadResponse {
  message: string;
  created_metadata: Array<{
    course_title: string;
    course_name: string;
    course_type: string;
    course_category: string;
    category_id: number;
  }>;
  total_processed: number;
  errors: string[] | null;
}

const CourseMetadataBulkUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleBulkUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await adminRequests.bulkUploadCourseMetadata(file);
      const result: BulkUploadResponse = response.data || response;

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      message.success(`Successfully processed ${result.total_processed} rows`);
      setFileList([]);
    } catch (error: any) {
      message.error(error.message || 'Upload failed');
      console.error('Bulk upload error:', error);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    accept: '.csv,.xlsx,.xls',
    beforeUpload: (file) => {
      const isValidType = file.type === 'text/csv' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
      
      if (!isValidType) {
        message.error('Please upload CSV or Excel files only');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB');
        return false;
      }

      handleBulkUpload(file);
      return false; // Prevent default upload
    },
    onChange: ({ fileList }) => setFileList(fileList),
    onRemove: () => {
      setFileList([]);
      setUploadResult(null);
    },
  };

  const downloadSampleCSV = () => {
    const csvContent = `course_title,course_name,course_type,course_category
"Introduction to Python Programming","Python Basics","Programming","Technology"
"Advanced JavaScript Concepts","JavaScript Advanced","Programming","Technology"
"Digital Marketing Fundamentals","Marketing 101","Marketing","Business"
"Data Science with Python","Data Science","Analytics","Technology"
"Entrepreneurship Essentials","Business Startup","Business","Entrepreneurship and Innovation"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course_metadata_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const resultColumns = [
    {
      title: 'Course Title',
      dataIndex: 'course_title',
      key: 'course_title',
    },
    {
      title: 'Course Name',
      dataIndex: 'course_name',
      key: 'course_name',
    },
    {
      title: 'Course Type',
      dataIndex: 'course_type',
      key: 'course_type',
    },
    {
      title: 'Category',
      dataIndex: 'course_category',
      key: 'course_category',
    },
    {
      title: 'Category ID',
      dataIndex: 'category_id',
      key: 'category_id',
    },
  ];

  return (
    <DashboardLayout title="Course Metadata Bulk Upload" isAdmin={true}>
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <Title level={2}>Course Metadata Bulk Upload</Title>
          <Paragraph>
            Upload course metadata in bulk using CSV or Excel files. This will create course metadata 
            that can be used as dropdown options in course creation forms.
          </Paragraph>

          <Alert
            message="Important Information"
            description={
              <div>
                <p>• Categories will be automatically created if they don't exist</p>
                <p>• Duplicate categories will not be created</p>
                <p>• Category matching is case-sensitive</p>
                <p>• Required columns: course_title, course_name, course_type, course_category</p>
              </div>
            }
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>Sample File Format</Title>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={downloadSampleCSV}
                type="dashed"
              >
                Download Sample CSV
              </Button>
            </div>

            <Divider />

            <div>
              <Title level={4}>Upload File</Title>
              <Dragger {...uploadProps} disabled={uploading}>
                <p className="ant-upload-drag-icon">
                  <FileExcelOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag CSV/Excel file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for CSV (.csv) and Excel (.xlsx, .xls) files. Maximum file size: 10MB
                </p>
              </Dragger>

              {uploading && uploadProgress > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text>Processing file...</Text>
                  <Progress percent={uploadProgress} status="active" />
                </div>
              )}
            </div>

            {uploadResult && (
              <div>
                <Divider />
                <Title level={4}>Upload Results</Title>
                
                {uploadResult.errors && uploadResult.errors.length > 0 ? (
                  <Alert
                    message="Upload completed with errors"
                    description={
                      <ul>
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                ) : (
                  <Alert
                    message={uploadResult.message}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                {uploadResult.created_metadata && uploadResult.created_metadata.length > 0 && (
                  <Table
                    columns={resultColumns}
                    dataSource={uploadResult.created_metadata}
                    rowKey={(record, index) => `${record.course_title}-${index}`}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                  />
                )}
              </div>
            )}
          </Space>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CourseMetadataBulkUpload;
