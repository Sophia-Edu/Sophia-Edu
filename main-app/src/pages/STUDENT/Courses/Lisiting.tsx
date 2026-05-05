import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { Col, Input, Row, Skeleton, Pagination } from "antd";
import { Select } from "antd";
import "./courses.scss";
import { Card, Breadcrumb } from "../../../components";
import { LearningImg, SocialImg } from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";
import studentRequest from "../../../requests/students.request";
import api from "../../../Api";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Course {
	id: number;
	course_name: string;
	title: string | string[];
	brief: string;
	content: string;
	price: number;
	categories: string[];
	author: {
		email: string;
		full_name: string;
		id: number;
		type: string;
		profile_picture?: string;
	};
	image: string | null;
	student_count: number;
	status: string;
	number_of_modules: number;
}


const ListingPage: React.FC<any> = () => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCourses, setTotalCourses] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [authorProfiles, setAuthorProfiles] = useState<{[key: number]: any}>({});
	const [currentCategory, setCurrentCategory] = useState<string>("Learning Development.");
	const [categoryDisplayName, setCategoryDisplayName] = useState<string>("Learning Development");
	const [isSearchMode, setIsSearchMode] = useState(false);
	const [searchLoading, setSearchLoading] = useState(false);
	const nav = useNavigate();
	const { state } = useLocation();

	// Detect category from navigation state or URL
	useEffect(() => {
		// Get category from navigation state (e.g., "learning", "social")
		const categoryFromState = state;
		
		console.log("Navigation state received:", categoryFromState);
		
		if (categoryFromState === "learning") {
			setCurrentCategory("Learning Development.");
			setCategoryDisplayName("Learning Development");
			console.log("Set category to Learning Development.");
		} else if (categoryFromState === "social") {
			setCurrentCategory("Entrepreneurship and Innovation");
			setCategoryDisplayName("Entrepreneurship and Innovation");
			console.log("Set category to Entrepreneurship and Innovation");
		} else if (categoryFromState === "programming") {
			setCurrentCategory("Programming");
			setCategoryDisplayName("Programming");
			console.log("Set category to Programming");
		} else {
			// Default to Learning Development instead of All Courses
			setCurrentCategory("Learning Development.");
			setCategoryDisplayName("Learning Development");
			console.log("Default category set to Learning Development.");
		}
	}, [state]);

	useEffect(() => {
		fetchCourses(currentPage);
	}, [currentPage, currentCategory]);

	// Trigger re-render when author profiles are updated
	useEffect(() => {
		// This will cause the component to re-render when authorProfiles changes
		// which will update the avatars with the fetched profile pictures
	}, [authorProfiles]);

	// Fetch author profile data
	const fetchAuthorProfile = async (authorId: number) => {
		if (authorProfiles[authorId]) {
			return authorProfiles[authorId]; // Return cached data
		}

		try {
			// Use the correct instructor profile endpoint
			const response = await api.get(`/instructor/profile/${authorId}`);
			const profileData = response.data || response;
			console.log(`Fetched profile for instructor ${authorId}:`, profileData);

			// Cache the profile data
			setAuthorProfiles(prev => ({
				...prev,
				[authorId]: profileData
			}));

			return profileData;
		} catch (error) {
			console.error(`Failed to fetch author profile for ID ${authorId}:`, error);
			return null;
		}
	};

	const fetchCourses = async (page: number = 1) => {
		try {
			setLoading(true);
			setIsSearchMode(false);
			console.log("Fetching courses with category:", currentCategory);
			// Pass current category to filter courses with per_page parameter
			const response = await studentRequest.getAllCourses(page, currentCategory, undefined, undefined, 10);
			
			console.log("API Response:", response);
			// Handle the response structure - it should already be the data from the API
			const data = response as any;
			setCourses(data.items || []);
			setCurrentPage(data.current_page);
			setTotalCourses(data.total);
			setTotalPages(data.pages);

			// Fetch profile data for all unique authors
			if (data.items && data.items.length > 0) {
				const uniqueAuthorIds = [...new Set(data.items.map((course: any) => course.author.id))] as number[];
				
				// Fetch profiles for authors we don't have cached
				const profilesToFetch = uniqueAuthorIds.filter((id: number) => !authorProfiles[id]);
				
				if (profilesToFetch.length > 0) {
					console.log("Fetching profiles for authors:", profilesToFetch);
					await Promise.all(profilesToFetch.map((id: number) => fetchAuthorProfile(id)));
				}
			}
		} catch (error) {
			console.error("Failed to fetch courses:", error);
			// Set empty state on error
			setCourses([]);
			setTotalCourses(0);
			setTotalPages(1);
			setCurrentPage(1);
		} finally {
			setLoading(false);
		}
	};

	// New server-side search function
	const searchCourses = async (searchQuery: string, page: number = 1) => {
		try {
			setSearchLoading(true);
			setIsSearchMode(true);
			console.log("Searching courses with query:", searchQuery);
			
			const response = await studentRequest.searchCourses(searchQuery, page, 10);
			console.log("Search API Response:", response);
			
			const data = response as any;
			setCourses(data.items || []);
			setCurrentPage(data.current_page || page);
			setTotalCourses(data.total || 0);
			setTotalPages(data.pages || 1);

			// Fetch profile data for search results
			if (data.items && data.items.length > 0) {
				const uniqueAuthorIds = [...new Set(data.items.map((course: any) => course.author.id))] as number[];
				const profilesToFetch = uniqueAuthorIds.filter((id: number) => !authorProfiles[id]);
				
				if (profilesToFetch.length > 0) {
					console.log("Fetching profiles for search results:", profilesToFetch);
					await Promise.all(profilesToFetch.map((id: number) => fetchAuthorProfile(id)));
				}
			}
		} catch (error) {
			console.error("Failed to search courses:", error);
			setCourses([]);
			setTotalCourses(0);
			setTotalPages(1);
			setCurrentPage(1);
		} finally {
			setSearchLoading(false);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' });
		
		// Fetch appropriate data based on current mode
		if (isSearchMode && searchTerm.trim()) {
			searchCourses(searchTerm, page);
		} else {
			fetchCourses(page);
		}
	};

	// Handle search with debouncing
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (searchTerm.trim()) {
				// Perform server-side search
				searchCourses(searchTerm, 1);
			} else if (isSearchMode) {
				// Clear search and return to category view
				setIsSearchMode(false);
				fetchCourses(1);
			}
		}, 500); // Increased debounce time for search

		return () => clearTimeout(timeoutId);
	}, [searchTerm]);

	// Handle filter changes
	useEffect(() => {
		if (!isSearchMode && currentPage === 1) {
			fetchCourses(1);
		}
	}, [sortBy]);

	const handleChange = (value: string) => {
		setSortBy(value);
		setCurrentPage(1); // Reset to first page when filter changes
		
		// Update current category based on filter selection
		if (value === "all") {
			setCurrentCategory("");
			setCategoryDisplayName("All Courses");
		} else if (value === "programming") {
			setCurrentCategory("Programming");
			setCategoryDisplayName("Programming");
		} else if (value === "learning-development") {
			setCurrentCategory("Learning Development.");
			setCategoryDisplayName("Learning Development");
		} else if (value === "entrepreneurship") {
			setCurrentCategory("Entrepreneurship and Innovation");
			setCategoryDisplayName("Entrepreneurship and Innovation");
		}
		
		console.log(`Selected: ${value}, Category: ${value === "all" ? "All" : value}`);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setCurrentPage(1); // Reset to first page when search changes
	};


	// Generate breadcrumb items based on current state
	const getBreadcrumbItems = () => {
		const items = [
			{ title: "Home", href: "/student/home", icon: <HomeOutlined /> },
			{ title: "Courses", href: "/student/courses" }
		];

		if (isSearchMode && searchTerm.trim()) {
			items.push({
				title: `Search Results for "${searchTerm}"`,
				href: "",
				icon: <SearchOutlined />
			});
		} else {
			items.push({ title: categoryDisplayName, href: "" });
		}

		return items;
	};

	// Enhanced avatar generation function that handles admin/instructor types and profile pictures
	const getAvatarUrl = (author: { full_name: string; type: string; id: number }) => {
		// Check if we have profile data for this author
		const profileData = authorProfiles[author.id];
		
		if (profileData) {
			// Use the correct field name from the API response
			const profilePic = profileData.profile_image;
			
			if (profilePic) {
				console.log("Using profile picture for", author.full_name, ":", profilePic);
				return profilePic;
			}
		}

		// Generate initials from full name
		const initials = author.full_name
			.split(' ')
			.map(name => name.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
		
		// Use different background colors based on author type
		const backgroundColor = author.type === 'admin' ? '2563eb' : '581A57'; // Blue for admin, Purple for instructor
		const textColor = 'fff';
		
		// Using a placeholder avatar service with initials and dynamic colors
		const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=${textColor}&size=64&font-size=0.33`;
		console.log("Using fallback avatar:", fallbackUrl);
		return fallbackUrl;
	};

	// Format price with NGN currency
	const formatPrice = (price: number) => {
		return `$${price.toLocaleString()}`;
	};

	// Skeleton loader component
	const CourseSkeletonCard = () => (
		<Col xs={24} sm={12} md={8} className="gutter-row">
			<div className="bg-white rounded-lg shadow-sm p-4 h-full course-skeleton w-full">
				<Skeleton.Image style={{ width: '100%', height: '200px' }} />
				<div className="mt-4">
					<Skeleton active paragraph={{ rows: 3 }} />
				</div>
			</div>
		</Col>
	);
	return (
		<Layout>
			<div className="courses">
				<img
					src={state == "social" ? SocialImg : LearningImg}
					className="w-full sm:h-[332px]"
				/>
				<div className="px-[10px] sm:px-[30px] py-10 w-[100%] sm:w-[95%] mx-auto">
					<Breadcrumb items={getBreadcrumbItems()} className="mb-6" />
					<div className="flex justify-between">
						<h3 className="text-[20px] font-semibold font-inter">
							{isSearchMode ? `Search Results for "${searchTerm}"` : `${categoryDisplayName} Courses`} ({totalCourses})
						</h3>

						<div className="flex gap-3 items-center">
							<Select
								defaultValue="all"
								value={sortBy}
								className="w-[160px] bg-transparent rounded-3xl h-[38px]"
								onChange={handleChange}
							>
								<Option value="all">All Courses</Option>
								<Option value="programming">Programming</Option>
								<Option value="learning-development">Learning Development</Option>
								<Option value="entrepreneurship">Entrepreneurship & Innovation</Option>
							</Select>
							<Input
								placeholder="Search for anything"
								size="large"
								allowClear
								value={searchTerm}
								onChange={handleSearchChange}
								className="text-black w-[200px] bg-transparent sm:w-[300px] rounded-2xl p-2 ml-[12px] md:ml-0 md:p-[7px] hidden sm:block"
							/>
						</div>
					</div>
					<Row gutter={[16, 16]} className="my-4">
						{(loading || searchLoading) ? (
							// Show skeleton loaders while loading
							Array(6).fill(0).map((_, index) => (
								<CourseSkeletonCard key={index} />
							))
						) : courses.length === 0 ? (
							<Col span={24} className="text-center py-12">
								<div className="text-gray-500">
									<div className="text-6xl mb-4">📚</div>
									<div className="text-xl mb-2">No courses available</div>
									<div className="text-sm">Check back later for new courses</div>
								</div>
							</Col>
						) : (
							courses.map((course: Course) => (
								<Col
									key={course.id}
									className="gutter-row"
									xs={24} // Full width on extra small screens (1 column)
									sm={12} // Half width on small screens (2 columns)
									md={8} // One-third width on medium screens (3 columns)
								>
									<Card
										image={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
										name={course.author.full_name}
										avatar={getAvatarUrl(course.author)}
										price={formatPrice(course.price)}
										description={course.brief || course.content.substring(0, 100) + "..."}
										buttonText="View Course"
										buttonColor="#581A57"
										subject={Array.isArray(course.title) ? course.title.join(', ') : course.title}
										buttonLink="..."
										onClick={() => nav(`${URL.ABOUTCOURSE}${course.id}`)}
										courseName={course.course_name}
										studentCount={course.student_count}
										modules={course.number_of_modules}
										authorType={course.author.type}
										status={course.status}
									/>
								</Col>
							))
						)}
					</Row>
					
					{!loading && courses.length > 0 && (
						<div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
							<div className="text-gray-600 order-2 sm:order-1">
								Page {currentPage} of {totalPages} • Total {totalCourses} courses
							</div>
							<Pagination
								current={currentPage}
								total={totalCourses}
								pageSize={10} // Adjust based on your API's page size
								showSizeChanger={false}
								showQuickJumper
								showTotal={(total, range) =>
									`${range[0]}-${range[1]} of ${total}`
								}
								onChange={handlePageChange}
								className="pagination-custom order-1 sm:order-2"
								disabled={loading}
							/>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default ListingPage;
