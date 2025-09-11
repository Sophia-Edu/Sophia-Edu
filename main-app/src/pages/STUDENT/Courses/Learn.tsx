import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import "./courses.scss";
import { Collapse, CollapseProps, Tabs, Modal, Radio, Input, Form, Upload, message, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { Button } from "../../../components";
import studentRequest from "../../../requests/students.request";

import { Bot, CircleCheck, DiscIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { truncate } from "lodash";
import ReactPlayer from 'react-player';
import { ChatBox } from "../../../components/chatbot";

const Learn: React.FC<any> = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [currentModuleNo, setCurrentModuleNo] = useState<number>(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeApplyTab, setActiveApplyTab] = useState<string>("apply");
  const [existingSurvey, setExistingSurvey] = useState<any>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [availableReviews, setAvailableReviews] = useState<any[]>([]);
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadingFeedback, setUploadingFeedback] = useState<{[key: number]: boolean}>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedbackFiles, setFeedbackFiles] = useState<{[key: number]: File | null}>({});
  
  const onChange = (key: string) => {
    console.log(key);
    // Validate that the key corresponds to a valid lesson
    const validLessons = course?.modules[currentModuleNo]?.data?.filter((item: any) => {
      return !item.title?.toLowerCase().startsWith('course:');
    }) || [];
    
    const keyIndex = parseInt(key);
    if (keyIndex >= 1 && keyIndex <= validLessons.length) {
      setActiveKey(key);
    } else if (validLessons.length > 0) {
      // If invalid key, stay on the last valid lesson
      setActiveKey(validLessons.length.toString());
    }
  };
  
  const { id: courseId } = useParams<{ id: string }>();

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const response: any = await studentRequest.getCourseById(courseId);

        console.log("Fetched course data:", response);
        console.log("Response items:", response.items);
        console.log("Response structure:", Object.keys(response));
        
        // Transform the API response to match expected structure
        // Check multiple possible response structures
        let modules = [];
        if (response.items) {
          modules = response.items;
        } else if (response.modules) {
          modules = response.modules;
        } else if (response.data) {
          modules = response.data;
        } else if (Array.isArray(response)) {
          modules = response;
        }
        
        const transformedCourse = {
          ...response,
          modules: modules
        };
        
        console.log("Transformed course:", transformedCourse);
        console.log("Transformed modules:", transformedCourse.modules);
        
        setCourse(transformedCourse);
      } catch (err: any) {
        setError(err.message || "Failed to fetch course data");
        console.error("Error fetching course:", err);
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);
  
  const expandIcon = (panelProps: any) =>
    panelProps.isActive ? <CircleCheck color="#fff" /> : <DiscIcon color="#fff" />;

  const renderCollapseItems = (): CollapseProps["items"] => {
    const modules = course?.modules || [];
    return modules.map((module: any, index: any) => ({
      key: `${module.description}-${index + 1}`,
      label: <p onClick={() => setCurrentModuleNo(index)}>{module.name || module.title}</p>,
      children: <p>{truncate(module.description, { length: 100 })}</p>,
    }));
  };

  const handleCollapseChange = (key: string | string[]) => {
    console.log(key);
  };

  // removed media playback state from parent to avoid re-renders causing video blinking

  // Function to navigate to previous tab
  const goToPreviousTab = () => {
    const currentIndex = parseInt(activeKey);
    if (currentIndex > 1) {
      onChange((currentIndex - 1).toString());
    }
  };

  // Function to navigate to next tab
  const goToNextTab = () => {
    const currentIndex = parseInt(activeKey);
    // Filter valid lessons to get accurate count
    const validLessons = course?.modules[currentModuleNo]?.data?.filter((item: any) => {
      return !item.title?.toLowerCase().startsWith('course:');
    }) || [];
    
    if (validLessons.length > 0 && currentIndex < validLessons.length) {
      onChange((currentIndex + 1).toString());
    }
  };
  const TabLabel = ({ label }: { label: string }) => (
    <div className="custom-tab-label">
      <span>{label}</span>
    </div>
  );

  // Media Content Component - Memoized to prevent re-renders
  const MediaContent = React.memo(({ moduleEntry }: { moduleEntry: any }) => {
    // local state so parent doesn't re-render on progress updates
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasImageError, setHasImageError] = useState(false);

    // Resolve possible media property names
    const mediaUrl = moduleEntry?.media_file || moduleEntry?.media || moduleEntry?.video || moduleEntry?.image || moduleEntry?.file_url;

    // Determine media type by extension
    const url = (mediaUrl || '').toString().toLowerCase();
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExts = ['.mp4', '.webm', '.m3u8', '.mov', '.avi', '.mkv', '.ogv', '.ogg'];
    const hasImageExt = imageExts.some(ext => url.endsWith(ext));
    const hasVideoExt = videoExts.some(ext => url.endsWith(ext));
    const isImage = !!mediaUrl && (hasImageExt || (!!moduleEntry?.image && !hasVideoExt));

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleProgress = (state: { played: number }) => {
      // throttle via progressInterval on player; minimal state update
      setProgress(state.played * 100);
    };

    return (
      <div className="relative rounded-lg h-[400px] w-full overflow-hidden bg-[#000]">
        {mediaUrl ? (
          isImage && !hasImageError ? (
            <img
              src={mediaUrl}
              alt={moduleEntry.title}
              className="w-full h-full object-cover"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <ReactPlayer
              key={mediaUrl}
              url={mediaUrl}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onPlay={handlePlay}
              onPause={handlePause}
              onProgress={handleProgress}
              progressInterval={800}
              playsinline
              light={false}
              config={{
                file: {
                  attributes: { controlsList: 'nodownload' }
                }
              }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-700">
            <img src="/logo.svg" alt="Course Logo" className="w-20 h-20 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">{moduleEntry.title}</h3>
            <p className="text-center px-8">This module content is best experienced through the text materials below</p>
          </div>
        )}
        {mediaUrl && !(isImage && !hasImageError) && (
          <Progress
            percent={progress}
            showInfo={false}
            strokeColor="#581A57"
            strokeWidth={3}
            className="absolute bottom-0 left-0 right-0 m-0"
          />
        )}
      </div>
    );
  });

  // Tab Content Component
  const TabContent = ({ moduleEntry }: { moduleEntry: any }) => {
    // Filter valid lessons to get accurate count for boundary checks
    const validLessons = course?.modules[currentModuleNo]?.data?.filter((item: any) => {
      return !item.title?.toLowerCase().startsWith('course:');
    }) || [];
    
    // Check if we're at the first or last tab
    const isFirstTab = activeKey === "1";
    const isLastTab = validLessons.length > 0 && parseInt(activeKey) === validLessons.length;
    
    return (
      <div className="flex sm:flex-row flex-col-reverse mt-[10px] gap-6 w-full">
        <div className="main w-full">
          <MediaContent moduleEntry={moduleEntry} />

          <div
            className="block pb-[20px] px-[20px] h-[350px] overflow-y-auto overflow-x-hidden rich-text-container"
            dangerouslySetInnerHTML={{ __html: moduleEntry.content }}
          />

          {/* Navigation buttons - visible on both desktop and mobile */}
          <div className="flex justify-between items-center mt-4 px-4 py-3 bg-gray-50 rounded-lg mb-20">
            <button 
              className={`flex items-center px-3 py-2 rounded-md ${isFirstTab ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`} 
              onClick={isFirstTab ? undefined : goToPreviousTab}
              disabled={isFirstTab}
            >
              <span className={`${isFirstTab ? 'bg-gray-400' : 'bg-[#581A57]'} mr-2 p-2 rounded`}>
                <ArrowLeftIcon size={16} color="#fff" />
              </span>
              <span className="text-[#666666] text-[14px] font-medium">Previous</span>
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md ${isLastTab ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
              onClick={isLastTab ? undefined : goToNextTab}
              disabled={isLastTab}
            >
              <span className="text-[#666666] text-[14px] font-medium">Next</span>
              <span className={`${isLastTab ? 'bg-gray-400' : 'bg-[#581A57]'} ml-2 p-2 rounded`}>
                <ArrowRightIcon size={16} color="#fff" />
              </span>
            </button>
          </div>
          
        </div>
      </div>
    );
  };

  // Generate TabPanel items dynamically from course data
  const generateTabItems = () => {
    if (!course || !course.modules || !course.modules[currentModuleNo] || !course.modules[currentModuleNo].data) {
      return [];
    }

    // Filter out course entries that shouldn't be lessons
    const validLessons = course.modules[currentModuleNo].data.filter((item: any) => {
      // Exclude entries that start with "Course:" as these are not actual lessons
      return !item.title?.toLowerCase().startsWith('course:');
    });

    return validLessons.map((item: any, index: number) => ({
      key: String(index + 1),
      label: <TabLabel label={item.title} />,
      children: <TabContent moduleEntry={item} />,
    }));
  };

  // Check for existing survey and load peer review data when modal opens
  useEffect(() => {
    if (isApplyModalOpen && courseId) {
      checkExistingSurvey();
      loadPeerReviewData();
    }
  }, [isApplyModalOpen, courseId]);

  const loadPeerReviewData = async () => {
    if (!courseId) return;
    
    try {
      // Load available reviews to assess
      const availableResponse = await studentRequest.getAvailableReviews(courseId);
      setAvailableReviews(availableResponse.data || []);
      
      // Load my submissions and their review status
      const mySubmissionsResponse = await studentRequest.getMySubmissions();
      setMySubmissions(mySubmissionsResponse.data || []);
    } catch (error: any) {
      console.error('Error loading peer review data:', error);
    }
  };

  const handleFileUpload = async (isResubmit: boolean = false) => {
    if (!selectedFile || !courseId) return;
    
    try {
      setUploadingDocument(true);
      
      if (isResubmit) {
        await studentRequest.resubmitDocumentForReview(courseId, selectedFile);
        message.success('Document resubmitted successfully for peer review!');
      } else {
        await studentRequest.uploadDocumentForReview(courseId, selectedFile);
        message.success('Document uploaded successfully for peer review!');
      }
      
      setSelectedFile(null);
      // Reload data after successful upload
      loadPeerReviewData();
      // Trigger notification refresh for peer review submission
      window.dispatchEvent(new Event('notifications:refresh'));
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      message.error('Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDownloadDocument = async (reviewId: number, fileName?: string) => {
    try {
      const response = await studentRequest.downloadReviewDocument(reviewId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `document_${reviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading document:', error);
    }
  };

  const handleUploadFeedback = async (reviewId: number, file: File) => {
    try {
      setUploadingFeedback(prev => ({ ...prev, [reviewId]: true }));
      await studentRequest.uploadFeedbackFile(reviewId, file);
      message.success('Feedback uploaded successfully!');
      // Reload data after successful upload
      loadPeerReviewData();
      // Trigger notification refresh for feedback submission
      window.dispatchEvent(new Event('notifications:refresh'));
    } catch (error: any) {
      console.error('Error uploading feedback:', error);
      message.error('Failed to upload feedback. Please try again.');
    } finally {
      setUploadingFeedback(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleDownloadFeedback = async (reviewId: number, fileName?: string) => {
    try {
      const response = await studentRequest.downloadFeedbackFile(reviewId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `feedback_${reviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading feedback:', error);
    }
  };

  const checkExistingSurvey = async () => {
    if (!courseId) return;
    
    try {
      setSurveyLoading(true);
      const response = await studentRequest.getMySurvey(courseId);
      setExistingSurvey(response.data?.survey);
      // Pre-fill form with existing data
      if (response.data?.survey) {
        surveyForm.setFieldsValue({
          satisfaction: getSatisfactionKey(response.data.survey.satisfaction_rating),
          comments: response.data.survey.additional_comments
        });
      }
    } catch (error: any) {
      // 404 means no survey exists yet, which is fine
      if (!error.message.includes('404') && !error.message.includes('No survey found')) {
        console.error('Error checking existing survey:', error);
      }
      setExistingSurvey(null);
    } finally {
      setSurveyLoading(false);
    }
  };

  // Convert satisfaction rating to radio key
  const getSatisfactionKey = (rating: number): string => {
    const ratingMap: { [key: number]: string } = {
      5: 'very_satisfied',
      4: 'satisfied', 
      3: 'neutral',
      2: 'dissatisfied',
      1: 'very_dissatisfied'
    };
    return ratingMap[rating] || 'neutral';
  };

  // Convert radio key to satisfaction rating
  const getSatisfactionRating = (key: string): number => {
    const keyMap: { [key: string]: number } = {
      'very_satisfied': 5,
      'satisfied': 4,
      'neutral': 3,
      'dissatisfied': 2,
      'very_dissatisfied': 1
    };
    return keyMap[key] || 3;
  };

  // Form instances at component level to access in useEffect
  const [form] = Form.useForm();
  const [surveyForm] = Form.useForm();

  // Apply Modal Component
  const ApplyModal = () => {

    const handleApplySubmit = (values: any) => {
      console.log('Apply form values:', values);
      // This is handled by the file upload functionality now
    };

    const handleSurveySubmit = async (values: any) => {
      if (!courseId) return;
      
      try {
        setSurveySubmitting(true);
        const surveyData = {
          satisfaction_rating: getSatisfactionRating(values.satisfaction),
          additional_comments: values.comments || ''
        };
        
        const response = await studentRequest.submitCourseSurvey(courseId, surveyData);
        
        // Update existing survey state
        setExistingSurvey(response.data?.survey);
        
        // Show success message
        console.log('Survey submitted successfully:', response);
        message.success('Survey submitted successfully. Thank you for your feedback!');
        
      } catch (error: any) {
        console.error('Error submitting survey:', error);
        // Handle specific error cases - check both error message and response data
        const isDuplicate = error.response?.status === 409 || 
                           error.message?.toLowerCase().includes('duplicate') ||
                           error.message?.toLowerCase().includes('already submitted') ||
                           error.response?.data?.message?.toLowerCase().includes('duplicate') ||
                           error.response?.data?.error?.toLowerCase().includes('duplicate') ||
                           error.response?.data?.message?.toLowerCase().includes('already submitted') ||
                           error.response?.data?.error?.toLowerCase().includes('already submitted');
        
        if (isDuplicate) {
          // Survey already exists, refresh to get latest data
          checkExistingSurvey();
          message.info('You have already submitted a survey for this course.');
        } else {
          // Only show error for actual submission failures
          message.error('Unable to submit survey. Please try again later.');
        }
      } finally {
        setSurveySubmitting(false);
      }
    };

    const applyTabItems = [
      {
        key: 'apply',
        label: 'Apply',
        children: (
          <div className="p-6 max-h-[500px] overflow-y-auto">
            <div className="mb-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Upload your work here for review. You may remove any identifying details to enable anonymous peer review (you can 
                resubmit after one month of no response from peers). Do ensure to read our <span className="text-blue-500 underline cursor-pointer">terms of use</span> before uploading your work.
              </p>
            </div>

            <Form form={form} onFinish={handleApplySubmit} layout="vertical">
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">(max file size: 20mb - .pdf,.docx, ppt, .xl)</p>
                    
                    {/* File Upload */}
                    <div className="mb-4">
                      <Upload
                        beforeUpload={(file) => {
                          setSelectedFile(file);
                          message.success(`${file.name} selected.`);
                          return false; // prevent auto upload
                        }}
                        onRemove={() => {
                          setSelectedFile(null);
                        }}
                        fileList={selectedFile ? [{ uid: "-1", name: selectedFile.name, status: "done" }] as any : []}
                        accept=".pdf,.docx,.ppt,.pptx,.xls,.xlsx"
                        maxCount={1}
                      >
                        <Button icon={<UploadOutlined />} className="mb-2" label="Choose File">
                          Choose File
                        </Button>
                      </Upload>
                    </div>
                    
                    <div className="flex gap-3 justify-center">
                      <button 
                        type="button"
                        onClick={() => handleFileUpload(false)}
                        disabled={!selectedFile || uploadingDocument}
                        className={`px-6 py-2 rounded text-sm font-medium ${
                          !selectedFile || uploadingDocument
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-[#581A57] text-white hover:bg-[#4a1549]'
                        }`}
                      >
                        {uploadingDocument ? 'Uploading...' : 'Upload'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleFileUpload(true)}
                        disabled={!selectedFile || uploadingDocument}
                        className={`px-6 py-2 rounded text-sm font-medium ${
                          !selectedFile || uploadingDocument
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                      >
                        {uploadingDocument ? 'Resubmitting...' : 'Resubmit'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Assess Peers Section */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">
                    Assess peers (upload your feedback within one month of the request for assessment)
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {availableReviews.length > 0 ? (
                      availableReviews.slice(0, 3).map((review, index) => (
                        <div 
                          key={review.id}
                          className="border rounded-lg p-4 text-center border-gray-200"
                        >
                          <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium bg-[#581A57]">
                            {review.slot || (index + 1)}
                          </div>
                          <p className="text-sm mb-2 text-gray-900">
                            Peer {review.slot || (index + 1)}
                          </p>
                          <p className="text-xs mb-1 text-gray-600">
                            {review.submitter_name}
                          </p>
                          <p className="text-xs mb-3 text-blue-500 underline cursor-pointer"
                             onClick={() => handleDownloadDocument(review.id, `peer_${review.slot}_document`)}>
                            Download Associated File
                          </p>
                          
                          <Upload
                            beforeUpload={(file) => {
                              setFeedbackFiles(prev => ({ ...prev, [review.id]: file }));
                              handleUploadFeedback(review.id, file);
                              return false; // prevent auto upload
                            }}
                            onRemove={() => {
                              setFeedbackFiles(prev => ({ ...prev, [review.id]: null }));
                            }}
                            fileList={feedbackFiles[review.id] ? [{ uid: `-${review.id}`, name: feedbackFiles[review.id]!.name, status: "done" }] as any : []}
                            accept=".pdf,.docx,.ppt,.pptx,.xls,.xlsx"
                            maxCount={1}
                            showUploadList={false}
                          >
                            <Button 
                              icon={<UploadOutlined />}
                              loading={uploadingFeedback[review.id]}
                              label={uploadingFeedback[review.id] ? 'Uploading...' : 'Upload'}
                              className={`px-4 py-2 text-sm font-medium ${
                                uploadingFeedback[review.id]
                                  ? 'bg-gray-400 text-gray-600'
                                  : 'bg-[#581A57] text-white hover:bg-[#4a1549]'
                              }`}
                            >
                              {uploadingFeedback[review.id] ? 'Uploading...' : 'Upload'}
                            </Button>
                          </Upload>
                        </div>
                      ))
                    ) : (
                      // Show empty slots when no reviews available
                      [1, 2, 3].map((peer) => (
                        <div 
                          key={peer}
                          className="border rounded-lg p-4 text-center border-gray-200"
                        >
                          <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium bg-gray-400">
                            {peer}
                          </div>
                          <p className="text-sm mb-2 text-gray-500">
                            Peer {peer}
                          </p>
                          <p className="text-xs mb-3 text-gray-400">
                            No documents available
                          </p>
                          <button 
                            type="button"
                            disabled
                            className="px-4 py-2 rounded text-sm font-medium bg-gray-300 text-gray-600 cursor-not-allowed"
                          >
                            Upload
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reviews from Peers Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Reviews from peers</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Always show 3 slots based on slot numbers */}
                    {Array.from({ length: 3 }, (_, index) => {
                      const slotNumber = index + 1;
                      const submission = mySubmissions.find(s => s.slot === slotNumber);
                      const hasReview = submission && submission.reviewer_name;
                      const hasFeedbackFile = submission && submission.has_feedback_file;
                      
                      return (
                        <div 
                          key={slotNumber}
                          className={`border rounded-lg p-4 text-center ${
                            hasReview ? 'border-[#581A57]' : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium ${
                            hasReview ? 'bg-[#581A57]' : 'bg-gray-400'
                          }`}>
                            {slotNumber}
                          </div>
                          <p className={`text-sm mb-2 ${hasReview ? 'text-gray-900' : 'text-gray-500'}`}>
                            Reviewer {slotNumber}
                          </p>
                          
                          {hasReview && hasFeedbackFile ? (
                            <p 
                              className="text-xs text-blue-500 underline cursor-pointer"
                              onClick={() => handleDownloadFeedback(submission.id, `feedback_reviewer_${slotNumber}`)}
                            >
                              Download associated file
                            </p>
                          ) : hasReview ? (
                            <p className="text-xs text-gray-600">No feedback yet</p>
                          ) : (
                            <p className="text-xs text-gray-400">
                              Awaiting review
                            </p>
                          )}
                          
                          {hasReview && submission.remarks && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-left">
                              <p className="font-medium text-gray-700">Comments:</p>
                              <p className="text-gray-600">{submission.remarks}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Form>
          </div>
        ),
      },
      {
        key: 'survey',
        label: 'Conclusion',
        children: (
          <div className="p-6 max-h-[500px] overflow-y-auto bg-gray-50">
            {/* Blue sidebar indicators */}
            <div className="flex">
              <div className="w-1 bg-blue-500 mr-4"></div>
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Congratulations on completing this course! You have successfully worked through all the modules and gained 
                    valuable knowledge and skills. This achievement represents your dedication to continuous learning and professional 
                    development.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We hope the concepts and practical applications covered in this course will serve you well in your future 
                    endeavors. Remember that learning is a continuous journey, and we encourage you to apply what you've learned 
                    and continue exploring related topics to further enhance your expertise.
                  </p>
                </div>

                {existingSurvey && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="text-green-800 font-medium mb-2">Thank you for your feedback!</h5>
                    <p className="text-green-700 text-sm mb-2">
                      You submitted your survey on {new Date(existingSurvey.submission_date).toLocaleDateString()}
                    </p>
                    <p className="text-green-700 text-sm">
                      Rating: {existingSurvey.satisfaction_rating}/5 stars
                    </p>
                    {existingSurvey.additional_comments && (
                      <p className="text-green-700 text-sm mt-2">
                        Comments: "{existingSurvey.additional_comments}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {surveyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#581A57] mx-auto mb-2"></div>
                <p className="text-gray-600">Loading survey...</p>
              </div>
            ) : (
              <Form form={surveyForm} onFinish={handleSurveySubmit} layout="vertical">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-6">End of Course Survey</h4>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      1. How satisfied are you with this course?
                    </label>
                    <Form.Item name="satisfaction" className="mb-0">
                      <Radio.Group className="space-y-3">
                        <div className="flex items-center">
                          <Radio value="satisfied" className="text-[#581A57]">
                            <span className="ml-2 text-gray-700">Satisfied</span>
                          </Radio>
                        </div>
                        <div className="flex items-center">
                          <Radio value="very_satisfied" className="text-[#581A57]">
                            <span className="ml-2 text-gray-700">Very Satisfied</span>
                          </Radio>
                        </div>
                        <div className="flex items-center">
                          <Radio value="neutral" className="text-[#581A57]">
                            <span className="ml-2 text-gray-700">Neutral</span>
                          </Radio>
                        </div>
                        <div className="flex items-center">
                          <Radio value="dissatisfied" className="text-[#581A57]">
                            <span className="ml-2 text-gray-700">Dissatisfied</span>
                          </Radio>
                        </div>
                        <div className="flex items-center">
                          <Radio value="very_dissatisfied" className="text-[#581A57]">
                            <span className="ml-2 text-gray-700">Very Dissatisfied</span>
                          </Radio>
                        </div>
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      2. Add any additional comments to the box below (max word of 500)
                    </label>
                    <Form.Item name="comments">
                      <Input.TextArea 
                        rows={4} 
                        placeholder="wghnfzggkn.bkhk"
                        maxLength={500}
                        showCount
                        className="border-gray-300"
                      />
                    </Form.Item>
                  </div>

                    <div className="flex gap-3">
                      <button 
                        type="submit"
                        disabled={surveySubmitting || !!existingSurvey}
                        className={`px-6 py-2 rounded text-sm font-medium ${
                          surveySubmitting || existingSurvey 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-[#581A57] text-white hover:bg-[#4a1549]'
                        }`}
                      >
                        {surveySubmitting ? 'Submitting...' : existingSurvey ? 'Survey Submitted' : 'Submit feedback'}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </div>
        ),
      },
    ];

    return (
      <Modal
        title="Course Application & Survey"
        open={isApplyModalOpen}
        onCancel={() => setIsApplyModalOpen(false)}
        footer={null}
        width={800}
        className="apply-modal"
        destroyOnClose={true}
        maskClosable={false}
        centered
        transitionName=""
        maskTransitionName=""
      >
        <Tabs
          activeKey={activeApplyTab}
          onChange={setActiveApplyTab}
          items={applyTabItems}
          className="apply-tabs"
          animated={false}
        />
      </Modal>
    );
  };


  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#581A57]"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading course</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Debug: Show what we actually have
  if (!course) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">No course data loaded</div>
            <p className="text-gray-600">Course object is null or undefined.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course.modules) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">No modules property found</div>
            <p className="text-gray-600">Course object: {JSON.stringify(Object.keys(course))}</p>
            <p className="text-gray-600 mt-2">Available properties: {Object.keys(course).join(', ')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (course.modules.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="text-gray-500 text-xl mb-4">Empty modules array</div>
            <p className="text-gray-600">Modules array exists but is empty.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-[10px] sm:px-[30px] mx-auto learn_course full-page">
        <div className="relative flex gap-4 sm:flex-row flex-col justify-between h-screen">
          {/* Fixed Module Sidebar */}
          <div className="w-full sm:w-[30%] sm:fixed sm:left-[10px] sm:top-[100px] sm:h-[calc(100vh-100px)] sm:overflow-y-auto sm:pt-4 sm:pb-4 bg-white z-[5]">
            <div className="px-[10px] sm:px-[30px]">
              <h2 className="sm:top-[12px] mb-[10px] sm:mb-20 font-semibold header sticky top-0 bg-white py-2 z-20">
                Course Module (History)
              </h2>
              <div className="space-y-2">
                {(renderCollapseItems() || []).map((item, index) => (
                  <Collapse
                    key={`${item.key}-${index}`}
                    onChange={handleCollapseChange}
                    items={[item]}
                    accordion
                    className="custom-collapse w-full"
                    expandIcon={expandIcon}
                  />
                ))}
              </div>
              
              {/* Apply Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                  className="w-full py-3 text-sm font-medium bg-blue-300 hover:bg-blue-400 text-blue-800"
                  type="primary"
                  label="Apply"
                  onclick={() => setIsApplyModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Main Content Area with Fixed Navigation */}
          <div className="w-full sm:w-[70%] sm:ml-[30%] flex flex-col h-screen sm:mt-[100px] sm:h-[calc(100vh-100px)]">
            {/* Fixed Navigation Tabs */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 pb-4">
              <div className="px-[10px] sm:px-[30px] pt-4">
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end sm:w-full ml-auto mb-6 overflow-x-auto">
                  {(() => {
                    const validLessons = course?.modules[currentModuleNo]?.data?.filter((item: any) => {
                      return !item.title?.toLowerCase().startsWith('course:');
                    }) || [];
                    return validLessons.map((item: any, index: number) => (
                      <Button
                        key={index}
                        className="px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0 text-xs sm:text-sm font-medium"
                        iconColor={activeKey == `${index + 1}` ? "#581A57" : "#B6B6B6"}
                        type="tab"
                        label={truncate(item.title, { length: 15 })}
                        onclick={() => onChange(`${index + 1}`)}
                        active={activeKey == `${index + 1}`}
                      />
                    ));
                  })()}
                </div>
              </div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-[10px] sm:px-[30px]">
                <Tabs
                  className="relative"
                  activeKey={activeKey}
                  items={generateTabItems()}
                  renderTabBar={() => <div />} // Hide default tab bar since we have custom fixed one
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-40 sm:bottom-24 right-4">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ApplyModal />
    </Layout>
  );
};

export default Learn;
