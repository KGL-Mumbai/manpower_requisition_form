import React, { useEffect, useState } from "react";
import { changeDateFormat, getData, salaryInLPA } from "../constants/Utils";
import { API_URL } from "../constants/config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../css/MyRequisitions.css";
import ReferenceBodyTemplate from "../components/MrfRefStatus";

// const roleId = 4


const createdOnBodyTemplate = (mrf) => {
	return changeDateFormat(mrf.createdOnUtc);
};
const updatedOnBodyTemplate = (mrf) => {
	return changeDateFormat(mrf.updatedOnUtc);
};

const salaryTemplate = (mrf) => {
	return salaryInLPA(mrf.salary);
};

const MyRequisitions = ({roleId,userId}) => {
	const [reqData, setReqData] = useState([]);
	useEffect(() => {
		async function getReqData() {   
			const apiUrl = API_URL.MY_REQUISITION + "?statusId=0&roleId=" + roleId+"&userId="+userId;
			const data = await getData(apiUrl);
			setReqData(data.result);
		}

		if (roleId) {
			getReqData();
		}
	}, [roleId]);

	const columns = [
		{
			field: "referenceNo",
			header: "MRF ID",
			body: ReferenceBodyTemplate,
			bodyClassName: "ref-col",
		},
		{
			field: "positionTitle",
			header: "Position Title",
			bodyClassName: " mrfdraft-ref-col  ",
			sortable: true,
		},
		{
			field: "name",
			header: "Created By",
			sortable: true,
		},
		{
			field: "createdOnUtc",
			header: "Created On",
			body: createdOnBodyTemplate,
			sortable: true,
		},
		{
			field: "updatedOnUtc",
			header: "Last Updated",
			body: updatedOnBodyTemplate,
			sortable: true,
		},
		{
			field: "requisitionType",
			header: "Requisition Type",
			sortable: true,
		},
		{
			field: "vacancyNo",
			header: "No. of Positions",
			sortable: true,
		},
		{
			field: "experience",
			header: "Exp Required",
			sortable: true,
		},
		{
			field: "salary",
			header: "Salary Range",
			body: salaryTemplate,
			sortable: true,
		},
		{
			field: "mrfStatus",
			header: "Status",
			bodyClassName: "stat-col",
			sortable: true,
		},
	];

	return (
		<div className="my-req">
			<h3 className="my-req-title">My Requisition</h3>
			<div className="req-table">
				<DataTable
					value={reqData}
					paginator={reqData.length > 10}
					removableSort
					rows={10}
					scrollable
					scrollHeight="flex"
				>
					{columns.map((col,index) => (
						<Column
						key={index}
							field={col.field}
							header={col.header}
							body={col.body}
							bodyClassName={"req-col " + col.bodyClassName}
							sortable={col.sortable}
						/>
					))}
				</DataTable>
			</div>
		</div>
	);
};
export default MyRequisitions;
