import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Layout";
import {
  AddressLocator,
  CommentIcon,
  DislikeIcon,
  IndicatorIcon,
  LikeIcon,
  LinkIcon,
  PDFIcon,
  LockIcon,
  OpenLockIcon,
  ThreeDotsIcon,
  WarningIcon,
  Logo,
} from "../../../assets";
import { Button, Modal } from "../../../components";
import { Dropdown, Input, MenuProps, Space, message, Modal as AntModal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";
import { useUser } from "../../../store";
import { getAvatar } from "../../../utils/helperFunction";
import { ClientRequest } from "../../../requests";

const { Option } = Select;

const HomePage: React.FC = () => {
  const nav = useNavigate();
  const { user } = useUser();
  const isSubscribed = Boolean(user?.is_subscribed);
  const [isExpanded, setIsExpanded] = useState(false); // Track if summary is expanded
  const maxLength = 20; // Maximum length for truncated summary

  // Toggle between expanded and truncated summary
  const toggleSummary = () => {
    setIsExpanded(!isExpanded);
  };

  // payment disabled

  // Paywall: show modal prompting user to subscribe/go to wallet
  const showPaywall = () => {
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
  };

  // payment disabled: remove related state
  const [posts, setPosts] = useState<any[]>([]);
  const [recentReads, setRecentReads] = useState<any[]>([]);
  const [commentsByPost, setCommentsByPost] = useState<Record<number, { items: any[]; open: boolean; loading: boolean; newContent: string; submitting: boolean; visibleCount: number }>>({});
  // Track local shared state (idempotent per backend guide)
  const [sharedByPost, setSharedByPost] = useState<Record<number, boolean>>({});

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  // Pagination state for posts
  const [page, setPage] = useState<number>(1);
  const perPage = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadPosts = async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const targetPage = reset ? 1 : page;
      const { items, pagination } = await ClientRequest.getGlobalFeed({ page: targetPage, per_page: perPage });
      // Map global feed items (post | repost) to a post-like shape the UI understands
      const mapped = (items || []).map((it: any) => {
        if (it?.type === 'repost' && it?.original_post) {
          const p = { ...it.original_post };
          // annotate for future UI use (e.g., "Reposted by ...")
          (p as any)._repost = true;
          (p as any)._reposter = it.reposter;
          (p as any)._repost_created_at = it.created_at;
          return p;
        }
        return it;
      });
      setPosts((prev) => (reset ? (mapped || []) : [...prev, ...(mapped || [])]));
      // Determine if there are more pages
      // Normalize pagination checks: use explicit guards instead of nullish coalescing of boolean
      const pag = pagination as any;
      const hasNextFromFlag = typeof pag?.has_next === 'boolean' ? pag.has_next : undefined;
      const hasNextFromNextPage = (pag?.next_page != null) ? true : undefined;
      const hasNextFromCounts = (pag?.total && pag?.per_page && pag?.page)
        ? ((pag.page * pag.per_page) < pag.total)
        : (((items as any)?.length ?? 0) === perPage);
      const hasNext = Boolean(hasNextFromFlag ?? hasNextFromNextPage ?? hasNextFromCounts);
      setHasMore(hasNext);
      if (hasNext) setPage(targetPage + 1);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const { posts: recents } = await ClientRequest.getRecentReads({ page: 1, per_page: 6, snippet_length: 80 });
        setRecentReads(recents || []);
      } catch {}
    };
    loadPosts(true);
    fetchRecent();
  }, []);

  // Infinite scroll: observe sentinel at bottom
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadPosts(false);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading]);

  const applyVoteLocally = (postId: number, vote_type: 'upvote' | 'downvote', resCounts?: { upvote_count: number; downvote_count: number }) => {
    setPosts((prev) => prev.map((p: any) => {
      if (p.id !== postId) return p;
      const next = { ...p };
      if (resCounts) {
        next.upvote_count = resCounts.upvote_count;
        next.downvote_count = resCounts.downvote_count;
      }
      // Toggle logic based on API behavior; use returned counters and flip user_vote accordingly
      if (p.user_vote === vote_type) {
        next.user_vote = null;
      } else {
        next.user_vote = vote_type;
      }
      return next;
    }));
  };

  const handleVote = async (postId: number, vote_type: 'upvote' | 'downvote') => {
    try {
      const res: any = await ClientRequest.voteOnPost(postId, vote_type);
      applyVoteLocally(postId, vote_type, { upvote_count: res?.upvote_count ?? 0, downvote_count: res?.downvote_count ?? 0 });
    } catch {}
  };

  const toggleComments = async (postId: number) => {
    setCommentsByPost((prev) => {
      const cur = prev[postId] || { items: [], open: false, loading: false, newContent: "", submitting: false, visibleCount: 0 };
      const willOpen = !cur.open;
      return { ...prev, [postId]: { ...cur, open: willOpen, visibleCount: willOpen ? Math.min(5, cur.items.length) : cur.visibleCount } };
    });
    // Load comments on first open
    const state = commentsByPost[postId];
    if (!state || (state.items.length === 0 && !state.loading)) {
      setCommentsByPost((prev) => ({ ...prev, [postId]: { ...(prev[postId] || { open: true, newContent: "", submitting: false, visibleCount: 0 }), items: [], loading: true } }));
      try {
        const items = await ClientRequest.listPostComments(postId);
        setCommentsByPost((prev) => ({ ...prev, [postId]: { ...(prev[postId] || { open: true, newContent: "", submitting: false, visibleCount: 0 }), items, loading: false, visibleCount: Math.min(5, items.length) } }));
      } catch {
        setCommentsByPost((prev) => ({ ...prev, [postId]: { ...(prev[postId] || { open: true, newContent: "", submitting: false, visibleCount: 0 }), loading: false } }));
      }
    }
  };

  const loadMoreComments = (postId: number) => {
    setCommentsByPost((prev) => {
      const cur = prev[postId];
      if (!cur) return prev;
      const nextCount = Math.min((cur.visibleCount || 0) + 5, cur.items.length);
      return { ...prev, [postId]: { ...cur, visibleCount: nextCount } };
    });
  };

  const collapseComments = (postId: number) => {
    setCommentsByPost((prev) => {
      const cur = prev[postId];
      if (!cur) return prev;
      return { ...prev, [postId]: { ...cur, open: false, visibleCount: Math.min(5, cur.items.length) } };
    });
  };

  const submitInlineComment = async (postId: number) => {
    const state = commentsByPost[postId];
    const content = state?.newContent?.trim();
    if (!content) return;
    setCommentsByPost((prev) => ({ ...prev, [postId]: { ...(prev[postId] as any), submitting: true } }));
    try {
      const res: any = await ClientRequest.addPostComment(postId, content);
      // add to thread and clear input
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: {
          ...(prev[postId] as any),
          items: [res?.comment, ...(prev[postId]?.items || [])],
          newContent: "",
          submitting: false,
          visibleCount: Math.min(((prev[postId]?.visibleCount ?? 0) + 1), (prev[postId]?.items?.length || 0) + 1),
        },
      }));
      setPosts((prev) => prev.map((p: any) => p.id === postId ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p));
    } catch {
      setCommentsByPost((prev) => ({ ...prev, [postId]: { ...(prev[postId] as any), submitting: false } }));
    }
  };

  // Removed Share/Repost and Save per request
  // Off-platform Share: build permalink and use Web Share API or clipboard
  const getPermalink = (post: any) => `${window.location.origin}/posts/${post.id}`; // Adjust path to your public route if needed

  const openShareWindow = (url: string) => {
    const w = 600;
    const h = 500;
    const y = window.top?.outerHeight ? Math.max((window.top!.outerHeight - h) / 2, 0) : 100;
    const x = window.top?.outerWidth ? Math.max((window.top!.outerWidth - w) / 2, 0) : 100;
    window.open(url, '_blank', `toolbar=0,location=0,status=0,menubar=0,scrollbars=1,resizable=1,width=${w},height=${h},left=${x},top=${y}`);
  };

  // No copy/system/email per request

  const shareTo = async (platform: string, post: any) => {
    const permalink = getPermalink(post);
    const title = encodeURIComponent(post?.title || 'Check this post');
    const url = encodeURIComponent(permalink);

    try {
      switch (platform) {
        case 'whatsapp':
          openShareWindow(`https://wa.me/?text=${title}%20${url}`);
          return;
        case 'twitter': // X
          openShareWindow(`https://twitter.com/intent/tweet?text=${title}&url=${url}`);
          return;
        case 'linkedin':
          openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
          return;
        case 'facebook':
          openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
          return;
        case 'telegram':
          openShareWindow(`https://t.me/share/url?url=${url}&text=${title}`);
          return;
        case 'instagram':
          // Instagram has no official web share endpoint for links;
          // open Instagram and instruct user to paste the link.
          openShareWindow(`https://www.instagram.com/?url=${url}`);
          message.info('Instagram does not support direct web link sharing. Paste the link in your post.');
          return;
        default:
          return;
      }
    } catch (e: any) {
      message.error(e?.message || 'Could not share');
    }
  };

  // Note: sharing is handled via shareTo() and the Dropdown menu

  const handleRepost = async (post: any) => {
    try {
      const res: any = await ClientRequest.sharePost(post.id);
      const status = res?.status ?? res?.data?.status ?? 200;
      const msg = res?.message ?? res?.data?.message ?? "Post shared successfully";
      if (status === 200 || status === 201) {
        setSharedByPost((prev) => ({ ...prev, [post.id]: true }));
        message.success(msg);
        // Ensure the repost appears in the feed
        await loadPosts(true);
      } else {
        const err = res?.error ?? res?.data?.error ?? "Failed to repost";
        message.error(err);
      }
    } catch (e: any) {
      message.error(e?.message || "Could not repost post");
    }
  };

  // Edit actions
  const openEdit = (post: any) => {
    setEditing({
      id: post.id,
      title: post.title || "",
      executive_summary: getPostSummary(post),
      subject: post.subject || "",
      doi_link: post.doi_link || "",
      video_link: post.video_link || "",
      documentFile: null as File | null,
    });
    setEditOpen(true);
  };

  const handleEditChange = (field: string, value: any) => {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  };

  const submitEdit = async () => {
    if (!editing) return;
    setEditLoading(true);
    try {
      await ClientRequest.updatePost(editing.id, {
        title: editing.title,
        executive_summary: editing.executive_summary,
        subject: editing.subject,
        doi_link: editing.doi_link,
        video_link: editing.video_link,
      });
      // Optimistically update local state
      setPosts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...editing } : p));
      message.success("Post updated");
      setEditOpen(false);
    } catch (e: any) {
      message.error(e?.message || "Could not update post");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = (post: any) => {
    AntModal.confirm({
      title: "Delete post?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await ClientRequest.deletePost(post.id);
          setPosts((prev) => prev.filter((p) => p.id !== post.id));
          message.success("Post deleted");
        } catch (e: any) {
          message.error(e?.message || "Could not delete post");
        }
      },
    });
  };

  // payment disabled: remove handlers and modal toggles

  // Convert absolute filesystem path to web path if it points under uploads
  const fsPathToUploadsUrl = (p: string): string | undefined => {
    if (!p) return undefined;
    // Normalize backslashes to slashes for processing
    const norm = p.replace(/\\/g, '/');
    // Try to locate '/uploads/' segment (common Flask static path: static/uploads/...)
    const idx = norm.toLowerCase().lastIndexOf('/uploads/');
    if (idx >= 0) {
      const tail = norm.slice(idx + '/uploads/'.length);
      return `/uploads/${tail}`;
    }
    // Also handle 'static/uploads/...'
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
    // If it's a full http(s) URL, return as-is
    if (/^https?:\/\//i.test(u)) return u;
    // If it looks like an absolute filesystem path, try to convert to /uploads/...
    if (/^[a-zA-Z]:\\|^\\\\|\/(?:[a-zA-Z0-9_\-.]+\/)+/.test(u) || u.includes('static') || u.includes('uploads')) {
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

  // Try to extract a document URL from the post object using common keys and nested shapes
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
      // Additional common variants
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

  // Safely extract a preview/summary with preference order
  const getPostSummary = (post: any): string => {
    const candidates = [
      post?.preview,
      post?.executive_summary,
      post?.executiveSummary,
      post?.summary,
      post?.abstract,
      post?.description,
    ];
    const found = candidates.find((v) => typeof v === 'string' && v.trim().length > 0);
    return (found as string) || "";
  };

  // Safely extract an author name from common shapes
  const getAuthorName = (post: any): string => {
    const a = post?.author || post?.user || post?.owner || {};
    return a?.full_name || a?.name || [a?.first_name, a?.last_name].filter(Boolean).join(" ") || "";
  };

  // Derive a year to display from typical fields
  const getPostYear = (post: any): string => {
    const y = post?.year ?? post?.published_year ?? post?.publication_year ?? null;
    if (y) return String(y);
    const ts = post?.created_at || post?.updated_at || post?.published_at || null;
    if (!ts) return "";
    const d = new Date(ts);
    return isNaN(d.getTime()) ? "" : String(d.getFullYear());
  };

  // Attempt to open a post's document; if not present on list item, fetch full post and retry
  const openPostDocument = async (post: any) => {
    if (!isSubscribed) {
      showPaywall();
      return;
    }
    // Try from current list item
    let url = getPostFileUrl(post);
    if (!url) {
      try {
        const full = await ClientRequest.getUserPost(post.id);
        url = getPostFileUrl(full || {});
      } catch {}
    }
    if (url) {
      window.open(url, "_blank");
    } else {
      message.info("No document attached for this post");
    }
  };
  return (
    <Layout>
      <div className="flex lg:flex-row flex-col px-[10px] lg:px-[80px] gap-4 items-start pb-[20px] min-h-screen">
        {/* First Section */}
        <div className="order-1 hidden lg:flex w-full flex-[0.25] min-h-[300px] sm:min-h-[400px] bg-white rounded-lg border-[#B6B6B6] border flex-col items-center justify-center">
          {/* Profile image */}
          <img
            src={getAvatar(String(user?.profile_image))}
            alt="Profile"
            className="w-[50px] h-[50px] sm:w-[64px] sm:h-[64px] sm:mt-0 mt-[-40px]"
            style={{ borderRadius: "50%" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getAvatar("");
            }}
          />
          <p className="font-semibold text-[16px] font-inter leading-[25.89px]">
            {user?.full_name || "Guest"}
          </p>
          {user?.email && (
            <a
              href={`mailto:${user.email}`}
              className="text-[#581A57] text-[13px] font-inter mt-1 break-all"
            >
              {user.email}
            </a>
          )}
          <p className="text-[#808080] text-[14px] my-[10px] flex gap-2 items-center">
            <AddressLocator />
            <span className="text-[14px] font-inter leading-[22.4px]">
              {(user?.location?.country_region || user?.location?.city)
                ? `${user?.location?.country_region || ""}${user?.location?.city ? `, ${user.location.city}` : ""}`
                : "Location"}
            </span>
          </p>
          {/* Education and certifications snippets intentionally hidden to avoid clutter under Location */}

          <Button
            label="View Profile"
            onclick={() => nav(URL.BIO)} // Corrected from onclick to onClick
            className="text-white bg-[#581A57] p-3 homepage_btn"
          />
        </div>

        {/* Second Section */}
        <div className="flex-[0.75] order-3 lg:order-2 w-full" style={{ overflowAnchor: 'none' }}>
          {posts.length > 0 ? (
            <>
            {posts.map((post: any, i: number) => (
              <div
                key={i}
                className="min-h-[200px] bg-white rounded-lg p-2 sm:p-4 mb-[10px]"
              >
                {/* Repost banner (if applicable) */}
                {(post as any)?._repost && (
                  <div className="text-[10px] sm:text-[12px] text-[#808080] mb-1">
                    Reposted by {((post as any)?._reposter?.full_name) || ((post as any)?._reposter?.name) || 'a user'}
                  </div>
                )}
                {/* Post Content */}
                <div className="flex justify-between items-center border-[#F2F2F2] border-b pb-2">
                  <div className="flex gap-1 sm:gap-3 items-center">
                    <img
                      src={getAvatar(String(post?.author?.profile_image))}
                      alt="user_image"
                      className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] cursor-pointer"
                      title="View profile"
                      onClick={() => {
                        const id = post?.author?.id;
                        if (id != null) nav(URL.USER_PROFILE.replace(":id", String(id)));
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getAvatar("");
                      }}
                    />
                    <div
                      className="cursor-pointer"
                      title="View profile"
                      onClick={() => {
                        const id = post?.author?.id;
                        if (id != null) nav(URL.USER_PROFILE.replace(":id", String(id)));
                      }}
                    >
                      <p className="text-[#581A57] font-inter leading-[25.89px] font-medium text-[12px] sm:text-[16px]">
                        {post.author?.full_name}
                      </p>
                      <p className="text-[#808080] text-[10px] sm:text-[14px] leading-[22.4px]">
                        {(post as any)?._repost ? 'Reposted' : 'Uploaded a paper'}
                      </p>
                    </div>
                  </div>
                  <Dropdown
                    menu={{
                      items: [
                        { label: <div onClick={() => openEdit(post)}>Edit</div>, key: "edit" },
                        { label: <div onClick={() => handleDeleteConfirm(post)} className="text-red-600">Delete</div>, key: "delete" },
                        { label: <div onClick={() => nav(URL.MESSAGING)}>Message</div>, key: "message" },
                        {
                          label: (
                            <div
                              className={`${sharedByPost[post.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                              onClick={() => !sharedByPost[post.id] && handleRepost(post)}
                            >
                              {sharedByPost[post.id] ? 'Reposted' : 'Repost'}
                            </div>
                          ),
                          key: "repost",
                          disabled: !!sharedByPost[post.id],
                        },
                      ] as MenuProps['items'],
                    }}
                    trigger={["click"]}
                  >
                    <Space>
                      <ThreeDotsIcon className="w-[40px]" />
                    </Space>
                  </Dropdown>
                </div>
                {/* Body */}
                <div className="flex items-center my-[10px] border-[#F2F2F2] border-b pb-2">
                  <div className={"flex-[1]"}>
                    <div className="flex flex-col gap-2">
                      <p className="leading-[25.6px] playfair-display-normal text-[16px] sm:text-[18px] font-bold text-black">
                        {post?.title}
                      </p>
                      <p className="text-[11px] leading-[22px] font-inter sm:text-[14px] text-black">
                        {(() => {
                          const summary = getPostSummary(post);
                          if (!summary) return '';
                          if (isExpanded) return summary;
                          return summary.length > maxLength ? `${summary.slice(0, maxLength)}...` : summary;
                        })()}
                        {(() => {
                          const summary = getPostSummary(post);
                          return summary && summary.length > maxLength;
                        })() && (
                          <span
                            className="text-[#581a57] cursor-pointer"
                            onClick={toggleSummary}
                          >
                            {isExpanded ? " see less" : " see more"}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center mt-3">
                      {getPostFileUrl(post) && (
                        isSubscribed ? (
                          <a href={getPostFileUrl(post)} target="_blank" rel="noopener noreferrer" onClick={async (e) => { e.preventDefault(); await openPostDocument(post); }}>
                            <p className="flex gap-1 items-center text-xs text-[#581A57] font-light">
                              <OpenLockIcon /> View PDF
                            </p>
                          </a>
                        ) : (
                          <button onClick={showPaywall} className="text-xs text-[#581A57] font-light flex items-center gap-1">
                            <LockIcon /> Locked
                          </button>
                        )
                      )}
                      {post?.video_link && (
                        isSubscribed ? (
                          <a
                            href={post.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={async (e) => { e.preventDefault(); try { await ClientRequest.getUserPost(post.id); } catch {} window.open(post.video_link, "_blank"); }}
                          >
                            <p className="flex gap-1 items-center text-xs text-[#581A57] font-light">
                              <LinkIcon /> {post.video_link}
                            </p>
                          </a>
                        ) : (
                          <span
                            aria-disabled
                            tabIndex={-1}
                            className="text-xs text-[#581A57] font-light flex items-center gap-1 opacity-60 cursor-not-allowed"
                            title="Subscribe to access"
                          >
                            <LinkIcon /> {post.video_link}
                          </span>
                        )
                      )}
                      {post?.doi_link && (
                        isSubscribed ? (
                          <a
                            href={post.doi_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={async (e) => {
                              e.preventDefault();
                              try { await ClientRequest.getUserPost(post.id); } catch {}
                              if (post?.doi_link) window.open(post.doi_link, "_blank");
                            }}
                          >
                            <p className="flex gap-1 items-center text-xs text-[#581A57] font-light">
                              <WarningIcon /> {post?.doi_link}
                            </p>
                          </a>
                        ) : (
                          <span
                            aria-disabled
                            tabIndex={-1}
                            className="text-xs text-[#581A57] font-light flex items-center gap-1 opacity-60 cursor-not-allowed"
                            title="Subscribe to access"
                          >
                            <WarningIcon /> {post?.doi_link}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div onClick={async () => { await openPostDocument(post); }} className="inline-block">
                      <PDFIcon
                        className={`w-[40px] sm:w-[61px] ${isSubscribed ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                      />
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="flex justify-between items-center text-[xx-small] sm:text-[small]">
                  <div className="flex gap-1 sm:gap-2 items-center ">
                    <button
                      className={`flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center ${post.user_vote === 'upvote' ? 'text-[#581A57]' : ''}`}
                      onClick={() => handleVote(post.id, 'upvote')}
                    >
                      <LikeIcon className="w-[10px] sm:w-[12px]" />
                      <span>Upvote</span>
                    </button>

                    <button
                      className={`flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center ${post.user_vote === 'downvote' ? 'text-[#581A57]' : ''}`}
                      onClick={() => handleVote(post.id, 'downvote')}
                    >
                      <DislikeIcon className="w-[10px] sm:w-[12px]" />
                      <span>Downvote</span>
                    </button>
                    <button
                      className="flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center"
                      onClick={() => toggleComments(post.id)}
                    >
                      <CommentIcon className="w-[10px] sm:w-[12px]" />
                      <span>Comment</span>
                    </button>
                    <Dropdown
                      menu={{
                        items: [
                          { key: 'whatsapp', label: <div onClick={() => shareTo('whatsapp', post)}>WhatsApp</div> },
                          { key: 'twitter', label: <div onClick={() => shareTo('twitter', post)}>Twitter/X</div> },
                          { key: 'linkedin', label: <div onClick={() => shareTo('linkedin', post)}>LinkedIn</div> },
                          { key: 'facebook', label: <div onClick={() => shareTo('facebook', post)}>Facebook</div> },
                          { key: 'telegram', label: <div onClick={() => shareTo('telegram', post)}>Telegram</div> },
                          { key: 'instagram', label: <div onClick={() => shareTo('instagram', post)}>Instagram</div> },
                        ] as MenuProps['items'],
                      }}
                      trigger={["click"]}
                    >
                      <button
                        className="flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center"
                      >
                        <span>Share</span>
                      </button>
                    </Dropdown>
                  </div>

                  <div className="flex  gap-1 sm:gap-2 items-center">
                    <p className="flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center">
                      <span
                        style={{ visibility: "hidden" }}
                        className="sm:!hidden"
                      >
                        <IndicatorIcon color="#2D2D2D" />
                      </span>
                      <span>{post.upvote_count ?? 0} Upvote</span>
                    </p>

                    <p className="flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center">
                      <IndicatorIcon color="#2D2D2D" />
                      <span>{post.downvote_count ?? 0} Downvote</span>
                    </p>
                    <p className="flex flex-col sm:flex-row font-inter font-[300] leading-[12.1px] lg:text-[12px] text-[8px] gap-1 sm:gap-2 items-center">
                      <IndicatorIcon color="#2D2D2D" />
                      <span>{post.comment_count ?? 0} Comments</span>
                    </p>
                  </div>
                </div>
                {/* Inline comments thread */}
                {commentsByPost[post.id]?.open && (
                  <div className="mt-3">
                    <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                      {commentsByPost[post.id]?.loading ? (
                        <p className="text-xs text-gray-500">Loading comments...</p>
                      ) : (
                        (commentsByPost[post.id]?.items || []).slice(0, commentsByPost[post.id]?.visibleCount || 0).map((c: any) => (
                          <div key={c.id} className="bg-[#F9F9F9] p-2 rounded">
                            <p className="text-[12px] text-[#581A57]">{c?.user?.full_name}</p>
                            <p className="text-[12px]">{c?.content}</p>
                          </div>
                        ))
                      )}
                      {(!commentsByPost[post.id]?.loading && (commentsByPost[post.id]?.items || []).length === 0) && (
                        <p className="text-xs text-gray-500">No comments yet</p>
                      )}
                    </div>
                    {/* Controls */}
                    {!commentsByPost[post.id]?.loading && (
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-gray-500">
                          Showing {commentsByPost[post.id]?.visibleCount || 0} of {(commentsByPost[post.id]?.items || []).length}
                        </div>
                        <div className="flex gap-2">
                          {(commentsByPost[post.id]?.visibleCount || 0) < (commentsByPost[post.id]?.items || []).length && (
                            <button className="text-[#581A57] text-xs" onClick={() => loadMoreComments(post.id)}>Load more</button>
                          )}
                          <button className="text-[#808080] text-xs" onClick={() => collapseComments(post.id)}>Collapse</button>
                        </div>
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Input
                        size="small"
                        placeholder="Add a comment"
                        value={commentsByPost[post.id]?.newContent || ""}
                        onChange={(e) => setCommentsByPost((prev) => ({ ...prev, [post.id]: { ...(prev[post.id] || { items: [], open: true, loading: false, newContent: "", submitting: false, visibleCount: 0 }), newContent: e.target.value } }))}
                      />
                      <Button
                        label={commentsByPost[post.id]?.submitting ? "Posting..." : "Post"}
                        onclick={() => submitInlineComment(post.id)}
                        className="p-[6px] bg-[#581A57] text-white"
                        disabled={commentsByPost[post.id]?.submitting}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Infinite scroll sentinel and status */}
            <div ref={sentinelRef} className="w-full h-6" />
            {loading && (
              <div className="w-full flex items-center justify-center my-3">
                <p className="text-xs text-gray-500">Loading...</p>
              </div>
            )}
            {!hasMore && (
              <div className="w-full flex items-center justify-center my-3">
                <p className="text-xs text-gray-500">No more posts</p>
              </div>
            )}
            </>
          ) : (
            <div className="min-h-[200px] bg-white rounded-lg p-2 sm:p-4 mb-[10px] flex flex-col items-center justify-center">
              <img
                src={Logo}
                alt="No Posts"
                className="w-[100px] h-[100px] mb-4"
              />
              <p className="text-[#808080] text-[14px] sm:text-[16px] font-inter">
                Start sharing your first post!
              </p>
            </div>
          )}
        </div>

        {/* Third Section */}
        <div className="block md:block order-2 lg:order-3 w-full lg:w-fit sm:flex-[0.25] p-2 pt-0 rounded-lg bg-white relative">
          <h2 className="text-[12px] leading-[28px] sm:text-[16px] font-inter border-[#F2F2F2] border-b pb-2 mb-2">
            Recently Read
          </h2>
          <div>
            {recentReads.map((it: any, i: number) => (
              <div
                className="bg-[#F5F5F5] p-2 rounded-sm mb-2"
                key={i}
              >
                <p className="playfair-display-normal text-[#121212] leading-[25.6px] text-[14px] sm:text-[16px]">
                  {it?.title}
                </p>
                {(() => {
                  const s = getPostSummary(it);
                  if (!s) return null;
                  const max = 80;
                  const text = s.length > max ? `${s.slice(0, max)}...` : s;
                  return (
                    <p className="text-[#666666] text-[12px] sm:text-[13px] font-inter leading-[20px] mt-1">
                      {text}
                    </p>
                  );
                })()}
                <p className="text-[#808080] text-[14px] font-inter leading-[22.4px]">
                  {getAuthorName(it) || ""}
                </p>
                <p className="text-[#808080] text-[14px] font-inter leading-[22.4px]">
                  {getPostYear(it)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment disabled */}
      {/* Edit Post Modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        className="card-modal"
        title="Edit Post"
      >
        <div className="flex flex-col gap-4">
          <label className="text-sm text-[#581A57]">Title</label>
          <Input value={editing?.title} onChange={(e) => handleEditChange('title', e.target.value)} />

          <label className="text-sm text-[#581A57]">Executive Summary</label>
          <Input.TextArea rows={4} value={editing?.executive_summary} onChange={(e) => handleEditChange('executive_summary', e.target.value)} />

          <label className="text-sm text-[#581A57]">Subject</label>
          <Select
            placeholder="Search Subject"
            className="w-full bg-white h-[38px] rounded-sm"
            value={editing?.subject || undefined}
            onChange={(v) => handleEditChange('subject', v)}
          >
            <Option value="enrolled">Enrolled</Option>
            <Option value="Social Entrepreneurship and Innovation courses">
              Social Entrepreneurship and Innovation courses
            </Option>
            <Option value="Learning Development courses">
              Learning Development courses
            </Option>
            <Option value="applied_science" disabled>
              Others
            </Option>
          </Select>

          <label className="text-sm text-[#581A57]">DOI Link</label>
          <Input value={editing?.doi_link} onChange={(e) => handleEditChange('doi_link', e.target.value)} />

          <label className="text-sm text-[#581A57]">Video Link</label>
          <Input value={editing?.video_link} onChange={(e) => handleEditChange('video_link', e.target.value)} />

          {/* Document replacement via PUT JSON isn't supported by backend; keeping hidden for now */}

          <div className="flex justify-end gap-2 mt-2">
            <Button label="Cancel" onclick={() => setEditOpen(false)} className="text-[#581A57] p-[8px] bg-[#E6DDE6]" />
            <Button label="Save" onclick={submitEdit} loading={editLoading} className="p-[8px] bg-[#581A57] text-white" />
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default HomePage;
