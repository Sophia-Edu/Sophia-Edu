import React, { useState, useEffect, useRef } from "react";
import Layout from "../../Layout";
import InfiniteScroll from "react-infinite-scroll-component";
import { SendArrow } from "../../../assets";
import { getAvatar } from "../../../utils/helperFunction";
import "./messaging.styles.scss";
import { Button, Form, Input, message } from "antd";
import { useUser } from "../../../store";
import clientRequests from "../../../requests/client.request";
import { useLocation } from "react-router-dom";

const Messaging: React.FC<any> = () => {
    const { user } = useUser();
    const location = useLocation();
    const [messages, setMessages] = useState<any[]>([]);
    const [sending, setSending] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedUser, setSelectedUser] = useState<{ id: number; full_name: string; profile_image?: string | null } | null>(null);

    const [hasMore, setHasMore] = useState(true);

    const sendMessage = async (msg: string) => {
        if (!selectedUser || (!msg.trim() && !selectedFile)) return;
        setSending(true);
        const payload: any = { recipient_id: selectedUser.id };
        if (msg.trim()) payload.content = msg.trim();
        if (selectedFile) payload.file = selectedFile;
        try {
            await clientRequests.sendMessage(payload);
            // refresh to get attachment_url
            await fetchConversation(selectedUser.id);
            setMessageText("");
            setSelectedFile(null);
            message.success("message sent");
        } catch (error: any) {
            message.error(error.message);
            throw error;
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
                    // reflect locally as read
                    setMessages((prev)=> prev.map((m:any)=> (m.recipient_id === myId ? { ...m, is_read: true } : m)));
                }
            }
        } catch (e) {
            // ignore
        } finally {
            setHasMore(false);
        }
    };

    useEffect(() => {
        // Load chat users, then deep-link select if userId present
        const init = async () => {
            try {
                const users = await clientRequests.getChatUsers();
                const params = new URLSearchParams(location.search);
                const idStr = params.get("userId");
                const deepId = idStr ? Number(idStr) : NaN;
                const first = users[0];
                const target = !Number.isNaN(deepId) ? users.find((u:any)=>u.id===deepId) : first;
                if (target) {
                    setSelectedUser({ id: target.id, full_name: target.full_name, profile_image: target.profile_image });
                    fetchConversation(target.id);
                }
            } catch {}
        };
        init();
    }, [location.search]);

    return (
        <Layout className="">
            <div className="sm:w-[90%] mt-[-1rem] mx-auto sm:px-[40px] messaging">
                <div className="bg-white py-[15px] px-[5px] mobile  text-clip flex gap-2   w-full md:w-[95%] mx-auto">
                    <div className="w-full">
                        {/*                        <header className="flex gap-3 items-center border-[#F5F5F5] border-b pb-[10px]">
                            <img src={avatar} width={50} />
                            <p>{selectedUser?.full_name || "Messages"}</p>
                        </header>*/}

                        {/* Message body */}
                        <div className="h-full w-full flex flex-col">
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
                                    endMessage={messages.length < 1 && <p>No more messages</p>}
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
                                                <img src={((user as any)?.profile_image && /^https?:\/\//.test((user as any)?.profile_image)) ? (user as any)?.profile_image : getAvatar((user as any)?.profile_image || "")} width={30} />
                                            ) : (
                                                <img src={(selectedUser?.profile_image && /^https?:\/\//.test(selectedUser?.profile_image)) ? (selectedUser?.profile_image as string) : getAvatar(selectedUser?.profile_image || "")} width={30} />
                                            )}
                                            <div className="w-full">
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
                                                <p className="text-[#808080] text-[12px]">
                                                    {message?.timestamp}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </InfiniteScroll>
                            </div>
                            <Form className="mt-2 w-full" onSubmitCapture={(e) => { e.preventDefault(); sendMessage(messageText); }}>
                                <Input
                                    className="w-full bg-[#F5F5F5] focus:bg-[#F5F5F5] hover:bg-[#F5F5F5] focus:border-0 hover:border-0 rounded-[50px] px-[19px] py-[15px]"
                                    name="message"
                                    placeholder="Type your message here"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    onPressEnter={(e) => { e.preventDefault(); sendMessage(messageText); }}
                                />
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setSelectedFile(f || null);
                                    }}
                                />
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
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
                                    </div>
                                    {!sending ? (
                                        <button
                                            type="button"
                                            aria-label="Send message"
                                            className="p-2 rounded-full hover:bg-gray-100"
                                            onClick={() => sendMessage(messageText)}
                                            disabled={!selectedUser || (!messageText.trim() && !selectedFile)}
                                            style={{ opacity: !selectedUser || (!messageText.trim() && !selectedFile) ? 0.5 : 1, cursor: !selectedUser || (!messageText.trim() && !selectedFile) ? 'not-allowed' : 'pointer' }}
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
        </Layout>
    );
};

export default Messaging;
