import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Logo as defaultAvatar } from "../assets";

// Define the interface for the JWT payload
interface JwtPayload {
	exp: number;
	iat: number;
	sub: string; // Customize based on your token's payload structure
	[key: string]: any; // Allow other dynamic properties
}

export const getRandomItem = (array: string[]) =>
	array[Math.floor(Math.random() * array.length)];

export const getRandomDate = () => {
	const start = new Date(2022, 0, 1);
	const end = new Date();
	const date = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
	return `${date.getFullYear()}-${
		date.getMonth() + 1
	}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}pm`;
};

// Cache for preloaded images
const imageCache = new Map<string, boolean>();

export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (imageCache.has(src)) {
            resolve();
            return;
        }
        
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, true);
            resolve();
        };
        img.onerror = () => {
            reject(new Error(`Failed to preload image: ${src}`));
        };
        img.src = src;
    });
};

export const getAvatar = (avatar?: string) => {
    // Normalize and validate the incoming avatar value
    const val = (avatar ?? "").trim();
    if (!val || val.toLowerCase() === "undefined" || val.toLowerCase() === "null") {
        return defaultAvatar as unknown as string;
    }
    // Replace known empty placeholder asset with Logo
    if (/\/assets\/empty-post\.svg$/i.test(val) || /empty-post\.svg$/i.test(val)) {
        return defaultAvatar as unknown as string;
    }
    
    // Preload the image for faster subsequent loads
    if (val && val.startsWith('http')) {
        preloadImage(val).catch(err => {
            console.warn('Failed to preload avatar image:', err);
        });
    }
    
    return val;
};

export const clearAllCookies = () => {
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	}
};

export const getTokenData = (token: string): JwtPayload | null => {
	try {
		return jwtDecode<JwtPayload>(token);
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

export const countWords = (text: string): number => {
	// Trim the text and split it by spaces or other word delimiters
	return text.trim().split(/\s+/).filter(Boolean).length;
};

export const uploadImageToCloudinary = async (file: any) => {
	const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
	const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

	if (!CLOUD_NAME) throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set');
	if (!UPLOAD_PRESET) throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not set');

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET); // Cloudinary upload preset

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, // Cloudinary URL
			formData
		);
		return response.data.secure_url; // Return the uploaded image URL
	} catch (error: any) {
		console.error('Cloudinary upload error:', error.response?.data ?? error.message ?? error);
		throw new Error(error.response?.data?.error?.message || 'Failed to upload image');
	}
};

export const uploadFileToCloudinary = async (file: any, resourceType: 'image' | 'video' | 'auto' = 'auto') => {
	const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
	const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

	if (!CLOUD_NAME) throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not set');
	if (!UPLOAD_PRESET) throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET is not set');

	const formData = new FormData();
	formData.append("file", file);
	formData.append("upload_preset", UPLOAD_PRESET); // Cloudinary upload preset

	try {
		// Use the appropriate resource type for different file types
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, // Cloudinary URL with resource type
			formData
		);
		return response.data.secure_url; // Return the uploaded file URL
	} catch (error: any) {
		console.error('Cloudinary upload error:', error.response?.data ?? error.message ?? error);
		throw new Error(error.response?.data?.error?.message || `Failed to upload ${resourceType}`);
	}
};

export const exportToExcel = (payload: any) => {
	const worksheet = XLSX.utils.json_to_sheet(payload.data);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
	const excelBuffer = XLSX.write(workbook, {
		bookType: "xlsx",
		type: "array",
	});
	const dataBlob = new Blob([excelBuffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
	});
	saveAs(
		dataBlob,
		payload.fileName ? payload.fileName + ".xlsx" : "table-data.xlsx"
	);
};

export const removeDuplicates = (obj: Record<string, any>): Record<string, any> => {
	return Object.keys(obj).reduce((acc, key) => {
		acc[key] = obj[key]; // Always assign the latest value
		return acc;
	}, {} as Record<string, any>);
};


 /**
 * Converts frontend module data to API payload format
 * @param {Object} moduleData - Frontend module data (e.g., module_1_title, module_1_description)
 * @param {string} courseId - The ID of the course this module belongs to
 * @param {number} moduleIndex - The current module index (1-based)
 * @returns {Object} - Formatted payload for API request
 */
 export function formatModulePayload(moduleData:any, courseId:any, moduleIndex: number = 1) {
	// Extract the base property names (remove the module_X_ prefix)
	const modulePrefix = `module_${moduleIndex}_`;
	const properties :any= {};
	
	for (const key in moduleData) {
		if (key.startsWith(modulePrefix)) {
			const newKey = key.replace(modulePrefix, '');
			properties[newKey] = moduleData[key];
		}
	}

	// Handle media file and resources that could be URLs or file objects
	let mediaFile = properties.media?.file || properties.media || undefined;
	let additionalResources = properties.additional_resources?.file || properties.additional_resources || undefined;
	
	// If media file or resources are URLs (from Cloudinary), use them directly
	if (typeof mediaFile === 'string' && (mediaFile.startsWith('http://') || mediaFile.startsWith('https://'))) {
		// It's already a URL, keep it as is
	} else if (mediaFile?.name) {
		// It's a file object, use the name for the API
		mediaFile = mediaFile.name;
	}
	
	if (typeof additionalResources === 'string' && (additionalResources.startsWith('http://') || additionalResources.startsWith('https://'))) {
		// It's already a URL, keep it as is
	} else if (additionalResources?.name) {
		// It's a file object, use the name for the API
		additionalResources = additionalResources.name;
	}

	// Map to the API payload structure
	const payload :any= {
		name: properties.title || '', // Using title as name if not provided separately
		course_id: courseId,
		description: properties.description || undefined,
		title: properties.title || undefined,
		content: properties.body || undefined,
		additional_resources: additionalResources,
		media_file: mediaFile
	};

	// Remove undefined values to clean up the payload
	Object.keys(payload).forEach(key => {
		if (payload[key] === undefined) {
			delete payload[key];
		}
	});

	return payload;
}


/**
 * export function formatModulePayload(moduleData: any, courseId: string): FormData {
 *     // Extract the base property names (remove the module_1_ prefix)
 *     const properties: any = {};
 *     for (const key in moduleData) {
 *         if (key.startsWith('module_1_')) {
 *             const newKey = key.replace('module_1_', '');
 *             properties[newKey] = moduleData[key];
 *         }
 *     }
 *
 *     // Create a new FormData object
 *     const formData = new FormData();
 *
 *     // Append simple data to FormData
 *     formData.append('name', properties.title || ''); // Using title as name if not provided separately
 *     formData.append('course_id', courseId);
 *     formData.append('description', properties.description || '');
 *     formData.append('title', properties.title || '');
 *     formData.append('content', properties.body || '');
 *     formData.append('additional_resources', properties.additional_resources || '');
 *
 *     // Append the media file, if it exists
 *     if (properties.media && properties.media.file) {
 *         formData.append('media_file', properties.media.file);
 *     }
 *
 *     return formData;
 * }
 */

