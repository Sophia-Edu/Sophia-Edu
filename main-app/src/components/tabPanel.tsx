import { useState } from 'react';
import type { TabsProps } from "antd";
import {  Progress } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import ReactPlayer from 'react-player';
import {BsFillPauseCircleFill, BsFillPlayCircleFill} from "react-icons/bs";

// Tab Label Component
const TabLabel = ({ label }: { label: string }) => (
    <div className="custom-tab-label">
        <span>{label}</span>
    </div>
);

// Define media content for each tab
const tabMedia = {
    1: {
        type: "image",
        src: "https://cdn.prod.website-files.com/5dbb30f00775d4350591a4e5/6335d12aa8bba4d2c450c8d7_react%20js%20introduction%20microverse%20(2).webp",
        alt: "Course Introduction"
    },
    2: {
        type: "video",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        poster: "https://example.com/video-poster.jpg"
    },
    3: {
        type: "image",
        src: "https://i.pcmag.com/imagery/articles/04dwtm4hFozaDQV4ceacXUR-27..v1664895929.png",
        alt: "Task Management App Preview"
    },
    4: {
        type: "video",
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        poster: "https://example.com/conclusion-poster.jpg"
    }
} as const;


// Media Content Component with state management
const MediaContent = ({ tabKey }: { tabKey: number }) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const media = tabMedia[tabKey as keyof typeof tabMedia];

    const handlePlay = () => {
        setPlaying(true);
    };

    const handlePause = () => {
        setPlaying(false);
    };

    const handleProgress = (state: { played: number }) => {
        setProgress(state.played * 100);
    };

    return (
        <div className="relative rounded-lg h-[400px] w-full overflow-hidden bg-[#000]">
            {media.type === "image" ? (
                <img
                    src={media.src}
                    alt={media.alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <>
                    <ReactPlayer
                        url={media.src}
                        width="100%"
                        height="100%"
                        controls
                        playing={playing}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onProgress={handleProgress}
                        light={true}
                        playIcon={
                           !playing ?  <BsFillPlayCircleFill
                               size={60}
                               color="#581A57"
                               stopColor={"#fff"}
                               onClick={handlePlay}
                           />: <BsFillPauseCircleFill
                               size={60}
                               color="#581A57"
                               stopColor={"#fff"}
                               className={""}
                               onClick={handlePlay}
                           />
                        }
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                    <Progress
                        percent={progress}
                        showInfo={false}
                        strokeColor="#581A57"
                        strokeWidth={3}
                        className="absolute bottom-0 left-0 right-0 m-0"
                    />
                </>
            )}
        </div>
    );
};

// Rich text content (same as before)
const richTextContent = {
    1: `<div class="rich-text-content">
        <h1 style="color: #581A57;">Introduction to Advanced Web Development</h1>
        <p>Welcome to our comprehensive <strong>Advanced Web Development</strong> course! This program is designed to take you from intermediate to expert level in modern web technologies. Over the next several weeks, you'll dive deep into cutting-edge frameworks, performance optimization, and scalable architecture patterns.</p>
        
        <h2>Course Overview</h2>
        <p>This course covers:</p>
        <ul>
          <li>Modern JavaScript frameworks (React, Angular, Vue)</li>
          <li>State management solutions (Redux, Context API, NgRx)</li>
          <li>Server-side rendering and static site generation</li>
          <li>Performance optimization techniques</li>
          <li>Web security best practices</li>
          <li>Progressive Web Apps (PWAs)</li>
          <li>Testing strategies (unit, integration, e2e)</li>
        </ul>

        <h2>What You'll Achieve</h2>
        <p>By completing this course, you will:</p>
        <ol>
          <li>Build production-ready applications with modern frameworks</li>
          <li>Understand advanced state management patterns</li>
          <li>Optimize application performance for various devices</li>
          <li>Implement security measures to protect your applications</li>
          <li>Deploy applications with CI/CD pipelines</li>
        </ol>

        <div style="background-color: #f8f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Prerequisites</h3>
          <p>Before starting, you should have:</p>
          <ul>
            <li>Basic understanding of HTML, CSS, and JavaScript</li>
            <li>Familiarity with ES6+ features</li>
            <li>Experience with at least one frontend framework</li>
            <li>Node.js and npm/yarn installed on your machine</li>
          </ul>
        </div>

        <h2>Course Structure</h2>
        <p>The course is divided into 8 modules, each focusing on a specific aspect of advanced web development. Each module contains:</p>
        <ul>
          <li>Video lectures explaining core concepts</li>
          <li>Hands-on coding exercises</li>
          <li>Real-world project components</li>
          <li>Quizzes to test your understanding</li>
          <li>Additional resources for deeper learning</li>
        </ul>

        <p style="font-style: italic; color: #666;">"The only way to learn a new programming language is by writing programs in it." - Dennis Ritchie</p>

        <h2>Getting Started</h2>
        <p>To begin, please ensure you have:</p>
        <ol>
          <li>Created your development environment</li>
          <li>Cloned the course repository</li>
          <li>Installed all required dependencies</li>
          <li>Familiarized yourself with the course schedule</li>
        </ol>

        <p>We recommend dedicating at least <strong>10-15 hours per week</strong> to this course to get the most out of it. The more time you invest in practicing the concepts, the more you'll benefit from the material.</p>
      </div>`,

    2: `<div class="rich-text-content">
        <h1 style="color: #581A57;">Video Lecture: React Performance Optimization</h1>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3>About This Video</h3>
          <p>Duration: 42 minutes | Difficulty: Intermediate | Last Updated: June 15, 2023</p>
        </div>

        <h2>Video Overview</h2>
        <p>In this comprehensive video tutorial, we'll explore various techniques to optimize React application performance. You'll learn both fundamental concepts and advanced strategies used by industry professionals to create blazing-fast applications.</p>

        <h3>Key Topics Covered</h3>
        <ul>
          <li>React's reconciliation algorithm and virtual DOM</li>
          <li>Component memoization with React.memo</li>
          <li>useMemo and useCallback hooks for expensive computations</li>
          <li>Code splitting and lazy loading</li>
          <li>Performance profiling with React DevTools</li>
          <li>Window virtualization for large lists</li>
          <li>Optimizing context providers</li>
        </ul>

        <h2>Practical Examples</h2>
        <p>Throughout the video, we'll work with a real-world e-commerce application and demonstrate:</p>
        <ol>
          <li>Identifying performance bottlenecks</li>
          <li>Measuring improvements with profiling tools</li>
          <li>Implementing various optimization techniques</li>
          <li>Comparing before-and-after performance metrics</li>
        </ol>

        <div style="border-left: 4px solid #581A57; padding-left: 15px; margin: 20px 0;">
          <h3>Important Note</h3>
          <p>While performance optimization is crucial, remember that premature optimization can sometimes do more harm than good. Always profile your application first to identify actual bottlenecks before implementing optimizations.</p>
        </div>

        <h2>Supplementary Materials</h2>
        <p>To accompany this video, we've provided:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #581A57; color: white;">
              <th style="padding: 10px; text-align: left;">Resource</th>
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: left;">Format</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Starter Code</td>
              <td style="padding: 10px;">Initial codebase with performance issues</td>
              <td style="padding: 10px;">GitHub Repository</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Cheat Sheet</td>
              <td style="padding: 10px;">Quick reference for optimization techniques</td>
              <td style="padding: 10px;">PDF</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Exercise Files</td>
              <td style="padding: 10px;">Practice problems to test your understanding</td>
              <td style="padding: 10px;">ZIP Archive</td>
            </tr>
          </tbody>
        </table>

        <h2>Next Steps</h2>
        <p>After watching this video, we recommend:</p>
        <ol>
          <li>Experimenting with the optimization techniques in your own projects</li>
          <li>Exploring the React documentation on performance</li>
          <li>Joining the discussion forum to share your findings</li>
          <li>Attempting the performance optimization challenge in the exercises</li>
        </ol>

        <p style="font-weight: bold; color: #581A57;">Remember: Performance optimization is an iterative process. The more you practice these techniques, the more intuitive they'll become.</p>
      </div>`,

    3: `<div class="rich-text-content">
        <h1 style="color: #581A57;">Hands-On Project: Building a Task Management App</h1>
        
        <h2>Project Overview</h2>
        <p>In this comprehensive project, you'll build a full-featured task management application using React, Node.js, and MongoDB. This real-world application will incorporate many of the concepts covered throughout the course.</p>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>Project Requirements</h3>
          <ul>
            <li>User authentication system</li>
            <li>CRUD operations for tasks</li>
            <li>Task categorization and filtering</li>
            <li>Drag-and-drop interface</li>
            <li>Real-time updates</li>
            <li>Responsive design</li>
          </ul>
        </div>

        <h2>Step-by-Step Implementation</h2>
        <h3>1. Setting Up the Project</h3>
        <p>We'll begin by creating our project structure and installing necessary dependencies:</p>
        <pre style="background-color: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto;">
<code>npx create-react-app task-manager
cd task-manager
npm install express mongoose bcryptjs jsonwebtoken cors
npm install react-beautiful-dnd @material-ui/core @material-ui/icons</code></pre>

        <h3>2. Backend Development</h3>
        <p>Our Node.js backend will handle:</p>
        <ul>
          <li>User authentication (JWT)</li>
          <li>API endpoints for task operations</li>
          <li>Database interactions</li>
          <li>Error handling</li>
        </ul>

        <h3>3. Frontend Development</h3>
        <p>The React frontend will include:</p>
        <ol>
          <li>Authentication screens (login/register)</li>
          <li>Dashboard view</li>
          <li>Task creation/editing forms</li>
          <li>Drag-and-drop board</li>
          <li>User settings</li>
        </ol>

        <h2>Key Challenges</h2>
        <p>Throughout this project, you'll encounter and solve several interesting challenges:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #581A57; color: white;">
              <th style="padding: 10px; text-align: left;">Challenge</th>
              <th style="padding: 10px; text-align: left;">Solution</th>
              <th style="padding: 10px; text-align: left;">Relevant Concept</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Real-time updates</td>
              <td style="padding: 10px;">WebSocket implementation</td>
              <td style="padding: 10px;">Event-driven architecture</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Drag-and-drop persistence</td>
              <td style="padding: 10px;">Optimistic UI updates</td>
              <td style="padding: 10px;">State management</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">JWT authentication</td>
              <td style="padding: 10px;">Protected routes</td>
              <td style="padding: 10px;">Security</td>
            </tr>
          </tbody>
        </table>

        <h2>Project Submission</h2>
        <p>When complete, you'll submit:</p>
        <ul>
          <li>Git repository link</li>
          <li>Deployed application URL</li>
          <li>Documentation README</li>
          <li>5-minute demo video</li>
        </ul>

        <div style="border: 1px solid #581A57; border-radius: 8px; padding: 15px; margin-top: 20px;">
          <h3>Bonus Features</h3>
          <p>For extra credit, consider implementing:</p>
          <ul>
            <li>Task due date notifications</li>
            <li>Collaborative editing</li>
            <li>Dark mode toggle</li>
            <li>Offline capability</li>
          </ul>
        </div>
      </div>`,

    4: `<div class="rich-text-content">
        <h1 style="color: #581A57;">Course Conclusion and Next Steps</h1>
        
        <h2>What We've Covered</h2>
        <p>Throughout this intensive course, we've explored the full spectrum of modern web development:</p>
        <ul>
          <li>Advanced JavaScript concepts and patterns</li>
          <li>State-of-the-art frontend frameworks</li>
          <li>Performance optimization techniques</li>
          <li>Security best practices</li>
          <li>Testing methodologies</li>
          <li>Deployment strategies</li>
          <li>Real-world project implementation</li>
        </ul>

        <div style="background-color: #f9f5fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Key Takeaways</h3>
          <ol>
            <li>Modern web development requires understanding both frontend and backend concepts</li>
            <li>Performance optimization is an ongoing process, not a one-time task</li>
            <li>Security should be considered at every stage of development</li>
            <li>Testing is crucial for maintaining application stability</li>
            <li>The JavaScript ecosystem evolves rapidly - continuous learning is essential</li>
          </ol>
        </div>

        <h2>Continuing Your Journey</h2>
        <p>To further develop your skills, we recommend:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background-color: #581A57; color: white;">
              <th style="padding: 10px; text-align: left;">Area</th>
              <th style="padding: 10px; text-align: left;">Resources</th>
              <th style="padding: 10px; text-align: left;">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Advanced React Patterns</td>
              <td style="padding: 10px;">React Advanced Patterns Workshop</td>
              <td style="padding: 10px;">Advanced</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">WebAssembly</td>
              <td style="padding: 10px;">WebAssembly for Web Developers</td>
              <td style="padding: 10px;">Intermediate</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 10px;">Serverless Architecture</td>
              <td style="padding: 10px;">AWS Serverless Workshop</td>
              <td style="padding: 10px;">Intermediate</td>
            </tr>
          </tbody>
        </table>

        <h2>Final Project Evaluation</h2>
        <p>Your final project will be evaluated on:</p>
        <ol>
          <li>Code quality and organization</li>
          <li>Functionality and feature completeness</li>
          <li>Performance metrics</li>
          <li>Security considerations</li>
          <li>User experience</li>
          <li>Documentation quality</li>
        </ol>

        <div style="border-left: 4px solid #581A57; padding-left: 15px; margin: 20px 0;">
          <h3>Certificate of Completion</h3>
          <p>Upon successful completion of all course requirements (including the final project), you'll receive a certificate that you can add to your LinkedIn profile and resume.</p>
        </div>

        <h2>Staying Connected</h2>
        <p>We encourage you to:</p>
        <ul>
          <li>Join our alumni network</li>
          <li>Participate in our monthly coding challenges</li>
          <li>Attend our web development meetups</li>
          <li>Contribute to our open-source projects</li>
        </ul>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
          <h3>Congratulations on Completing the Course!</h3>
          <p>You've gained valuable skills that will serve you throughout your development career. Remember that learning is a continuous journey - keep building, keep experimenting, and most importantly, keep coding!</p>
          <p style="font-weight: bold; color: #581A57;">Welcome to the world of advanced web development!</p>
        </div>
      </div>`
};

// Tab Content Component
const TabContent = ({ tabNumber }: { tabNumber: number }) => {
    return (
        <div className="flex sm:flex-row flex-col-reverse mt-[10px] gap-6 w-full">
       
            <div className=" relative main">
                <MediaContent tabKey={tabNumber} />

                <div
                    className="sm:block hidden pb-[60px] h-[350px] overflow-hidden overflow-y-scroll rich-text-container"
                    dangerouslySetInnerHTML={{ __html: richTextContent[tabNumber as keyof typeof richTextContent] }}
                />

                <div className="hidden sm:block absolute bottom-2 left-0 cursor-pointer">
          <span className="bg-[#581A57] mr-2 p-2 rounded">
            <ArrowLeftOutlined />
          </span>
                    <span className="text-[#666666] text-[14px]">Introduction</span>
                </div>
                <div className="hidden sm:block absolute bottom-2 right-0 cursor-pointer">
                    <span className="text-[#666666] text-[14px]">Education</span>
                    <span className="bg-[#581A57] ml-2 p-2 rounded">
            <ArrowRightOutlined />
          </span>
                </div>
            </div>
        </div>
    );
};

// Main TabPanel Component
const TabPanel: TabsProps["items"] = [
    {
        key: "1",
        label: <TabLabel label="Course Introduction" />,
        children: <TabContent tabNumber={1} />,
    },
    {
        key: "2",
        label: <TabLabel label="Video Lectures" />,
        children: <TabContent tabNumber={2} />,
    },
    {
        key: "3",
        label: <TabLabel label="Hands-On Project" />,
        children: <TabContent tabNumber={3} />,
    },
    {
        key: "4",
        label: <TabLabel label="Conclusion" />,
        children: <TabContent tabNumber={4} />,
    },
];

export default TabPanel;