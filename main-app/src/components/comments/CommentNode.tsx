import React from 'react';
import { Input } from 'antd';
import { Button } from '..';

interface Props {
  postId: number;
  comment: any;
  level?: number;
  commentsByPost: Record<number, any>;
  setCommentsByPost: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  toggleReplyInput: (postId: number, commentId: number) => void;
  submitReply: (postId: number, parentId: number) => Promise<void>;
}

const CommentNode: React.FC<Props> = ({ postId, comment, level = 0, commentsByPost, setCommentsByPost, toggleReplyInput, submitReply }) => {
  const replyState = commentsByPost[postId]?.replyFor?.[comment.id] || { open: false, content: '', submitting: false };

  return (
    <div className="bg-[#F9F9F9] p-2 rounded" style={{ marginLeft: level * 16 }}>
      <p className="text-[12px] text-[#581A57]">{comment?.user?.full_name}</p>
      <p className="text-[12px]">{comment?.content}</p>
      <div className="flex gap-2 mt-1 items-center">
        <button className="text-xs text-[#581A57]" onClick={() => toggleReplyInput(postId, comment.id)}>Reply</button>
      </div>
      {replyState.open && (
        <div className="mt-2 flex gap-2">
          <Input
            size="small"
            placeholder="Write a reply"
            value={replyState.content}
            onChange={(e) => setCommentsByPost((prev) => ({
              ...prev,
              [postId]: {
                ...(prev[postId] || { items: [], open: true, loading: false, newContent: '', submitting: false, visibleCount: 0 }),
                replyFor: { ...(prev[postId]?.replyFor || {}), [comment.id]: { open: prev[postId]?.replyFor?.[comment.id]?.open ?? true, content: e.target.value, submitting: prev[postId]?.replyFor?.[comment.id]?.submitting ?? false } }
              }
            }))}
          />
          <Button label={replyState.submitting ? 'Replying...' : 'Reply'} onclick={() => submitReply(postId, comment.id)} className="p-[6px] bg-[#581A57] text-white" disabled={replyState.submitting} />
        </div>
      )}
      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((r: any) => (
            <CommentNode key={r.id} postId={postId} comment={r} level={level + 1} commentsByPost={commentsByPost} setCommentsByPost={setCommentsByPost} toggleReplyInput={toggleReplyInput} submitReply={submitReply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(CommentNode);
