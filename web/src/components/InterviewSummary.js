import { useEffect, useState,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import DropdownComponent from "./Dropdown";
import MultiSelectDropdown from "./multiselectDropdown";
import InterviewFeedbackComponent from "./InterviewFeedbackComponent";
import { API_URL, FILE_URL, ROLES } from "../constants/config";
import { storageService } from "../constants/storage";
import ToastMessages from "./ToastMessages";
import {
	changeDateFormat,
	arrayToObj,
	objToIntArray,
	getData,
	strToArray,
	putData,
} from "../constants/Utils";
import "../css/InterviewSummary.css";

 //const roleId = 3;

const uploadedOnBodyTemplate = (interview) => {
	return changeDateFormat(interview.createdOnUtc);
};

const resumeBodyTemplate = (interview) => {
	let resumeLink = FILE_URL.RESUME + interview.resumePath;
	return (
		<a href={resumeLink} target="_blank" className="int-link-cell">
			{interview.resumePath}
		</a>
	);
};

const attachmentBodyTemplate = (interview) => {
	if (interview.attachment) {
        let attachmentLink = FILE_URL.ASSIGNMENT + interview.attachment;
        return (
            <a href={attachmentLink} target="_blank" className="int-link-cell">
                {/* You can also display the attachment name or any other details */}
                View Attachment
            </a>
        );
    } else {
        return (
            <span className="no-attachment-message">
                N/A
            </span>
        );
    }
};

//summary component

const InterviewSummary = ({ roleId=null,visible, onHide, mrfId = null,userId=null }) => {

	const [interviewData, setInterviewData] = useState([]);
	const [interviewStatus, setInterviewStatus] = useState([]);
	const [interviewerData, setInterviewerData] = useState([]);
	const [saveBttn, setSaveBttn] = useState([]);
	const [showFeed, setShowFeed] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const toastRef = useRef(null);

	async function getIntData() {
		const apiUrl =
		  API_URL.INTERVIEW_SUMMARY_POPUP + `?id=${mrfId}&DashBoard=true&roleId=${roleId}&userId=${userId}`;
		let response = await getData(apiUrl);
		const data = response.result;
		let arr = new Array(data.interviewDetails.length).fill(false);
		setInterviewData(data.interviewDetails);
		setInterviewStatus(data.interviewstatus);
		setInterviewerData(data.interviewReviewer);
		setSaveBttn(arr);
	  }
	  
	  useEffect(() => {
		if (mrfId) {
		  getIntData();
		}
	  }, [mrfId]);
	  
	  const update = async (data) => {
		console.log(data);
		 const id=data.interviewevaluationId;
		 const candidateId=data.candidateId;
		 const interviewerId=data.interviewerId;
		 const evaluationDateUtc=data.evaluationDateUtc;
		 const	evalutionStatusId=data.evalutionStatusId;
		 const	updatedByEmployeeId=storageService.getData("profile").employeeId;
		 const	updatedOnUtc=new Date().toISOString();
	
		 const interviewDetailsData = {
			id,
			evalutionStatusId,
			updatedByEmployeeId,
			updatedOnUtc
		};

		const updateStatus = {
			id,
			evalutionStatusId,
			updatedByEmployeeId,
			updatedOnUtc
		};
	
		try {
		//   const response = await fetch(`${API_URL.INTERVIEW_EVALUATION}${id}`, {
		// 	method: "Put",
		// 	headers: {
		// 	  "Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(updateStatus),
		//   });
		let response = await putData(`${API_URL.INTERVIEW_EVALUATION}${id}`,updateStatus);
		
		  if (response.ok) {
			const responseData = response.json();
			if (responseData.statusCode === 409) {
			  toastRef.current.showConflictMessage(responseData.message);
			} else {
				
			  toastRef.current.showSuccessMessage(
				"Interview status updated successfully!"
			  );
			}
		  } else {
			console.error("Request failed with status:", response.status);
			const errorData = await response.text();
			console.error("Error Data:", errorData);
			if (response.status === 400) {
			  toastRef.current.showBadRequestMessage(
				"Bad request: " + response.url
			  );
			}
		  }
		} catch (error) {
		  console.error("Error:", error);
		}
	  };

	const statusBodyTemplate = (interview, options) => {
		const handleDropdownChange = (e) => {
			let interviewDataCopy = [...interviewData];
			let sv = [...saveBttn];
			sv[options.rowIndex] = true;
			interviewDataCopy[options.rowIndex].evalutionStatusId = e.target.value;
			setInterviewData(interviewDataCopy);
			setSaveBttn(sv);
		};

		if (roleId === ROLES.mrfOwner) {
			let is = interviewStatus.filter((x) => x.id === interview.evalutionStatusId);
			return <p className="drop-width">{is[0].status}</p>;
		}

		return (
			<DropdownComponent
				optionLabel="status"
				optionValue="id"
				className="drop-width"
				options={interviewStatus}
				value={interview.evalutionStatusId}
				onChange={handleDropdownChange}
			/>
		);
	};

	const interviewerBodyTemplate = (interview, options) => {
		if (roleId === ROLES.hr)
		{
			return (
        <div>
          {interview.interviewerName}
        </div>);}
		else{
		const handleMultiSelectChange = (e) => {
			let interviewDataCopy = [...interviewData];
			let sv = [...saveBttn];
			sv[options.rowIndex] = e.value.length > 0 ? true : false;
			interviewDataCopy[options.rowIndex].interviewerEmployeeId = objToIntArray(
				e.value,
				"employeeId"
			);
			setInterviewData(interviewDataCopy);
			setSaveBttn(sv);
		};
		 
		return (
			<MultiSelectDropdown
				className="drop-width"
				options={interviewerData}
				value={arrayToObj(
					interviewerData,
					strToArray(interview.interviewerEmployeeIds),
					"employeeId"
				)}
				onChange={handleMultiSelectChange}
				optionLabel="name"
				placeholder="Select Interviewer"
				// optionValue="employeeId"
			/>
		);
				}
			};

	

			const feedbackBodyTemplate = (interview) => {
				if (interview.evalutionStatusId < 5) return "To be updated";
		
				return (
					<>
						<p
							onClick={() => {
								setSelectedId(interview.candidateId);
								setShowFeed(true);
							}}
							className="int-link-cell"
						>
							Click Here
						</p>
						{showFeed && selectedId === interview.candidateId && (
							<InterviewFeedbackComponent
								visible={showFeed}
								onHide={() => setShowFeed(false)}
								cId={selectedId}
							/>
						)}
					</>
				);
			};

	const actionBodyTemplate = (interview, options) => {
		const onClickHandleSave = () => {
			update(interview);
			let sv = [...saveBttn];
			sv[options.rowIndex] = false;
			setSaveBttn(sv);
		  };
		  if (saveBttn[options.rowIndex]) {
			return <Button icon="pi pi-save " onClick={onClickHandleSave} />;
		  }
		  return <Button icon="pi pi-save" disabled />;
	};

	const columns = [
		{
			field: "referenceNo",
			header: "Sr. No.",
			body: (data, options) => options.rowIndex + 1,
			bodyClassName: "int-edit-col",
		},
		{
			field: "candidateName",
			header: "Name",
			sortable: true,
		},
		{
			field: "resumePath",
			header: "Resume",
			body: resumeBodyTemplate,
			sortable: true,
		},
		{
			field: "createdOnUtc",
			header: "Uploaded On",
			body: uploadedOnBodyTemplate,
			sortable: true,
		},
		{
			field: "createdName",
			header: "Uploaded By",
			sortable: true,
		},
		{
			field: "interviewerEmployeeIds",
			header: "Interviewer/ Panel",
			body: interviewerBodyTemplate,
			bodyClassName: "drop-col",
			sortable: true,
		},
		{
			field: "evalutionStatusId",
			header: "Interview Status",
			body: statusBodyTemplate,
			bodyClassName: "drop-col",
			sortable: true,
		},
		{
			field: "evalutionStatus",
			header: "Interview Feedback",
			body: feedbackBodyTemplate,
		},
		{
			field: "attachment",
			header: "Attachment",
			body: attachmentBodyTemplate,
		},
		{
			header: "Action",
			body: actionBodyTemplate,
			bodyClassName: "int-edit-col",
		},
	];
	return (
		<Dialog
			//header={"Interview Summary- MRF ID:   " +interviewData[0]?.referenceNo +" Position Title: "+interviewData[0]?.positionTitle}
			header={
				<div>
				   Interview Summary- MRF ID:{"\u00A0\u00A0"}
				  <span style={{ fontWeight: 'bold', color: '#d9362b' }}>
					{interviewData[0]?.referenceNo}
				  </span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
				  Position Title:{"\u00A0\u00A0"}
				  <span style={{ fontWeight: 'bold', color: '#d9362b' }}>
				  {interviewData[0]?.positionTitle}</span>
				</div>
			  }
			visible={visible}
			onHide={onHide}
			draggable={false}
			className="int-card"
		>
			<DataTable
				value={interviewData}
				paginator={interviewData.length > 10}
				removableSort
				rows={10}
				scrollable
				scrollHeight="flex"
			>
				{columns.map((col) => (
					<Column
						field={col.field}
						header={col.header}
						body={col.body}
						bodyClassName={"int-col " + col.bodyClassName}
						sortable={col.sortable}
					/>
				))}
			</DataTable>
			<ToastMessages ref={toastRef} />
		</Dialog>
	);
};

export default InterviewSummary;
