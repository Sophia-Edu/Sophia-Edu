import React, { useEffect, useRef, useState } from "react";
import Layout from "../../Layout";
import { AddressLocator, profileBG } from "../../../assets";
import {
	Avatar,
	Button,
	Form,
	FormProps,
	Input,
	message,
	Switch,
	Spin,
	Select,
} from "antd";
import "./profile.styles.scss";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAlert, UserProps, useUser } from "../../../store";
import { ClientRequest } from "../../../requests";
import { getAvatar } from "../../../utils/helperFunction";
import axios from "axios";
import api from "../../../Api";
import { removeStoredAuthToken } from "../../../utils/storage";
import authRequests from "../../../requests/auth.request";
import { useParams } from "react-router-dom";

// Using AntD Select (multiple) for scalable follow selection

dayjs.extend(customParseFormat);

const initialProfileValues: UserProps = {
	full_name: "",
	email: "",
	password: "",
	confirm_password: "",
	age: 0,
	gender: "male",
	is_subscribed: false,
	role: "student",
	phone_number: "",
	location: { country_region: null, city: null },
	licenses_certifications: [{}],
	education: [
		{
			id: 1,
			school: "",
			degree: "",
			field_of_study: "",
			start_date: "",
			end_date: "",
		},
	],
	work_experience: [
		{
			company: "",
			role_title: "",
			job_description: "",
			start_date: "",
			end_date: "",
		},
	],
	bio: "",
};

type EntityType = "education" | "licenses_certifications" | "work_experience";
const Profile: React.FC<any> = () => {
	const [form] = Form.useForm();
	const previewFullName = Form.useWatch("full_name", form);
	const previewBio = Form.useWatch("bio", form);
	const previewLocation = Form.useWatch(["location"], form) as any;
	const previewEducation = Form.useWatch(["education"], form) as any[] | undefined;
	const previewWork = Form.useWatch(["work_experience"], form) as any[] | undefined;
	const previewLicenses = Form.useWatch(["licenses_certifications"], form) as any[] | undefined;
	const previewEmail = Form.useWatch("email", form);
	const previewPhone = Form.useWatch("phone_number", form);
	const { onFailure, onSuccess } = useAlert();
	const { setUser, user } = useUser();
	const [isLoading, setIsLoading] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [removing, setRemoving] = useState(0);
	const [entities, setEntities] = useState<{ [key in EntityType]?: any[] }>({
		education: initialProfileValues.education,
		licenses_certifications: initialProfileValues.licenses_certifications,
		work_experience: initialProfileValues.work_experience,
	});
	const [profile, setProfile] = useState<UserProps | null>(initialProfileValues);
	const fileInputRef: any = useRef(null);
	const coverFileInputRef: any = useRef(null);
  // Follow Subjects/Industries state and loading
  const [subjects, setSubjects] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingIndustries, setLoadingIndustries] = useState(false);
  const [submittingFollow, setSubmittingFollow] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [selectedIndustryIds, setSelectedIndustryIds] = useState<number[]>([]);
  // metadata maps keyed by id for quick lookup (keeps visible label unchanged)
  const [subjectMetaMap, setSubjectMetaMap] = useState<Record<number, any>>({});
  const [industryMetaMap, setIndustryMetaMap] = useState<Record<number, any>>({});

	// Routing: detect if viewing another user's profile
	const { id: routeId } = useParams();
	const viewingOther = !!routeId && String((user as any)?.id ?? "") !== String(routeId);
	const [otherProfile, setOtherProfile] = useState<UserProps | null>(null);
	const displayUser = viewingOther ? otherProfile : user;

	useEffect(() => {
		let active = true;
		(async () => {
			if (viewingOther && routeId) {
				try {
					const res: any = await ClientRequest.getUserById(Number(routeId));
					if (active) setOtherProfile(res);
				} catch (e) {
					// silent
				}
			}
		})();
		return () => {
			active = false;
		};
	}, [routeId, viewingOther]);

	// Sync form with other profile when viewingOther
	useEffect(() => {
		if (viewingOther && otherProfile) {
			form.setFieldsValue(otherProfile as any);
			setProfile(otherProfile);
		}
	}, [viewingOther, otherProfile, form]);

  // Hydrate selected follows from localStorage (temporary until backend provides fetch follows)
  useEffect(() => {
    try {
      const savedSubjects = localStorage.getItem("followed_subject_ids");
      const savedIndustries = localStorage.getItem("followed_industry_ids");
      if (savedSubjects) setSelectedSubjectIds(JSON.parse(savedSubjects));
      if (savedIndustries) setSelectedIndustryIds(JSON.parse(savedIndustries));
    } catch {}
  }, []);

  // Load lists for follow options (store full objects in maps for guidance display)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingSubjects(true);
        const res = (await api.get("/subjects_for_follow")) as any;
        if (active) {
          const list = Array.isArray(res) ? res : [];
          setSubjects(list);
          const map: Record<number, any> = {};
          list.forEach((item: any) => { if (item && item.id != null) map[item.id] = item; });
          setSubjectMetaMap(map);
        }
      } catch (err: any) {
        console.error("Failed to load subjects", err);
        message.error(err?.response?.data?.error || "Failed to load subjects");
      } finally {
        setLoadingSubjects(false);
      }
      try {
        setLoadingIndustries(true);
        const res = (await api.get("/industries_for_follow")) as any;
        if (active) {
          const list = Array.isArray(res) ? res : [];
          setIndustries(list);
          const map: Record<number, any> = {};
          list.forEach((item: any) => { if (item && item.id != null) map[item.id] = item; });
          setIndustryMetaMap(map);
        }
      } catch (err: any) {
        console.error("Failed to load industries", err);
        message.error(err?.response?.data?.error || "Failed to load industries");
      } finally {
        setLoadingIndustries(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const onSubjectsFollowChange = async (newIds: number[]) => {
    const prev = new Set(selectedSubjectIds);
    const next = new Set(newIds);
    const toFollow = Array.from(next).filter((id) => !prev.has(id));
    const toUnfollow = Array.from(prev).filter((id) => !next.has(id));
    setSelectedSubjectIds(newIds);
    try { localStorage.setItem("followed_subject_ids", JSON.stringify(newIds)); } catch {}
    if (toFollow.length === 0 && toUnfollow.length === 0) return;
    setSubmittingFollow(true);
    const key = "bio-follow-subjects";
    message.loading({ content: "Updating subjects...", key });
    try {
      await Promise.all([
        ...toFollow.map((id) => api.post(`/subjects/${id}/follow`)),
        ...toUnfollow.map((id) => api.post(`/subjects/${id}/unfollow`)),
      ]);
      message.success({ content: "Subjects updated", key, duration: 1.5 });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to update subjects";
      console.error("Subjects update failed", err);
      message.error({ content: msg, key });
    } finally {
      setSubmittingFollow(false);
    }
  };

  const onIndustriesFollowChange = async (newIds: number[]) => {
    const prev = new Set(selectedIndustryIds);
    const next = new Set(newIds);
    const toFollow = Array.from(next).filter((id) => !prev.has(id));
    const toUnfollow = Array.from(prev).filter((id) => !next.has(id));
    setSelectedIndustryIds(newIds);
    try { localStorage.setItem("followed_industry_ids", JSON.stringify(newIds)); } catch {}
    if (toFollow.length === 0 && toUnfollow.length === 0) return;
    setSubmittingFollow(true);
    const key = "bio-follow-industries";
    message.loading({ content: "Updating industries...", key });
    try {
      await Promise.all([
        ...toFollow.map((id) => api.post(`/industries/${id}/follow`)),
        ...toUnfollow.map((id) => api.post(`/industries/${id}/unfollow`)),
      ]);
      message.success({ content: "Industries updated", key, duration: 1.5 });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Failed to update industries";
      console.error("Industries update failed", err);
      message.error({ content: msg, key });
    } finally {
      setSubmittingFollow(false);
    }
  };

	const handleActiveToggle = async (checked: boolean) => {
		try {
			await ClientRequest.setActive(checked);
			onSuccess(checked ? "Account activated" : "Account deactivated");
			if (checked) {
				// On activation, refresh user profile state
				const res: any = await ClientRequest.getMe();
				setUser(res);
			} else {
				// On deactivation, immediately reflect locally and logout
				if (user) {
					setUser({ ...user, is_active: false } as any);
				}
				removeStoredAuthToken();
				window.location.assign("/login?reactivate=1");
			}
		} catch (error: any) {
			onFailure(error);
		}
	};
	const [activeTab, setActiveTab] = useState("1");

	const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
	const getLocationFromCoords = async (
		lat: number,
		lon: number
	): Promise<{ country: string; city: string }> => {
		try {
			const response = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json`,
				{
					params: {
						latlng: `${lat},${lon}`,
						key: GOOGLE_MAPS_API_KEY,
					},
				}
			);

			const results = response.data.results;
			if (results.length > 0) {
				const addressComponents = results[0].address_components;
				const country =
					addressComponents.find((component: any) =>
						component.types.includes("country")
					)?.long_name || "Unknown";
				const city =
					addressComponents.find((component: any) =>
						component.types.includes("locality")
					)?.long_name || "Unknown";

				return { country, city };
			} else {
				return { country: "Unknown", city: "Unknown" };
			}
		} catch (error) {
			console.error("Error fetching location data:", error);
			return { country: "Unknown", city: "Unknown" };
		}
	};

	const handlePhoneBlur = async () => {
		try {
			const value = form.getFieldValue("phone_number");
			await ClientRequest.updateMe({ phone_number: value });
			onSuccess("Phone number updated!");
			const res: any = await ClientRequest.getMe();
			setUser(res);
		} catch (error: any) {
			onFailure(error);
		}
	};

	const handleCoverFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			setCoverUrl(URL.createObjectURL(file));
			try {
				await ClientRequest.uploadCoverPhoto(file);
				onSuccess("Cover photo updated successfully!");
				// Refetch to sync store so banner updates across app
				const res: any = await ClientRequest.getMe();
				setUser(res);
			} catch (error: any) {
				onFailure(error);
			}
		}
	};
	const handleClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					const locationData = await getLocationFromCoords(latitude, longitude);
					form.setFieldsValue({
						location: {
							country_region: locationData.country,
							city: locationData.city,
						},
					});
					message.success("Location fetched sucessfully!.");
				},
				(error) => {
					console.log(error);
					message.error("Failed to get location.");
					// setLocation(null);
				}
			);
		} else {
			message.error("Geolocation is not supported by this browser.");
		}
	};
	useEffect(() => {
		setProfile(user);
		if (user) {
			form.setFieldsValue(user);
		}
		if (form.getFieldValue("education")?.length === 0) {
			form.setFieldsValue({
				education: [
					{
						id: 1,
						school: "",
						degree: "",
						field_of_study: "",
						start_date: "",
						end_date: "",
					},
				],
			});
		}
		console.log(form.getFieldValue("work_experience"));
		if (form.getFieldValue("work_experience")?.length === 0) {
			form.setFieldsValue({
				work_experience: [
					{
						id: 1,
						company: "",
						role_title: "",
						job_description: "",
						start_date: "",
						end_date: "",
					},
				],
			});
		}
	}, [user]);
	useEffect(() => {
		if (user) {
			form.setFieldsValue(user);
			setEntities({
				education:
					user.education && user.education?.length > 0
						? user.education
						: initialProfileValues.education,
				licenses_certifications:
					user.licenses_certifications &&
					user.licenses_certifications?.length > 0
						? user.licenses_certifications
						: initialProfileValues.licenses_certifications,
				work_experience:
					user.work_experience && user.work_experience?.length > 0
						? user.work_experience
						: initialProfileValues.work_experience,
			});
		}
	}, [user, form]);
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const [coverUrl, setCoverUrl] = useState<string | undefined>(undefined);

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			// Display the image preview
			setImageUrl(URL.createObjectURL(file));

			try {
				// Upload the file to the server
				console.log(file);
				await ClientRequest.uploadImage(file);
				onSuccess("Profile Image Changed successfully!");
			} catch (error: any) {
				onFailure(error);
			}
		}
	};
	const handleUpdateProfile: FormProps<UserProps>["onFinish"] = async (
		value: UserProps
	) => {
		setIsLoading(true);
		console.log(value);
		try {
			if (form.getFieldValue("education")[0]?.school === "0") {
				form.setFieldsValue({
					education: form.getFieldValue("education"),
					licenses_certifications: form.getFieldValue(
						"licenses_certifications"
					),
					work_experience: form.getFieldValue("work_experience"),
				});
			}

			const resp: any = await ClientRequest.updateMe(value); // Assuming AuthRequest returns a promise
			const res: any = await ClientRequest.getMe();
			setUser(res);
			onSuccess(resp.message);
		} catch (error: any) {
			console.error("Login error:", error);
			onFailure(error.message); // Trigger failure alert
		} finally {
			setIsLoading(false);
		}
	};

	const addEntity = (
		entity: "education" | "licenses_certifications" | "work_experience"
	) => {
		const newItem =
			entity === "education"
				? {
						id: entities.education && entities.education.length + 1,
						school: "",
						degree: "",
						field_of_study: "",
						start_date: "",
						end_date: "",
				  }
				: entity === "licenses_certifications"
				? {
						id:
							entities.licenses_certifications &&
							entities.licenses_certifications.length + 1,
						name: "",
						issuing_organization: "",
						issue_date: "",
						expiration_date: "",
						credential_id: "",
						credential_url: "",
				  }
				: {
						id: entities.work_experience && entities.work_experience.length + 1,
						company: "",
						role_title: "",
						job_description: "",
						start_date: "",
						end_date: "",
				  };
		setEntities((prevState: any) => ({
			...prevState,
			[entity]: [...prevState[entity], newItem],
		}));
	};

	const removeEntity = async (id: number, entity: EntityType) => {
		setRemoving(id);
		const currentList: any[] = form.getFieldValue(entity) || [];
		const persistedIds = Array.isArray(user?.[entity])
			? (user as any)[entity].map((x: any) => x?.id).filter((v: any) => v != null)
			: [];
		const isPersisted = persistedIds.includes(id);
		try {
			if (isPersisted) {
				await ClientRequest.deleteProfileEntity(id.toString(), entity);
			}
		} catch (error) {
			console.log(error);
		} finally {
			const next = currentList.filter((val: any) => val.id !== id);
			form.setFieldsValue({ [entity]: next } as any);
			setEntities((prevState: any) => ({
				...prevState,
				[entity]: next,
			}));
			setRemoving(0);
		}
	};

	// Build minimal payload for partial updates (omit empty and untouched rows)
	const buildPartialPayload = () => {
		const values = form.getFieldsValue(true) as any;
		const payload: any = {};
		const keepString = (v: any) => v !== undefined && v !== null && String(v).trim() !== "";
		// Top-level fields
		["full_name", "email", "bio", "phone_number", "profile_image", "cover_photo"].forEach((k) => {
			if (keepString(values[k])) payload[k] = values[k];
		});
		// Location
		if (values.location) {
			const loc: any = {};
			if (keepString(values.location.country_region)) loc.country_region = values.location.country_region;
			if (keepString(values.location.city)) loc.city = values.location.city;
			if (Object.keys(loc).length) payload.location = loc;
		}
		// Helper for arrays
		const mapArray = (arr: any[], keys: string[]) =>
			(arr || [])
				.map((item: any) => {
					if (!item) return null;
					const out: any = {};
					if (item.id != null) out.id = item.id;
					keys.forEach((k) => {
						if (keepString(item[k])) out[k] = item[k];
					});
					return Object.keys(out).length ? out : null;
				})
				.filter(Boolean);
		const edu = mapArray(values.education, ["school", "degree", "field_of_study", "start_date", "end_date"]);
		if (edu.length) payload.education = edu;
		const work = mapArray(values.work_experience, ["company", "role_title", "job_description", "start_date", "end_date"]);
		if (work.length) payload.work_experience = work;
		const lic = mapArray(values.licenses_certifications, ["name", "issuing_organization", "issue_date", "expiration_date", "credential_id", "credential_url"]);
		if (lic.length) payload.licenses_certifications = lic;
		return payload;
	};

	const handlePartialUpdate = async () => {
		try {
			setIsLoading(true);
			const payload = buildPartialPayload();
			if (!Object.keys(payload).length) {
				return onFailure("Nothing to update");
			}
			const resp: any = await ClientRequest.partialUpdate(payload);
			onSuccess(resp?.message || "Profile partially updated successfully");
			const res: any = await ClientRequest.getMe();
			setUser(res);
		} catch (error: any) {
			onFailure(error.message || "Failed partial update");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Layout loading={!displayUser}>
			<div className="w-[90%] md-920:w-4/5 mx-auto profile">
				<div className="relative">
					<img
						alt="cover"
						src={coverUrl || ((displayUser?.cover_photo as string) || profileBG)}
						className="h-[120px] sm:h-[200px] w-full object-cover rounded-md"
					/>
					<div className="flex justify-between sm:flex-row flex-col">
						<div className="mb-3 relative flex gap-2 bottom-[15px]  left-[30px] md-920:left-[100px] ">
							<Avatar
								size={64}
								className="cursor-pointer border-4 border-solid border-white "
								src={imageUrl || getAvatar(displayUser?.profile_image as string)} // Changed to use avatar prop
								alt="Profile Image" // Changed to use avatar prop
								onClick={() => { if (!viewingOther) fileInputRef.current?.click(); }}
							/>
							{!viewingOther && (
							<input
								type="file"
								ref={fileInputRef}
								style={{ display: "none" }}
								onChange={handleFileChange}
							/>
							)}
							{!viewingOther && (
							<input
								type="file"
								ref={coverFileInputRef}
								style={{ display: "none" }}
								onChange={handleCoverFileChange}
							/>
							)}
							<div className=" flex flex-col gap-y-1">
								<h2 className="text-[16px] font-medium mt-[18px]">
									{previewFullName ?? displayUser?.full_name}
								</h2>
								<p className="text-[#808080] flex gap-2 items-center text-[14px] ">
									<AddressLocator />
									{(() => {
										const loc = previewLocation ?? displayUser?.location;
										const country = loc?.country_region;
										const city = loc?.city;
										return (country || city)
											? `${country || ""}${city ? `, ${city}` : ""}`
											: "Location";
									})()}
								</p>
								{!viewingOther && (
									<p
										className="text-[#808080] cursor-pointer text-[14px]"
										onClick={() => fileInputRef.current?.click()}
									>
										Change Profile Picture
									</p>
								)}
								{!viewingOther && (
									<p
										className="text-[#808080] cursor-pointer text-[14px]"
										onClick={() => coverFileInputRef.current?.click()}
									>
										Change Cover Photo
									</p>
								)}
							</div>
						</div>

						<div className="flex gap-3">
							<p
								className={`text-[16px] font-medium cursor-pointer sm:mt-[18px]  ${
									activeTab === "1" ? "underline" : "text-[#808080]"
								}`}
								onClick={() => setActiveTab("1")}
							>
								Bio - information
							</p>
							<p
								className={`text-[16px] cursor-pointer font-medium sm:mt-[18px] ${
									activeTab == "2" ? "underline" : "text-[#808080]"
								}`}
								onClick={() => setActiveTab("2")}
							>
								Settings
							</p>
						</div>
					</div>
				</div>
				{activeTab === "1" ? (
					<Form
						form={form}
						layout="vertical"
						initialValues={initialProfileValues}
						onFinish={handleUpdateProfile}
					>
						{/* Personal Information */}
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Personal Information
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const nameOrEmail = previewFullName || previewEmail || user?.full_name || user?.email;
											const bio = previewBio ?? user?.bio;
											const phone = previewPhone ?? user?.phone_number;
											return nameOrEmail ? (
												<>
													<span>{nameOrEmail}</span>
													{bio && (<span className="block">{bio}</span>)}
													{phone && (<span className="block">{phone}</span>)}
												</>
											) : (
												"Input your username, bio and phone number here"
											);
										})()}
									</p>
								</div>
							</div>
							<div className="w-full md-920:w-1/2">
								<Form.Item
									label="Full Name"
									className="inter-normal"
									name="full_name"
								>
									<Input placeholder="Aluko Folajimi" className="p-2" />
								</Form.Item>
								<Form.Item label="Bio" className="inter-normal" name="bio">
									<Input.TextArea placeholder="I am a..." className="p-2" />
								</Form.Item>
								<Form.Item
									label="Phone Number"
									className="inter-normal"
									name="phone_number"
								>
									<Input placeholder="+44123456" className="p-2" onBlur={handlePhoneBlur} />
								</Form.Item>
							</div>
						</div>

						{/* location */}
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Location
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const loc = previewLocation ?? user?.location;
											const country = loc?.country_region;
											const city = loc?.city;
											return (country || city)
												? `${country || ""}${city ? `, ${city}` : ""}`
												: "Input your location here";
										})()}
									</p>
								</div>
							</div>
							<div className="w-full md-920:w-1/2">
								<Form.Item
									label="Country/Region"
									className="inter-normal"
									name={["location", "country_region"]}
								>
									<Input placeholder="Nigeria" className="p-2" />
								</Form.Item>
								<Form.Item className="inter-normal mt-[-20px]">
									<Button
										type="link"
										className="text-[#581A57] p-0"
										onClick={handleClick}
									>
										Use current Location
									</Button>
								</Form.Item>
								<Form.Item
									label="City"
									className="inter-normal"
									name={["location", "city"]}
								>
									<Input placeholder="Lagos" className="p-2" />
								</Form.Item>
							</div>
						</div>

						{/* Education */}

						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Education
									</h3>
									<div className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const source = (previewEducation && previewEducation.length ? previewEducation : user?.education) as any[] | undefined;
											const items = (source || []).filter((e: any) => (e?.school && String(e.school).trim()) || (e?.degree && String(e.degree).trim()));
											if (!items.length) return "Input your educational background here";
											return (
												<div className="flex flex-col gap-3">
													{items.map((e: any, idx: number) => {
														const school = (e.school != null ? String(e.school) : "").trim();
														const degree = (e.degree != null ? String(e.degree) : "").trim();
														const field = (e.field_of_study != null ? String(e.field_of_study) : "").trim();
														const sd = (e.start_date != null ? String(e.start_date) : "").trim();
														const ed = (e.end_date != null ? String(e.end_date) : "").trim();
														return (
															<div key={idx} className="leading-snug">
																{school && <div>{school}</div>}
																{degree && <div className="text-[#808080]">{degree}</div>}
																{field && <div className="text-[#808080]">{field}</div>}
																{(sd || ed) && (
																	<div className="text-[#9A9A9A] text-[14px]">{sd || "—"} - {ed || "Present"}</div>
																)}
																{!school && !degree && !field && !sd && !ed && <div>—</div>}
															</div>
														);
													})}
												</div>
											);
										})()}
									</div>
								</div>
							</div>

							<div className="w-full md-920:w-1/2">
								{entities.education?.map((data: any, index: number) => (
									<div key={index}>
										<Form.Item
											label="School"
											className="inter-normal hidden"
											name={["education", index, "id"]}
										>
											<Input
												placeholder="University of Stafford"
												className="p-2"
												defaultValue={index + 1}
												value="ggg"
											/>
										</Form.Item>
										<Form.Item
											label="School"
											className="inter-normal"
											name={["education", index, "school"]}
										>
											<Input
												placeholder="University of Stafford"
												className="p-2"
											/>
										</Form.Item>
										<Form.Item
											label="Degree"
											className="inter-normal"
											name={["education", index, "degree"]}
										>
											<Input placeholder="BSc. Agriculture" className="p-2" />
										</Form.Item>
										<Form.Item
											label="Field of Study"
											className="inter-normal"
											name={["education", index, "field_of_study"]}
										>
											<Input placeholder="Engineering" className="p-2" />
										</Form.Item>
										<Form.Item
											label="Start Date"
											className="inter-normal w-full"
											name={["education", index, "start_date"]}
										>
											<Input
												placeholder="1902-02-02"
												className="p-2"
												type="date"
											/>
										</Form.Item>
										<Form.Item
											label="End Date"
											className="inter-normal"
											name={["education", index, "end_date"]}
										>
											<Input
												placeholder="1902-02-02"
												className="p-2"
												type="date"
											/>
										</Form.Item>
										<div className="flex gap-2 my-[26px] justify-end">
											{index > 0 && (
												<Button
													htmlType="button"
													loading={removing === data.id}
													disabled={removing === data.id}
													onClick={() => removeEntity(data.id, "education")}
													className="bg-[#DBDBDB] !hover:bg-[#DBDBDB] text-[#3A3A3A] text-[14px] rounded-[8px]"
												>
													Remove
												</Button>
											)}
											<Button
												type="link"
												onClick={() => addEntity("education")}
												className="bg-[#3A3A3A] hover:!bg-[#3A3A3A] ml-[10px] text-[#fff] hover:!text-[#fff] text-[14px] rounded-[8px]"
											>
												Add More
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
						{/* Work experience */}
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Work Experience
									</h3>
									<div className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const source = (previewWork && previewWork.length ? previewWork : user?.work_experience) as any[] | undefined;
											const items = (source || []).filter((w: any) => (w?.company && String(w.company).trim()) || (w?.role_title && String(w.role_title).trim()));
											if (!items.length) return "Input your work experience(s) here";
											return (
												<div className="flex flex-col gap-3">
													{items.map((w: any, idx: number) => {
														const company = (w.company != null ? String(w.company) : "").trim();
														const role = (w.role_title != null ? String(w.role_title) : "").trim();
														const desc = (w.job_description != null ? String(w.job_description) : "").trim();
														const sd = (w.start_date != null ? String(w.start_date) : "").trim();
														const ed = (w.end_date != null ? String(w.end_date) : "").trim();
														return (
															<div key={idx} className="leading-snug">
																{company && <div>{company}</div>}
																{role && <div className="text-[#808080]">{role}</div>}
																{desc && <div className="text-[#808080]">{desc}</div>}
																{(sd || ed) && (
																	<div className="text-[#9A9A9A] text-[14px]">{sd || "—"} - {ed || "Present"}</div>
																)}
																{!company && !role && !desc && !sd && !ed && <div>—</div>}
															</div>
														);
													})}
												</div>
											);
										})()}
									</div>
								</div>
							</div>
							<div className="w-full md-920:w-1/2">
								{entities.work_experience?.map((data: any, index: number) => (
									<div key={index}>
										<Form.Item
											label="Company"
											className="inter-normal"
											name={["work_experience", index, "company"]}
										>
											<Input
												placeholder="Chevron group of company"
												className="p-2"
											/>
										</Form.Item>
										<Form.Item
											label="Role/Title"
											className="inter-normal"
											name={["work_experience", index, "role_title"]}
										>
											<Input placeholder="Senior Developer" className="p-2" />
										</Form.Item>
										<Form.Item
											label="Job Description"
											className="inter-normal"
											name={["work_experience", index, "job_description"]}
										>
											<Input placeholder="Engineering" className="p-2" />
										</Form.Item>

										<Form.Item
											label="Start Date"
											className="inter-normal w-full"
											name={["work_experience", index, "start_date"]}
										>
											<Input
												placeholder="1902-02-02"
												className="p-2"
												type="date"
											/>
										</Form.Item>
										<Form.Item
											label="End Date"
											className="inter-normal"
											name={["work_experience", index, "end_date"]}
										>
											<Input
												placeholder="1902-02-02"
												className="p-2"
												type="date"
											/>
										</Form.Item>
										<div className="flex gap-2 my-[26px] justify-end">
											{index > 0 && (
												<Button
													htmlType="button"
													loading={removing === data.id}
													disabled={removing === data.id}
													onClick={() =>
														removeEntity(data.id, "work_experience")
													}
													className="bg-[#DBDBDB] !hover:bg-[#DBDBDB] text-[#3A3A3A] text-[14px] rounded-[8px]"
												>
													Remove
												</Button>
											)}
											<Button
												type="link"
												onClick={() => addEntity("work_experience")}
												className="bg-[#3A3A3A] hover:!bg-[#3A3A3A] ml-[10px] text-[#fff] hover:!text-[#fff] text-[14px] rounded-[8px]"
											>
												Add More
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Licenses and Certifications */}
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Licenses and Certifications
									</h3>
									<div className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const source = (previewLicenses && previewLicenses.length ? previewLicenses : user?.licenses_certifications) as any[] | undefined;
											const items = (source || []).filter((l: any) => (l?.name && String(l.name).trim()) || (l?.issuing_organization && String(l.issuing_organization).trim()) || (l?.credential_url && String(l.credential_url).trim()));
											if (!items.length) return "This is the area to showcase what you have got";
											return (
												<div className="flex flex-col gap-3">
													{items.map((l: any, idx: number) => {
														const name = (l.name != null ? String(l.name) : "").trim();
														const org = (l.issuing_organization != null ? String(l.issuing_organization) : "").trim();
														const credId = (l.credential_id != null ? String(l.credential_id) : "").trim();
														const url = (l.credential_url != null ? String(l.credential_url) : "").trim();
														const issue = (l.issue_date != null ? String(l.issue_date) : "").trim();
														const exp = (l.expiration_date != null ? String(l.expiration_date) : "").trim();
														return (
															<div key={idx} className="leading-snug">
																{name && <div>{name}</div>}
																{org && <div className="text-[#808080]">{org}</div>}
																{credId && <div className="text-[#808080]">{credId}</div>}
																{(issue || exp) && (
																	<div className="text-[#9A9A9A] text-[14px]">{issue || "—"} - {exp || "—"}</div>
																)}
																{url && <div className="text-[#808080] break-all">{url}</div>}
																{!name && !org && !credId && !issue && !exp && !url && <div>—</div>}
															</div>
														);
													})}
												</div>
											);
										})()}
									</div>
								</div>
							</div>
							<div className="w-full md-920:w-1/2">
								{entities.licenses_certifications?.map(
									(data: any, index: number) => (
										<div key={index}>
											<Form.Item
												label="Name"
												className="inter-normal"
												name={["licenses_certifications", index, "name"]}
											>
												<Input
													placeholder="Diploma in AGILE Methodology"
													className="p-2"
												/>
											</Form.Item>
											<Form.Item
												label="Issuing Organization"
												className="inter-normal"
												name={[
													"licenses_certifications",
													index,
													"issuing_organization",
												]}
											>
												<Input placeholder="Microsoft" className="p-2" />
											</Form.Item>
											<Form.Item
												label="Issue Date"
												className="inter-normal"
												name={["licenses_certifications", index, "issue_date"]}
											>
												<Input
													placeholder="1902-02-02"
													className="p-2"
													type="date"
												/>
											</Form.Item>

											<Form.Item
												label="Expiration Date"
												className="inter-normal"
												name={[
													"licenses_certifications",
													index,
													"expiration_date",
												]}
											>
												<Input
													placeholder="1902-02-02"
													className="p-2"
													type="date"
												/>
											</Form.Item>
											<Form.Item
												label="Credential ID"
												className="inter-normal"
												name={[
													"licenses_certifications",
													index,
													"credential_id",
												]}
											>
												<Input placeholder="#2CDMW34C" className="p-2" />
											</Form.Item>
											<Form.Item
												label="Credential URL"
												className="inter-normal"
												name={[
													"licenses_certifications",
													index,
													"credential_url",
												]}
											>
												<Input
													placeholder="https://placeholder.io"
													className="p-2"
												/>
											</Form.Item>
											<div className="flex gap-2 my-[26px] justify-end">
												{index > 0 && (
													<Button
														htmlType="button"
														loading={removing === data.id}
														disabled={removing === data.id}
														onClick={() =>
															removeEntity(data.id, "licenses_certifications")
														}
														className="bg-[#DBDBDB] !hover:bg-[#DBDBDB] text-[#3A3A3A] text-[14px] rounded-[8px]"
													>
														Remove
													</Button>
												)}
												<Button
													type="link"
													onClick={() => addEntity("licenses_certifications")}
													className="bg-[#3A3A3A] hover:!bg-[#3A3A3A] ml-[10px] text-[#fff] hover:!text-[#fff] text-[14px] rounded-[8px]"
												>
													Add More
												</Button>
											</div>
										</div>
									)
								)}
							</div>
						</div>
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div
								className="w-full md-920:w-1/2"
								style={{ visibility: "hidden" }}
							></div>
							<div className="w-full md-920:w-1/2">
								{!viewingOther && (
									<div className="my-[15px] flex gap-3">
										<Button
											htmlType="submit"
											loading={isLoading}
											disabled={isLoading}
											className="p-[20px] text-white bg-[#581A57]"
										>
											Update
										</Button>
										<Button
											type="default"
											htmlType="button"
											loading={isLoading}
											disabled={isLoading}
											className="p-[20px]"
											onClick={(e) => { e.preventDefault(); handlePartialUpdate(); }}
										>
											Partial update
										</Button>
										<p className="text-[12px] text-[#666666] leading-snug mt-1">
											Partial update saves only what you changed and leaves the rest of your profile as-is. For lists (Education, Work, Licenses), it updates existing entries and adds new ones when needed.
										</p>
									</div>
								)}
							</div>
						</div>
					</Form>
				) : (
					<Form
						form={form}
						layout="vertical"
						initialValues={initialProfileValues}
						onFinish={handleUpdateProfile}
					>
						{/* Personal Information */}
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div className="w-full md-920:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Contact Details
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{(() => {
											const email = previewEmail ?? user?.email;
											const phone = previewPhone ?? user?.phone_number;
											return (email || phone) ? (
												<>
													<span>{email || ""}</span>
													{phone && (<span className="block">{phone}</span>)}
												</>
											) : (
												"Input your contact details"
											);
										})()}
									</p>
								</div>
							</div>
							<div className="w-full md-920:w-1/2">
								<Form.Item
									label="Email Address"
									className="inter-normal"
									name="email"
								>
									<Input
										readOnly
										placeholder="johndoe@gmail.com"
										className="p-2"
									/>
								</Form.Item>
								<Form.Item
									label="Phone Number"
									className="inter-normal"
									name="phone_number"
								>
									<Input placeholder="+44123456" className="p-2" onBlur={handlePhoneBlur} />
								</Form.Item>
							</div>
						</div>

						{/* Subject session */}
						<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
							<div className="w-full sm:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Follow subjects and industries
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										Let our recommendation system suggest your preferred project
										based on the subjects you follow
									</p>
								</div>
							</div>
							<div className="w-full sm:w-1/2">
								<Form.Item label="Subjects" className="inter-normal">
									<Spin spinning={loadingSubjects || submittingFollow}>
										<Select
											mode="multiple"
											allowClear
											showSearch
											placeholder="Search Subject"
											className="w-full"
											value={selectedSubjectIds}
											onChange={(vals) => onSubjectsFollowChange(vals as number[])}
											optionLabelProp="title"
											optionFilterProp="title"
											notFoundContent="No subjects available"
										>
											{subjects.map((s: any) => (
												<Select.Option key={s.id} value={s.id} title={s.name}>
													<div>
														<div>{s.name}</div>
														{/* show additional metadata inside dropdown only (not in selected label) */}
														{Object.keys(s).filter((k) => k !== "id" && k !== "name").length > 0 && (
															<div className="text-[#666666] text-sm mt-1">
																{Object.keys(s)
																	.filter((k) => k !== "id" && k !== "name")
																	.map((k) => (
																		<div key={k}><strong>{k}:</strong> {String((s as any)[k])}</div>
																	))}
															</div>
														)}
													</div>
												</Select.Option>
											))}
										</Select>
									</Spin>
									{/* Guidance: show metadata for the most recently selected subject (visible label stays as name) */}
									{selectedSubjectIds && selectedSubjectIds.length > 0 && (() => {
										const lastId = selectedSubjectIds[selectedSubjectIds.length - 1];
										const meta = subjectMetaMap[lastId];
										if (!meta) return null;
										const extra: Record<string, any> = { ...meta };
										delete extra.id;
										delete extra.name;
										const keys = Object.keys(extra);
										if (!keys.length) return null;
										return (
											<div className="text-sm text-[#666666] mt-2" aria-live="polite">
												{keys.map((k) => (
													<div key={k}><strong>{k}:</strong> {String((extra as any)[k])}</div>
												))}
											</div>
										);
									})()}
								</Form.Item>

								<Form.Item label="Industry" className="inter-normal">
									<Spin spinning={loadingIndustries || submittingFollow}>
										<Select
											mode="multiple"
											allowClear
											showSearch
											placeholder="Select Industry"
											className="w-full"
											value={selectedIndustryIds}
											onChange={(vals) => onIndustriesFollowChange(vals as number[])}
											optionLabelProp="title"
											optionFilterProp="title"
											notFoundContent="No industries available"
										>
											{industries.map((i: any) => (
												<Select.Option key={i.id} value={i.id} title={i.name}>
													<div>
														<div>{i.name}</div>
														{Object.keys(i).filter((k) => k !== "id" && k !== "name").length > 0 && (
											<div className="text-[#666666] text-sm mt-1">
												{Object.keys(i)
													.filter((k) => k !== "id" && k !== "name")
													.map((k) => (
														<div key={k}><strong>{k}:</strong> {String((i as any)[k])}</div>
													))}
											</div>
										)}
									</div>
								</Select.Option>
							))}
						</Select>
					</Spin>
									{/* Guidance: show metadata for the most recently selected industry */}
									{selectedIndustryIds && selectedIndustryIds.length > 0 && (() => {
										const lastId = selectedIndustryIds[selectedIndustryIds.length - 1];
										const meta = industryMetaMap[lastId];
										if (!meta) return null;
										const extra: Record<string, any> = { ...meta };
										delete extra.id;
										delete extra.name;
										const keys = Object.keys(extra);
										if (!keys.length) return null;
										return (
											<div className="text-sm text-[#666666] mt-2" aria-live="polite">
												{keys.map((k) => (
													<div key={k}><strong>{k}:</strong> {String((extra as any)[k])}</div>
												))}
											</div>
										);
									})()}
								</Form.Item>
							</div>
						</div>

						{/* Deactivate account session */}
						<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
							<div className="w-full sm:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Deactivate Account
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										{`Toggle this switch to deactivate your account. Please email support to permanently delete your account.`}
									</p>
								</div>
							</div>
							<div className="w-full sm:w-1/2">
								<Switch
									checked={user?.is_active ?? true}
									onChange={handleActiveToggle}
									className="custom-switch"
								/>
							</div>
						</div>

						{/* Password Info */}
						<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
							<div className="w-full sm:w-1/2">
								<div>
									<h3 className="mb-[10px] text-[24px] font-semibold">
										Change Password
									</h3>
									<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
										Edit this section with caution
									</p>
								</div>
							</div>
							<div className="w-full sm:w-1/2">
								<Form.Item
									label="Current Password"
									className="inter-normal"
									name="current_password"
								>
									<Input
										placeholder="*************"
										type="password"
										className="p-2"
									/>
								</Form.Item>

								<Form.Item
									label="New Password"
									className="inter-normal"
									name="new_password"
								>
									<Input type="password" className="p-2" />
								</Form.Item>

								<Form.Item
									label="Confirm Password"
									className="inter-normal"
									name="confirm_password"
								>
									<Input type="password" className="p-2" />
								</Form.Item>
							</div>
						</div>
						<div className="flex flex-col md-920:flex-row gap-2 my-[28px]">
							<div
								className="w-full md-920:w-1/2"
								style={{ visibility: "hidden" }}
							></div>
							<div className="w-full md-920:w-1/2">
								<Button
									type="primary"
									block
									loading={isChangingPassword}
									disabled={isChangingPassword}
									className="my-[15px] p-[20px] text-white bg-[#581A57]"
									onClick={async () => {
										try {
											setIsChangingPassword(true);
											const values = await form.validateFields([
												"current_password",
												"new_password",
												"confirm_password",
											]);
											const { current_password, new_password, confirm_password } = values;
											if (!current_password || !new_password || !confirm_password) {
												return onFailure("Please fill all password fields");
											}
											if (new_password !== confirm_password) {
												return onFailure("New password and confirm password do not match");
											}
											await authRequests.changePassword({ current_password, new_password, confirm_password });
											onSuccess("Password changed successfully");
											form.setFieldsValue({ current_password: undefined, new_password: undefined, confirm_password: undefined });
										} catch (err: any) {
											if (err?.errorFields) return; // antd validation error, already shown
											onFailure(err?.message || "Failed to change password");
										} finally {
											setIsChangingPassword(false);
										}
									}}
								>
									Change Password
								</Button>
							</div>
						</div>
					</Form>
				)}
			</div>
		</Layout>
	);
};

export default Profile;
