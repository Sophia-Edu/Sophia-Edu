import { ClientRequest } from '../requests';

export const getShareableUrl = (postId: number | string): string => {
  // Use HTTPS always and ensure URL is properly formatted
  const origin = window.location.origin.replace('http:', 'https:');
  return `${origin}/posts/${postId}`;
};

export const sharePost = async (platform: string, post: any) => {
  try {
    // First, try to get the shareable URL from the backend
    const shareResponse = await ClientRequest.sharePost(post.id);
    const shareUrl = shareResponse?.data?.shareUrl || getShareableUrl(post.id);

    // Get post metadata
    const title = post?.title || 'Check out this post on Sophia';
    const description = post?.description || post?.summary || 'Read this interesting post on Sophia';
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    const encodedUrl = encodeURIComponent(shareUrl);
    const source = encodeURIComponent('Sophia Educational Platform');

    // Platform-specific sharing logic with enhanced metadata
    switch (platform.toLowerCase()) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
      
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=sophia_edu`;
      
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}&source=${source}`;
      
      case 'whatsapp':
        return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
      
      case 'telegram':
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}%0A%0A${encodedDesc}`;
      
      case 'instagram':
        // Return formatted text for copying since Instagram doesn't support direct sharing
        return `${title}\n\n${description}\n\nRead more at: ${shareUrl}`;
      
      default:
        return shareUrl;
    }
  } catch (error) {
    console.error('Error generating share URL:', error);
    // Return a basic shareable URL as fallback
    const fallbackUrl = getShareableUrl(post.id);
    console.log('Using fallback URL:', fallbackUrl);
    return fallbackUrl;
  }
};
