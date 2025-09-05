import React, { useState } from 'react';
import { Button, Dropdown, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ClientRequest } from '../../requests';

interface ShareButtonProps {
  postId: number;
  title: string;
  summary?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ postId, title, summary }) => {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = async () => {
    try {
      const response = await ClientRequest.sharePost(postId);
      return response?.data?.share_url || `${window.location.origin}/posts/${postId}`;
    } catch (error) {
      console.error('Failed to get share URL:', error);
      return `${window.location.origin}/posts/${postId}`;
    }
  };

  const handleShare = async (platform: string) => {
    try {
      setSharing(true);
      const shareUrl = await getShareUrl();
      const encodedUrl = encodeURIComponent(shareUrl);
      const encodedTitle = encodeURIComponent(title);
      const encodedSummary = encodeURIComponent(summary || '');

      let shareLink = '';
      switch (platform) {
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
          break;
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
          break;
        case 'whatsapp':
          shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          message.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
          return;
      }

      if (shareLink) {
        const width = 600;
        const height = 500;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          shareLink,
          'shareWindow',
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );

        // Track share event
        try {
          await ClientRequest.sharePost(postId);
        } catch (error) {
          console.error('Failed to track share:', error);
        }
      }
    } catch (error) {
      console.error('Failed to share:', error);
      message.error('Failed to share. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  const items: MenuProps['items'] = [
    { key: 'facebook', label: <div onClick={() => handleShare('facebook')}>Facebook</div> },
    { key: 'twitter', label: <div onClick={() => handleShare('twitter')}>Twitter/X</div> },
    { key: 'linkedin', label: <div onClick={() => handleShare('linkedin')}>LinkedIn</div> },
    { key: 'whatsapp', label: <div onClick={() => handleShare('whatsapp')}>WhatsApp</div> },
    { key: 'copy', label: <div onClick={() => handleShare('copy')}>{copied ? 'Copied!' : 'Copy Link'}</div> }
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} disabled={sharing}>
      <Button 
        icon={<ShareAltOutlined />} 
        loading={sharing}
        className="flex items-center justify-center w-8 h-8 min-w-0"
      />
    </Dropdown>
  );
};
