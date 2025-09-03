import { Table as AntTable, TableColumnsType, TableProps } from "antd";
import React, { useState } from "react";

type TableRowSelection<T> = TableProps<T>["rowSelection"];

const Table: React.FC<{
	data?: any[];
	columns?: TableColumnsType<any>;
	rowSelection?: any;
	type?: string;
	pagination?: any;
	className?: string;
	onFilter?: any;
	loading?: boolean;
}> = ({ data = [], columns = [], className = "", rowSelection = {}, type = "default", pagination = {}, loading = false }) => {
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

	const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const section: TableRowSelection<any> = {
		selectedRowKeys,
		onChange: onSelectChange,
		selections: [
			// Table.SELECTION_ALL,
			// Table.SELECTION_INVERT,
			// Table.SELECTION_NONE,
			{
				key: "odd",
				text: "Select Odd Row",
				onSelect: (changeableRowKeys) => {
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return false;
						}
						return true;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
			{
				key: "even",
				text: "Select Even Row",
				onSelect: (changeableRowKeys) => {
					let newSelectedRowKeys = [];
					newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
						if (index % 2 !== 0) {
							return true;
						}
						return false;
					});
					setSelectedRowKeys(newSelectedRowKeys);
				},
			},
		],
	};
	if (type === "selection")
		return (
			<AntTable
				dataSource={data.map((item) => ({ ...item, key: item.id }))}
				columns={columns}
				loading={loading}
				className={`customtable ${className}`}
				rowSelection={rowSelection ? rowSelection : section}
				pagination={pagination}
			/>
		);
	return (
		<AntTable
			dataSource={data}
			loading={loading}
			columns={columns}
			className={`customtable ${className}`}
			pagination={pagination}
		/>
	);
};

export default Table;
