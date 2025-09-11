import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { Form, Input, Select } from "antd";
import { Button } from "../../../components";
import { message, Upload as AntDUpload } from "antd";
import { UploadIcon } from "../../../assets";
import "./upload.styles.scss";
import { countWords } from "../../../utils/helperFunction";
import { ClientRequest } from "../../../requests";
import api from "../../../Api";
import { toast } from "react-toastify";
import FollowTree from "../../../components/FollowTree";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";

const { Dragger } = AntDUpload;
const { TextArea } = Input; // Import TextArea from Ant Design

// Dragger props will be created inside component so we can access state

// Using dynamic options from API; no follow/unfollow here
const Upload: React.FC<any> = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const nav = useNavigate();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [subjectsTree, setSubjectsTree] = useState<any[]>([]);
  const [industries, setIndustries] = useState<Array<{ id: number; name: string }>>([]);
  const [industriesTree, setIndustriesTree] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingIndustries, setLoadingIndustries] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingSubjects(true);
        const res = (await api.get("/subjects_for_follow")) as any;
        console.debug('/subjects_for_follow raw (upload):', res);
        if (!active) return;
        const raw = res;
        const tree = raw?.tree ?? raw;
        let list: any[] = [];
        if (Array.isArray(tree)) list = tree;
        else if (tree && typeof tree === 'object' && tree.id != null) list = [tree];
        else if (Array.isArray(raw?.flat)) list = raw.flat;
        // flatten leaves to use in Select dropdowns (collect nodes with id)
        const flatten = (nodes: any[]): any[] => {
          const out: any[] = [];
          const walk = (arr: any[]) => {
            (arr || []).forEach((n) => {
              if (!n) return;
              if (n.selectable === true || (n.id != null && !Array.isArray(n.children))) out.push(n);
              else if (Array.isArray(n.children)) walk(n.children);
            });
          };
          walk(nodes || []);
          return out;
        };
    const leavesRaw = flatten(list);
    const leaves = leavesRaw.map((l: any) => { if (!l || typeof l !== 'object') return l; const c = { ...l }; delete c.selectable; return c; });
        if (active) {
          setSubjects(leaves as Array<{ id: number; name: string }>);
          // If list is flat (no children), rebuild a grouped tree by course_name
          const anyHasChildren = (list || []).some((n: any) => Array.isArray(n?.children) && n.children.length > 0);
          if (!anyHasChildren) {
            const groupMap = new Map<string, any[]>();
            (Array.isArray(list) ? list : []).forEach((item: any) => {
              if (!item) return;
              const keyRaw = item.course_name || item.courseTitle || item.category || 'Others';
              const key = String(keyRaw).trim() || 'Others';
              if (!groupMap.has(key)) groupMap.set(key, []);
              groupMap.get(key)!.push({ ...item, selectable: true });
            });
            const groups = Array.from(groupMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
            const makeGroupId = (name: string) => `group-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            const groupedTree = groups.map(([name, children]) => ({ id: makeGroupId(name), name, selectable: false, children }));
            setSubjectsTree(groupedTree);
          } else {
            setSubjectsTree(list || []);
          }
        }
      } catch (err: any) {
        console.error("Failed to load subjects", err);
        message.error(err?.response?.data?.error || "Failed to load subjects");
      } finally {
        setLoadingSubjects(false);
      }
      try {
        setLoadingIndustries(true);
        const res = (await api.get("/industries_for_follow")) as any;
        console.debug('/industries_for_follow raw (upload):', res);
        if (!active) return;
        const raw = res;
        const tree = raw?.tree ?? raw;
        let list: any[] = [];
        if (Array.isArray(tree)) list = tree;
        else if (tree && typeof tree === 'object' && tree.id != null) list = [tree];
        else if (Array.isArray(raw?.flat)) list = raw.flat;
        const flatten = (nodes: any[]): any[] => {
          const out: any[] = [];
          const walk = (arr: any[]) => {
            (arr || []).forEach((n) => {
              if (!n) return;
              if (n.selectable === true || (n.id != null && !Array.isArray(n.children))) out.push(n);
              else if (Array.isArray(n.children)) walk(n.children);
            });
          };
          walk(nodes || []);
          return out;
        };
    const leavesRaw = flatten(list);
    const leaves = leavesRaw.map((l: any) => { if (!l || typeof l !== 'object') return l; const c = { ...l }; delete c.selectable; return c; });
        if (active) {
          setIndustries(leaves as Array<{ id: number; name: string }>);
          setIndustriesTree(list || []);
        }
      } catch (err: any) {
        console.error("Failed to load industries", err);
        message.error(err?.response?.data?.error || "Failed to load industries");
      } finally {
        setLoadingIndustries(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      // Use controlled state to ensure values are present
      formData.append("title", title || values.title || "");
      formData.append("executive_summary", summary || values.executive_summary || "");
      formData.append("subject", values.subject);
      if (values.industry) formData.append("industry", values.industry);
      if (values.doi_link) formData.append("doi_link", values.doi_link);
      if (values.video_link) formData.append("video_link", values.video_link);
      if (documentFile) formData.append("document", documentFile);

      await ClientRequest.uploadPost(formData);
      toast.success("Uploaded successfully.");
      // Force-refresh notifications unread count in navbar immediately
      window.dispatchEvent(new Event('notifications:refresh'));
      nav(URL.HOME);
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Removed unused handleChange to satisfy TypeScript -- use specific handlers instead

  // Local selection state for guidance rendering
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedIndustryId, setSelectedIndustryId] = useState<number | null>(null);

  const handleSubjectSelectChange = (value: any) => {
    setSelectedSubjectId(value ?? null);
    console.log(`Selected subject: ${value}`);
  };

  const handleIndustrySelectChange = (value: any) => {
    setSelectedIndustryId(value ?? null);
    console.log(`Selected industry: ${value}`);
  };

  const handleSummaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = event.target.value;
    const wordCount = countWords(inputText);
    // Only update the text if the word count is within the limit
    if (wordCount <= 200) {
      setSummary(inputText);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;
    const wordCount = countWords(inputText);

    // Only update the text if the word count is within the limit
    if (wordCount <= 20) {
      setTitle(inputText);
    }
  };

  // Derived counts for live display
  const titleWordCount = countWords(title);
  const summaryWordCount = countWords(summary);

  return (
    <Layout>
      <div className="w-[90%] sm:w-3/5 mx-auto upload">
        <h2 className="text-[24px] sm:text-center my-[20px] font-semibold">
          Enterprise Project
        </h2>
        <p className="text-[16px] mb-[20px] writeup">
          Upload your enterprise project here. This may include some or all of the following: business plan or pitch deck that explains the business idea of your project, DOI of research work supporting your project, website or video link explaining your project. We strongly advise that you patent your idea/inventions where possible before you upload or post them to Sophia. By continuing to upload your work/manuscript for review and also by using this site, you agree that Sophia does not have any liability for your work or intellectual property in the case of theft.
        </p>

        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={handleSubmit}>
          <Form.Item label="Title" name={"title"}>
            <Input
              name="title"
              className="p-2"
              placeholder="Enter title (max 20 words)"
              value={title}
              onChange={handleTitleChange}
            />
            <div
              style={{
                color: titleWordCount <= 20 ? "#666" : "red",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              {`${titleWordCount}/20 words`}
            </div>
          </Form.Item>
          <Form.Item label="Executive summary" name={"executive_summary"}>
            <TextArea
              name="executive_summary"
              className="p-2"
              value={summary}
              onChange={handleSummaryChange}
              placeholder="Enter executive summary (max 200 words)"
              rows={4} // Set the number of rows for the textarea
            />
            <div
              style={{
                color: summaryWordCount <= 200 ? "#666" : "red",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              {`${summaryWordCount}/200 words`}
            </div>
          </Form.Item>
          <Form.Item label="Document" name={"document_path"}>
            <Dragger
              multiple={false}
              beforeUpload={(file) => {
                setDocumentFile(file);
                message.success(`${file.name} selected.`);
                return false; // prevent auto upload
              }}
              onRemove={() => {
                setDocumentFile(null);
              }}
              fileList={documentFile ? [{ uid: "-1", name: documentFile.name, status: "done" }] as any : []}
            >
              <p className="ant-upload-drag-icon flex justify-center">
                <UploadIcon />
              </p>
              <p className="ant-upload-hint">
                (max file size: 200mb - pdf, docx, ppt, xl)
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item label="Add Links" name="doi_link">
            <Input className="p-2" placeholder="DOI Link" />
          </Form.Item>
          <Form.Item label=" " name="video_link">
            <Input className="p-2 mt-[-10px] mb-[20px]" placeholder="Video Link" />
          </Form.Item>
          <Form.Item label="Subject(s) and industries your project belongs" name={"subject"}>
            {subjectsTree && subjectsTree.length > 0 ? (
              <FollowTree asDropdown={true} title="Subjects" placeholder="Search Subject" nodes={subjectsTree} checkedIds={selectedSubjectId != null ? [selectedSubjectId] : []} onChange={(ids) => handleSubjectSelectChange(ids && ids.length ? ids[0] : null)} />
            ) : (
              <Select
                placeholder="Search Subject"
                className="w-full bg-white h-[38px] rounded-sm"
                onChange={handleSubjectSelectChange}
                showSearch
                placement="bottomLeft"
                getPopupContainer={() => document.body}
                dropdownAlign={{ overflow: { adjustY: false } } as any}
                listHeight={240}
                loading={loadingSubjects}
                optionFilterProp="title"
                optionLabelProp="title"
                notFoundContent="No subjects available"
              >
                {subjects.map((s) => (
                  <Select.Option key={s.id} value={s.id} title={s.name}>
                    <div>
                      <div>{s.name}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            )}
            {/* Guidance: show metadata for the selected subject */}
            <div id="subject-guidance" className="text-sm text-[#666666] mt-2" aria-live="polite">
              {selectedSubjectId != null && (() => {
                const meta = subjects.find((x) => x.id === selectedSubjectId);
                if (!meta) return null;
                const extraKeys = Object.keys(meta).filter((k) => k !== "id" && k !== "name" && k !== "selectable");
                if (!extraKeys.length) return null;
                return extraKeys.map((k) => (<div key={k}><strong>{k}:</strong> {String((meta as any)[k])}</div>));
              })()}
            </div>
          </Form.Item>
          <Form.Item label="Industry" name={"industry"}>
            {industriesTree && industriesTree.length > 0 ? (
              <FollowTree asDropdown={true} title="Industries" placeholder="Select Industry" nodes={industriesTree} checkedIds={selectedIndustryId != null ? [selectedIndustryId] : []} onChange={(ids) => handleIndustrySelectChange(ids && ids.length ? ids[0] : null)} />
            ) : (
              <Select
                id="industry-select"
                placeholder="Select Industry"
                className="w-full bg-white h-[38px] rounded-sm"
                onChange={handleIndustrySelectChange}
                showSearch
                placement="bottomLeft"
                getPopupContainer={() => document.body}
                dropdownAlign={{ overflow: { adjustY: false } } as any}
                listHeight={240}
                loading={loadingIndustries}
                optionFilterProp="title"
                optionLabelProp="title"
                notFoundContent="No industries available"
              >
                {industries.map((i) => (
                  <Select.Option key={i.id} value={i.id} title={i.name}>
                    <div>
                      <div>{i.name}</div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            )}
            {/* Guidance: show metadata for the selected industry */}
            <div id="industry-guidance" className="text-sm text-[#666666] mt-2" aria-live="polite">
              {selectedIndustryId != null && (() => {
                const meta = industries.find((x) => x.id === selectedIndustryId);
                if (!meta) return null;
                const extraKeys = Object.keys(meta).filter((k) => k !== "id" && k !== "name" && k !== "selectable");
                if (!extraKeys.length) return null;
                return extraKeys.map((k) => (<div key={k}><strong>{k}:</strong> {String((meta as any)[k])}</div>));
              })()}
            </div>
          </Form.Item>
          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <Button
              label={"Submit"}
              htmlType="submit"
              loading={loading}
              className="p-[20px] w-full sm:w-[200px] bg-[#581A57] text-white mb-[90px]"
            />
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default Upload;
