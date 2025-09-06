import api from "../Api";
import {UserProps} from "../store";
import { uploadFileToCloudinary } from "../utils/helperFunction";

class ClientRequests {
    // Normalize a post response: accept flat object or { post: {...} } or AxiosResponse.data
    private pickPost = (res: any) => {
        if (!res) return res;
        // If interceptor not applied
        const data = res?.data ?? res;
        return data?.post ?? data;
    };
    // Ensure license items use backend's expected key on write and UI's expected key on read
    private mapLicenseKeysOut = (data: any) => {
        if (!data || typeof data !== 'object') return data;
        const clone: any = Array.isArray(data) ? [...data] : { ...data };
        const items = clone?.licenses_certifications;
        if (Array.isArray(items)) {
            clone.licenses_certifications = items.map((it: any) => {
                if (!it || typeof it !== 'object') return it;
                const item = { ...it };
                if (item.credential_id != null && item.credentials_id == null) {
                    item.credentials_id = item.credential_id;
                }
                return item;
            });
        }
        return clone;
    };

    // Paginated profiles list with phone_number included by backend
    getProfiles = async (params: { page?: number; per_page?: number; search?: string }): Promise<{ items: any[]; meta: any | null }> => {
        try {
            const response: any = await api.get(`/profile`, { params });
            // Normalize to { items, meta } regardless of interceptor shape
            const items = Array.isArray(response?.items)
                ? response.items
                : Array.isArray(response?.data?.items)
                ? response.data.items
                : Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                ? response.data
                : [];
            const meta = response?.meta || response?.data?.meta || null;
            return { items, meta };
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    private mapLicenseKeysIn = (obj: any) => {
        if (!obj || typeof obj !== 'object') return obj;
        const clone: any = Array.isArray(obj) ? [...obj] : { ...obj };
        const items = clone?.licenses_certifications;
        if (Array.isArray(items)) {
            clone.licenses_certifications = items.map((it: any) => {
                if (!it || typeof it !== 'object') return it;
                const item = { ...it };
                if (item.credential_id == null && item.credentials_id != null) {
                    item.credential_id = item.credentials_id;
                }
                return item;
            });
        }
        return clone;
    };
    getUserById = async (id: number) => {
        try {
            const response: any = await api.get(`/profile/${id}`);
            return this.mapLicenseKeysIn(response);
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    getMe = async (isAdmin?: boolean) => {
        try {
            // New endpoint returns the current user's profile directly
            const response = await api.get(`${isAdmin ? '/admin' : ''}/profile/me`);
            const data: any = this.mapLicenseKeysIn(response);
            // Expecting a single user object
            if (data && typeof data === 'object') {
                return data;
            }
            return null;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    updateMe = async (data: Partial<UserProps>) => {
        try {
            const payload = this.mapLicenseKeysOut(data);
            const response = await api.put(`/profile`, payload);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // PATCH /profile/partial — update only provided fields/items
    partialUpdate = async (data: Partial<UserProps>) => {
        try {
            const payload = this.mapLicenseKeysOut(data);
            const response = await api.patch(`/profile/partial`, payload);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    deleteProfileEntity = async (
        id: string,
        entity: "education" | "licenses_certifications" | "work_experience"
    ) => {
        try {
            // Map entity names to backend endpoint paths
            const pathMap: Record<string, string> = {
                education: "education",
                work_experience: "experience",
                licenses_certifications: "license",
            };
            const path = pathMap[entity];
            const response = await api.delete(`/user/${path}?id=${id}`);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    addProfileEntity = async (
        entity: "education" | "licenses_certifications" | "work_experience",
        data: any
    ) => {
        try {
            // Create new entity items via dedicated endpoints without id in query
            const pathMap: Record<string, string> = {
                education: "education",
                work_experience: "experience",
                licenses_certifications: "license",
            };
            const path = pathMap[entity];
            const response = await api.post(`/user/${path}`, data);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    uploadImage = async (img: File) => {
        try {
            // Strict client-side upload to Cloudinary, then update profile with URL
            const secureUrl = await uploadFileToCloudinary(img, 'image');
            const response = await api.put(`/profile`, { profile_image: secureUrl });
            return response;
        } catch (error: any) {
            console.log(error?.response?.data ?? error?.message ?? error);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "failed";
            throw new Error(errorMessage);
        }
    };

    uploadCoverPhoto = async (img: File) => {
        try {
            const secureUrl = await uploadFileToCloudinary(img, 'image');
            const response = await api.put(`/profile`, { cover_photo: secureUrl });
            return response;
        } catch (error: any) {
            console.log(error?.response?.data ?? error?.message ?? error);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "failed";
            throw new Error(errorMessage);
        }
    };

    setActive = async (active: boolean) => {
        try {
            const response = await api.put(`/profile/active`, { active });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    toggleActive = async () => {
        try {
            const response = await api.post(`/profile/active/toggle`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    reactivate = async (payload: { email: string; password: string }) => {
        try {
            const response = await api.post(`/reactivate`, payload);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    sendMessage = async (payload: any) => {
        try {
            // Strict client-side: if file present (FormData or object), upload to Cloudinary
            let response;

            // Helper to pull values out of FormData
            const extractFromFormData = (fd: FormData) => {
                const obj: any = {};
                fd.forEach((value, key) => {
                    if (key === 'file') obj.file = value;
                    else obj[key] = value;
                });
                return obj;
            };

            let dataObj: any = null;
            if (typeof FormData !== 'undefined' && payload instanceof FormData) {
                dataObj = extractFromFormData(payload);
            } else if (payload && (payload.file instanceof File || payload.file instanceof Blob)) {
                dataObj = payload;
            }

            if (dataObj && (dataObj.file instanceof File || dataObj.file instanceof Blob)) {
                const file: File | Blob = dataObj.file as File | Blob;
                // Upload to Cloudinary
                console.debug('Sending message: starting Cloudinary upload for file', (file as any)?.name ?? file);
                const secureUrl = await uploadFileToCloudinary(file, 'auto');
                console.debug('Sending message: Cloudinary upload returned secureUrl=', secureUrl);

                // Validate returned URL is for configured Cloudinary cloud name
                const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
                if (!CLOUD_NAME) {
                    console.error('VITE_CLOUDINARY_CLOUD_NAME is not set');
                    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set');
                }
                try {
                    const parsed = new URL(secureUrl);
                    const isCloudinaryHost = parsed.hostname.endsWith('cloudinary.com');
                    const hasCloudName = parsed.pathname.includes(`/${CLOUD_NAME}/`);
                    if (!isCloudinaryHost || !hasCloudName) {
                        throw new Error('Cloudinary upload returned a URL that does not match the configured cloud name');
                    }
                } catch (err: any) {
                    console.error('Invalid Cloudinary URL returned:', secureUrl, err?.message ?? err);
                    throw new Error('Invalid Cloudinary URL returned from upload');
                }

                const body: any = {};
                if (dataObj.recipient_id != null) body.recipient_id = dataObj.recipient_id;
                if (dataObj.content != null) body.content = dataObj.content;
                body.attachment_url = secureUrl;
                console.debug('Sending message: POST /messages body=', body);
                response = await api.post(`/messages`, body);
            } else if (dataObj) {
                // no file, but was FormData or object -> send as JSON
                response = await api.post(`/messages`, dataObj);
            } else {
                // plain object payload without files
                response = await api.post(`/messages`, payload);
            }

            return response;
        } catch (error: any) {
            console.log(error?.response?.data ?? error?.message ?? error);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || "failed";
            throw new Error(errorMessage);
        }
    };

    getMyMessages = async (): Promise<any[]> => {
        try {
            const response = await api.get(`/messages`);
            // Runtime returns data via interceptor, but TS types this as AxiosResponse.
            // Support both shapes safely.
            if (Array.isArray(response)) return response;
            const data = (response as any)?.data;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    getFriendMessage = async (userId: number): Promise<any[]> => {
        try {
            const response = await api.get(`/messages/${userId}`);
            if (Array.isArray(response)) return response;
            const data = (response as any)?.data;
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // GET /users with optional query params: page, per_page, search, name, email, location
    getUsers = async (params: {
        page?: number;
        per_page?: number;
        search?: string;
        name?: string;
        email?: string;
        location?: string;
    }): Promise<{ items: any[]; meta: any | null }> => {
        try {
            const response: any = await api.get(`/users`, { params });
            // Normalize to { items, meta } regardless of interceptor shape
            const raw = Array.isArray(response?.items)
                ? response.items
                : Array.isArray(response?.data?.items)
                ? response.data.items
                : Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                ? response.data
                : [];
            const meta = response?.meta || response?.data?.meta || null;
            // Map to consistent fields used by UI
            const items = raw.map((u: any) => {
                const id = u?.id ?? u?.user_id ?? u?.uid ?? u?.ID ?? null;
                const first = u?.first_name ?? u?.firstname ?? u?.firstName ?? "";
                const last = u?.last_name ?? u?.lastname ?? u?.lastName ?? "";
                const full_name = u?.full_name ?? u?.name ?? [first, last].filter(Boolean).join(" ");
                const email = u?.email ?? u?.mail ?? u?.user_email ?? "";
                const profile_image =
                    u?.profile_image ??
                    u?.profile_picture ??
                    u?.avatar_url ??
                    u?.avatar ??
                    u?.photo_url ??
                    u?.image_url ??
                    u?.photo ??
                    null;
                return { id, full_name, email, profile_image, ...u };
            }).filter((u: any) => u.id != null);
            return { items, meta };
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    markReadMessage = async (message_id: string) => {
        try {
            const response = await api.put(`/messages/${message_id}/read`);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // Messages unread counts and chat users
    getUnreadTotal = async (): Promise<number> => {
        try {
            const response: any = await api.get(`/messages/unread-count`);
            // API returns { unread_count: <int> }
            return response?.unread_count ?? 0;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    getUnreadByUser = async (): Promise<Array<{ user_id: number; count: number }>> => {
        try {
            const response: any = await api.get(`/messages/unread-count/by-user`);
            return Array.isArray(response) ? response : [];
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    getChatUsers = async (): Promise<Array<{ id: number; full_name: string; profile_image?: string | null; unread_count: number }>> => {
        try {
            const response: any = await api.get(`/chat-users`);
            const raw: any[] = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
            // Normalize keys so UI can reliably access profile_image and full_name
            const items = raw.map((u: any) => {
                const id = u?.id ?? u?.user_id ?? u?.uid ?? null;
                const first = u?.first_name ?? u?.firstname ?? u?.firstName ?? "";
                const last = u?.last_name ?? u?.lastname ?? u?.lastName ?? "";
                const full_name = u?.full_name ?? u?.name ?? [first, last].filter(Boolean).join(" ");
                const unread_count = u?.unread_count ?? u?.unread ?? 0;
                const profile_image =
                    u?.profile_image ??
                    u?.profile_picture ??
                    u?.avatar_url ??
                    u?.avatar ??
                    u?.photo_url ??
                    u?.image_url ??
                    u?.photo ??
                    null;
                return { id, full_name, profile_image, unread_count };
            }).filter((u: any) => u.id != null);
            return items;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // Notifications CRUD
    listNotifications = async (): Promise<Array<{ id: number; content: string; is_read: boolean; created_at: string }>> => {
        try {
            const response: any = await api.get(`/notifications`);
            const items = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
            return items;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    createNotification = async (content: string): Promise<{ id: number } | any> => {
        try {
            const response: any = await api.post(`/notifications`, { content });
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    markNotificationRead = async (notificationId: number): Promise<any> => {
        try {
            const response: any = await api.put(`/notifications/${notificationId}/read`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // New: unread count for notifications
    getNotificationsUnreadCount = async (): Promise<number> => {
        try {
            const response: any = await api.get(`/notifications/unread-count`);
            return response?.unread_count ?? 0;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // New: mark all notifications as read
    markAllNotificationsRead = async (): Promise<any> => {
        try {
            const response: any = await api.put(`/notifications/mark-all-read`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    deleteNotification = async (notificationId: number): Promise<any> => {
        try {
            const response: any = await api.delete(`/notifications/${notificationId}`);
            return response;
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    // Unified global search: GET /search?q=term&limit=5
    globalSearch = async (params: { q?: string; search?: string; limit?: number }): Promise<{
        query: string;
        courses: any[];
        modules: any[];
        users: Array<{ id: number; full_name: string; email?: string; profile_image?: string | null }>;
    }> => {
        try {
            const response: any = await api.get(`/search`, { params });
            const query = response?.query || params.q || params.search || "";
            const courses = Array.isArray(response?.courses) ? response.courses : [];
            const modules = Array.isArray(response?.modules) ? response.modules : [];
            const rawUsers = Array.isArray(response?.users) ? response.users : [];
            const users = rawUsers.map((u: any) => {
                const id = u?.id ?? u?.user_id ?? null;
                const full_name = u?.full_name ?? u?.name ?? "";
                const email = u?.email ?? "";
                const profile_image =
                    u?.profile_image ?? u?.profile_picture ?? u?.avatar_url ?? u?.avatar ?? null;
                return { id, full_name, email, profile_image };
            }).filter((u: any) => u.id != null);
            return { query, courses, modules, users };
        } catch (error: any) {
            console.log(error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    };

    uploadPost = async (payload: any) => {
        try {
            // Map keys to backend snake_case regardless of input style
            const mapKey = (k: string) => {
                const m: Record<string, string> = {
                    executiveSummary: 'executive_summary',
                    doiLink: 'doi_link',
                    videoLink: 'video_link',
                };
                return m[k] || k;
            };

            // If FormData provided, rebuild with normalized keys
            if (typeof FormData !== 'undefined' && payload instanceof FormData) {
                const form = new FormData();
                // Copy entries while remapping keys where necessary
                (payload as FormData).forEach((value, key) => {
                    // Backend expects the file under 'document'
                    if (key === 'file') {
                        form.append('document', value as any);
                    } else {
                        form.append(mapKey(key), value as any);
                    }
                });
                const response = await api.post(`/user/posts`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return this.pickPost(response);
            }

            // If a file/document exists in object payload, send multipart
            const fileLike = (payload?.file instanceof File || payload?.file instanceof Blob)
                || (payload?.document instanceof File || payload?.document instanceof Blob)
                || (payload?.documentFile instanceof File || payload?.documentFile instanceof Blob);

            if (fileLike) {
                // Strict client-side upload: upload document to Cloudinary, then send URL to backend
                const file = payload.document || payload.file || payload.documentFile;
                const secureUrl = await uploadFileToCloudinary(file, 'auto');
                const body: any = {};
                const keys = ['title','executive_summary','executiveSummary','subject','doi_link','doiLink','video_link','videoLink'];
                keys.forEach((k) => {
                    const v = (payload as any)[k];
                    if (v != null) body[mapKey(k)] = v;
                });
                // backend expects 'document' or similar; send as document_url
                body.document_url = secureUrl;
                const response = await api.post(`/user/posts`, body);
                return this.pickPost(response);
            }

            // Otherwise send JSON with snake_case
            const body: any = {};
            (['title','executive_summary','subject','doi_link','video_link'] as const).forEach((k) => {
                const v = (payload as any)[k];
                if (v !== undefined && v !== null) body[k] = v;
            });
            // Also map from potential camelCase input
            if (body.executive_summary == null && payload?.executiveSummary != null) body.executive_summary = payload.executiveSummary;
            if (body.doi_link == null && payload?.doiLink != null) body.doi_link = payload.doiLink;
            if (body.video_link == null && payload?.videoLink != null) body.video_link = payload.videoLink;

            const response = await api.post(`/user/posts`, body);
            return this.pickPost(response);
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    getPosts = async () => {
        try {
            const response = await api.get(`/user/posts`);
            return response;
        } catch (error: any) {
            // Extract the message or create a custom error message
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // List user posts with pagination and normalized shape
    listUserPosts = async (params: { page?: number; per_page?: number }) => {
        try {
            const res: any = await api.get(`/user/posts`, { params });
            // Accept common shapes:
            // 1) { data: { posts, pagination } }
            // 2) { data: { items, pagination } }
            // 3) { data: posts[] }
            // 4) direct array
            // 5) { data: { data: { posts/items, pagination } } }
            const root = res?.data?.data ?? res?.data ?? res;
            let collection: any[] = [];
            if (Array.isArray(root?.posts)) collection = root.posts;
            else if (Array.isArray(root?.items)) collection = root.items;
            else if (Array.isArray(root?.data)) collection = root.data;
            else if (Array.isArray(root)) collection = root;
            const posts = (collection || []).map((p: any) => {
                const exec = p?.executive_summary ?? p?.executiveSummary ?? p?.summary ?? p?.abstract ?? p?.description ?? "";
                return { ...p, executive_summary: exec };
            });
            const pagination = root?.pagination || root?.meta || null;
            return { posts, pagination };
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Get a single post (also records a read for Recent Reads)
    getUserPost = async (post_id: number | string) => {
        try {
            const res: any = await api.get(`/user/posts/${post_id}`);
            // Return flat post object, regardless of shape
            return this.pickPost(res);
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Vote on a post: { vote_type: 'upvote' | 'downvote' }
    voteOnPost = async (post_id: number | string, vote_type: 'upvote' | 'downvote') => {
        try {
            const res: any = await api.post(`/user/posts/${post_id}/vote`, { vote_type });
            return res; // { message, upvote_count, downvote_count }
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Comments
    addPostComment = async (post_id: number | string, content: string, parent_id?: number | null) => {
        try {
            const body: any = { content };
            if (parent_id != null) body.parent_id = parent_id;
            const res: any = await api.post(`/user/posts/${post_id}/comments`, body);
            return res; // { message, comment }
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    listPostComments = async (post_id: number | string) => {
        try {
            const res: any = await api.get(`/user/posts/${post_id}/comments`);
            return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Share
    sharePost = async (post_id: number | string) => {
        try {
            const res: any = await api.post(`/user/posts/${post_id}/share`);
            return res;
        } catch (error: any) {
            // Fallback: some backends may expose /repost instead of /share
            const status = error?.response?.status;
            if (status === 404 || status === 405) {
                try {
                    const res2: any = await api.post(`/user/posts/${post_id}/repost`);
                    return res2;
                } catch (err2: any) {
                    console.log(err2);
                }
            }
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Repost
    repostPost = async (post_id: number | string) => {
        try {
            const res: any = await api.post(`/user/posts/${post_id}/repost`);
            return res;
        } catch (error: any) {
            // Fallback to /share if /repost is not present
            const status = error?.response?.status;
            if (status === 404 || status === 405) {
                try {
                    const res2: any = await api.post(`/user/posts/${post_id}/share`);
                    return res2;
                } catch (err2: any) {
                    console.log(err2);
                }
            }
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Global feed: merged originals and reposts
    getGlobalFeed = async (params: { page?: number; per_page?: number }) => {
        try {
            const res: any = await api.get(`/feed`, { params });
            // Expected: { status, data: { items, pagination } } but support variants
            const dataRoot = res?.data ?? res;
            const inner = dataRoot?.data ?? dataRoot;
            let items: any[] = [];
            if (Array.isArray(inner?.items)) items = inner.items;
            else if (Array.isArray(inner?.posts)) items = inner.posts;
            else if (Array.isArray(inner)) items = inner;
            // No heavy normalization; preserve type 'post' | 'repost'
            const pagination = inner?.pagination || inner?.meta || null;
            return { items, pagination };
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Save/Bookmark
    savePost = async (post_id: number | string) => {
        try {
            const res: any = await api.post(`/user/posts/${post_id}/save`);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    getSavedPosts = async () => {
        try {
            const res: any = await api.get(`/user/saved_posts`);
            return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Followed/related posts
    getFollowedPosts = async () => {
        try {
            const res: any = await api.get(`/user/followed_posts`);
            return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Recently read
    getRecentReads = async (params: { page?: number; per_page?: number; snippet_length?: number }) => {
        try {
            const res: any = await api.get(`/user/posts/recent`, { params });
            const root = res?.data?.data ?? res?.data ?? res;
            // Accept common container keys
            const containers: any[] = [
                root?.posts,
                root?.items,
                root?.data?.posts,
                root?.data?.items,
                root?.recent,
                root?.recents,
                Array.isArray(root) ? root : undefined,
            ].filter(Boolean);
            const raw: any[] = (containers.find((x) => Array.isArray(x)) as any[]) || [];
            const posts = raw.map((p: any) => {
                const exec = p?.executive_summary ?? p?.executiveSummary ?? p?.summary ?? p?.abstract ?? p?.description ?? "";
                // Normalize author shape
                const author = p?.author || p?.user || p?.owner || null;
                return { ...p, executive_summary: exec, author: author ?? p?.author };
            });
            const pagination = root?.pagination || root?.meta || root?.paging || null;
            return { posts, pagination };
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Update a post (PUT JSON). Backend expects snake_case JSON.
    updatePost = async (
        post_id: number | string,
        payload: {
            title?: string;
            executive_summary?: string;
            subject?: string;
            doi_link?: string;
            video_link?: string;
            // Document replacement not supported on JSON PUT per backend note
            // Use separate endpoint if available; omitted here
            document?: never;
        }
    ) => {
        try {
            // Only include provided keys
            const body: any = {};
            (['title','executive_summary','subject','doi_link','video_link'] as const).forEach((k) => {
                const v = (payload as any)[k];
                if (v !== undefined && v !== null) body[k] = v;
            });
            const res: any = await api.put(`/user/posts/${post_id}`, body);
            // Return flat post object if wrapped
            return this.pickPost(res);
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Delete a post
    deletePost = async (post_id: number | string) => {
        try {
            const res: any = await api.delete(`/user/posts/${post_id}`);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    // Certificates
    createCertificate = async (payload: {
        course: string;
        publication_title: string;
        publication_name: string;
        doi: string;
        preview_image_url?: string;
        pdf_url?: string;
    }) => {
        try {
            const res: any = await api.post(`/certificates`, payload);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    getCertificateById = async (id: number | string) => {
        try {
            const res: any = await api.get(`/certificates/${id}`);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    getCertificateBySlug = async (slug: string) => {
        try {
            const res: any = await api.get(`/certificates/slug/${slug}`);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    listMyCertificates = async () => {
        try {
            const res: any = await api.get(`/users/me/certificates`);
            return res;
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    downloadCertificatePdf = async (id: number | string, slug?: string) => {
        try {
            const path = `/certificates/${id}/download${slug ? `?slug=${encodeURIComponent(slug)}` : ""}`;
            const res: any = await api.get(path);
            return res; // Expecting { redirect: url } in Phase 1
        } catch (error: any) {
            console.log(error);
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                "failed";
            throw new Error(errorMessage);
        }
    }

    uploadCertificateAsset = async (file: File | Blob, _filename?: string) => {
        try {
            // Strict client-side upload to Cloudinary, return URL to be saved by backend
            const secureUrl = await uploadFileToCloudinary(file as any, 'auto');
            return { url: secureUrl };
        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "failed";
            throw new Error(errorMessage);
        }
    }
}

const clientRequests = new ClientRequests();
export default clientRequests;
