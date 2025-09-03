import React, { useEffect, useState } from "react";
import Layout from "../../DashboardLayout";

import { Button, Form, Input, Select, Upload } from "antd";
import { URL } from "../../../utils/constants";
import { ArrowLeftOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { CourseProps, useCourse } from "../../../store.tsx";
import { toast } from "react-toastify";
import { TutorRequest } from "../../../requests";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "../../../components/editor.tsx";
import tutorRequests from "../../../requests/tutor.request.tsx";
import { message } from "antd";
import { uploadImageToCloudinary } from "../../../utils/helperFunction.tsx";

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
  const [courseImage, setCourseImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [modulesData, setModulesData] = useState<any[]>([]); // Store all modules data
  const [currentContentIndex, setCurrentContentIndex] = useState(0); // Track current content item within module
  const [moduleContents, setModuleContents] = useState<any[]>([]); // Store content items for current module
  const nav = useNavigate();
  
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

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await TutorRequest.getCategories();
        setCategories(response.items || []);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
        message.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

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
      const formValues = form.getFieldsValue();

      // Create a new object with all form values properly mapped
      const updatedFormValues = {
        courses: [
          {
            course_name: formValues.course_name,
            title: formValues.course_title, 
            brief: formValues.brief,
            content: formValues.content,
            course_type: formValues.course_type,
            price: formValues.price,
            number_of_modules: formValues.number_of_modules,
            image: courseImage, // Changed from image_base64 to image with Cloudinary URL
          },
        ],
        category_id: formValues.category_id,
      };

      let courseId;

      if (course?.id) {
        // Course already exists, use existing ID
        courseId = course.id;
      } else {
        console.log("Creating new course with values:", updatedFormValues);
        // Create new course
        const addedCourse: any = await TutorRequest.createCourse(
          updatedFormValues
        );
        setCourse(addedCourse.courses[0]);
        courseId = addedCourse.course_id || addedCourse.courses[0].id;
      }

      // Update course state with the correct ID and proper mapping
      setCourse((prevCourse: CourseProps | null): CourseProps => {
        const newCourse: CourseProps = {
          id: courseId,
          brief: formValues.brief || '',
          course_category: formValues.category_id || '',
          course_title: formValues.course_title || '',
          course_type: formValues.course_type || '',
          number_of_module: formValues.number_of_modules || 1,
          modules: prevCourse?.modules || []
        };
        
        return newCourse;
      });

      // Ensure moduleNumber state is preserved for step 2
      const finalModuleCount = formValues.number_of_modules || 1;
      setModuleNumber(finalModuleCount);
      console.log("Transitioning to step 2 with", finalModuleCount, "modules");

      setStep(step + 1);
    } catch (error) {
      console.error("Error creating course:", error);
      message.error("Failed to create course. Please try again.");
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
  const formatMultipleModulesPayload = (
    allModulesData: any[],
    courseId: string
  ) => {
    const modules = allModulesData.map((moduleData, index) => {
      // Each module can have multiple content items in the data array
      const dataArray = moduleData.contents?.map((contentItem: any, contentIndex: number) => {
        let additionalResources = null;
        let mediaFile = null;

        if (contentItem.additional_resources?.file) {
          additionalResources = contentItem.additional_resources.file.name || "uploaded_file";
        } else if (contentItem.additional_resources) {
          additionalResources = contentItem.additional_resources;
        }

        if (contentItem.media_file?.name) {
          mediaFile = contentItem.media_file.name;
        } else if (contentItem.media_file) {
          mediaFile = "uploaded_media";
        }

        return {
          title: contentItem.title || `Content ${contentIndex + 1}`,
          content: contentItem.body || contentItem.content || `Content ${contentIndex + 1}`,
          additional_resources: additionalResources,
          media_file: mediaFile,
          course_id: parseInt(courseId),
          order: contentIndex + 1,
        };
      }) || [
        {
          title: moduleData.title || `Module ${index + 1}`,
          content: moduleData.body || moduleData.content || `Content for Module ${index + 1}`,
          additional_resources: moduleData.additional_resources,
          media_file: moduleData.media_file,
          course_id: parseInt(courseId),
          order: 1,
        }
      ];

      return {
        name: moduleData.name || moduleData.title || `Module ${index + 1}`,
        description: moduleData.description || `Description for Module ${index + 1}`,
        order: index + 1,
        is_template: true,
        data: dataArray,
      };
    });

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
        contents: updatedContents
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
        const payload = formatMultipleModulesPayload(
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
          contents: updatedContents
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
        setModuleContents(modulesData[currentModule - 1].contents || []);
      } else {
        setModuleContents([]);
      }
      form.resetFields();
    } else {
      setStep(1); // Go back to the previous step
    }
  };

  console.log(course);

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
            <Form
              layout="vertical"
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{ number_of_module: 1 }}
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
                  placeholder="Select a Course Type"
                  className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
                >
                  <Select.Option value="Programming">Programming</Select.Option>
                  <Select.Option value="Design">Design</Select.Option>
                  <Select.Option value="Business">Business</Select.Option>
                  <Select.Option value="Marketing">Marketing</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
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
                <Input placeholder="Enter Course Name" className="p-2" />
              </Form.Item>

              <Form.Item
                label="Course Title"
                className="inter-normal"
                name={"course_title"}
                rules={[
                  { required: true, message: "Please enter course title" },
                ]}
              >
                <Input placeholder="Enter Course Title" className="p-2" />
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
                  defaultValue={1}
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
                      : course?.id 
                        ? "Continue with Modules" 
                        : "Next"
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
              <div className="my-4">
                {currentContentIndex < moduleContents.length ? (
                  // User is editing existing content, show proceed to new option
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
