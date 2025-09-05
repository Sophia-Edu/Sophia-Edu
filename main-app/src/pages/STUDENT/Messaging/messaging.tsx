import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import { IndicatorIcon, PenIcon, SendArrow } from "../../../assets";
import { getAvatar } from "../../../utils/helperFunction";
import { MailOutlined } from "@ant-design/icons";
import "./messaging.styles.scss";
import { Badge, Button, Form, Input, Modal, Select, message } from "antd";
import { useUser } from "../../../store";
import { useLocation } from "react-router-dom";
import clientRequests from "../../../requests/client.request";
import { URL } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const Messaging: React.FC<any> = () => {
  const { user } = useUser();
  const [me, setMe] = useState<any>(null);
  const location = useLocation();
  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; full_name: string } | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  // Remove file upload related state
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState<{ id: number; full_name: string } | null>(null);
  const [composeContent, setComposeContent] = useState<string>("");
  const [composeSending, setComposeSending] = useState(false);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const nav = useNavigate();

  // Inline search (similar to header) for quickly finding users
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const [hasMore, setHasMore] = useState(false);
  const openCompose = () => setComposeOpen(true);
  const closeCompose = () => {
    setComposeOpen(false);
    setComposeRecipient(null);
    setComposeContent("");
    setUserOptions([]);
    setUsersLoading(false);
  };

  const sendFirstMessage = async () => {
    if (!composeRecipient || !composeContent.trim()) {
      message.warning("Select a recipient and enter a message");
      return;
    }
    setComposeSending(true);
    try {
      await clientRequests.sendMessage({
        recipient_id: composeRecipient.id,
        content: composeContent.trim(),
      });
      message.success("message sent");
      // Refresh chat users and select the new conversation
      const users = await clientRequests.getChatUsers();
      setChatUsers(users);
      const newly = users.find((u: any) => u.id === composeRecipient.id);
      if (newly) {
        setSelectedUser({ id: newly.id, full_name: newly.full_name });
        fetchConversation(newly.id);
      }
      closeCompose();
      setMessageText("");
    } catch (e: any) {
      message.error(e?.message || "Failed to send message");
    } finally {
      setComposeSending(false);
    }
  };

  const searchUsers = async (q: string) => {
    const term = q?.trim() || "";
    if (term.length < 2) {
      setUserOptions([]);
      return;
    }
    try {
      setUsersLoading(true);
      const res = await clientRequests.globalSearch({ q: term, limit: 10 });
      setUserOptions(res.users || []);
    } catch (e: any) {
      message.error(e?.message || "Failed to search users");
    } finally {
      setUsersLoading(false);
    }
  };

  // Debounced inline search (for the left panel search box)
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const id = setTimeout(async () => {
      try {
        const res = await clientRequests.globalSearch({ q: term, limit: 10 });
        setSearchResults(res.users || []);
      } catch (e: any) {
        // silently ignore for typing experience
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm]);
  const sendMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;
    setSending(true);
    try {
      await clientRequests.sendMessage({
        recipient_id: selectedUser.id,
        content: messageText.trim()
      });
      // Refresh messages
      await fetchConversation(selectedUser.id);
      setMessageText("");
      message.success("message sent");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSending(false);
    }
  };

  const fetchConversation = async (otherUserId: number) => {
    try {
      const msgs: any[] = await clientRequests.getFriendMessage(otherUserId);
      setMessages(msgs);
      const myId = (user as any)?.id;
      if (myId) {
        const toMark = msgs.filter((m:any)=> m.recipient_id === myId && !m.is_read);
        if (toMark.length) {
          for (const m of toMark) {
            try { await clientRequests.markReadMessage(String(m.id)); } catch {}
          }
          // Update local state to reflect read flags
          setMessages((prev)=> prev.map((m:any)=> (
            (m.recipient_id === myId ? { ...m, is_read: true } : m)
          )));
          // Also zero the unread badge for this user in the list
          setChatUsers((prev)=> prev.map((u:any)=> u.id===otherUserId ? { ...u, unread_count: 0 } : u));
        }
      }
    } catch (e: any) {
      message.error(e?.message || "Failed to load conversation");
    } finally {
      setHasMore(false);
    }
  };

  const fetchChatUsers = async () => {
    try {
      const users = await clientRequests.getChatUsers();
      setChatUsers(users);
      if (users.length && !selectedUser) {
        setSelectedUser({ id: users[0].id, full_name: users[0].full_name });
        fetchConversation(users[0].id);
      }
    } catch (e: any) {
      message.error(e?.message || "Failed to load chats");
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, []);

  // Ensure we have the latest logged-in profile (for avatar rendering when no chat selected and for self messages)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await clientRequests.getMe();
        if (mounted) setMe(profile || null);
      } catch {
        // silent fail; fallback to store user or default avatar
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?.id]);

  // Deep-link: if ?userId= is present, auto-select that chat when users load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idStr = params.get("userId");
    const deepId = idStr ? Number(idStr) : NaN;
    if (!Number.isNaN(deepId) && chatUsers.length) {
      const match: any = chatUsers.find((u) => u.id === deepId);
      if (match && (!selectedUser || selectedUser.id !== match.id)) {
        setSelectedUser({ id: match.id, full_name: match.full_name });
        fetchConversation(match.id);
      }
    }
  }, [location.search, chatUsers]);

  return (
    <Layout className="">
      <div className="xl:w-[90%] mx-auto sm:px-[40px] messaging">
        <div className="bg-transparent sm:bg-white p-[15px] cursor-pointer  sm:h-[700px] text-clip flex gap-2 rounded-lg min-h-[500px] w-full md:w-[95%] mx-auto">
          {/* Chat List */}
          <div className="md:w-[25%] lg:w-[30%] overflow-auto border-[#F5F5F5] md:border-r w-full md:pr-[10px]">
            <div className="flex justify-between mb-[15px]">
              <h2 className="font-semibold text-[20px] font-inter">
                All Messages
              </h2>
              <PenIcon className="cursor-pointer" onClick={openCompose} />
            </div>
            <p className="text-[12px] text-[#808080] mb-3">
              Select a conversation to continue your previous chat, or search and select a user to start a new one.
            </p>
            {/* Inline Search Users (like header) */}
            <div className="relative mb-3">
              <Input
                placeholder="Search users"
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-3xl p-2"
              />
              {(searchTerm.trim().length >= 2) && (
                <div className="absolute z-[1000] mt-2 bg-white shadow-lg rounded-lg p-3 w-[min(80vw,280px)] max-h-[60vh] overflow-auto">
                  <p className="text-xs text-gray-500 mb-2">{searching ? "Searching..." : `Results for "${searchTerm.trim()}"`}</p>
                  {searchResults.length > 0 ? (
                    <div className="mb-1">
                      <p className="text-[12px] font-semibold text-[#581A57] mb-1">Users</p>
                      {searchResults.map((u: any) => (
                        <div
                          key={`u-${u.id}`}
                          className="py-1 px-2 hover:bg-gray-50 cursor-pointer rounded flex items-center gap-2"
                          onMouseDown={(e)=>e.preventDefault()}
                          onClick={() => {
                            setSearchTerm("");
                            // Ensure user appears in chat list
                            setChatUsers((prev) => {
                              const exists = prev.some((p:any)=>p.id===u.id);
                              if (exists) return prev;
                              return [{ id: u.id, full_name: u.full_name, profile_image: u.profile_image, unread_count: 0 }, ...prev];
                            });
                            setSelectedUser({ id: u.id, full_name: u.full_name });
                            fetchConversation(u.id);
                          }}
                        >
                          <img src={(u.profile_image && /^https?:\/\//.test(u.profile_image)) ? u.profile_image : getAvatar(u.profile_image || "")} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <span className="text-sm">{u.full_name}</span>
                            {u.email && <span className="text-[11px] text-gray-500">{u.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !searching && <div className="text-sm text-gray-500">No users</div>
                  )}
                </div>
              )}
            </div>
            {chatUsers.map((u) => (
              <div
                key={u.id}
                className={`flex gap-3 items-start mb-[15px] cursor-pointer ${selectedUser?.id === u.id ? "bg-[#f7f7f7]" : ""}`}
                onClick={() => {
                  // On small screens, navigate to the mobile conversation view
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    nav(`${URL.MESSAGING}/${u.id}`);
                  } else {
                    setSelectedUser({ id: u.id, full_name: u.full_name });
                  }
                }}
              >
                <div className="relative mt-[10px]">
                  <img src={(u.profile_image && /^https?:\/\//.test(u.profile_image)) ? (u.profile_image as string) : getAvatar(u.profile_image || "")} width={40} alt="" />
                  <IndicatorIcon
                    className="absolute right-[0px] bottom-[5px]"
                  />
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="">
                      <h2 className="font-inter text-[14px] font-semibold">{u.full_name}</h2>
                      <h2 className="text-[16px] ">{u.full_name}</h2>
                      {u.unread_count > 0 && (
                        <Badge count={u.unread_count} overflowCount={99} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-[75%] lg:w-[70%] p-3  hidden md:block">
            {/* Header */}
            <header className="flex gap-3 items-center border-[#F5F5F5] border-b pb-[10px]">
              <img
                src={(() => {
                  if (selectedUser) {
                    const pi = chatUsers.find((u:any)=>u.id===selectedUser?.id)?.profile_image;
                    return (pi && /^https?:\/\//.test(pi)) ? pi : getAvatar(pi || "");
                  }
                  const selfPi = (me?.profile_image) || (user as any)?.profile_image || "";
                  return (selfPi && /^https?:\/\//.test(selfPi)) ? selfPi : getAvatar(selfPi || "");
                })()}
                width={50}
                alt=""
              />
              <p>{selectedUser?.full_name || "Select a chat"}</p>
            </header>

            {/* Message body */}
            <div className="msgbody_height w-full flex flex-col">
              {selectedUser ? (
                <div
                  className={`hidden-scrollbar flex-1 overflow-auto pr-1 ${
                    messages.length < 1 && "flex items-center justify-center "
                  }`}
                >
                  <InfiniteScroll
                    dataLength={messages.length}
                    next={() => { /* pagination hook point */ }}
                    hasMore={hasMore}
                    className={`pb-24 ${messages.length < 1 && "mt-[-66px]"}`}
                    loader={<h4>Loading...</h4>}
                    endMessage={messages.length < 1 && <p>No messages yet</p>}
                  >
                    {messages.map((message: any, i: number) => (
                      <div
                        key={i}
                        className={`flex gap-3 items-start mt-[30px] ${
                          message?.sender_id === (user as any)?.id
                            ? "self"
                            : "other"
                        }`}
                      >
                        {message?.sender_id === (user as any)?.id ? (
                          <img src={(() => { const spi = (me?.profile_image) || (user as any)?.profile_image || ""; return (spi && /^https?:\/\//.test(spi)) ? spi : getAvatar(spi || ""); })()} width={30} />
                        ) : (
                          <img
                            src={(() => { const pi = chatUsers.find((u:any)=>u.id===selectedUser?.id)?.profile_image; return (pi && /^https?:\/\//.test(pi)) ? pi : getAvatar(pi || ""); })()}
                            width={30}
                          />
                        )}
                        <div className="w-2/5">
                          <p
                            className={`${
                              message?.sender_id === (user as any)?.id
                                ? "bg-[#581A57] text-white"
                                : "bg-[#F5F5F5] text-[#581A57]"
                            } text-[14px] custom-rounded mb-2 p-2 w-full`}
                          >
                            {message?.content}
                          </p>
                          {message?.attachment_url && (
                            <div className="mb-2">
                              {/(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg)$/i.test(message.attachment_url) ? (
                                <a href={message.attachment_url} target="_blank" rel="noreferrer">
                                  <img src={message.attachment_url} alt="attachment" className="max-h-48 rounded-lg" />
                                </a>
                              ) : (
                                <a
                                  href={message.attachment_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 underline break-all"
                                >
                                  Attachment
                                </a>
                              )}
                            </div>
                          )}
                          <p className="text-[#808080] text-[12px] flex items-center gap-2">
                            {message?.timestamp}
                            {message?.sender_id === (user as any)?.id && (
                              <span className="text-[11px] text-[#581A57]">{message?.is_read ? "Read" : "Sent"}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-[#808080]">
                  <p>Select a chat to view messages</p>
                </div>
              )}
              <Form className="mt-2 w-full" onSubmitCapture={(e) => { e.preventDefault(); sendMessage(); }}>
                <Input
                  className="w-full bg-[#F5F5F5] focus:bg-[#F5F5F5] hover:bg-[#F5F5F5] focus:border-0 hover:border-0 rounded-[50px] px-[19px] py-[15px]"
                  name="message"
                  placeholder="Type your message here"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onPressEnter={(e) => { e.preventDefault(); sendMessage(); }}
                />
                {/* Hidden file input */}
                {/* <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setSelectedFile(f || null);
                  }}
                /> */}
                <div className="mt-3 flex items-center justify-between">
                  {/* <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm bg-white text-[#581A57] border border-[#E5E5E5] rounded shadow-sm hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload
                    </button>
                    {selectedFile && (
                      <span className="text-[12px] text-gray-700 truncate max-w-[50vw]">
                        {selectedFile.name}
                      </span>
                    )}
                  </div> */}
                  {!sending ? (
                    <button
                      type="button"
                      aria-label="Send message"
                      className="p-2 rounded-full hover:bg-gray-100"
                      onClick={sendMessage}
                      disabled={!selectedUser || !messageText.trim()}
                      style={{ opacity: !selectedUser || !messageText.trim() ? 0.5 : 1, cursor: !selectedUser || !messageText.trim() ? 'not-allowed' : 'pointer' }}
                    >
                      <SendArrow className="pointer-events-none" />
                    </button>
                  ) : (
                    <Button loading={true} className="bg-transparent border-0" />
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
        {/* Compose New Message Modal */}
        <Modal
          title="New Message"
          open={composeOpen}
          onOk={sendFirstMessage}
          confirmLoading={composeSending}
          onCancel={closeCompose}
          okText="Send"
        >
          <div className="flex flex-col gap-3">
            <Select
              showSearch
              placeholder="Search user by name or email"
              filterOption={false}
              onSearch={searchUsers}
              onChange={(value) => {
                const found = userOptions.find((u) => u.id === value);
                if (found) setComposeRecipient({ id: found.id, full_name: found.full_name });
              }}
              optionLabelProp="label"
              options={userOptions.map((u) => ({
                value: u.id,
                label: (
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-[#581A57]" />
                    <span>{u.full_name}</span>
                    {u.email && <span className="text-[11px] text-[#808080]">({u.email})</span>}
                  </div>
                ),
              }))}
              notFoundContent={usersLoading ? "Searching..." : "No users"}
              value={composeRecipient?.id}
            />
            <Input.TextArea
              placeholder="Type your message"
              value={composeContent}
              onChange={(e) => setComposeContent(e.target.value)}
              rows={4}
            />
          </div>
        </Modal>
    </Layout>
  );
};

export default Messaging;
