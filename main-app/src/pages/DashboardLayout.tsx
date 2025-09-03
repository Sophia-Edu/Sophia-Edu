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
import { ClientRequest } from "../requests";

const { Header, Sider, Content } = AntDLayout;

const DashboardLayout: React.FC<{
	children: ReactNode;
	title: any;
	hasMargin?: boolean;
	isAdmin?: boolean;
	onclick?: any;
}> = ({ children, title, hasMargin, isAdmin, onclick }) => {
	const [activeKey, setActiveKey] = useState<string>("1");
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
		} else {
			navigate(URL.ADMIN_SETTINGS);
		}
	};
	const dropdown: MenuProps["items"] = [
		{
			key: "1",
			label: (
				<div className="text-[16px]" onClick={() => navigate(URL.BIO)}>
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
			const res: any = await ClientRequest.getMe(isAdmin);
			if (res) {
				if (isAdmin) {
					const { admins: [admin] } = res;
					setUser(admin);
				} else {
					setUser(res);
				}
			}
		};
		if (!user) {
			fetchUser();
		}
	}, [setUser]);
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
					) : null}
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
									<img src={avatar} alt=".." width={30} />
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
