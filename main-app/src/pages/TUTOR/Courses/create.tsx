import React, { useEffect, useState } from "react";
import Layout from "../../DashboardLayout";

import { Button, Form, Input, Select, Upload, Checkbox, List } from "antd";
import { URL } from "../../../utils/constants";

import { ArrowLeftOutlined, LoadingOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { CourseProps, useCourse } from "../../../store.tsx";
import { toast } from "react-toastify";
import { TutorRequest, AdminRequest } from "../../../requests";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "../../../components/editor.tsx";
import tutorRequests from "../../../requests/tutor.request.tsx";
import { message } from "antd";
import { uploadImageToCloudinary, uploadFileToCloudinary, getTokenData } from "../../../utils/helperFunction.tsx";
import { getStoredAuthToken, getUserType, setStoredAuthToken } from "../../../utils/storage";

import ModuleManager from "../../../components/module/ModuleManager";
import CollapsibleSection from "../../../components/CollapsibleSection";

const handleBeforeUpload = (file: any) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!allowedTypes.includes(file.type)) {
    message.error(`Invalid file type! Please upload a document file.
        Supported formats: PDF, DOCX, PPT, PPTX, XLS, XLSX`);
    return Upload.LIST_IGNORE;
  }

  if (file.size > maxSize) {
    message.error("File is too large! Maximum size allowed is 20MB.");
    return Upload.LIST_IGNORE;
  }

  // Show success message and store the file object (don't upload to Cloudinary)
  message.success(`Document "${file.name}" is ready to attach!`);
  return false; // File passes validation, but we'll handle it locally
};

// Function will be moved after state declarations

const handleMediaUpload = (file: any) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/bmp",
    "image/tiff",
  ];

  const allowedVideoTypes = [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
    "video/mkv",
    "video/3gp",
    "video/quicktime",
  ];

  const maxSize = 50 * 1024 * 1024; // 50MB for media files
  const isImage = allowedImageTypes.includes(file.type);
  const isVideo = allowedVideoTypes.includes(file.type);

  if (!isImage && !isVideo) {
    message.error(`Invalid file type! Please upload an image or video file. 
        Supported image formats: JPG, PNG, GIF, WEBP, SVG, BMP, TIFF
        Supported video formats: MP4, AVI, MOV, WMV, FLV, WEBM, MKV, 3GP`);
    return Upload.LIST_IGNORE;
  }

  if (file.size > maxSize) {
    message.error("File is too large! Maximum size allowed is 50MB.");
    return Upload.LIST_IGNORE;
  }

  // Show success message
  message.success(
    `${isImage ? "Image" : "Video"} file "${file.name}" is ready to upload!`
  );
  return false; // File passes validation
};
const CreateCoursePage: React.FC = () => {
  const [form] = Form.useForm();
  const [moduleNumber, setModuleNumber] = useState<number>(1);
  const { course, setCourse } = useCourse();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentModule, setCurrentModule] = useState(0); // Track current module
  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [courseMetadata, setCourseMetadata] = useState<{ course_titles: string[]; course_names: string[]; course_types: string[] } | null>(null);
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [modulesData, setModulesData] = useState<any[]>([]); // Store all modules data
  const [currentContentIndex, setCurrentContentIndex] = useState(0); // Track current content item within module
  const [moduleContents, setModuleContents] = useState<any[]>([]); // Store content items for current module
  // New: module selection (optional) in step 1
  const [availableModules, setAvailableModules] = useState<any[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);
  const nav = useNavigate();
  
  // Toggle select existing module (optional)
  const toggleModuleSelection = (moduleId: number) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true);
      // Use the uploadImageToCloudinary helper function
      const secureUrl = await uploadImageToCloudinary(file);
      
      // Set the course image to the Cloudinary URL
      setCourseImage(secureUrl);
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  // Fetch categories and course metadata when component mounts
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setMetadataLoading(true);
        // Categories
        const response: any = await TutorRequest.getCategories();
        setCategories(response.items || []);
        // Course metadata (titles, names, types)
        const metadataResponse: any = await AdminRequest.getCourseMetadata();
        const md = metadataResponse?.data || metadataResponse;
        setCourseMetadata({
          course_titles: md?.course_titles || [],
          course_names: md?.course_names || [],
          course_types: md?.course_types || [],
        });
      } catch (error: any) {
        console.error("Error loading dropdown data:", error);
        message.error("Failed to load dropdown data");
      } finally {
        setMetadataLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Function to load available modules for selection
  const loadAvailableModules = async () => {
    try {
      const list = await tutorRequests.listModules();
      // Normalize items to a consistent shape for display
      const normalized = (Array.isArray(list) ? list : []).map((m: any, idx: number) => {
        const id = m?.id ?? m?.module_id ?? m?.moduleId ?? idx;
        const name = m?.name ?? m?.title ?? `Module ${idx + 1}`;
        const description = m?.description ?? m?.brief ?? '';
        const lessons = Array.isArray(m?.data)
          ? m.data
          : Array.isArray(m?.lessons)
          ? m.lessons
          : Array.isArray(m?.contents)
          ? m.contents
          : [];
        const data_entries_count = m?.data_entries_count ?? m?.lessons_count ?? (Array.isArray(lessons) ? lessons.length : 0);
        return { ...m, id, name, title: m?.title ?? name, description, data: lessons, data_entries_count };
      });
      setAvailableModules(normalized);
    } catch (err) {
      console.error('Failed to load modules for selection', err);
    }
  };

  // New: Fetch available modules for optional selection (step 1)
  useEffect(() => {
    if (step === 1) {
      loadAvailableModules();
    }
  }, [step]);

  useEffect(() => {
    // Only run this effect in step 1
    if (step === 1) {
      const numberOfModules = form.getFieldValue("number_of_modules");
      const newModuleNumber = numberOfModules || 1;
      if (newModuleNumber !== moduleNumber) {
        console.log("useEffect: Setting moduleNumber from", moduleNumber, "to", newModuleNumber);
        setModuleNumber(newModuleNumber);
      }
    }
  }, [form, step, moduleNumber]);

  // Initialize form with persisted values
  useEffect(() => {
    if (course && step === 1) {
      const formValues = {
        category_id: course.course_category || '',
        course_type: course.course_type || '',
        course_name: course.course_title || '',
        course_title: course.course_title || '',
        brief: course.brief || '',
        content: course.brief || '', // Map brief to content if no content field
        price: '', // Add price if stored somewhere
        number_of_modules: course.number_of_module || 1,
      };
      form.setFieldsValue(formValues);
      setModuleNumber(course.number_of_module || 1);
      
      console.log("Loading course data into form:", course);
      console.log("Form values set:", formValues);
    }
  }, [course, form, step]);

  // Load existing module data when currentModule changes
  useEffect(() => {
    if (step === 2) {
      // Ensure moduleNumber is set from course data when entering step 2
      if (course?.number_of_module && moduleNumber !== course.number_of_module) {
        console.log("Setting module number in step 2 from course data:", course.number_of_module);
        setModuleNumber(course.number_of_module);
      }
      
      // Load existing module data if it exists
      if (modulesData[currentModule]) {
        const moduleData = modulesData[currentModule];
        setModuleContents(moduleData.contents || []);
        
        // If there's existing content, load the first content item into the form
        if (moduleData.contents && moduleData.contents.length > 0) {
          const firstContent = moduleData.contents[0];
          const modulePrefix = `module_${currentModule + 1}_`;
          const formFields: any = {};
          
          Object.keys(firstContent).forEach((key) => {
            if (firstContent[key] !== null && firstContent[key] !== undefined) {
              formFields[`${modulePrefix}${key}`] = firstContent[key];
            }
          });
          
          form.setFieldsValue(formFields);
          setCurrentContentIndex(0);
          console.log(`Loaded existing content for Module ${currentModule + 1}`);
        } else {
          setCurrentContentIndex(0);
          form.resetFields();
        }
      } else {
        setModuleContents([]);
        setCurrentContentIndex(0);
        form.resetFields();
      }
    }
  }, [currentModule, step, modulesData, course, moduleNumber, form]);

  console.log(course);

  const handleValuesChange = () => {
    // Only update module number when we're in step 1 (course creation step)
    if (step === 1) {
      const numberOfModules = form.getFieldValue("number_of_modules");
      if (numberOfModules && numberOfModules !== moduleNumber) {
        console.log("Updating module number from", moduleNumber, "to", numberOfModules);
        setModuleNumber(numberOfModules);
      }
    }
  };

  const handleNext = async () => {
    // Check if course image has been uploaded to Cloudinary
    if (!courseImage) {
      message.error('Please upload a course image before proceeding');
      return;
    }
    
    setLoading(true);
    try {
      // Preflight: ensure backend sees instructor usertype cookie if your environment requires it
      try {
        const cookieType = getUserType();
        let token: string | null = getStoredAuthToken();
        if (!token && typeof window !== 'undefined') {
          const ls = window.localStorage?.getItem('token');
          if (ls && ls.trim()) token = ls.trim();
        }
        if (!cookieType && token) {
          const payload: any = getTokenData(token);
          const role = payload?.role || payload?.user_type || payload?.type || payload?.usertype;
          const roles = payload?.roles || payload?.scopes || [];
          const isInstructor = String(role || '').toLowerCase() === 'instructor' || (Array.isArray(roles) && roles.map((r: any) => String(r).toLowerCase()).includes('instructor'));
          if (isInstructor) {
            // This will set the usertype cookie without changing endpoints
            setStoredAuthToken(token, 'instructor');
          }
        }
      } catch {}

      const formValues = form.getFieldsValue();
      const first = (v: any) => Array.isArray(v) ? v[0] : v;
      const normCourseType = first(formValues.course_type);
      const normCourseName = first(formValues.course_name);
      const normCourseTitle = first(formValues.course_title);

      // Create payload matching backend requirements
      const selectedCategory = categories.find(cat => cat.id === formValues.category_id);
      const categoryNames = selectedCategory ? [selectedCategory.name] : [];
      
      const basePayload = {
        courses: [{
          course_name: normCourseName,
          title: normCourseTitle,
          brief: formValues.brief,
          content: formValues.content,
          course_type: normCourseType,
          price: formValues.price,
          image: courseImage,
        }],
        categories: categoryNames, // Backend expects categories array, not category_id
      };

      const selectedIds = Array.isArray(selectedModuleIds) ? selectedModuleIds.map(Number) : [];

      if (selectedIds.length > 0) {
        // Create single course with module_ids array - backend expects this format
        const coursePayload = {
          titles: normCourseTitle,
          course_name: normCourseName,
          content: formValues.content,
          price: formValues.price,
          module_ids: selectedIds,  // Backend expects array of module IDs
          categories: categoryNames
        };
        
        console.log("Sending course payload with module_ids:", coursePayload);
        console.log("Selected module IDs:", selectedIds);
        
        await TutorRequest.createCourse(coursePayload);
        toast.success(`Course created successfully with ${selectedIds.length} modules attached!`);
      } else {
        // Create single course without modules
        const coursePayload = {
          ...basePayload,
          courses: [{
            ...basePayload.courses[0],
            module_id: null
          }]
        };
        
        await TutorRequest.createCourse(coursePayload);
        toast.success("Course created successfully!");
      }

      nav(URL.COURSES);
      return;
    } catch (error: any) {
      const status = error?.response?.status;
      const msg = error?.message || "";
      if (status === 403 || /only instructors/i.test(msg)) {
        toast.error("Only instructors can upload courses. Please log in as an instructor and try again.");
      } else {
        message.error("Failed to create course. Please try again.");
      }
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      // Prepare FormData
      const formData = new FormData();

      // Create updated values with course title as array
      const updatedValues = {
        ...values,
        titles: [values.course_title], // Convert single title to array format
        image: courseImage, // Changed from image_base64 to image with Cloudinary URL
      };

      // Dynamically append form fields to FormData
      Object.entries({ ...course, ...updatedValues }).forEach(
        ([key, value]: any) => {
          formData.append(key, value);
        }
      );

      // Submit FormData
      await TutorRequest.createCourse(formData);

      // Navigate & Notify
      nav(URL.COURSES);
      toast.success("Course created successfully.");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  // New function to format multiple modules for batch creation
  const formatMultipleModulesPayload = async (
    allModulesData: any[],
    courseId: string
  ) => {
    const modules: any[] = [];

    for (let index = 0; index < allModulesData.length; index++) {
      const moduleData = allModulesData[index] || {};

      // lessons can be stored under data or contents in various parts of the UI
      const lessonsSrc = moduleData.data || moduleData.contents || [];
      const dataArr: any[] = [];

      for (let i = 0; i < lessonsSrc.length; i++) {
        const lesson = lessonsSrc[i] || {};

        // normalize additional_resources and media_file
        let additional_resources: any = lesson.additional_resources ?? null;
        let media_file: any = lesson.media_file ?? null;

        // handle Antd Upload file structures
        if (additional_resources?.file) additional_resources = additional_resources.file;
        if (additional_resources?.originFileObj) additional_resources = additional_resources.originFileObj;
        if (Array.isArray(additional_resources) && additional_resources[0]?.originFileObj) additional_resources = additional_resources[0].originFileObj;

        if (media_file?.originFileObj) media_file = media_file.originFileObj;
        if (Array.isArray(media_file) && media_file[0]?.originFileObj) media_file = media_file[0].originFileObj;

        // upload files if they are File objects
        if (additional_resources instanceof File) {
          try {
            additional_resources = await uploadFileToCloudinary(additional_resources, additional_resources.type?.startsWith('image/') ? 'image' : 'auto');
          } catch (err) {
            console.error('Failed to upload lesson additional_resources', err);
            additional_resources = null;
          }
        }

        if (media_file instanceof File) {
          try {
            media_file = await uploadFileToCloudinary(media_file, media_file.type?.startsWith('image/') ? 'image' : 'auto');
          } catch (err) {
            console.error('Failed to upload lesson media_file', err);
            media_file = null;
          }
        }

        dataArr.push({
          title: lesson.title || `Content ${i + 1}`,
          content: lesson.body || lesson.content || '',
          media_file: typeof media_file === 'string' ? media_file : null,
          additional_resources: typeof additional_resources === 'string' ? additional_resources : null,
          order: i + 1,
        });
      }

      // module-level media/resources
      let module_additional_resources: any = moduleData.additional_resources ?? null;
      let module_media_file: any = moduleData.media_file ?? null;

      if (module_additional_resources?.originFileObj) module_additional_resources = module_additional_resources.originFileObj;
      if (Array.isArray(module_additional_resources) && module_additional_resources[0]?.originFileObj) module_additional_resources = module_additional_resources[0].originFileObj;
      if (module_media_file?.originFileObj) module_media_file = module_media_file.originFileObj;
      if (Array.isArray(module_media_file) && module_media_file[0]?.originFileObj) module_media_file = module_media_file[0].originFileObj;

      if (module_additional_resources instanceof File) {
        try {
          module_additional_resources = await uploadFileToCloudinary(module_additional_resources, module_additional_resources.type?.startsWith('image/') ? 'image' : 'auto');
        } catch (err) {
          console.error('Failed to upload module additional_resources', err);
          module_additional_resources = null;
        }
      }

      if (module_media_file instanceof File) {
        try {
          module_media_file = await uploadFileToCloudinary(module_media_file, module_media_file.type?.startsWith('image/') ? 'image' : 'auto');
        } catch (err) {
          console.error('Failed to upload module media_file', err);
          module_media_file = null;
        }
      }

      modules.push({
        name: moduleData.name || moduleData.title || `Module ${index + 1}`,
        title: moduleData.title || moduleData.name || `Module ${index + 1}`,
        description: moduleData.description || '',
        additional_resources: typeof module_additional_resources === 'string' ? module_additional_resources : null,
        media_file: typeof module_media_file === 'string' ? module_media_file : null,
        order: index + 1,
        is_template: moduleData.is_template ?? false,
        data: dataArr,
      });
    }

    return { modules };
  };

  // Update handleNextModule to collect data and create all modules at once
  const handleNextModule = async () => {
    // Check if course ID exists before proceeding
    if (!course?.id) {
      message.error(
        "Course ID is missing. Please go back and create the course first."
      );
      setStep(1);
      return;
    }

    try {
      setLoading(true);

      // Get current content data from form if form has content
      const formValues = form.getFieldsValue();
      const hasFormContent = Object.values(formValues).some(value => value && value !== '');
      
      let currentContentData = null;
      if (hasFormContent) {
        currentContentData = extractContentData(formValues, currentModule + 1);
        
        // Validate that required fields are filled if there's content
        if (currentContentData.title || currentContentData.body) {
          if (!currentContentData.title || !currentContentData.body) {
            message.error('Please fill in both Title and Body, or clear the form before proceeding to next module.');
            setLoading(false);
            return;
          }
        }
      }
      
      // Add current content to the moduleContents array if it has valid content
      let updatedContents = [...moduleContents];
      if (currentContentData && (currentContentData.title || currentContentData.body)) {
        if (currentContentIndex < updatedContents.length) {
          // Update existing content
          updatedContents[currentContentIndex] = currentContentData;
        } else {
          // Add new content
          updatedContents.push(currentContentData);
        }
      }

      // Create module data with all its contents - ensure at least one content item
      if (updatedContents.length === 0) {
        message.error(`Module ${currentModule + 1} must have at least one content item. Please add content before proceeding.`);
        setLoading(false);
        return;
      }

      const moduleData = {
        name: `Module ${currentModule + 1}`,
        description: `Module ${currentModule + 1} Description`,
        data: updatedContents
      };

      // Add module data to the collection
      const updatedModulesData = [...modulesData];
      updatedModulesData[currentModule] = moduleData;
      setModulesData(updatedModulesData);

      if (currentModule < moduleNumber - 1) {
        // Move to next module
        setCurrentModule(currentModule + 1);
        setCurrentContentIndex(0); // Reset content index for new module
        setModuleContents([]); // Reset module contents for new module
        form.resetFields();
        message.success(
          `Module ${currentModule + 1} completed with ${updatedContents.length} content item(s). Moving to Module ${currentModule + 2}.`
        );
      } else {
        // All modules completed - create all modules at once
        console.log("Creating modules with data:", updatedModulesData);
        const payload = await formatMultipleModulesPayload(
          updatedModulesData,
          String(course.id)
        );
        console.log("Formatted payload:", payload);

        try {
          await tutorRequests.createMultipleCourseModules(payload);
          message.success("All modules created successfully!");
          
          // Clear course state after successful creation
          setCourse(() => ({
            id: undefined,
            brief: '',
            course_category: '',
            course_title: '',
            course_type: '',
            number_of_module: 1,
            modules: []
          }));
          
          // Clear local state
          setModulesData([]);
          setModuleContents([]);
          setCurrentModule(0);
          setCurrentContentIndex(0);
          
          setTimeout(() => {
            nav(URL.COURSES);
          }, 1500);
        } catch (error) {
          console.error("Error creating modules:", error);
          message.error("Failed to create modules. Please try again.");
        }
      }
    } catch (e) {
      console.error("Error processing module:", e);
      message.error(
        `Failed to process module ${currentModule + 1}. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // New function to handle adding more content to current module
  const handleAddMoreContent = () => {
    // Get current content data from form
    const formValues = form.getFieldsValue();
    const currentContentData = extractContentData(formValues, currentModule + 1);
    
    // Validate that required fields are filled
    if (!currentContentData.title || !currentContentData.body) {
      message.error('Please fill in Title and Body before adding more content.');
      return;
    }
    
    // Add to moduleContents array
    const updatedContents = [...moduleContents, currentContentData];
    setModuleContents(updatedContents);
    setCurrentContentIndex(updatedContents.length); // Set to next new index
    
    // Clear form for next content item
    form.resetFields();
    
    message.success(`Content item ${currentContentIndex + 1} added to Module ${currentModule + 1}. Ready to add content item ${updatedContents.length + 1}.`);
  };

  // New function to handle editing existing content
  const handleEditContent = (contentIndex: number) => {
    // Save current form data first if it has content and it's a new item
    const formValues = form.getFieldsValue();
    const hasContent = Object.values(formValues).some(value => value && value !== '');
    
    if (hasContent && currentContentIndex >= moduleContents.length) {
      // User was creating new content, ask if they want to save it first
      const currentContentData = extractContentData(formValues, currentModule + 1);
      if (currentContentData.title || currentContentData.body) {
        if (window.confirm('You have unsaved content. Do you want to save it before editing the selected item?')) {
          const updatedContents = [...moduleContents, currentContentData];
          setModuleContents(updatedContents);
        }
      }
    } else if (hasContent && contentIndex !== currentContentIndex && currentContentIndex < moduleContents.length) {
      // User was editing existing content, save changes
      const currentContentData = extractContentData(formValues, currentModule + 1);
      const updatedContents = [...moduleContents];
      updatedContents[currentContentIndex] = currentContentData;
      setModuleContents(updatedContents);
    }

    // Load the selected content item into the form
    const selectedContent = moduleContents[contentIndex];
    if (selectedContent) {
      const modulePrefix = `module_${currentModule + 1}_`;
      const formFields: any = {};
      
      Object.keys(selectedContent).forEach((key) => {
        if (selectedContent[key] !== null && selectedContent[key] !== undefined) {
          // Handle file fields specially
          if (key === 'additional_resources' && selectedContent[key]) {
            if (selectedContent[key] instanceof File) {
              // Create fileList structure for Upload component
              formFields[`${modulePrefix}${key}`] = {
                fileList: [{
                  uid: '-1',
                  name: selectedContent[key].name,
                  status: 'done',
                  originFileObj: selectedContent[key]
                }]
              };
            } else {
              formFields[`${modulePrefix}${key}`] = selectedContent[key];
            }
          } else if (key === 'media_file' && selectedContent[key]) {
            if (selectedContent[key] instanceof File) {
              // Create fileList structure for Upload component
              formFields[`${modulePrefix}media`] = {
                fileList: [{
                  uid: '-1',
                  name: selectedContent[key].name,
                  status: 'done',
                  originFileObj: selectedContent[key]
                }]
              };
            } else {
              formFields[`${modulePrefix}media`] = selectedContent[key];
            }
          } else {
            formFields[`${modulePrefix}${key}`] = selectedContent[key];
          }
        }
      });
      
      form.setFieldsValue(formFields);
      setCurrentContentIndex(contentIndex);
      message.info(`Now editing content item ${contentIndex + 1} of Module ${currentModule + 1}`);
    }
  };

  // New function to proceed to add new content (after editing)
  const handleProceedToNew = () => {
    // Save current form data to the current content index
    const formValues = form.getFieldsValue();
    const currentContentData = extractContentData(formValues, currentModule + 1);
    
    // Validate that required fields are filled
    if (!currentContentData.title || !currentContentData.body) {
      message.error('Please fill in Title and Body before proceeding.');
      return;
    }
    
    const updatedContents = [...moduleContents];
    updatedContents[currentContentIndex] = currentContentData;
    setModuleContents(updatedContents);
    
    // Move to new content item
    setCurrentContentIndex(updatedContents.length);
    form.resetFields();
    
    message.success(`Content item ${currentContentIndex + 1} updated. Ready to add content item ${updatedContents.length + 1}.`);
  };

  // Helper function to extract content data from form values
  const extractContentData = (formValues: any, moduleIndex: number) => {
    const modulePrefix = `module_${moduleIndex}_`;
    const contentData: any = {};

    for (const key in formValues) {
      if (key.startsWith(modulePrefix)) {
        const newKey = key.replace(modulePrefix, "");
        contentData[newKey] = formValues[key];
      }
    }

    // Handle additional resources file
    let additionalResources = null;
    if (contentData.additional_resources?.fileList && contentData.additional_resources.fileList.length > 0) {
      // Get the file object from fileList
      const file = contentData.additional_resources.fileList[0];
      additionalResources = file.originFileObj || file;
    } else if (contentData.additional_resources) {
      additionalResources = contentData.additional_resources;
    }

    // Handle media file
    let mediaFile = null;
    if (contentData.media?.fileList && contentData.media.fileList.length > 0) {
      const file = contentData.media.fileList[0];
      mediaFile = file.originFileObj || file;
    } else if (contentData.media) {
      mediaFile = contentData.media;
    }

    return {
      title: contentData.title || "",
      description: contentData.description || "",
      body: contentData.body || "",
      content: contentData.body || "",
      additional_resources: additionalResources,
      media_file: mediaFile,
    };
  };

  const handleBackModule = () => {
    // Save current form content before navigating
    const formValues = form.getFieldsValue();
    const hasFormContent = Object.values(formValues).some(value => value && value !== '');
    
    if (hasFormContent) {
      const currentContentData = extractContentData(formValues, currentModule + 1);
      
      // If there's meaningful content (title or body), save it
      if (currentContentData.title || currentContentData.body) {
        const updatedContents = [...moduleContents];
        
        if (currentContentIndex < updatedContents.length) {
          // Update existing content
          updatedContents[currentContentIndex] = currentContentData;
        } else {
          // Add new content
          updatedContents.push(currentContentData);
        }
        
        // Save to modulesData
        const moduleData = {
          name: `Module ${currentModule + 1}`,
          description: `Module ${currentModule + 1} Description`,
          data: updatedContents
        };
        
        const updatedModulesData = [...modulesData];
        updatedModulesData[currentModule] = moduleData;
        setModulesData(updatedModulesData);
        
        console.log(`Saved current content for Module ${currentModule + 1} before going back`);
      }
    }
    
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentContentIndex(0);
      // Load previous module data if exists
      if (modulesData[currentModule - 1]) {
        setModuleContents(modulesData[currentModule - 1].data || []);
      } else {
        setModuleContents([]);
      }
      form.resetFields();
    } else {
      setStep(1); // Go back to the previous step
    }
  };

  // Add a new empty module and jump to it
  const handleAddModule = () => {
    const newIndex = modulesData.length;
    const newModule = {
      name: `Module ${newIndex + 1}`,
      title: `Module ${newIndex + 1}`,
      description: '',
      data: [],
      order: newIndex + 1,
      is_template: false,
    };
    const copy = [...modulesData, newModule];
    setModulesData(copy);
    setModuleNumber((prev) => Math.max(prev, copy.length));
    setCurrentModule(newIndex);
    setModuleContents([]);
    message.success(`Added Module ${newIndex + 1}`);
  };

  // console.debug('Course state (step 1 init):', course);

  if (step === 1) {
    return (
      <Layout title="Courses">
        <div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
          <div className="w-full sm:w-1/2">
            <div>
              <h3 className="mb-[10px] text-[24px] font-semibold">
                {course?.id ? "Edit Course" : "Upload Course"}
              </h3>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                {course?.id 
                  ? "You are editing an existing course. You can update details or continue with modules."
                  : "Input your course details here"
                }
              </p>
              {course?.id && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                  <p className="text-sm text-blue-700 font-medium">
                    📝 Existing Course: {course.course_title || "Untitled"}
                  </p>
                  <p className="text-xs text-blue-600">
                    Course ID: {course.id} | Modules: {course.number_of_module}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            {/* Module manager: accessible from step 1 as well */}
            <CollapsibleSection 
              title="Module Management" 
              defaultExpanded={false}
              className="mb-4"
              badge={
                modulesData.length > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {modulesData.length} Created
                  </span>
                )
              }
            >
              <ModuleManager 
                modules={modulesData} 
                setModules={setModulesData} 
                courseId={course?.id as any}
                onModuleCreated={loadAvailableModules}
              />
            </CollapsibleSection>
            
            {/* Optional: Select existing modules to prefill */}
            <CollapsibleSection 
              title="Select Existing Modules" 
              defaultExpanded={selectedModuleIds.length > 0}
              className="mb-4"
              badge={
                <div className="flex items-center gap-2">
                  {selectedModuleIds.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Selected: {selectedModuleIds.length}
                    </span>
                  )}
                  {availableModules.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {availableModules.length} Available
                    </span>
                  )}
                </div>
              }
            >
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-3">Pick from your existing modules to prefill step 2. You can still add, edit, or delete modules later.</p>
                
                <div className="flex justify-end mb-2">
                  <Button 
                    size="small" 
                    type="link" 
                    onClick={() => setSelectedModuleIds([])}
                    disabled={selectedModuleIds.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                <List
                  size="small"
                  dataSource={availableModules}
                  locale={{ emptyText: 'No modules found' }}
                  renderItem={(m: any) => (
                    <List.Item
                      className="hover:bg-gray-50 transition-colors px-3 py-2"
                      actions={[
                        <span key="lessons" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Lessons: {m.data_entries_count ?? (Array.isArray(m.data) ? m.data.length : 0)}
                        </span>
                      ]}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Checkbox
                          checked={selectedModuleIds.includes(Number(m.id))}
                          onChange={() => toggleModuleSelection(Number(m.id))}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{m.name || m.title}</div>
                          {m.description ? (
                            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{m.description}</div>
                          ) : (
                            <div className="text-xs text-gray-400 mt-1 italic">No description</div>
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
              
              {availableModules.length > 5 && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Scroll to see more modules ({availableModules.length} total)
                </div>
              )}
            </CollapsibleSection>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{ number_of_modules: 1 }}
            >
              <Form.Item
                label="Course Category"
                className="inter-normal"
                name={"category_id"}
                rules={[
                  {
                    required: true,
                    message: "Please select at least one category",
                  },
                ]}
              >
                <Select
                  placeholder="Select Categories"
                  className="!px-[20px]  inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                  loading={categories.length === 0}
                >
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Course Type"
                className="inter-normal"
                name={"course_type"}
              >
                <Select
                  placeholder="Select or enter course type"
                  className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                  loading={metadataLoading}
                  showSearch
                  allowClear
                  mode="tags"
                  maxTagCount={1}
                  maxTagTextLength={50}
                >
                  {courseMetadata?.course_types?.map((type, idx) => (
                    <Select.Option key={idx} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Course Name"
                className="inter-normal"
                name={"course_name"}
                rules={[
                  { required: true, message: "Please enter course name" },
                ]}
              >
                <Select
                  placeholder="Select or enter course name"
                  className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                  loading={metadataLoading}
                  showSearch
                  allowClear
                  mode="tags"
                  maxTagCount={1}
                  maxTagTextLength={80}
                >
                  {courseMetadata?.course_names?.map((name, idx) => (
                    <Select.Option key={idx} value={name}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Course Title"
                className="inter-normal"
                name={"course_title"}
                rules={[
                  { required: true, message: "Please enter course title" },
                ]}
              >
                <Select
                  placeholder="Select or enter course title"
                  className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                  loading={metadataLoading}
                  showSearch
                  allowClear
                  mode="tags"
                  maxTagCount={1}
                  maxTagTextLength={80}
                >
                  {courseMetadata?.course_titles?.map((title, idx) => (
                    <Select.Option key={idx} value={title}>
                      {title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Price"
                className="inter-normal"
                name={"price"}
                rules={[
                  { required: true, message: "Please enter course price" },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter Course Price"
                  className="p-2"
                />
              </Form.Item>

              <Form.Item
                label="Course Content"
                className="inter-normal"
                name={"content"}
                rules={[
                  { required: true, message: "Please enter course content" },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter course content description"
                  className="p-2"
                  rows={4}
                />
              </Form.Item>

              <Form.Item
                label="Number of Modules"
                className="inter-normal"
                name={"number_of_modules"}
                rules={[
                  {
                    required: true,
                    message: "Please select number of modules",
                  },
                ]}
              >
                <Select
                  className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                >
                  {[1, 2, 3, 4, 5].map((count) => (
                    <Select.Option key={count} value={count}>
                      {count}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Brief Description"
                className="inter-normal"
                name={"brief"}
              >
                <Input.TextArea
                  placeholder="Enter a brief description"
                  className="p-2"
                />
              </Form.Item>

              <Form.Item
                label="Course Image"
                className="inter-normal"
                name="course_image"
              >
                <Upload
                  listType="picture-card"
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith("image/");
                    if (!isImage) {
                      message.error("You can only upload image files!");
                      return Upload.LIST_IGNORE;
                    }
                    
                    // Set the image file for later upload
                    // Start the upload process immediately
                    handleImageUpload(file);
                    
                    return false;
                  }}
                >
                  <div>
                    {imageUploading ? <LoadingOutlined /> : <UploadOutlined />}
                    <div style={{ marginTop: 8 }}>
                      {imageUploading ? 'Uploading...' : 'Upload'}
                    </div>
                  </div>
                </Upload>
              </Form.Item>

              {/*{Array.from({length: moduleNumber}, (_, i) => (*/}
              {/*    <Form.Item*/}
              {/*        label={`Module ${i + 1}`}*/}
              {/*        key={i}*/}
              {/*        className="inter-normal"*/}
              {/*        name={`module_${i + 1}_description`}*/}
              {/*    >*/}
              {/*        <Input*/}
              {/*            className="p-[12px]"*/}
              {/*            placeholder={`Write a short description (max word of 200)`}*/}
              {/*        />*/}
              {/*    </Form.Item>*/}
              {/*))}*/}
              <div className="flex gap-2 my-[26px] justify-end">
                {course?.id && (
                  <Button
                    type="default"
                    onClick={() => {
                      setCourse(() => ({
                        id: undefined,
                        brief: '',
                        course_category: '',
                        course_title: '',
                        course_type: '',
                        number_of_module: 1,
                        modules: []
                      }));
                      form.resetFields();
                      setModulesData([]);
                      setModuleContents([]);
                      setCurrentModule(0);
                      setCurrentContentIndex(0);
                      message.info("Started fresh course creation");
                    }}
                    className="text-gray-600"
                  >
                    Start Fresh
                  </Button>
                )}
                <Button
                  type="link"
                  loading={loading}
                  disabled={imageUploading || !courseImage}
                  className={`p-3 px-8 ml-[10px] text-[14px] rounded-[8px] ${
                    imageUploading || !courseImage 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-[#581A57] !hover:bg-[#581A57] text-[#fff]'
                  }`}
                  onClick={handleNext}
                >
                  {imageUploading 
                    ? "Uploading Image..." 
                    : !courseImage 
                      ? "Upload Image First"
                      : "Create Course"
                  }
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Layout>
    );
  } else if (step === 2) {
    return (
      <Layout
        title={
          <>
            <ArrowLeftOutlined /> <span>Courses</span>
          </>
        }
        onclick={() => setStep(1)}
      >
        <div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
          <div className="w-full sm:w-1/2 pr-5">
            <div>
              <div className={"flex gap-20 items-center justify-between"}>
                <h3 className="mb-[10px] text-[24px] font-semibold">
                  Upload Course Breakdown
                </h3>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    <span className={"text-2xl text-[#581A57]"}>
                      {currentModule + 1}
                    </span>
                    <span className="text-gray-500">{`/${moduleNumber}`}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Module {currentModule + 1} of {moduleNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    Content item {currentContentIndex + 1} 
                    {moduleContents.length > 0 && ` (${moduleContents.length} saved)`}
                    {currentContentIndex >= moduleContents.length && " (New)"}
                  </p>
                </div>
              </div>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                Input your course contents here
              </p>
            </div>
          </div>
            <div className="w-full sm:w-1/2">
              {/* Module navigator + manager (create/update/delete modules & lessons) */}
                <div className="mb-4">
                  <div className="flex gap-2 items-center overflow-x-auto whitespace-nowrap py-2">
                    {modulesData.map((m, idx) => (
                      <Button
                        key={idx}
                        type={idx === currentModule ? 'primary' : 'default'}
                        size="small"
                        onClick={() => {
                          setCurrentModule(idx);
                          setModuleContents(m.data || []);
                        }}
                        className="!mr-2"
                      >
                        {m.name || m.title || `Module ${idx + 1}`}
                      </Button>
                    ))}
                    <Button type="dashed" size="small" onClick={handleAddModule} icon={<PlusOutlined/>}>
                      Add Module
                    </Button>
                  </div>
                </div>
                <ModuleManager 
                  modules={modulesData} 
                  setModules={setModulesData}
                  onModuleCreated={loadAvailableModules}
                />
            {/* Module and Content Progress */}
            <div className="bg-white text-center py-3 mb-4 text-[20px] inter-normal font-medium">
              MODULE {currentModule + 1} - Content Item {currentContentIndex + 1}
              {currentContentIndex >= moduleContents.length && " (New)"}
            </div>
            
            {/* Debug info - remove in production */}
            {/* <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-4 text-xs">
              <strong>Debug:</strong> moduleNumber = {moduleNumber}, currentModule = {currentModule}, 
              course.number_of_module = {course?.number_of_module}, moduleContents.length = {moduleContents.length}
            </div> */}
             <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              onKeyPress={(e) => {
                // Prevent form submission on Enter key
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
              {/* Additional Resources Upload */}
              <Form.Item
                label="Additional Resources"
                name={`module_${currentModule + 1}_additional_resources`}
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Upload supporting documents: .pdf, .docx, .ppt, .xl files
                  </p>
                </div>
                <Upload beforeUpload={handleBeforeUpload} multiple={false}>
                  <Button icon={<UploadOutlined />} className="w-full">
                    Upload Documents (Max: 20MB)
                  </Button>
                </Upload>
              </Form.Item>

              {/* Title/Heading */}
              <Form.Item
                label="Title/Heading"
                name={`module_${currentModule + 1}_title`}
              >
                <Input placeholder="Enter title" />
              </Form.Item>

              {/* Description */}
              <Form.Item
                label="Description"
                name={`module_${currentModule + 1}_description`}
              >
                <Input placeholder="Enter Description" />
              </Form.Item>

              {/* Upload Image/Video */}
              <Form.Item
                label="Upload Image/Video"
                name={`module_${currentModule + 1}_media`}
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Supported formats: Images (.jpg, .png, .gif, .webp, .svg) |
                    Videos (.mp4, .avi, .mov, .wmv, .webm)
                  </p>
                </div>
                <Upload
                  beforeUpload={handleMediaUpload}
                  multiple={false}
                  accept="image/*,video/*"
                  listType="picture-card"
                >
                  <div className="text-center">
                    <UploadOutlined
                      style={{ fontSize: "24px", color: "#581A57" }}
                    />
                    <div className="mt-2 text-sm">Upload Media</div>
                    <div className="text-xs text-gray-500">Max: 50MB</div>
                  </div>
                </Upload>
              </Form.Item>

              {/*<Form.Item label="Body" name={`module_${currentModule + 1}_body`}>*/}
              <RichTextEditor
                name={`module_${currentModule + 1}_body`}
                label="Body"
                rules={[{ required: true, message: "Please enter content" }]}
              />

              {/* Proceed to add title button */}
              <div className="my-6">
                {currentContentIndex < moduleContents.length ? (
                  <Button
                    className="text-[#581A57] !hover:text-[#581A57] !hover:border-[#581A57] border-[#581A57] border-1 w-full"
                    type="default"
                    onClick={handleProceedToNew}
                  >
                    Update and proceed to add new content item
                  </Button>
                ) : (
                  // User is adding new content, show add more option
                  <Button
                    className="text-[#581A57] !hover:text-[#581A57] !hover:border-[#581A57] border-[#581A57] border-1 w-full"
                    type="default"
                    onClick={handleAddMoreContent}
                  >
                    Add this content item to Module {currentModule + 1}
                  </Button>
                )}

                {/* Module manager is available in the right column */}
              </div>

              {/* Show saved content items */}
              {moduleContents.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Saved content items for Module {currentModule + 1} (click to edit):
                  </p>
                  {moduleContents.map((content, index) => (
                    <div 
                      key={index} 
                      className={`text-sm p-2 mb-1 rounded cursor-pointer border transition-colors ${
                        index === currentContentIndex 
                          ? 'bg-[#581A57] text-white border-[#581A57]' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#581A57] hover:bg-gray-50'
                      }`}
                      onClick={() => handleEditContent(index)}
                    >
                      <div className="font-medium">
                        {index + 1}. {content.title || `Content ${index + 1}`}
                      </div>
                      {content.description && (
                        <div className="text-xs opacity-75 truncate">
                          {content.description}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-2">
                    Currently: 
                    {currentContentIndex < moduleContents.length 
                      ? ` Editing content item ${currentContentIndex + 1}`
                      : " Creating new content item"
                    }
                  </div>
                  {currentContentIndex < moduleContents.length && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={() => {
                        setCurrentContentIndex(moduleContents.length);
                        form.resetFields();
                        message.info("Ready to create new content item");
                      }}
                      className="mt-2 p-0 h-auto text-[#581A57]"
                    >
                      + Start new content item
                    </Button>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2 my-[26px] justify-between">
                <Button type="default" onClick={handleBackModule}>
                  Back
                </Button>
                <Button
                  type="primary"
                  disabled={loading}
                  loading={loading}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleNextModule();
                  }}
                  htmlType="button" // Explicitly set as button type to prevent form submission
                >
                  {currentModule === moduleNumber - 1
                    ? `Finish & Create All ${moduleNumber} Module${moduleNumber > 1 ? 's' : ''}`
                    : `Complete Module ${currentModule + 1} & Continue (${currentModule + 2}/${moduleNumber})`}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout
        title={
          <>
            <ArrowLeftOutlined /> <span>Courses</span>
          </>
        }
        onclick={() => setStep(1)}
      >
        <div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
          <div className="w-full sm:w-1/2 pr-5">
            <div>
              <div className={"flex gap-20 items-center justify-between"}>
                <h3 className="mb-[10px] text-[24px] font-semibold">
                  Upload Course Breakdown
                </h3>
                <p>
                  <span className={"text-2xl"}>{currentModule + 1}</span>
                  <span>{`/${moduleNumber}`}</span>
                </p>
              </div>
              <p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
                Make sure your course is catchy and descriptive as possible
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            {/* Dynamic Module Title */}
            <div className="bg-white text-center py-3 mb-4 text-[20px] inter-normal font-medium">
              Orientation
            </div>

            <Form layout="vertical" form={form} onValuesChange={() => {}}>
              {/* Additional Resources Upload */}
              <Form.Item
                label="Additional Resources"
                name={`additional_resources_${currentModule}`}
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Upload supporting documents: .pdf, .docx, .ppt, .xl files
                  </p>
                </div>
                <Upload beforeUpload={handleBeforeUpload}>
                  <Button icon={<UploadOutlined />} className="w-full">
                    Upload Documents (Max: 20MB)
                  </Button>
                </Upload>
              </Form.Item>

              {/* Title/Heading */}
              <Form.Item label="Title/Heading" name={`title_${currentModule}`}>
                <Input placeholder="Enter title" />
              </Form.Item>

              {/* Upload Image/Video */}
              <Form.Item
                label="Upload Image/Video"
                name={`media_${currentModule}`}
              >
                <div className="mb-2">
                  <p className="text-sm text-gray-600">
                    Supported formats: Images (.jpg, .png, .gif, .webp, .svg) |
                    Videos (.mp4, .avi, .mov, .wmv, .webm)
                  </p>
                </div>
                <Upload
                  beforeUpload={handleMediaUpload}
                  accept="image/*,video/*"
                  listType="picture-card"
                >
                  <div className="text-center">
                    <UploadOutlined
                      style={{ fontSize: "24px", color: "#581A57" }}
                    />
                    <div className="mt-2 text-sm">Upload Media</div>
                    <div className="text-xs text-gray-500">Max: 50MB</div>
                  </div>
                </Upload>
              </Form.Item>

              {/* Body */}
              <Form.Item label="Body" name={`body_${currentModule}`}>
                <Input.TextArea placeholder="Enter content here" />
              </Form.Item>

              {/* Navigation Buttons */}
              <div className="flex gap-2 my-[26px] justify-between">
                <Button type="default" onClick={handleBackModule}>
                  Back
                </Button>
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    handleNextModule();
                  }}
                  htmlType="button" // Explicitly set as button type to prevent form submission
                  disabled={loading}
                  loading={loading}
                >
                  {currentModule === Array(moduleNumber).fill(null).length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
};
export default CreateCoursePage;
