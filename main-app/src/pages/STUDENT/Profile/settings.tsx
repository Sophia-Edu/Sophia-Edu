import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { avatar, profileBG } from "../../../assets";
import { Avatar, Form, Input, message, Checkbox, Spin } from "antd";
import { HeatMapOutlined } from "@ant-design/icons";
import "./profile.styles.scss";
import { useUser } from "../../../store";
import api from "../../../Api";
import FollowTree from "../../../components/FollowTree";

const Profile: React.FC<any> = () => {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [subjectsTree, setSubjectsTree] = useState<any[]>([]);
  const [industries, setIndustries] = useState<Array<{ id: number; name: string }>>([]);
  const [industriesTree, setIndustriesTree] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingIndustries, setLoadingIndustries] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Local selected state (without server readback endpoint, starts empty)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<number[]>([]);

  // Hydrate selected follows from localStorage (temporary until backend provides fetch follows)
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem("followed_subject_ids");
      const savedIndustries = localStorage.getItem("followed_industry_ids");
      if (savedSubjects) setSelectedSubjectIds(JSON.parse(savedSubjects));
      if (savedIndustries) setSelectedIndustryIds(JSON.parse(savedIndustries));
    } catch {}
  }, []);

  // Load dropdown data for follows
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = (await api.get("/subjects_for_follow")) as any;
        console.debug('/subjects_for_follow raw (settings):', res);
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
  let leaves = flatten(list);
  leaves = leaves.map((l: any) => { if (!l || typeof l !== 'object') return l; const c = { ...l }; delete c.selectable; return c; });
  setSubjects(leaves as Array<{ id: number; name: string }>);
  setSubjectsTree(list || []);
      } catch (err: any) {
        console.error("Failed to load subjects", err);
        message.error(err?.response?.data?.error || "Failed to load subjects");
      } finally {
        setLoadingSubjects(false);
      }
    };

    const loadIndustries = async () => {
      try {
        setLoadingIndustries(true);
        const res = (await api.get("/industries_for_follow")) as any;
        console.debug('/industries_for_follow raw (settings):', res);
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
  let leaves = flatten(list);
  leaves = leaves.map((l: any) => { if (!l || typeof l !== 'object') return l; const c = { ...l }; delete c.selectable; return c; });
  setIndustries(leaves as Array<{ id: number; name: string }>);
  setIndustriesTree(list || []);
      } catch (err: any) {
        console.error("Failed to load industries", err);
        message.error(err?.response?.data?.error || "Failed to load industries");
      } finally {
        setLoadingIndustries(false);
      }
    };

    loadSubjects();
    loadIndustries();
  }, []);
  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user]);

  // Checkbox change handlers – diff old vs new
  const onSubjectsChange = async (newIds: Array<number>) => {
    console.log("Subjects changed ->", newIds);
    const prev = new Set(selectedSubjectIds);
    const next = new Set(newIds);
    const toFollow = Array.from(next).filter((id) => !prev.has(id));
    const toUnfollow = Array.from(prev).filter((id) => !next.has(id));
    setSelectedSubjectIds(newIds as number[]);
    // persist
    try { localStorage.setItem("followed_subject_ids", JSON.stringify(newIds)); } catch {}
    if (toFollow.length === 0 && toUnfollow.length === 0) return;
    setSubmitting(true);
    const key = "follow-subjects-loading";
    message.loading({ content: "Updating subjects...", key });
    try {
      const validToFollow = toFollow.map((id) => Number(id)).filter((n) => Number.isFinite(n));
      const validToUnfollow = toUnfollow.map((id) => Number(id)).filter((n) => Number.isFinite(n));
      if (validToFollow.length === 0 && validToUnfollow.length === 0) {
        console.warn('No valid subject ids to follow/unfollow; dropped invalid ids', { toFollow, toUnfollow });
      } else {
        await Promise.all([
          ...validToFollow.map((id) => api.post(`/subjects/${id}/follow`)),
          ...validToUnfollow.map((id) => api.post(`/subjects/${id}/unfollow`)),
        ]);
      }
      if (toFollow.length) message.success(`Followed ${toFollow.length} subject(s)`, 2);
      if (toUnfollow.length) message.success(`Unfollowed ${toUnfollow.length} subject(s)`, 2);
      message.success({ content: "Subjects updated", key, duration: 1.5 });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to update subjects";
      console.error("Subjects update failed", err);
      message.error({ content: msg, key });
    } finally {
      setSubmitting(false);
    }
  };

  const onIndustriesChange = async (newIds: Array<number>) => {
    console.log("Industries changed ->", newIds);
    const prev = new Set(selectedIndustryIds);
    const next = new Set(newIds);
    const toFollow = Array.from(next).filter((id) => !prev.has(id));
    const toUnfollow = Array.from(prev).filter((id) => !next.has(id));
    setSelectedIndustryIds(newIds as number[]);
    // persist
    try { localStorage.setItem("followed_industry_ids", JSON.stringify(newIds)); } catch {}
    if (toFollow.length === 0 && toUnfollow.length === 0) return;
    setSubmitting(true);
    const key = "follow-industries-loading";
    message.loading({ content: "Updating industries...", key });
    try {
      const validToFollow = toFollow.map((id) => Number(id)).filter((n) => Number.isFinite(n));
      const validToUnfollow = toUnfollow.map((id) => Number(id)).filter((n) => Number.isFinite(n));
      if (validToFollow.length === 0 && validToUnfollow.length === 0) {
        console.warn('No valid industry ids to follow/unfollow; dropped invalid ids', { toFollow, toUnfollow });
      } else {
        await Promise.all([
          ...validToFollow.map((id) => api.post(`/industries/${id}/follow`)),
          ...validToUnfollow.map((id) => api.post(`/industries/${id}/unfollow`)),
        ]);
      }
      if (toFollow.length) message.success(`Followed ${toFollow.length} industry/industries`, 2);
      if (toUnfollow.length) message.success(`Unfollowed ${toUnfollow.length} industry/industries`, 2);
      message.success({ content: "Industries updated", key, duration: 1.5 });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to update industries";
      console.error("Industries update failed", err);
      message.error({ content: msg, key });
    } finally {
      setSubmitting(false);
    }
  };

  const reloadLists = () => {
    // Re-run initial effects by calling endpoints again
    (async () => {
      try {
        setLoadingSubjects(true);
        const s = (await api.get("/subjects_for_follow")) as any;
        setSubjects((Array.isArray(s) ? s : []) as Array<{ id: number; name: string }>);
      } catch (e) { console.error(e); } finally { setLoadingSubjects(false); }
      try {
        setLoadingIndustries(true);
        const i = (await api.get("/industries_for_follow")) as any;
        setIndustries((Array.isArray(i) ? i : []) as Array<{ id: number; name: string }>);
      } catch (e) { console.error(e); } finally { setLoadingIndustries(false); }
    })();
  };
  return (
    <Layout>
      <div className="w-4/5 mx-auto profile">
        <div className="relative">
          <img
            alt="example"
            src={profileBG} // Changed to use image prop
            className="h-[200px] w-full object-cover rounded-md"
          />
          <div className="flex justify-between">
            <div className="mb-3 relative flex gap-2 bottom-[36px] sm:bottom-[20px]  left-[100px] ">
              <Avatar
                size={64}
                className="border-4 border-solid border-white "
                src={avatar} // Changed to use avatar prop
              />
              <div className=" flex flex-col gap-y-1">
                <h2 className="text-[16px] font-medium mt-[18px]">
                  Aluko Opeyemi Folajimi
                </h2>
                <p className="text-[#808080] text-[14px] ">
                  <HeatMapOutlined />
                  Location
                </p>
                <p className="text-[#808080] text-[14px]">
                  Change Profile Picture
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <p className="text-[16px] font-medium mt-[18px] text-[#808080]">
                Bio - information
              </p>
              <p className="text-[16px] font-medium mt-[18px] underline">
                Settings
              </p>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="flex gap-2 my-[28px]">
          <div className="w-1/2">
            <div>
              <h3 className="mb-[10px] text-[24px] font-semibold">
                Contact Details
              </h3>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                Take an insight into your basic unique credentials on our
                platform you can trust us for securities of them.
              </p>
            </div>
          </div>
          <div className="w-1/2">
            <Form layout="vertical" form={form}>
              <Form.Item
                label="Email Address"
                className="inter-normal"
                name="email"
              >
                <Input placeholder="folajimi....@gmail.com" className="p-2" />
              </Form.Item>
              <Form.Item label="Phone Number" className="inter-normal">
                <Input placeholder="+2347067903042" className="p-2" />
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* follow subject and industries */}
        <div className="flex gap-2 my-[28px]">
          <div className="w-1/2">
            <div>
              <h3 className="mb-[10px] text-[24px] font-semibold">
                Follow subjects and industries
              </h3>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                Let our recommendation system suggest your preferred project
                based on the subjects and industries you follow
              </p>
            </div>
          </div>
          <div className="w-1/2">
            <Form layout="vertical">
              <Form.Item label="Follow Subjects" className="inter-normal">
                <Spin spinning={loadingSubjects || submitting}>
                  {subjectsTree && subjectsTree.length > 0 ? (
                    <FollowTree asDropdown={true} title="Subjects" placeholder="Search Subject" nodes={subjectsTree} checkedIds={selectedSubjectIds} onChange={(ids) => onSubjectsChange(ids)} />
                  ) : subjects.length > 0 ? (
                    <Checkbox.Group
                      className="grid grid-cols-1 sm:grid-cols-2 gap-y-2"
                      value={selectedSubjectIds}
                      onChange={(vals) => onSubjectsChange(vals as number[])}
                      options={subjects.map((s) => ({ label: s.name, value: s.id }))}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      No subjects available. <button type="button" className="underline text-blue-600" onClick={reloadLists}>Reload</button>
                    </div>
                  )}
                </Spin>
              </Form.Item>

              <Form.Item label="Follow Industries" name={"industry"}>
                <Spin spinning={loadingIndustries || submitting}>
                  {industriesTree && industriesTree.length > 0 ? (
                    <FollowTree asDropdown={true} title="Industries" placeholder="Select Industry" nodes={industriesTree} checkedIds={selectedIndustryIds} onChange={(ids) => onIndustriesChange(ids)} />
                  ) : industries.length > 0 ? (
                    <Checkbox.Group
                      className="grid grid-cols-1 sm:grid-cols-2 gap-y-2"
                      value={selectedIndustryIds}
                      onChange={(vals) => onIndustriesChange(vals as number[])}
                      options={industries.map((i) => ({ label: i.name, value: i.id }))}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      No industries available. <button type="button" className="underline text-blue-600" onClick={reloadLists}>Reload</button>
                    </div>
                  )}
                </Spin>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Reset password */}
        <div className="flex gap-2 my-[28px]">
          <div className="w-1/2">
            <div>
              <h3 className="mb-[10px] text-[24px] font-semibold">
                Reset Password
              </h3>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                Reset your password by confirm via out platform and your email
                account
              </p>
            </div>
          </div>
          <div className="w-1/2">
            <Form layout="vertical">
              <Form.Item label="Current Password" className="inter-normal">
                <Input
                  placeholder="*********"
                  type="password"
                  className="p-2"
                />
              </Form.Item>
              <Form.Item label="New Password" className="inter-normal">
                <Input type="password" className="p-2" />
              </Form.Item>
              <Form.Item label="Confirm Password" className="inter-normal">
                <Input
                  placeholder="*********"
                  type="password"
                  className="p-2"
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
