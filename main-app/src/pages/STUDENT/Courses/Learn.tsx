import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import "./courses.scss";
import { Collapse, CollapseProps, Tabs } from "antd";

import { Button } from "../../../components";
import { ChatBox } from "../../../components/chatbot.tsx";
import studentRequest from "../../../requests/students.request";

import { Bot, CircleCheck, DiscIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { truncate } from "lodash";
import ReactPlayer from 'react-player';
import { Progress } from "antd";
import { BsFillPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs";

const Learn: React.FC<any> = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [_, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [currentModuleNo, setCurrentModuleNo] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const onChange = (key: string) => {
    console.log(key);
    setActiveKey(key);
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
        
        setCourse(response);
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

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

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
    if (course?.modules[currentModuleNo]?.data && currentIndex < course.modules[currentModuleNo].data.length) {
      onChange((currentIndex + 1).toString());
    }
  };
  const TabLabel = ({ label }: { label: string }) => (
    <div className="custom-tab-label">
      <span>{label}</span>
    </div>
  );

  // Media Content Component
  const MediaContent = ({ moduleEntry }: { moduleEntry: any }) => {
    return (
      <div className="relative rounded-lg h-[400px] w-full overflow-hidden bg-[#000]">
        {moduleEntry.media_file ? (
          <ReactPlayer
            url={moduleEntry.media_file}
            width="100%"
            height="100%"
            controls
            playing={playing}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={handleProgress}
            light={true}
            playIcon={
              !playing ? 
                <BsFillPlayCircleFill
                  size={60}
                  color="#581A57"
                  stopColor={"#fff"}
                  onClick={handlePlay}
                /> : 
                <BsFillPauseCircleFill
                  size={60}
                  color="#581A57"
                  stopColor={"#fff"}
                  className={""}
                  onClick={handlePlay}
                />
            }
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-700">
            <img 
              src="/logo.svg" 
              alt="Course Logo" 
              className="w-20 h-20 mb-4 opacity-50"
            />
            <h3 className="text-xl font-semibold mb-2">{moduleEntry.title}</h3>
            <p className="text-center px-8">This module content is best experienced through the text materials below</p>
          </div>
        )}
        {moduleEntry.media_file && (
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
  };

  // Tab Content Component
  const TabContent = ({ moduleEntry }: { moduleEntry: any }) => {
    // Check if we're at the first or last tab
    const isFirstTab = activeKey === "1";
    const isLastTab = course?.modules[currentModuleNo]?.data && 
                     parseInt(activeKey) === course.modules[currentModuleNo].data.length;
    
    return (
      <div className="flex sm:flex-row flex-col-reverse mt-[10px] gap-6 w-full">
        <div className="relative main w-full">
          <MediaContent moduleEntry={moduleEntry} />

          <div
            className="sm:block pb-[60px] h-[350px] overflow-y-auto overflow-x-hidden rich-text-container"
            dangerouslySetInnerHTML={{ __html: moduleEntry.content }}
          />

          {/* Desktop navigation buttons */}
          <div 
            className={`hidden sm:block  absolute bottom-2 left-0 cursor-pointer ${isFirstTab ? 'opacity-50' : ''}`} 
            onClick={isFirstTab ? undefined : goToPreviousTab}
          >
            <span className={`${isFirstTab ? 'bg-gray-400' : 'bg-[#581A57]'} mr-2 p-2 rounded`}>
              <ArrowLeftIcon size={16} color="#fff" />
            </span>
            <span className="text-[#666666] text-[14px]">Previous</span>
          </div>
          <div 
            className={`hidden sm:block absolute bottom-2 right-0 cursor-pointer ${isLastTab ? 'opacity-50' : ''}`}
            onClick={isLastTab ? undefined : goToNextTab}
          >
            <span className="text-[#666666] text-[14px]">Next</span>
            <span className={`${isLastTab ? 'bg-gray-400' : 'bg-[#581A57]'} ml-2 p-2 rounded`}>
              <ArrowRightIcon size={16} color="#fff" />
            </span>
          </div>
          
          {/* Mobile navigation buttons */}
          <div className="sm:hidden flex justify-between mt-4 mb-6">
            <button 
              className={`flex items-center ${isFirstTab ? 'opacity-50' : ''}`}
              onClick={isFirstTab ? undefined : goToPreviousTab}
              disabled={isFirstTab}
            >
              <span className={`${isFirstTab ? 'bg-gray-400' : 'bg-[#581A57]'} mr-2 p-1 rounded`}>
                <ArrowLeftIcon size={14} color="#fff" />
              </span>
              <span className="text-[#666666] text-xs">Previous</span>
            </button>
            
            <button 
              className={`flex items-center ${isLastTab ? 'opacity-50' : ''}`}
              onClick={isLastTab ? undefined : goToNextTab}
              disabled={isLastTab}
            >
              <span className="text-[#666666] text-xs">Next</span>
              <span className={`${isLastTab ? 'bg-gray-400' : 'bg-[#581A57]'} ml-2 p-1 rounded`}>
                <ArrowRightIcon size={14} color="#fff" />
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

    return course.modules[currentModuleNo].data.map((item: any, index: number) => ({
      key: String(index + 1),
      label: <TabLabel label={item.title} />,
      children: <TabContent moduleEntry={item} />,
    }));
  };

  // Custom Tab Bar
  const CustomTabBar = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end sm:w-full ml-auto mb-6 overflow-x-auto">
      {course?.modules[currentModuleNo]?.data?.map((item: any, index: number) => (
        <Button
          key={index}
          className="px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0 text-xs sm:text-sm font-medium"
          iconColor={activeKey == `${index + 1}` ? "#581A57" : "#B6B6B6"}
          type="tab"
          label={truncate(item.title, { length: 15 })}
          onclick={() => onChange(`${index + 1}`)}
          active={activeKey == `${index + 1}`}
        />
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="px-[10px] sm:px-[30px] mx-auto learn_course full-page">
        <div className="relative flex gap-4 sm:flex-row flex-col justify-between">
          <div className="w-full sm:w-[30%]">
            <div>
              <h2 className="sm:top-[12px] mb-[10px] sm:mb-20 font-semibold header">
                Course Module (History)
              </h2>
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
          </div>

          <div className="w-full sm:w-[70%] overflow-hidden">
            <Tabs
              className="relative"
              activeKey={activeKey}
              items={generateTabItems()}
              renderTabBar={CustomTabBar}
            />
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-24 right-4">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Layout>
  );
};

export default Learn;
