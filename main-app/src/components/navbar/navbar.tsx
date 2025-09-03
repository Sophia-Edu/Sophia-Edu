import React, { useEffect, useState } from "react";
import {
	Menu,
	Input,
	Badge,
	Typography,
	MenuProps,
	Dropdown,
	Button,
	Space,
} from "antd";
import "./navbar.scss";
import { DownOutlined } from "@ant-design/icons";
import { BellOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { Logo } from "../../assets";
import { useNavigate } from "react-router-dom";
import { URL } from "../../utils/constants";
import { getAvatar } from "../../utils/helperFunction";
import { truncate } from "lodash";
import { useScreenSize } from "../../utils/hooks/useScreen";
import { useModal } from "../../store";
import { LogOutModal } from "..";
import clientRequests from "../../requests/client.request";

const { Title } = Typography;

const Navbar: React.FC<{ data: any }> = ({ data }) => {
	const navigate = useNavigate();
	const { showConfirmModal } = useModal();

	const showLogout = () => {
		showConfirmModal(
			"",
			<LogOutModal />,
			() => console.log("Confirmed"),
			() => console.log("Cancelled")
		);
	};

	type MenuItem = Required<MenuProps>["items"][number];
	const { isTablet } = useScreenSize();
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifUnread, setNotifUnread] = useState<number>(0);
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

    // Fetch unread messages count periodically
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const count = await clientRequests.getUnreadTotal();
                if (mounted) setUnreadCount(count || 0);
            } catch (e) {
                // silent fail
            }
        };
        load();
        const id = setInterval(load, 30000);
        return () => { mounted = false; clearInterval(id); };
    }, []);

    // Fetch unread notifications count periodically and on demand
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const count = await clientRequests.getNotificationsUnreadCount();
                if (mounted) setNotifUnread(count || 0);
            } catch (e) {
                // silent fail
            }
        };
        // initial
        load();
        // polling
        const id = setInterval(load, 30000);
        // react to explicit refresh events fired elsewhere (e.g., after posting)
        const refreshHandler = () => { load(); };
        window.addEventListener('notifications:refresh', refreshHandler);
        return () => { mounted = false; clearInterval(id); window.removeEventListener('notifications:refresh', refreshHandler); };
    }, []);
	const items: MenuItem[] = [
		{
			key: "home",
			label: "Home",
		},
		{
			key: "learnings",
			label: (
				<span>
					Learnings <DownOutlined />
				</span>
			),
			children: [
				{
					key: "/learnings/development",
					label: "Learning Development",
				},
				{
					key: "/learnings/social",
					label: "Entrepreneurship and Innovation",
				},
			],
		},
	];

	const dropdown: MenuProps["items"] = [
		{
			key: "1",
			label: <div onClick={() => navigate(URL.BIO)}>Profile</div>,
		},
		{
			key: "2",
			label: (
				<div onClick={() => navigate(URL.NOTIFICATION)}>Notifications</div>
			),
		},
		{
			key: "3",
			label: <div onClick={() => navigate(URL.MESSAGING)}>Messages</div>,
		},
		{
			key: "4",
			label: <div onClick={() => navigate(URL.WALLET)}>Wallet</div>,
		},
		{
			key: "5",
			label: (
				<div onClick={() => navigate(URL.GENERATE_CERTIFICATE)}>
					Generate Certificates
				</div>
			),
			// disabled: true,
		},

		// Removed mobile-only 'Recently read' menu item since the section is now visible by default on mobile
		{
			key: "7",
			label: (
				<div className="text-[#f00]" onClick={showLogout}>
					Logout
				</div>
			),
		},
	];

	const onClick: MenuProps["onClick"] = (e) => {
		console.log(e.key);
		if (e.key === "home") {
			navigate("/");
		} else if (e.key === "/learnings/development") {
			navigate(URL.COURSELISTING);
		} else if (e.key === "/learnings/social") {
			navigate(URL.COURSELISTING, { state: "social" });
		}
	};

	const [isScrolled, setIsScrolled] = useState(false);

  // Global search state (header input)
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ courses: any[]; modules: any[]; users: any[] }>({ courses: [], modules: [], users: [] });
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setResults({ courses: [], modules: [], users: [] });
      return;
    }
    let active = true;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await clientRequests.globalSearch({ q: term, limit: 5 });
        if (!active) return;
        setResults({
          courses: Array.isArray(res.courses) ? res.courses : [],
          modules: Array.isArray(res.modules) ? res.modules : [],
          users: Array.isArray(res.users) ? res.users : [],
        });
      } catch {
        if (active) setResults({ courses: [], modules: [], users: [] });
      } finally {
        if (active) setSearching(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(t); };
  }, [searchTerm]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 50) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={`navbar mx-auto ${
				isScrolled || isMobile ? "fixed" : ""
			}`}
		>
			<Title
				level={3}
				className="logo cursor-pointer"
				onClick={() => navigate("/")}
			>
				<img src={Logo} alt="..." className="md-920:w-[108px] w-[60px]" />
			</Title>
			<div className="relative">
              <Input
                placeholder="Search"
                size="large"
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${
                  isTablet ? "w-[50vw]" : "w-[250px]"
                }   rounded-3xl p-2 ml-[12px] md:ml-0 md:p-3`}
              />
              {(searchTerm.trim().length >= 2) && (
                <div className="absolute z-[1000] mt-2 ml-[12px] md:ml-0 bg-white shadow-lg rounded-lg p-3 w-[min(80vw,320px)] max-h-[60vh] overflow-auto">
                  <p className="text-xs text-gray-500 mb-2">{searching ? "Searching..." : `Results for "${searchTerm.trim()}"`}</p>
                  {results.users.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[12px] font-semibold text-[#581A57] mb-1">Users</p>
                      {results.users.map((u: any) => (
                        <div key={`u-${u.id}`} className="py-1 px-2 hover:bg-gray-50 cursor-pointer rounded flex items-center gap-2"
                          onMouseDown={(e)=>e.preventDefault()}
                          onClick={() => { setSearchTerm(""); navigate(URL.USER_PROFILE.replace(":id", String(u.id))); }}>
                          <img src={(u.profile_image && /^https?:\/\//.test(u.profile_image)) ? u.profile_image : getAvatar(u.profile_image || "")} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <div className="flex flex-col">
                            <span className="text-sm">{u.full_name}</span>
                            {u.email && <span className="text-[11px] text-gray-500">{u.email}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {results.courses.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[12px] font-semibold text-[#581A57] mb-1">Courses</p>
                      {results.courses.map((c: any) => (
                        <div key={`c-${c.id}`} className="py-1 px-2 hover:bg-gray-50 cursor-pointer rounded"
                          onMouseDown={(e)=>e.preventDefault()}
                          onClick={() => { setSearchTerm(""); navigate(URL.COURSELISTING); }}>
                          <span className="text-sm">{c.course_name || c.title || `Course #${c.id}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {results.modules.length > 0 && (
                    <div className="mb-1">
                      <p className="text-[12px] font-semibold text-[#581A57] mb-1">Modules</p>
                      {results.modules.map((m: any) => (
                        <div key={`m-${m.id}`} className="py-1 px-2 hover:bg-gray-50 cursor-pointer rounded"
                          onMouseDown={(e)=>e.preventDefault()}
                          onClick={() => { setSearchTerm(""); navigate(URL.COURSELISTING); }}>
                          <span className="text-sm">{m.name || `Module #${m.id}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(!searching && results.users.length===0 && results.courses.length===0 && results.modules.length===0) && (
                    <div className="text-sm text-gray-500">No results</div>
                  )}
                </div>
              )}
            </div>
			{isTablet ? (
				<>
					<div className="flex !gap-[20px]">
						<div
							className="cursor-pointer"
							onClick={() => navigate(URL.NOTIFICATION)}
						>
							<Badge count={notifUnread} overflowCount={99} showZero className="cursor">
								<BellOutlined
									className="sm:text-[24px] text-[18px]"
									style={{ marginLeft: "20px" }}
								/>
							</Badge>
						</div>
						<div
							className="cursor-pointer"
							onClick={() => navigate(URL.MESSAGING)}
						>
							<Badge count={unreadCount} overflowCount={99} className="cursor">
								<MessageOutlined
									className="sm:text-[24px] text-[18px]"
									style={{ marginLeft: "20px" }}
								/>
							</Badge>
						</div>
						<Dropdown menu={{ items: dropdown }}>
							<Space>
								<img
									src={getAvatar(data?.profile_image)}
									alt=".."
									className="w-[30px] h-[30px] rounded-full object-cover"
								/>

								<DownOutlined />
							</Space>
						</Dropdown>
					</div>
				</>
			) : (
				<>
					<Menu
						onClick={onClick}
						// overflowedIndicator={false}
						style={{ width: 256 }}
						mode="horizontal"
						items={items}
					/>
					<div className="flex gap-6">
						<div className="flex">
							<div
								className="cursor-pointer"
								onClick={() => navigate(URL.NOTIFICATION)}
							>
								<Badge count={notifUnread} overflowCount={99} showZero className="cursor">
									<BellOutlined
										style={{ fontSize: "20px", marginLeft: "20px" }}
									/>
								</Badge>
							</div>
							<div
								className="cursor-pointer"
								onClick={() => navigate(URL.MESSAGING)}
							>
								<Badge count={unreadCount} overflowCount={99} className="cursor">
									<MessageOutlined
										style={{ fontSize: "20px", marginLeft: "20px" }}
									/>
								</Badge>
							</div>
						</div>
						<div
							className="flex upload cursor-pointer"
							onClick={() => navigate(URL.UPLOAD)}
						>
							<PlusOutlined style={{ fontSize: "20px", marginLeft: "20px" }} />
							<p className="text-[#581A57] text-sm font-[inter]">Upload</p>
						</div>
						<Dropdown menu={{ items: dropdown }} className="ml-[10px]">
							<Button className="hover:!border-[#581A57] border-[#581A57] bg-[#F5F5F5] hover:!bg-[#F5F5F5] py-[20px] hover:!text-[#581A57]">
								<Space>
									<img
										src={getAvatar(data?.profile_image)}
										alt=".."
										className="w-[30px] h-[30px] rounded-full object-cover"
									/>
									<div className="flex flex-col items-start leading-tight">
										<span className="text-[14px]">{truncate(data?.full_name, { length: 20 })}</span>
										{data?.email && (
											<span className="text-[12px] text-gray-500">{truncate(data.email, { length: 24 })}</span>
										)}
									</div>
									<DownOutlined />
								</Space>
							</Button>
						</Dropdown>
					</div>
				</>
			)}
		</div>
	);
}

export default Navbar;
