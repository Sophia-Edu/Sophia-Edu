// @ts-nocheck
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
  
  const { courseId } = useParams<{ courseId: string }>();

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

  // Load peer review data
  const loadPeerReviewData = async () => {
    if (!courseId) return;
    
    try {
      const [availableResponse, submissionsResponse] = await Promise.all([
        studentRequest.getAvailableReviews(courseId),
        studentRequest.getMySubmissions()
      ]);
      
      setAvailableReviews(availableResponse.data || []);
      setMySubmissions(submissionsResponse.data || []);
    } catch (error) {
      console.error('Error loading peer review data:', error);
    }
  };

  // Check for existing survey
  const checkExistingSurvey = async () => {
    if (!courseId) return;
    
    try {
      setSurveyLoading(true);
      const response = await studentRequest.getMySurvey(courseId);
      setExistingSurvey(response.data?.survey);
    } catch (error) {
      console.error('Error checking existing survey:', error);
    } finally {
      setSurveyLoading(false);
    }
  };

  // Handle file upload for peer review
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

  // Handle feedback file upload
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

  // Handle document download
  const handleDownloadDocument = async (reviewId: number, fileName?: string) => {
    try {
      const response = await studentRequest.downloadReviewDocument(reviewId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `document_${reviewId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading document:', error);
    }
  };

  // Handle feedback download
  const handleDownloadFeedback = async (reviewId: number, fileName?: string) => {
    try {
      const response = await studentRequest.downloadFeedbackFile(reviewId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `feedback_${reviewId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading feedback:', error);
    }
  };

  // Handle survey submission
  const handleSurveySubmit = async (values: any) => {
    setSurveySubmitting(true);
    
    try {
      const surveyData = {
        satisfaction_rating: values.satisfaction_rating,
        additional_comments: values.additional_comments || ''
      };
      
      const response = await studentRequest.submitCourseSurvey(courseId, surveyData);
      
      // Update existing survey state
      setExistingSurvey(response.data?.survey);
      
      // Show success message
      console.log('Survey submitted successfully:', response);
      
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

  const [form] = Form.useForm();
  const [surveyForm] = Form.useForm();

  // Apply Modal Component
  const ApplyModal = () => {
    const applyTabItems = [
      {
        key: 'apply',
        label: 'Apply',
        children: (
          <div className="p-6 max-h-[500px] overflow-y-auto">
            <Form form={form} layout="vertical">
              <div className="space-y-6">
                {/* Document Upload Section */}
                <div>
                  <h4 className="text-base font-medium text-gray-900 mb-4">Submit your work</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload
                      beforeUpload={(file) => {
                        setSelectedFile(file);
                        return false; // prevent auto upload
                      }}
                      onRemove={() => setSelectedFile(null)}
                      fileList={selectedFile ? [{ uid: '-1', name: selectedFile.name, status: "done" }] as any : []}
                      accept=".pdf,.docx,.ppt,.pptx,.xls,.xlsx"
                      maxCount={1}
                    >
                      <div className="space-y-2">
                        <UploadOutlined className="text-2xl text-gray-400" />
                        <p className="text-sm text-gray-600">Click or drag file to upload</p>
                        <p className="text-xs text-gray-400">Supports: PDF, DOCX, PPT, PPTX, XLS, XLSX</p>
                      </div>
                    </Upload>
                    
                    {selectedFile && (
                      <div className="mt-4 space-x-2">
                        <Button 
                          label="Upload"
                          loading={uploadingDocument}
                          onclick={() => handleFileUpload(false)}
                          className="bg-[#581A57] text-white hover:bg-[#4a1549]"
                        />
                        <Button 
                          label="Resubmit"
                          loading={uploadingDocument}
                          onclick={() => handleFileUpload(true)}
                          className="bg-orange-500 text-white hover:bg-orange-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Assess Peers Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-4">Assess peers</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Always show 3 slots based on slot numbers */}
                    {Array.from({ length: 3 }, (_, index) => {
                      const slotNumber = index + 1;
                      const review = availableReviews.find(r => r.slot === slotNumber);
                      
                      return (
                        <div 
                          key={slotNumber}
                          className={`border rounded-lg p-4 text-center ${
                            review ? 'border-[#581A57]' : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium ${
                            review ? 'bg-[#581A57]' : 'bg-gray-400'
                          }`}>
                            {slotNumber}
                          </div>
                          <p className="text-sm mb-2 text-gray-900">
                            Peer {slotNumber}
                          </p>
                          
                          {review ? (
                            <>
                              <p className="text-xs mb-1 text-gray-600">
                                {review.submitter_name}
                              </p>
                              <p className="text-xs mb-3 text-blue-500 underline cursor-pointer"
                                 onClick={() => handleDownloadDocument(review.id, `peer_${slotNumber}_document`)}>
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
                                  label={uploadingFeedback[review.id] ? 'Uploading...' : 'Upload Feedback'}
                                  className={`px-4 py-2 text-sm font-medium ${
                                    uploadingFeedback[review.id]
                                      ? 'bg-gray-400 text-gray-600'
                                      : 'bg-[#581A57] text-white hover:bg-[#4a1549]'
                                  }`}
                                />
                              </Upload>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">No submission available</p>
                          )}
                        </div>
                      );
                    })}
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
            {/* Survey content */}
            <div className="flex">
              <div className="w-1 bg-blue-500 mr-4"></div>
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    Congratulations on completing this course! Please take a moment to provide your feedback.
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
                      <Form.Item
                        name="satisfaction_rating"
                        label="How satisfied are you with this course?"
                        rules={[{ required: true, message: 'Please rate your satisfaction' }]}
                      >
                        <Radio.Group>
                          <div className="space-y-2">
                            <Radio value={5}>⭐⭐⭐⭐⭐ Excellent</Radio>
                            <Radio value={4}>⭐⭐⭐⭐ Good</Radio>
                            <Radio value={3}>⭐⭐⭐ Average</Radio>
                            <Radio value={2}>⭐⭐ Below Average</Radio>
                            <Radio value={1}>⭐ Poor</Radio>
                          </div>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <div className="mb-6">
                      <Form.Item
                        name="additional_comments"
                        label="Additional Comments (Optional)"
                      >
                        <Input.TextArea 
                          rows={4} 
                          placeholder="Share your thoughts about the course..."
                        />
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={surveySubmitting}
                        disabled={surveySubmitting || !!existingSurvey}
                        label={surveySubmitting ? 'Submitting...' : existingSurvey ? 'Survey Submitted' : 'Submit Survey'}
                        className={`w-full py-3 text-sm font-medium ${
                          surveySubmitting || existingSurvey
                            ? 'bg-gray-400 text-gray-600'
                            : 'bg-[#581A57] text-white hover:bg-[#4a1549]'
                        }`}
                      />
                    </Form.Item>
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

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Learning Interface</h1>
            <Button
              className="w-full py-3 text-sm font-medium bg-blue-300 hover:bg-blue-400 text-blue-800"
              type="primary"
              label="Apply"
              onclick={() => setIsApplyModalOpen(true)}
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-[#581A57] text-white p-3 rounded-full shadow-lg hover:bg-[#4a1549] transition-colors z-50"
      >
        <Bot size={24} />
      </button>
      
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ApplyModal />
    </Layout>
  );
};

export default Learn;
