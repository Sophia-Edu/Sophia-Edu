import React, { ReactNode, useEffect, useState } from "react";
import {
	Button,
	Drawer,
	Dropdown,
	Layout as AntDLayout,
	Menu,
	MenuProps,
	Space,
} from "antd";
import {
	CloseOutlined,
	DownOutlined,
	MenuOutlined,
	SettingOutlined,
} from "@ant-design/icons";
import {
	avatar,
	BlogIcon,
	CourseIcon,
	Logo,
	NotificationBell,
	OverviewIcon,
	StudentsIcon,
	Wallet2Icon,
} from "../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import { LogOutModal, Modal } from "../components";
import { useModal, useUser } from "../store";
import { ClientRequest, TutorRequest } from "../requests";
import { getAvatar, getTokenData } from "../utils/helperFunction";
import { getStoredAuthToken, getInstructorId } from "../utils/storage";

const { Header, Sider, Content } = AntDLayout;

const DashboardLayout: React.FC<{
	children: ReactNode;
	title: any;
	hasMargin?: boolean;
	isAdmin?: boolean;
	onclick?: any;
}> = ({ children, title, hasMargin, isAdmin, onclick }) => {
	const [activeKey, setActiveKey] = useState<string>("1");
	const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
	const [profileError, setProfileError] = useState<string | null>(null);
	const { setUser, user } = useUser();

	const {
		visible,
		modalTitle,
		modalContent,
		showConfirmModal,
		confirmLoading,
		onCancel,
		toggleModal,
	} = useModal();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const showLogout = () => {
		showConfirmModal(
			"",
			<LogOutModal />,
			() => console.log("Confirmed"),
			() => console.log("Cancelled")
		);
	};
	const handleCancel = () => {
		onCancel();
		toggleModal();
	};
	const [open, setOpen] = useState(false);
	const onClose = () => {
		setOpen(false);
	};
	const showDrawer = () => {
		setOpen(true);
	};
	useEffect(() => {
		// alert(URL.ADMIN_STUDENTS);
		if (pathname === URL.OVERVIEW || pathname === URL.ADMIN_OVERVIEW) {
			setActiveKey("1");
		} else if (
			pathname === URL.COURSES ||
			pathname === URL.ADMIN_COURSES ||
			pathname === URL.CREATE_COURSE|| pathname === URL.ADMIN_CREATE_COURSE 
		) {
			setActiveKey("2");
		} else if (
			pathname === URL.STUDENTS_LIST ||
			pathname === URL.TUTOR_LIST ||
			pathname === URL.ADMIN_CREATE_INSTRUCTOR ||
			pathname.includes("/admin/instructor")
		) {
			setActiveKey("3");
		} else if (pathname === URL.ADMIN_SUBJECTS_INDUSTRIES) {
			setActiveKey("7");
		} else if (pathname === URL.ADMIN_COURSE_METADATA_BULK_UPLOAD) {
			setActiveKey("8");
		} else if (pathname === URL.ADMIN_SURVEYS || pathname === URL.INSTRUCTOR_SURVEYS) {
			setActiveKey("9");
		} else if (pathname === URL.TUTOR_WALLET || pathname === URL.ADMIN_WALLET) {
			setActiveKey("4");
		} else if (
			pathname === URL.SETTINGS ||
			pathname === URL.ADMIN_BLOGS ||
			pathname === URL.ADMIN_CREATE_BLOGS
		) {
			setActiveKey("5");
		} else {
			setActiveKey("6");
		}
	}, [pathname, URL, setActiveKey]);
	const handleMenuClick = (e: any) => {
		setActiveKey(e.key);
		if (e.key === "1") {
			if (isAdmin) {
				navigate(URL.ADMIN_OVERVIEW);
			} else {
				navigate(URL.OVERVIEW);
			}
			setActiveKey("1");
		} else if (e.key === "2") {
			if (isAdmin) {
				navigate(URL.ADMIN_COURSES);
			} else {
				navigate(URL.COURSES);
			}
			setActiveKey("2");
		} else if (e.key === "3") {
			if (isAdmin) {
				navigate(URL.TUTOR_LIST);
			} else {
				navigate(URL.STUDENTS_LIST);
			}
			setActiveKey("3");
		} else if (e.key === "4") {
			if (isAdmin) {
				navigate(URL.ADMIN_WALLET);
			} else {
				navigate(URL.TUTOR_WALLET);
			}
			setActiveKey("4");
		} else if (e.key === "5") {
			if (isAdmin) {
				navigate(URL.ADMIN_BLOGS);
			} else {
				navigate(URL.SETTINGS);
			}
		} else if (e.key === "7") {
			if (isAdmin) {
				navigate(URL.ADMIN_SUBJECTS_INDUSTRIES);
			}
			setActiveKey("7");
		} else if (e.key === "8") {
			if (isAdmin) {
				navigate(URL.ADMIN_COURSE_METADATA_BULK_UPLOAD);
			}
			setActiveKey("8");
		} else if (e.key === "9") {
			if (isAdmin) {
				navigate(URL.ADMIN_SURVEYS);
			} else {
				navigate(URL.INSTRUCTOR_SURVEYS);
			}
			setActiveKey("9");
		} else {
			navigate(URL.ADMIN_SETTINGS);
		}
	};
	const dropdown: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<div className="text-[16px]" onClick={() => navigate(isAdmin ? URL.BIO : URL.SETTINGS)}>
					View Profile
				</div>
			),
		},
		{
			key: "2",
			label: (
				<div className="text-red-600 text-[16px]" onClick={showLogout}>
					Logout
				</div>
			),
		},
	];
	const getMenuItemClass = (key: string) =>
		activeKey === key
			? "!text-[#581A57] !bg-[#F5F5F5] !border-r-[#581A57] !border-r-[5px] !border-[#F5F5F5] !font-bold !text-[16px] !my-[20px]"
			: "!text-[#808080] !text-[16px] !inter-normal !my-[20px]";
	useEffect(() => {
		const fetchUser = async () => {
			setIsLoadingProfile(true);
			setProfileError(null);
			
			try {
				// Check if user data is already cached and valid
				if (user && user.profile_image) {
					setIsLoadingProfile(false);
					return;
				}

				// Admin path uses /profile/me
				if (isAdmin) {
					try {
						const res: any = await ClientRequest.getMe(true);
						if (res && res.admins && Array.isArray(res.admins)) {
							const [admin] = res.admins;
							setUser(admin);
							setIsLoadingProfile(false);
							return;
						}
					} catch (e: any) {
						console.warn('[DashboardLayout] /admin/profile/me failed:', e?.message || e);
						setProfileError('Failed to load admin profile');
					}
					setIsLoadingProfile(false);
					return;
				}

				// Instructor path - optimized with early returns
				let instructorId: number | null = null;
				
				// 1) Try cached instructor id first (fastest)
				const cachedId = getInstructorId();
				if (cachedId && /^\d+$/.test(String(cachedId))) {
					instructorId = Number(cachedId);
				} else {
					// 2) Fall back to token parsing only if no cached id
					try {
						const token = getStoredAuthToken();
						if (token) {
							const payload: any = getTokenData(token);
							const fromToken = payload?.id ?? payload?.user_id ?? payload?.uid ?? payload?.ID ?? payload?.sub ?? null;
							if (fromToken != null && /^\d+$/.test(String(fromToken))) {
								instructorId = Number(fromToken);
							}
						}
					} catch (e) {
						console.warn('[DashboardLayout] Token parsing failed:', e);
					}
				}

				if (instructorId) {
					try {
						console.debug('[DashboardLayout] Fetching instructor profile for id:', instructorId);
						const instructor: any = await TutorRequest.getInstructorById(instructorId);
						
						// Simplified data extraction
						let data: any = instructor;
						if (Array.isArray(instructor)) {
							data = instructor[0];
						} else if (instructor?.data) {
							data = Array.isArray(instructor.data) ? instructor.data[0] : instructor.data;
						}

						if (data && Object.keys(data).length) {
							setUser(data);
							console.debug('[DashboardLayout] Profile loaded successfully');
						} else {
							setProfileError('No profile data found');
						}
					} catch (e) {
						console.error('[DashboardLayout] Failed to fetch instructor profile:', (e as any)?.message || e);
						setProfileError('Failed to load instructor profile');
					}
				} else {
					setProfileError('No instructor ID found');
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error);
				setProfileError('Failed to load profile');
			} finally {
				setIsLoadingProfile(false);
			}
		};
		
		// Only fetch if we don't have user data or if admin status changed
		if (!user || (isAdmin !== undefined)) {
			fetchUser();
		} else {
			setIsLoadingProfile(false);
		}
	}, [setUser, isAdmin, user]);

	// Observe and report profile loading errors (prevents unused variable lint warning)
	useEffect(() => {
		if (profileError) {
			console.warn('[DashboardLayout] Profile load error:', profileError);
		}
	}, [profileError]);

	return (
		<AntDLayout style={{ minHeight: "100vh" }}>
			<Sider
				theme="light"
				className="!min-w-[300px] !hidden md:!block z-40"
				style={{ height: "100vh", position: "fixed", left: 0, top: 0 }}
			>
				<div className="justify-center p-4 flex ">
					<img
						src={Logo}
						alt="logo"
						width={100}
						style={{ maxWidth: "100%", maxHeight: "100%" }}
					/>
				</div>
				<Menu
					theme="light"
					mode="inline"
					selectedKeys={[activeKey]}
					onClick={handleMenuClick}
					className="rounded-0"
				>
					<Menu.Item
						key="1"
						icon={
							<OverviewIcon color={activeKey == "1" ? "#581A57" : "#808080"} />
						}
						className={getMenuItemClass("1")}
					>
						Overviews
					</Menu.Item>
					<Menu.Item
						key="2"
						icon={
							<CourseIcon color={activeKey == "2" ? "#581A57" : "#808080"} />
						}
						className={getMenuItemClass("2")}
					>
						Courses
					</Menu.Item>
					<Menu.Item
						key="3"
						icon={
							<StudentsIcon color={activeKey == "3" ? "#581A57" : "#808080"} />
						}
						className={getMenuItemClass("3")}
					>
						{isAdmin ? "Instructors" : "Students"}
					</Menu.Item>
					{isAdmin ? (
						<>
							<Menu.Item
								key="7"
								icon={
									<SettingOutlined
										color={activeKey == "7" ? "#581A57" : "#808080"}
									/>
								}
								className={getMenuItemClass("7")}
								onClick={() => navigate(URL.ADMIN_SUBJECTS_INDUSTRIES)}
							>
								Subjects & Industries
							</Menu.Item>
							<Menu.Item
								key="8"
								icon={
									<SettingOutlined
										color={activeKey == "8" ? "#581A57" : "#808080"}
									/>
								}
								className={getMenuItemClass("8")}
								onClick={() => navigate(URL.ADMIN_COURSE_METADATA_BULK_UPLOAD)}
							>
								Course Metadata Bulk Upload
							</Menu.Item>
							<Menu.Item
								key="9"
								icon={
									<SettingOutlined
										color={activeKey == "9" ? "#581A57" : "#808080"}
									/>
								}
								className={getMenuItemClass("9")}
								onClick={() => navigate(URL.ADMIN_SURVEYS)}
							>
								Survey Management
							</Menu.Item>
						</>
					) : (
						<Menu.Item
							key="9"
							icon={
								<SettingOutlined
									color={activeKey == "9" ? "#581A57" : "#808080"}
								/>
							}
							className={getMenuItemClass("9")}
							onClick={() => navigate(URL.INSTRUCTOR_SURVEYS)}
						>
							Survey Management
						</Menu.Item>
					)}
					<Menu.Item
						key="4"
						icon={
							<Wallet2Icon color={activeKey == "4" ? "#581A57" : "#808080"} />
						}
						className={getMenuItemClass("4")}
					>
						Wallet
					</Menu.Item>
					{isAdmin ? (
						<>
							<Menu.Item
								key="5"
								icon={
									<BlogIcon color={activeKey == "5" ? "#581A57" : "#808080"} />
								}
								className={getMenuItemClass("5")}
							>
								Blog
							</Menu.Item>

							<Menu.Item
								key="6"
								icon={
									<SettingOutlined
										color={activeKey == "6" ? "#581A57" : "#808080"}
									/>
								}
								className={getMenuItemClass("6")}
							>
								Settings
							</Menu.Item>
						</>
					) : (
						<Menu.Item
							key="5"
							icon={
								<SettingOutlined
									color={activeKey == "5" ? "#581A57" : "#808080"}
								/>
							}
							className={getMenuItemClass("5")}
						>
							Settings
						</Menu.Item>
					)}
				</Menu>
			</Sider>
			<AntDLayout className="sm:ml-[300px] px-[10px] sm:px-0">
				<Header
					className="px-[10px] sm:!px-[20px] z-20 fixed top-0 left-0 right-0 w-[calc(100% - 300px)] bg-white flex justify-between items-center"
					style={{
						background: "#ffffff",
						boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
					}}
				>
					<h2
						className="cursor-pointer font-semibold inter-bold text-[24px] !hidden md:!block"
						onClick={onclick}
					>
						{title}
					</h2>
					<div className="flex gap-6 md:!hidden">
						<MenuOutlined
							className="text-[18px] cursor-pointer"
							onClick={showDrawer}
						/>
						<img
							src={Logo}
							alt="logo"
							width={100}
							style={{ maxWidth: "100%", maxHeight: "100%" }}
						/>
					</div>
					<Drawer
						title={
							<div className="justify-between flex ">
								<img
									src={Logo}
									alt="logo"
									width={100}
									style={{ maxWidth: "100%", maxHeight: "100%" }}
								/>
								<CloseOutlined style={{ color: "red" }} onClick={onClose} />
							</div>
						}
						placement={"left"}
						closable={false}
						onClose={onClose}
						open={open}
					>
						<div className="!min-w-[300px] ">
							<Menu
								theme="light"
								mode="inline"
								selectedKeys={[activeKey]}
								onClick={handleMenuClick}
								className="rounded-0"
							>
								<Menu.Item
									key="1"
									icon={<OverviewIcon />}
									className={getMenuItemClass("1")}
								>
									Overviews
								</Menu.Item>
								<Menu.Item
									key="2"
									icon={<CourseIcon />}
									className={getMenuItemClass("2")}
								>
									Courses
								</Menu.Item>
								<Menu.Item
									key="3"
									icon={<StudentsIcon />}
									className={getMenuItemClass("3")}
								>
									{isAdmin ? "Instructors" : "Students"}
								</Menu.Item>
								{isAdmin ? (
									<>
										<Menu.Item
											key="7"
											icon={
												<SettingOutlined
													color={activeKey == "7" ? "#581A57" : "#808080"}
												/>
											}
											className={getMenuItemClass("7")}
											onClick={() => navigate(URL.ADMIN_SUBJECTS_INDUSTRIES)}
										>
											Subjects & Industries
										</Menu.Item>
										<Menu.Item
											key="8"
											icon={
												<SettingOutlined
													color={activeKey == "8" ? "#581A57" : "#808080"}
												/>
											}
											className={getMenuItemClass("8")}
											onClick={() => navigate(URL.ADMIN_COURSE_METADATA_BULK_UPLOAD)}
										>
											Course Metadata Bulk Upload
										</Menu.Item>
									</>
								) : null}
								<Menu.Item
									key="4"
									icon={<Wallet2Icon />}
									className={getMenuItemClass("4")}
								>
									Wallet
								</Menu.Item>
								{isAdmin ? (
									<>
										<Menu.Item
											key="5"
											icon={
												<BlogIcon
													color={activeKey == "5" ? "#581A57" : "#808080"}
												/>
											}
											className={getMenuItemClass("5")}
										>
											Blog
										</Menu.Item>

										<Menu.Item
											key="6"
											icon={
												<SettingOutlined
													color={activeKey == "6" ? "#581A57" : "#808080"}
												/>
											}
											className={getMenuItemClass("6")}
										>
											Settings
										</Menu.Item>
									</>
								) : (
									<Menu.Item
										key="5"
										icon={
											<SettingOutlined
												color={activeKey == "5" ? "#581A57" : "#808080"}
											/>
										}
										className={getMenuItemClass("5")}
									>
										Settings
									</Menu.Item>
								)}
							</Menu>
						</div>
					</Drawer>
					<div className="flex gap-3 items-center">
						<NotificationBell className="cursor-pointer" />
						<Dropdown
							className="border-0 bg-transparent !shadow-none "
							menu={{ items: dropdown }}
						>
							<Button className="pl-0 sm:pl-[15px]">
								<Space>
									{isLoadingProfile ? (
										<div className="w-[30px] h-[30px] rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
											<div className="w-4 h-4 bg-gray-400 rounded-full animate-bounce"></div>
										</div>
									) : (
										<img 
											src={getAvatar(user?.profile_image)}
											alt="Profile" 
											width={30} 
											className="w-[30px] h-[30px] rounded-full object-cover transition-opacity duration-200"
											loading="eager"
											onLoad={() => {
												console.debug('[DashboardLayout] Profile image loaded successfully');
											}}
											onError={(e) => {
												console.error('Profile image failed to load:', user?.profile_image);
												(e.target as HTMLImageElement).src = avatar;
											}}
										/>
									)}
									<DownOutlined />
								</Space>
							</Button>
						</Dropdown>
					</div>
				</Header>
				<Content
					style={{
						margin: hasMargin ? "64px 16px" : "64px 0",
						paddingTop: "16px",
						paddingBottom: "16px",
						overflow: "auto",
					}}
				>
					<div
						className="site-layout-background p-0 sm:p-[24px]"
						style={{ minHeight: "calc(100vh - 64px)", overflowY: "auto" }}
					>
						{children}
					</div>
				</Content>
			</AntDLayout>
			<Modal
				isOpen={visible}
				onClose={handleCancel}
				title={modalTitle}
				confirmLoading={confirmLoading}
			>
				{modalContent}
			</Modal>
		</AntDLayout>
	);
};

export default DashboardLayout;
