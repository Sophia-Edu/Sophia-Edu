import React, { useState } from "react";
import Layout from "../../DashboardLayout";
import { Tabs, Form, Input, Button, Upload, message, Typography } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { AdminRequest } from "../../../requests";

const { Title, Paragraph } = Typography;

const SubjectsIndustriesUploadPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

  // Single create forms
  const [subjectForm] = Form.useForm();
  const [industryForm] = Form.useForm();

  const onCreateSubject = async (values: any) => {
    setSubmitting(true);
    try {
      await AdminRequest.createSubject(values);
      message.success("Subject created");
      subjectForm.resetFields();
    } catch (e: any) {
      message.error(e.message || "Failed to create subject");
    } finally {
      setSubmitting(false);
    }
  };

  const onCreateIndustry = async (values: any) => {
    setSubmitting(true);
    try {
      await AdminRequest.createIndustry(values);
      message.success("Industry created");
      industryForm.resetFields();
    } catch (e: any) {
      message.error(e.message || "Failed to create industry");
    } finally {
      setSubmitting(false);
    }
  };

  // Removed JSON bulk input; using file upload only for bulk

  // File uploads
  const subjectsUploadProps: UploadProps = {
    name: "file",
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    multiple: false,
    customRequest: async ({ file, onError, onSuccess }: any) => {
      try {
        await AdminRequest.uploadSubjectsFile(file as File);
        onSuccess?.({});
        message.success("Subjects file uploaded (processed in bulk endpoint)");
      } catch (e: any) {
        onError?.(e);
        message.error(e.message || "Upload failed");
      }
    },
    maxCount: 1,
    showUploadList: true,
  };

  const industriesUploadProps: UploadProps = {
    name: "file",
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    multiple: false,
    customRequest: async ({ file, onError, onSuccess }: any) => {
      try {
        await AdminRequest.uploadIndustriesFile(file as File);
        onSuccess?.({});
        message.success("Industries file uploaded (processed in bulk endpoint)");
      } catch (e: any) {
        onError?.(e);
        message.error(e.message || "Upload failed");
      }
    },
    maxCount: 1,
    showUploadList: true,
  };

  return (
    <Layout title="Subjects & Industries" isAdmin>
      <div className="px-4">
        <Title level={3}>Upload Subjects and Industries</Title>
        <Paragraph className="text-[#666]">
          Single create or CSV/XLSX upload. Headers/keys: Subjects
          (title or name, course_category, course_type, course_name, course_title). Industries (title or name, industry, supersector, sector, subsector).
        </Paragraph>
        <Tabs
          defaultActiveKey="subjects"
          items={[
            {
              key: "subjects",
              label: "Subjects",
              children: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Title level={4}>Single Create (JSON)</Title>
                    <Form layout="vertical" form={subjectForm} onFinish={onCreateSubject}>
                      <Form.Item name="title" label="Title or Name" rules={[{ required: true }]}>
                        <Input placeholder="Mathematics" />
                      </Form.Item>
                      <Form.Item name="course_category" label="Course Category">
                        <Input placeholder="STEM" />
                      </Form.Item>
                      <Form.Item name="course_type" label="Course Type">
                        <Input placeholder="Undergraduate" />
                      </Form.Item>
                      <Form.Item name="course_name" label="Course Name">
                        <Input placeholder="BSc Math" />
                      </Form.Item>
                      <Form.Item name="course_title" label="Course Title">
                        <Input placeholder="Linear Algebra I" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#581A57]">Create Subject</Button>
                    </Form>
                  </div>
                  <div>
                    <Title level={5}>Bulk Create (CSV/XLSX)</Title>
                    <Upload.Dragger {...subjectsUploadProps} className="mt-2">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag CSV/XLSX file to upload</p>
                    </Upload.Dragger>
                  </div>
                </div>
              ),
            },
            {
              key: "industries",
              label: "Industries",
              children: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Title level={4}>Single Create (JSON)</Title>
                    <Form layout="vertical" form={industryForm} onFinish={onCreateIndustry}>
                      <Form.Item name="title" label="Title or Name" rules={[{ required: true }]}>
                        <Input placeholder="Information Technology" />
                      </Form.Item>
                      <Form.Item name="industry" label="Industry">
                        <Input placeholder="Technology" />
                      </Form.Item>
                      <Form.Item name="supersector" label="Supersector">
                        <Input placeholder="Software & Services" />
                      </Form.Item>
                      <Form.Item name="sector" label="Sector">
                        <Input placeholder="Software" />
                      </Form.Item>
                      <Form.Item name="subsector" label="Subsector">
                        <Input placeholder="Application Software" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={submitting} className="bg-[#581A57]">Create Industry</Button>
                    </Form>
                  </div>
                  <div>
                    <Title level={5}>Bulk Create (CSV/XLSX)</Title>
                    <Upload.Dragger {...industriesUploadProps} className="mt-2">
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Click or drag CSV/XLSX file to upload</p>
                    </Upload.Dragger>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Layout>
  );
};

export default SubjectsIndustriesUploadPage;
