import React, { useEffect, useState } from "react";
import Layout from "../../Layout";
import { Col, Input, Row, Skeleton, Pagination } from "antd";
import { Select } from "antd";
import "./courses.scss";
import { Card } from "../../../components";
import { LearningImg, SocialImg } from "../../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";
import studentRequest from "../../../requests/students.request";

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
	const nav = useNavigate();
	const { state } = useLocation();

	useEffect(() => {
		fetchCourses(currentPage);
	}, [currentPage]);

	const fetchCourses = async (page: number = 1) => {
		try {
			setLoading(true);
			const response = await studentRequest.getAllCourses(page);
			console.log("Fetched courses:", response);
			
			// Handle the response structure - it should already be the data from the API
			const data = response as any;
			setCourses(data.items || []);
			setCurrentPage(data.current_page);
			setTotalCourses(data.total);
			setTotalPages(data.pages);
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

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// Add effect to refetch when search/filter changes but debounce it
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (currentPage === 1) {
				fetchCourses(1);
			}
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [searchTerm, sortBy]);

	const handleChange = (value: string) => {
		setSortBy(value);
		setCurrentPage(1); // Reset to first page when filter changes
		console.log(`Selected: ${value}`);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setCurrentPage(1); // Reset to first page when search changes
	};

	// Note: Since we're using server-side pagination, client-side filtering 
	// is limited to the current page. For full search functionality,
	// you might want to implement server-side search by modifying the API call
	const filteredCourses = courses.filter(course => {
		const matchesSearch = course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.brief?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			course.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
		
		if (sortBy === "all") return matchesSearch;
		return matchesSearch && course.categories.some(cat => 
			cat.toLowerCase().includes(sortBy.toLowerCase())
		);
	});

	// Generate avatar URL or fallback to default
	const getAvatarUrl = (fullName: string) => {
		// Create a default avatar URL using the first letter of the name
		// You can replace this with a service like DiceBear or Gravatar
		const initials = fullName
			.split(' ')
			.map(name => name.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
		
		// Using a placeholder avatar service with initials
		return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=581A57&color=fff&size=40`;
	};

	// Format price with NGN currency
	const formatPrice = (price: number) => {
		return `NGN ${price.toLocaleString()}`;
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
					<div className="flex justify-between">
						<h3 className="text-[20px] font-semibold font-inter">
							All Courses ({totalCourses})
						</h3>

						<div className="flex gap-3 items-center">
							<Select
								defaultValue="all"
								value={sortBy}
								className="w-[120px] bg-transparent rounded-3xl h-[38px]"
								onChange={handleChange}
							>
								<Option value="all">All Courses</Option>
								<Option value="web design">Web Design</Option>
								<Option value="graphics design">Graphics Design</Option>
								<Option value="security">Security</Option>
								<Option value="programming">Programming</Option>
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
						{loading ? (
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
						) : filteredCourses.length === 0 ? (
							<Col span={24} className="text-center py-8">
								<div className="text-gray-500 text-lg">
									No courses found matching your criteria
								</div>
								<div className="text-sm mt-2">
									Try adjusting your search or filter
								</div>
							</Col>
						) : (
							filteredCourses.map((course) => (
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
										avatar={getAvatarUrl(course.author.full_name)}
										price={formatPrice(course.price)}
										description={course.brief || course.content.substring(0, 100) + "..."}
										buttonText="View Course"
										buttonColor="#581A57"
										subject={course.categories.join(', ')}
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
