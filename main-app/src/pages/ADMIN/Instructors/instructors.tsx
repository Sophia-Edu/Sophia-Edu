import React, { Fragment, useEffect, useMemo, useState } from "react";
import Layout from "../../DashboardLayout";
import { Card, Dropdown, Form, Input, Space, TableColumnsType } from "antd";
import { avatar, FilterIcon } from "../../../assets";
import { Button, Table } from "../../../components";
// import { getRandomDate, getRandomItem } from "../../../utils/helperFunction";
import { useScreenSize } from "../../../utils/hooks/useScreen";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";
import { AdminRequest } from "../../../requests";
import { useAlert } from "../../../store";

const renderColumns = (nav: Function) => {
    return [
        {
            title: "Instructor Name",
            dataIndex: "full_name",
			render: (full_name: string, record: any) => (
				<div className="flex gap-2 items-center">
					{
						record.profile_image ? (
							<img src={record.profile_image} alt="avatar" width={20} />
						) : (
							<img src={avatar} alt="avatar" width={20} />
						)
					}
					<p>{ full_name }</p>
				</div>
			)
        },
        {
            title: "Courses",
            dataIndex: "courses",
            render: (courses: any) => (
                <Fragment>
                    { courses.map((course: any) => (
						<span className="block" key={course.id}>{ course.title }</span>
					)) }
                </Fragment>
            )
        },
        {
            title: "Earnings",
            dataIndex: "earnings",
        },
        {
            title: "Date Created",
            dataIndex: "created_at",
        },
        {
            title: "",
            key: "more",
            render: (_: any, record: any) => (
                <Dropdown menu={{ items: [
					{
						key: "1",
						label: (
							<div
								className="text-[14px] cursor-pointer"
								onClick={() => console.log(record)}
							>
								View Info
							</div>
						),
					},
					{
						key: "2",
						label: (
							<div
								className="text-[14px] cursor-pointer"
								onClick={() => nav(`/admin/instructor/${record.id}/students`)}
							>
								View Students
							</div>
						),
					},
				] }}>
                    <Space className="cursor-pointer">...</Space>
                </Dropdown>
            )
        },
    ];
};

const StudentsPage: React.FC = () => {
	const { isMobile } = useScreenSize();
	const [instructors, setInstructors] = useState([])
	const [tableData, setTableData] = useState<{ total?: number, per_page?: number, current_page?: number }>({});
	const [loading, setLoading] = useState(false)
	const { onFailure } = useAlert();
	const nav = useNavigate();

	const columns: TableColumnsType<any> = renderColumns(nav)

	const pagination = useMemo(() => ({
		total: tableData?.total ?? 0,
		pageSize: tableData?.per_page ?? 10,
		current: tableData?.current_page ?? 1,
	}), [tableData])

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const resp: any = await AdminRequest.getInstructors();
				if (resp && resp?.items && Array.isArray(resp.items)) {
					setInstructors(resp.items)
					setTableData(resp)
				}
			} catch (error: any) {
				onFailure(error.message);
			} finally {
				setLoading(false)
			}
		};
		fetchData();

		return () => {
			setInstructors([])
			setTableData({})
			setLoading(false)
		}
	}, []);

	return (
		<Layout title="Instructors" hasMargin={!isMobile} isAdmin>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">
							{tableData?.total ?? 0} Instructors
						</h2>

						<Form>
							<Form.Item>
								<Input
									placeholder="Search "
									className="px-2 py-3 !outline-none border-[#DBDBDB] border w-[300px] rounded-[50px]"
								/>
							</Form.Item>
						</Form>
						<div className="flex items-center gap-2 cursor-pointer">
							<FilterIcon />
							<p className="text-[#808080] text-[14px] inter-normal">Filter</p>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							label="Export"
							className="text-[#808080] p-3 bg-transparent border-[#808080] border rounded-[5px]"
						/>
						<Button
							label="Add Instructor"
							onclick={() => nav(URL.ADMIN_CREATE_INSTRUCTOR)}
							className="text-[#fff] p-3 bg-[#581A57]  border rounded-[5px]"
						/>
					</div>
				</header>

				<Table
					className="mt-[20px]"
					columns={columns}
					data={instructors}
					type={"selection"}
					loading={loading}
					pagination={pagination}
				/>
			</Card>
		</Layout>
	);
};

export default StudentsPage;
