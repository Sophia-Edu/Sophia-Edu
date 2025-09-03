import React, { useState, Fragment } from "react";
import Layout from "../../DashboardLayout";

import { Button, Form, FormProps, Input, Select } from "antd";
import { AdminRequest } from "../../../requests";
import { useAlert } from "../../../store";
// import { useLocation } from "react-router-dom";
import { useCourseData } from "../../../utils/hooks/useCourseData";
import { useNavigate } from "react-router-dom";

type FieldType = {
	full_name?: string;
	email?: string;
	phone?: string;
	password?: string;
	remember?: string;
	confirm_password?: string;
};

const defaultCourseSelections: any = { 
	category: '', 
	type: '', 
	name: '', 
	title: '', 
	amount: '', 
	brief: '', 
	number_of_modules: 0,
	showAddTitle: false 
};

const CreateCoursePage: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const nav = useNavigate()
	// const { state } = useLocation();
	const [courseSelections, setCourseSelections] = useState([{ ...defaultCourseSelections }]);
	const { getCourseTypes, getCourseNames, getCourseTitles, getCourseCategories } = useCourseData();

	// const { user } = state;
	// console.log(state);
	const handleAddCourse = () => {
        setCourseSelections([...courseSelections, { ...defaultCourseSelections }]);
    };

	const handleRemoveCourse = (index: number) => {
		if (courseSelections.length === 1) {
			AlertFailure("You must have at least one course");
			return;
		}
        const newSelections = [...courseSelections];
        newSelections.splice(index, 1);
        setCourseSelections(newSelections);
    };

	const handleCourseChange = (index: number, field: string, value: string) => {
        const newSelections: Array<any> = [...courseSelections];
        newSelections[index][field] = value;
        // Reset dependent fields
        if (field === 'category') {
            newSelections[index].type = '';
            newSelections[index].name = '';
            newSelections[index].title = '';
        } else if (field === 'type') {
            newSelections[index].name = '';
            newSelections[index].title = '';
        } else if (field === 'name') {
            newSelections[index].title = '';
        }
        setCourseSelections(newSelections);
    };
	const getInstructorData = (values: any) => {
		let { full_name, email, phone, password } = values;
		let courses = courseSelections.map((course) => ({
			course_category: course.category,
			course_type: course.type,
			course_name: course.name,
			course_title: course.title,
			price: course.amount ? parseFloat(course.amount) : null,
			brief: course.brief,
			number_of_modules: course.number_of_modules,
		}));
		
		return {			full_name,
			email,
			phone,
			password,
			courses,
		};
	}

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		if (values.password && (values.password !== values.confirm_password)) {
			AlertFailure("Password and Confirm Password do not match");
			return;
		}
		let instructorData = getInstructorData(values)

		setLoading(true);
		try {
			await AdminRequest.createInstructor(instructorData); // Assuming AuthRequest returns a promise
			onSuccess("Instructor created successfully!");
			form.resetFields();
			setCourseSelections([{ ...defaultCourseSelections }]);
			nav("/admin/instructors");
		} catch (error: any) {
			console.error("Creation error:", error);
			AlertFailure(error.message); // Trigger failure alert
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo: any
	) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Layout title="Instructor" isAdmin>
			{/* Personal information secion */}
			<Form
				layout="vertical"
				form={form}
				onFinish={onFinish}
				// onValuesChange={}
				initialValues={{}}
				onFinishFailed={onFinishFailed}
				className="p-4 sm:p-0"
			>
				<div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Personal Information
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								This section contains instructor details like name,phone etc.
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item
							label="Full Name"
							className="inter-normal"
							name={"full_name"}
						>
							<Input placeholder="John Doe" className="p-2" />
						</Form.Item>
						<Form.Item
							label="Email Address"
							className="inter-normal"
							name={"email"}
						>
							<Input
								placeholder="myexample@email.com"
								className="p-2"
							/>
						</Form.Item>
						<Form.Item
							label="Phone Number"
							className="inter-normal"
							name={"phone"}
						>
							<Input placeholder="+2349009009000" className="p-2" />
						</Form.Item>
					</div>
				</div>

				{/* Assign courses section */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Assign Course
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Attach a course to the instructor
							</p>
						</div>
					</div>

					<div className="flex flex-col w-full sm:w-1/2">
					{
						courseSelections.map((selection, index) => (
							<Fragment>
								<div className="w-full" key={index}>
									<Form.Item label="Course Category" name={`course_category_${index}`} className="inter-normal">
										<Select
											placeholder="Select a Category"
											value={selection.category}
											className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
											onChange={(value) => handleCourseChange(index, 'category', value)}
										>
											{
												getCourseCategories().map((category) => (
													<Select.Option key={category} value={category}>
														{ category }
													</Select.Option>
												))
											}
										</Select>
									</Form.Item>									<Form.Item label="Course Type" name={`course_type_${index}`} className="inter-normal">
										<Select
											placeholder="Select a Type"
											value={selection.type}
											className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
											onChange={(value) => handleCourseChange(index, 'type', value)}
										>
											{
												getCourseTypes(selection.category).map((type) => (
													<Select.Option key={type} value={type}>
														{ type }
													</Select.Option>
												))
											}
										</Select>
									</Form.Item>
									<Form.Item label="Course Name" name={`course_name_${index}`} className="inter-normal">
										<Select
											placeholder="Select a Name"
											value={selection.name}
											onChange={(value) => handleCourseChange(index, 'name', value)}
											className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
										>
											{
												getCourseNames(selection.category, selection.type).map((name) => (
													<Select.Option key={name} value={name}>
														{ name }
													</Select.Option>
												))
											}
										</Select>
									</Form.Item>									{!selection.showAddTitle ? (
										<>
											<Form.Item label="Course Title" className="mb-0">
												<div className="flex justify-between items-center">
													<span className="text-[#666666]">Select from existing titles</span>
													<Button 
														className="text-[#581A57]" 
														type="link" 
														onClick={() => {
															const newSelections = [...courseSelections];
															newSelections[index].showAddTitle = true;
															setCourseSelections(newSelections);
														}}
													>
														{/* + Add Title */}
													</Button>
												</div>
											</Form.Item>
											<Form.Item name={`course_title_${index}`} className="inter-normal">
												<Select
													placeholder="Select a Title"
													className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
													value={selection.title}
													onChange={(value) => handleCourseChange(index, 'title', value)}
												>
													{
														getCourseTitles(selection.category, selection.type, selection.name).map((title) => (
															<Select.Option key={title} value={title}>
																{ title }
															</Select.Option>
														))
													}
												</Select>
											</Form.Item>
										</>
									) : (
										<Form.Item label="Course Title" name={`course_title_${index}`} className="inter-normal">
											<div className="flex items-center">
												<Input 
													placeholder="Enter custom title" 
													className="p-2"
													value={selection.title}
													onChange={(e) => handleCourseChange(index, 'title', e.target.value)}
												/>
												<Button 
													className="ml-2 text-[#581A57]" 
													type="link" 
													onClick={() => {
														const newSelections = [...courseSelections];
														newSelections[index].showAddTitle = false;
														setCourseSelections(newSelections);
													}}
												>
													Select Title
												</Button>
											</div>
										</Form.Item>
									)}
									<Form.Item label="Amount" className="inter-normal" name={`course_amount_${index}`}>
										<Input className="p-2" type="number" value={selection.amount} onChange={(e) => handleCourseChange(index, 'amount', e.target.value)} placeholder="Enter amount"/>
									</Form.Item>	
																	

									<Form.Item label="Number of Modules" className="inter-normal" name={`course_number_of_modules_${index}`}>
										<Input className="p-2" type="number" value={selection.number_of_modules} onChange={(e) => handleCourseChange(index, 'number_of_modules', e.target.value)} placeholder="Enter number of modules"/>
									</Form.Item>

									<div className="flex items-center justify-end gap-2">
										<Button onClick={() => handleRemoveCourse(index)} className="bg-[#DBDBDB] text-[#3A3A3A] text-[14px] rounded-[8px]">
											Remove
										</Button>

										{
											(index === courseSelections.length - 1) && (
												<Button onClick={handleAddCourse} className="bg-[#3A3A3A] text-[#fff] text-[14px] rounded-[8px]">
													Add More
												</Button>
											)
										}
									</div>
								</div>
							</Fragment>
						))
					}
					</div>
				</div>

				{/* Create Password section */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Create Password
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Create Password for instructor
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item
							label="Password"
							className="inter-normal"
							name={"password"}
						>
							<Input placeholder="**********" type="password" className="p-2" />
						</Form.Item>

						<Form.Item
							label="Confirm Password"
							className="inter-normal"
							name={"confirm_password"}
						>
							<Input placeholder="**********" type="password" className="p-2" />
						</Form.Item>
						<Button
							block
							loading={loading}
							htmlType="submit"
							disabled={loading}
							className="my-[15px] p-[20px] text-white bg-[#581A57]"
						>
							Send email
						</Button>
					</div>
				</div>
			</Form>
		</Layout>
	);
};

export default CreateCoursePage;
