import React, { useState, useEffect } from "react";
import Layout from "../../Layout";
import { Collapse, CollapseProps, Form, Input, Rate, Skeleton } from "antd";
import "./courses.scss"; // Import the custom CSS
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import {
	AudioIcon,
	CertificateIcon,
	CircleHeartIcon,
	DiscIcon,
	LaptopIcon,
	OpenBookIcon,
	SmileyIcon,
} from "../../../assets";
// We're using a custom expandIcon function instead of the indicator image
import { Button, Modal } from "../../../components";
import { useNavigate, useParams } from "react-router-dom";
import studentRequest from "../../../requests/students.request";

const AboutPage: React.FC<any> = () => {
	const nav = useNavigate()
	const {id} = useParams()
	const [loading, setLoading] = useState(true);
	const [course, setCourse] = useState<any>(null);
	const [error, setError] = useState<string>("");


	// Fetch course data when component mounts
	useEffect(() => {
		const fetchCourse = async () => {
			if (!id) return;
			try {
				setLoading(true);
				const response:any = await studentRequest.getCourseById(id);
				
				setCourse(response);
			} catch (err: any) {
				setError(err.message || 'Failed to fetch course data');
				console.error('Error fetching course:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchCourse();
	}, [id]);

	// Helper function to format price
	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `$${numPrice.toFixed(2)}`;
	};
	const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

	// Create dynamic collapse items based on course modules
	const createCollapseItems = (): CollapseProps["items"] => {
		if (!course) return [];

			
		// If we have actual modules array, use it (for the array of modules in the course)
		if (course.modules && course.modules.length > 0) {
			return course.modules.map((module: any) => {
				const moduleEntries = module.data || [];
				
				return {
					key: module.id.toString(),
					label: (
						<div className="flex  justify-between items-center w-full">
							<span className="font-medium">{module.name || module.title}</span>
							<span className="text-sm text-gray-500 mr-2">
								{moduleEntries.length > 0 ? `${moduleEntries.length} lessons` : `Module ${module.order}`}
							</span>
						</div>
					),
					children: (
						<div className="space-y-4">
							{module.description && (
								<div className="mb-4">
									<p className="text-gray-600">{module.description}</p>
								</div>
							)}
							
							{/* If module has data array with entries */}
							{moduleEntries.length > 0 ? (
								<div className="space-y-2">
									{moduleEntries.map((entry: any, index: number) => (
										<div key={index} className="border-b pb-2 last:border-b-0">
											<div className="flex items-center gap-2">
												<div className="bg-[#581A57] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
													{entry.order || index + 1}
												</div>
												<h4 className="font-medium text-gray-800">{entry.title}</h4>
											</div>
											
											{/* {entry.content && (
												<div className="pl-8 mt-2">
													<div 
														className="text-gray-600 prose prose-sm max-w-none text-sm"
														dangerouslySetInnerHTML={{ __html: entry.content }}
													/>
												</div>
											)} */}
											
											{entry.media_file && (
												<div className="pl-8 mt-2">
													<a 
														href={entry.media_file} 
														target="_blank" 
														rel="noopener noreferrer"
														className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1"
													>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
														</svg>
														Media Resource
													</a>
												</div>
											)}
											
											{entry.additional_resources && (
												<div className="pl-8 mt-2">
													<a 
														href={entry.additional_resources} 
														target="_blank" 
														rel="noopener noreferrer"
														className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1"
													>
														<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
														</svg>
														Additional Resources
													</a>
												</div>
											)}
										</div>
									))}
								</div>
							) : (
								// Fallback for modules without data array
								<div className="space-y-2">
									{module.content && (
										<div>
											<div 
												className="text-gray-600 prose prose-sm max-w-none"
												dangerouslySetInnerHTML={{ __html: module.content }}
											/>
										</div>
									)}
									
									{module.additional_resources && (
										<div>
											<a 
												href={module.additional_resources} 
												target="_blank" 
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
												</svg>
												Additional Resources
											</a>
										</div>
									)}
									
									{module.media_file && (
										<div>
											<a 
												href={module.media_file} 
												target="_blank" 
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
												</svg>
												Media Resource
											</a>
										</div>
									)}
								</div>
							)}
						</div>
					),
				};
			});
		}

		// Check if we have a module with data_entries in it (from the payload structure)
		if (course.module && course.module.data_entries && course.module.data_entries.length > 0) {
			return [
				{
					key: course.module.id?.toString() || "1",
					label: (
						<div className="flex justify-between items-center w-full">
							<span className="font-medium">{course.module.name || `Module ${course.module.order || 1}`}</span>
							<span className="text-sm text-gray-500 mr-2">{course.module.data_entries.length} lessons</span>
						</div>
					),
					children: (
						<div className="space-y-4">
							{course.module.description && (
								<div className="mb-4">
									<p className="text-gray-600">{course.module.description}</p>
								</div>
							)}
							
							{/* Module entries/lessons */}
							<div className="space-y-2">
								{course.module.data_entries.map((entry: any, index: number) => (
									<div key={entry.id} className="border-b pb-2 last:border-b-0">
										<div className="flex items-center gap-2">
											<div className="bg-[#581A57] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
												{entry.order || index + 1}
											</div>
											<h4 className="font-medium text-gray-800">{entry.title}</h4>
										</div>
										
										{entry.content && (
											<div className="pl-8 mt-2">
												<div 
													className="text-gray-600 prose prose-sm max-w-none text-sm"
													dangerouslySetInnerHTML={{ __html: entry.content }}
												/>
											</div>
										)}
										
										{entry.media_file && (
											<div className="pl-8 mt-2">
												<a href={entry.media_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
													</svg>
													Media Resource
												</a>
											</div>
										)}
										
										{entry.additional_resources && (
											<div className="pl-8 mt-2">
												<a 
													href={entry.additional_resources} 
													target="_blank" 
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1"
												>
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
													</svg>
													Additional Resources
												</a>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					),
				}
			];
		}
		
		// Check for module_entries from the JSON example
		if (course.module_entries && course.module_entries.length > 0) {
			// Group entries by module if needed
			const moduleEntries = course.module_entries;
			return [
				{
					key: course.module?.id?.toString() || "1",
					label: (
						<div className="flex justify-between items-center w-full">
							<span className="font-medium">{course.module?.name || `Module ${course.module?.order || 1}`}</span>
							<span className="text-sm text-gray-500 mr-2">{moduleEntries.length} lessons</span>
						</div>
					),
					children: (
						<div className="space-y-4">
							{course.module?.description && (
								<div className="mb-4">
									<p className="text-gray-600">{course.module.description}</p>
								</div>
							)}
							
							{/* Module entries/lessons */}
							<div className="space-y-2">
								{moduleEntries.map((entry: any, index: number) => (
									<div key={entry.id} className="border-b pb-2 last:border-b-0">
										<div className="flex items-center gap-2">
											<div className="bg-[#581A57] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
												{entry.order || index + 1}
											</div>
											<h4 className="font-medium text-gray-800">{entry.title}</h4>
										</div>
										
										{entry.content && (
											<div className="pl-8 mt-2">
												<div 
													className="text-gray-600 prose prose-sm max-w-none text-sm"
													dangerouslySetInnerHTML={{ __html: entry.content }}
												/>
											</div>
										)}
										
										{entry.media_file && (
											<div className="pl-8 mt-2">
												<a href={entry.media_file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
													</svg>
													Media Resource
												</a>
											</div>
										)}
										
										{entry.additional_resources && (
											<div className="pl-8 mt-2">
												<a 
													href={entry.additional_resources} 
													target="_blank" 
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline cursor-pointer text-sm flex items-center gap-1"
												>
													<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
													</svg>
													Additional Resources
												</a>
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					),
				}
			];
		}
	

		// Fallback to generated modules if no actual module data
		if (course.number_of_modules > 0) {
			const items = [];
			for (let i = 1; i <= course.modules.length; i++) {
				items.push({
					key: i.toString(),
					label: `Module ${i}`,
					children: (
						<div>
							<p>Module {i} content for {course.course_name}</p>
							<p>This module covers important topics related to {course.categories?.join(', ') || 'the course curriculum'}.</p>
						</div>
					),
				});
			}
			return items;
		}

		// Default fallback
		return [
			{
				key: "1",
				label: "Module 1",
				children: <p>{text}</p>,
			},
		];
	};

	const items: CollapseProps["items"] = createCollapseItems();
	const onChange = (key: string | string[]) => {
		console.log(key);
	};
	const [open, setOpen] = useState(false);
	const [buttonLoading, setButtonLoading] = useState({
		firstBtn: false,
		secondBtn: false,
	});

	const handleTopUpWallet = () => {
		setButtonLoading({
			firstBtn: !buttonLoading.firstBtn,
			secondBtn: buttonLoading.secondBtn,
		});
		setTimeout(() => {
			setButtonLoading({ firstBtn: false, secondBtn: buttonLoading.secondBtn });
			setOpen(false);
		}, 2000);
	};
	const handlePayWithWallet = () => {
		setButtonLoading({
			firstBtn: buttonLoading.firstBtn,
			secondBtn: !buttonLoading.secondBtn,
		});
		setTimeout(() => {
			setButtonLoading({ firstBtn: buttonLoading.firstBtn, secondBtn: false });
			setOpen(false);
			nav(`/course/${id}/learning`)
		}, 2000);
	};
	// Custom expand icon with more visible arrow indicator
	const expandIcon = (panelProps: any) => {
		if (panelProps.isActive) {
			return (
				<div className="flex items-center justify-center w-8 h-8 rounded-full border border-[#581A57] bg-[#581A57] text-white">
					<ArrowUpOutlined style={{ fontSize: '16px', fontWeight: 'bold' }} />
				</div>
			);
		} else {
			return (
				<div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600">
					<ArrowDownOutlined style={{ fontSize: '16px', fontWeight: 'bold' }} />
				</div>
			);
		}
	};
	return (
		<Layout>
			{loading ? (
				<div className="mb-[80px] about_course px-[10px] sm:px-[30px] py-1 sm:py-10 w-[100%] sm:w-[95%] mx-auto">
					<Skeleton active paragraph={{ rows: 10 }} />
				</div>
			) : error ? (
				<div className="mb-[80px] about_course px-[10px] sm:px-[30px] py-1 sm:py-10 w-[100%] sm:w-[95%] mx-auto">
					<div className="text-center py-8">
						<h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Course</h2>
						<p className="text-gray-600">{error}</p>
						<Button 
							className="mt-4 bg-[#581A57] text-white"
							label="Go Back"
							onclick={() => nav(-1)}
						/>
					</div>
				</div>
			) : !course ? (
				<div className="mb-[80px] about_course px-[10px] sm:px-[30px] py-1 sm:py-10 w-[100%] sm:w-[95%] mx-auto">
					<div className="text-center py-8">
						<h2 className="text-xl font-semibold text-gray-600 mb-4">Course Not Found</h2>
						<p className="text-gray-600">The course you're looking for doesn't exist.</p>
						<Button 
							className="mt-4 bg-[#581A57] text-white"
							label="Go Back"
							onclick={() => nav(-1)}
						/>
					</div>
				</div>
			) : (
			<div className="mb-[80px] about_course px-[10px] sm:px-[30px] py-1 sm:py-10 sm:pb-[100px] w-[100%] sm:w-[95%] mx-auto flex md:flex-row flex-col justify-between gap-2">
				<div className="w-full md:w-1/2 order-1">
					<h1 className="font-semibold text-[18px] sm:text-[24px] mb-[20px] font-inter">
						About the Course
					</h1>
					<div className="flex mb-[20px]">
						{course.categories && course.categories.length > 0 ? (
							course.categories.map((category: string, index: number) => (
								<p key={index} className="font-semibold text-[16px] font-inter sm:text-[20px] text-[#581A57] mr-2">
									{category} {index < course.categories.length - 1 ? ">" : ""}
								</p>
							))
						) : (
							<>
								<p className="font-semibold text-[16px] font-inter sm:text-[20px] text-[#581A57] ">
									Applied Science {">"}
								</p>
								<p className=" text-[16px] font-inter sm:text-[20px] text-[#581A57] ">
									Agriculture {">"}
								</p>
								<p className=" text-[16px] font-inter sm:text-[20px] text-[#581A57] ">
									History
								</p>
							</>
						)}
					</div>

					<p className="text-[16px] font-inter sm:text-[20px] my-[30px] leading-[32px] inter-normal">
						{course.brief && course.brief.trim() !== "" 
							? course.brief 
							: course.content && course.content.trim() !== "" 
								? course.content 
								: "This course provides comprehensive learning materials and hands-on exercises designed to help you master the subject matter. Join thousands of students who have successfully completed this course and advanced their careers."
						}
					</p>
					<div className="flex gap-3 my-[30px]">
						<p className="text-[16px]">
							{course.rating || "4.5"} Ratings ({course.student_count || 0} Students)
						</p>
						<Rate disabled defaultValue={course.rating || 4.5} />
					</div>
					<div className="flex gap-2 my-[30px]">
						<p className="text-[#737373]">Instructor:</p>
						<p>{course.author?.full_name || "Course Instructor"}</p>
					</div>
					
					{/* Course Type and Additional Info */}
					{course.course_type && (
						<div className="flex gap-2 my-[15px]">
							<p className="text-[#737373]">Course Type:</p>
							<p>{course.course_type}</p>
						</div>
					)}
					
					{course.date_created && (
						<div className="flex gap-2 my-[15px]">
							<p className="text-[#737373]">Created:</p>
							<p>{new Date(course.date_created).toLocaleDateString()}</p>
						</div>
					)}
					
					{course.status && (
						<div className="flex gap-2 my-[15px]">
							<p className="text-[#737373]">Status:</p>
							<p className={`capitalize ${course.status === 'published' ? 'text-green-600' : 'text-orange-600'}`}>
								{course.status}
							</p>
						</div>
					)}
					<div className="relative">
						{/* Background Image with Transparency */}
						<img
							alt={course.course_name || "Course image"}
							src={course.image
								? (course.image.startsWith('http')
									? course.image
									: `/api/${String(course.image).replace(/^\//, '')}`)
								: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
							}
							className="my-[30px] h-[165px] sm:h-[209px] w-full object-cover rounded-md"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
							}}
						/>
						{/* Black Overlay */}
						<div className="absolute inset-0 bg-black opacity-50 rounded-md my-[30px]"></div>
						{/* Centered Course Subject */}
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-white font-bold text-lg font-inter text-center px-4">
								{course.course_name || course.categories?.join(", ") || "Course"}
							</span>
						</div>
					</div>
					{/* <img
						alt="example"
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTGhAJjvgxShaDTndohHFPFz8sFATlPDhNGA&s"
						className="my-[30px] h-[209px] w-full object-cover rounded-[10px]"
					/> */}
					<div>
						<h1 className="text-[20px] my-[30px] font-semibold order-3">
							Course Content {course.module_entries && (
								<span className="text-sm font-normal text-gray-600 ">
									({course.modules.length} lessons)
								</span>
							)}
						</h1>
						{(!course.modules || course.modules.length === 0) &&
						 course.number_of_modules === 0 && (
							<div className="bg-gray-50 p-4 rounded-lg text-center">
								<p className="text-gray-600">Course content is being prepared. Check back soon!</p>
							</div>
						)}
						{((course.modules && course.modules.length > 0) || 
						  (course.module_entries && course.module_entries.length > 0) || 
						  course.number_of_modules > 0) && (
							<div className="border  border-gray-200 rounded-md">
								<Collapse
									onChange={onChange}
									items={items}
									accordion
									className="custom-collapse"
									expandIcon={expandIcon}
									expandIconPosition="end" // Ensure icon is at the end
									bordered={false}
									defaultActiveKey={items && items.length > 0 ? [String(items[0]?.key)] : undefined} // Open the first module by default
								/>
							</div>
						)}
					</div>
				</div>

				<div className="w-full md:w-[500px] order-2">
					<div className="w-full md:w-[500px] bg-[#F5F5F5] rounded-xl p-6">
						<div className="flex gap-2 mb-[20px]">
							<SmileyIcon />
							<p className="text-[#4D4D4D] font-medium">Beginner Friendly</p>
						</div>

						<div className="flex gap-2 mb-[20px]">
							<OpenBookIcon />
							<div className="flex-1">
								<p className="text-[#4D4D4D] font-medium">Additional Resources</p>
								{course.additional_resources && (
									<p className="text-[#737373] text-sm mt-1">{course.additional_resources}</p>
								)}
							</div>
						</div>

						<div className="flex gap-2 mb-[20px]">
							<LaptopIcon />
							<div className="flex-1">
								<p className="text-[#4D4D4D] font-medium">Self Paced</p>
								<p className="text-[#737373] text-sm mt-1">{course.number_of_modules} Modules</p>
							</div>
						</div>
						<div className="flex gap-2 mb-[20px]">
							<CircleHeartIcon />
							<p className="text-[#4D4D4D] font-medium">
								99% Positive Learning
							</p>
						</div>
						<div className="flex gap-2 mb-[20px]">
							<AudioIcon />
							<p className="text-[#4D4D4D] font-medium">Audio: English</p>
						</div>
						<div className="flex gap-2 mb-[20px]">
							<DiscIcon />
							<p className="text-[#4D4D4D] font-medium">Online</p>
						</div>
						<div className="flex gap-2 mb-[20px]">
							<CertificateIcon />
							<p className="text-[#4D4D4D] font-medium">
								Certificate Available
							</p>
						</div>
						<div className="w-full">
							<Button
								className="bg-[#581A57] text-white"
								block
								label={"Start learning"}
								onclick={() => nav(`/course/${id}/learning`)}
							/>
						</div>
					</div>
				</div>
			</div>
			)}
			<Modal
				isOpen={open}
				onClose={() => setOpen(!open)}
				className="card-modal"
				title="Proceed to Payment"
				cancelText="Top Up Wallet"
				okText="Pay with wallet"
			>
				<Form layout="vertical">
					<Form.Item label="Course Title">
						<Input 
							name="course" 
							value={course?.course_name || "Loading..."}
							disabled
							placeholder="Enter your Course of Choice" 
						/>
					</Form.Item>
					<Form.Item label="Amount">
						<Input 
							name="amount" 
							value={course ? formatPrice(course.price) : "$15"}
							disabled
							placeholder="$15" 
						/>
					</Form.Item>
					<Form.Item label="Instructor">
						<Input 
							name="instructor" 
							value={course?.author?.full_name || "Loading..."}
							disabled
							placeholder="Instructor Name" 
						/>
					</Form.Item>
				</Form>
				<div style={{ marginTop: "20px", textAlign: "right" }}>
					<Button
						loading={buttonLoading.secondBtn === true}
						onclick={handlePayWithWallet}
						label="Pay with wallet"
						className="mr-[10px] p-[8px] bg-[#581A57] text-white"
					/>
					<Button
						onclick={handleTopUpWallet}
						loading={buttonLoading.firstBtn === true}
						label="Top up wallet"
						className="text-[#581A57] p-[8px] bg-[#E6DDE6]"
					/>
				</div>
			</Modal>
		</Layout>
	);
};

export default AboutPage;
