import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../DashboardLayout";
import { Tabs, Form, Input, Button, Upload, message, Typography, Checkbox, Spin } from "antd";
import type { UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { AdminRequest } from "../../../requests";
import api from "../../../Api";

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
        let uploadFile = file as File;
        const name = (uploadFile as any).name || "";
        const lowerName = name.toLowerCase();
        const isCSV = lowerName.endsWith(".csv") || (uploadFile.type || "").includes("csv");

        if (isCSV) {
          const text = await uploadFile.text();
          const lines = text.split(/\r?\n/);
          if (lines.length > 0) {
            const headers = lines[0].split(",").map((h) => h.trim());
            const lowerHeaders = headers.map((h) => h.toLowerCase());
            const removeIdx = lowerHeaders.findIndex(
              (h) => h === "course_category" || h === "coursecategory" || h === "course category"
            );
            if (removeIdx !== -1) {
              const newLines = lines.map((line) => {
                if (!line) return line;
                const cols = line.split(",");
                if (cols.length <= removeIdx) return line;
                cols.splice(removeIdx, 1);
                return cols.join(",");
              });
              const newContent = newLines.join("\n");
              uploadFile = new File([newContent], name, { type: "text/csv" });
            }
          }
        }

        await AdminRequest.uploadSubjectsFile(uploadFile);
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

  // -- Follow tree preview (fetch + display only) -------------------------------------------------
  const [subjectsTree, setSubjectsTree] = useState<any[]>([]);
  const [industriesTree, setIndustriesTree] = useState<any[]>([]);
  const [rawSubjectsResponse, setRawSubjectsResponse] = useState<any>(null);
  const [rawIndustriesResponse, setRawIndustriesResponse] = useState<any>(null);
  const [loadingSubjectsTree, setLoadingSubjectsTree] = useState(false);
  const [loadingIndustriesTree, setLoadingIndustriesTree] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(new Set());
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingSubjectsTree(true);
  const s: any = await api.get("/subjects_for_follow");
  console.debug("/subjects_for_follow raw:", s);
  setRawSubjectsResponse(s);
  if (!active) return;
  // Normalize possible shapes:
  // - { tree: [...] }
  // - [{...}, {...}]
  // - { tree: {...} } (single root)
  // - { flat: [...] }
  const raw = s;
  const tree = raw?.tree ?? raw;
  let subjects: any[] = [];
  if (Array.isArray(tree)) subjects = tree;
  else if (tree && typeof tree === 'object' && tree.id != null) subjects = [tree];
  else if (Array.isArray(raw?.flat)) subjects = raw.flat;
  setSubjectsTree(subjects || []);
      } catch (err: any) {
        console.error("Failed to load subjects for follow", err);
        message.error(err?.response?.data?.error || "Failed to load subjects for follow");
      } finally {
        setLoadingSubjectsTree(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingIndustriesTree(true);
  const i: any = await api.get("/industries_for_follow");
  console.debug("/industries_for_follow raw:", i);
  setRawIndustriesResponse(i);
  if (!active) return;
  const raw = i;
  const tree = raw?.tree ?? raw;
  let industries: any[] = [];
  if (Array.isArray(tree)) industries = tree;
  else if (tree && typeof tree === 'object' && tree.id != null) industries = [tree];
  else if (Array.isArray(raw?.flat)) industries = raw.flat;
  setIndustriesTree(industries || []);
      } catch (err: any) {
        console.error("Failed to load industries for follow", err);
        message.error(err?.response?.data?.error || "Failed to load industries for follow");
      } finally {
        setLoadingIndustriesTree(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const toggleLocalSelection = useCallback((id: number, type: "subject" | "industry") => {
    if (type === "subject") {
      setSelectedSubjectIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        try { localStorage.setItem("admin_preview_selected_subject_ids", JSON.stringify(Array.from(next))); } catch {};
        return next;
      });
    } else {
      setSelectedIndustryIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        try { localStorage.setItem("admin_preview_selected_industry_ids", JSON.stringify(Array.from(next))); } catch {};
        return next;
      });
    }
  }, []);

  // Hydrate preview selections from localStorage (non-critical)
  useEffect(() => {
    try {
      const s = localStorage.getItem("admin_preview_selected_subject_ids");
      const i = localStorage.getItem("admin_preview_selected_industry_ids");
      if (s) setSelectedSubjectIds(new Set(JSON.parse(s)));
      if (i) setSelectedIndustryIds(new Set(JSON.parse(i)));
    } catch {}
  }, []);

  const RenderNode: React.FC<{ node: any; type: "subject" | "industry" }> = ({ node, type }) => {
    if (!node) return null;
    // Treat as leaf if explicitly selectable OR has an id (legacy flat items)
    const isLeaf = node.selectable === true || (node.id != null && !Array.isArray(node.children));
  if (isLeaf) {
      const id = node.id;
      const checked = type === "subject" ? selectedSubjectIds.has(id) : selectedIndustryIds.has(id);
      return (
        <div style={{ paddingLeft: 16, paddingTop: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Checkbox checked={checked} onChange={() => toggleLocalSelection(id, type)} />
      <span>{node.label ?? node.name ?? node.title}</span>
            {(node.course_name || node.course_title) ? (
              <small style={{ color: '#888', marginLeft: 8 }}>| {node.course_title || node.course_name}</small>
            ) : null}
          </label>
        </div>
      );
    }
    // group node
    return (
      <div style={{ marginLeft: 8, marginTop: 6 }}>
        <div style={{ fontWeight: 600 }}>{node.label}</div>
        <div>
          {Array.isArray(node.children) && node.children.map((c: any, idx: number) => (
            <RenderNode key={idx} node={c} type={type} />
          ))}
        </div>
      </div>
    );
  };

  const flattenLeaves = (nodes: any[]): any[] => {
    const out: any[] = [];
    const walk = (arr: any[]) => {
      (arr || []).forEach((n) => {
        if (!n) return;
    if (n.selectable === true || (n.id != null && !Array.isArray(n.children))) {
      out.push({ id: n.id, label: n.label ?? n.name ?? n.title, raw: n });
        } else if (Array.isArray(n.children)) {
          walk(n.children);
        }
      });
    };
    walk(nodes || []);
    return out;
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
        {/* Debug panel: raw responses and flattened leaves */}
        <div style={{ marginTop: 20, padding: 12, background: '#fafafa', borderRadius: 6 }}>
          <Title level={5}>Debug: subjects_for_follow (raw)</Title>
          <pre style={{ maxHeight: 160, overflow: 'auto', background: '#fff', padding: 8 }}>{JSON.stringify(rawSubjectsResponse, null, 2)}</pre>
          <div style={{ marginTop: 8 }}>
            <strong>Flattened leaves:</strong>
            <pre style={{ maxHeight: 120, overflow: 'auto', background: '#fff', padding: 8 }}>{JSON.stringify(flattenLeaves(subjectsTree), null, 2)}</pre>
          </div>
          <Title level={5} style={{ marginTop: 12 }}>Debug: industries_for_follow (raw)</Title>
          <pre style={{ maxHeight: 160, overflow: 'auto', background: '#fff', padding: 8 }}>{JSON.stringify(rawIndustriesResponse, null, 2)}</pre>
          <div style={{ marginTop: 8 }}>
            <strong>Flattened leaves:</strong>
            <pre style={{ maxHeight: 120, overflow: 'auto', background: '#fff', padding: 8 }}>{JSON.stringify(flattenLeaves(industriesTree), null, 2)}</pre>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubjectsIndustriesUploadPage;
