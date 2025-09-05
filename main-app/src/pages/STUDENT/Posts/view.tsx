import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spin, message, Modal as AntModal } from "antd";
import Layout from "../../Layout";
import { ClientRequest } from "../../../requests";
import { LinkIcon, WarningIcon, LockIcon, OpenLockIcon } from "../../../assets";
import { useUser } from "../../../store";
import { URL } from "../../../utils/constants";

// Convert absolute filesystem path to web path if it points under uploads/static
const fsPathToUploadsUrl = (p: string): string | undefined => {
  if (!p) return undefined;
  const norm = p.replace(/\\/g, '/');
  const idx = norm.toLowerCase().lastIndexOf('/uploads/');
  if (idx >= 0) {
    const tail = norm.slice(idx + '/uploads/'.length);
    return `/uploads/${tail}`;
  }
  const idx2 = norm.toLowerCase().lastIndexOf('/static/uploads/');
  if (idx2 >= 0) {
    const tail = norm.slice(idx2 + '/static/uploads/'.length);
    return `/uploads/${tail}`;
  }
  return undefined;
};

// Build absolute URL from potential relative path or filesystem path
const normalizeToAbsoluteUrl = (u?: string): string | undefined => {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[a-zA-Z]:\\\\|^\\\\\\\\|\/(?:[a-zA-Z0-9_\-.]+\/)+/.test(u) || u.includes('static') || u.includes('uploads')) {
    const maybe = fsPathToUploadsUrl(u);
    if (maybe) u = maybe;
  }
  try {
    if (u.startsWith('/')) return `${window.location.origin}${u}`;
    return `${window.location.origin}/${u.replace(/^\.?\/?/, '')}`;
  } catch {
    return u;
  }
};

const getPostFileUrl = (post: any): string | undefined => {
  const nested = [
    post?.file?.url,
    post?.file?.path,
    post?.file?.location,
    post?.attachment?.url,
    post?.attachment?.path,
    post?.document?.url,
    post?.document?.path,
    Array.isArray(post?.documents) ? post?.documents?.[0]?.url : undefined,
    Array.isArray(post?.documents) ? post?.documents?.[0]?.path : undefined,
  ];
  const flat = [
    post?.file_url,
    post?.document_url,
    post?.attachment_url,
    post?.file_link,
    post?.file_path,
    post?.file,
    post?.document,
    post?.document_path,
    post?.documentPath,
    post?.document_file,
    post?.documentFile,
    post?.attachmentUrl,
    post?.pdf_url,
    post?.pdfUrl,
    post?.paper_url,
    post?.paperUrl,
  ];
  const found = [...nested, ...flat].find((v) => typeof v === 'string' && v.length > 0) as string | undefined;
  return normalizeToAbsoluteUrl(found);
};

const getSummary = (post: any) =>
  post?.executive_summary || post?.summary || post?.abstract || post?.description || "";

const PostViewer: React.FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useUser();
  const isSubscribed = Boolean(user?.is_subscribed);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const p = await ClientRequest.getUserPost(id);
        setPost(p);
      } catch (e: any) {
        message.error(e?.message || "Could not load post");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const openDoc = async () => {
    if (!post) return;
    if (!isSubscribed) {
      AntModal.confirm({
        title: "This document is for subscribers",
        icon: undefined,
        content: (
          <div className="flex items-center gap-2 mt-2">
            <LockIcon />
            <span>Subscribe to unlock and view documents.</span>
          </div>
        ),
        okText: "Go to Wallet",
        cancelText: "Cancel",
        onOk: () => nav(URL.WALLET),
      });
      return;
    }
    const url = getPostFileUrl(post);
    if (url) {
      window.open(url, "_blank");
    } else {
      message.info("No document attached for this post");
    }
  };

  return (
    <Layout>
      <div className="px-[10px] lg:px-[80px] py-4 min-h-screen">
        {loading ? (
          <div className="w-full flex items-center justify-center py-10"><Spin /></div>
        ) : !post ? (
          <div className="bg-white p-4 rounded">Post not found.</div>
        ) : (
          <div className="bg-white p-4 rounded">
            <h1 className="text-xl font-semibold mb-2">{post?.title}</h1>
            {getSummary(post) && (
              <p className="text-sm text-[#666] mb-3">{getSummary(post)}</p>
            )}

            <div className="flex gap-4 items-center">
              <Button type="primary" onClick={openDoc} style={{ background: '#581A57' }} disabled={!isSubscribed}>
                {isSubscribed ? (
                  <span className="flex items-center gap-1"><OpenLockIcon /> Open Document</span>
                ) : (
                  <span className="flex items-center gap-1"><LockIcon /> Locked</span>
                )}
              </Button>
              {post?.video_link && (
                isSubscribed ? (
                  <a href={post.video_link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#581A57] flex items-center gap-1">
                    <LinkIcon /> {post.video_link}
                  </a>
                ) : (
                  <span aria-disabled tabIndex={-1} className="text-xs text-[#581A57] flex items-center gap-1 opacity-60 cursor-not-allowed" title="Subscribe to access">
                    <LinkIcon /> {post.video_link}
                  </span>
                )
              )}
              {post?.doi_link && (
                isSubscribed ? (
                  <a href={post.doi_link} target="_blank" rel="noopener noreferrer" className="text-xs text-[#581A57] flex items-center gap-1">
                    <WarningIcon /> {post.doi_link}
                  </a>
                ) : (
                  <span aria-disabled tabIndex={-1} className="text-xs text-[#581A57] flex items-center gap-1 opacity-60 cursor-not-allowed" title="Subscribe to access">
                    <WarningIcon /> {post.doi_link}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PostViewer;
