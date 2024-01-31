import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import DropdownComponent from "../components/Dropdown";
import MultiSelectDropdown from "../components/multiselectDropdown";
import InterviewFeedbackComponent from "../containers/InterviewFeedbackComponent";
import {
	API_URL,
	FILE_URL,
	MRF_STATUS_FOR_DISABLE,
	ROLES,
} from "../constants/config";
import { storageService } from "../constants/storage";
import ToastMessages from "../components/ToastMessages";
import {
	changeDateFormat,
	arrayToObj,
	objToIntArray,
	getData,
	strToArray,
	putData,
	postData,
	getDataAPI,
} from "../constants/Utils";
import "../css/InterviewSummary.css";
import AssignmentUpload from "../containers/AssignmentUpload";
import LoadingSpinner from "../components/LoadingSpinner";


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

//summary component
const InterviewSummary = ({
	roleId = null,
	visible,
	onHide,
	mrfId = null,
	userId = null,
}) => {
	const [interviewData, setInterviewData] = useState([]);
	const [interviewStatus, setInterviewStatus] = useState([]);
	const [interviewerData, setInterviewerData] = useState([]);
	const [saveBttn, setSaveBttn] = useState([]);
	const [showFeed, setShowFeed] = useState(false);
	const [selectedId, setSelectedId] = useState(null);
	const [updateField, setupdateField] = useState("");
	const [showUploadAssignment, setshowUploadAssignment] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [candidateInterviewDetails, setCandidateInterviewDetails] = useState(
		{}
	);
	const toastRef = useRef(null);

	async function getIntData() {
		const apiUrl =
			API_URL.INTERVIEW_SUMMARY_POPUP +
			`?id=${mrfId}&DashBoard=true&roleId=${roleId}&userId=${userId}`;
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
		setIsLoading(true);
		const id = data.interviewevaluationId;
		const candidateId = data.candidateId;
		const interviewerEmployeeIds = data.interviewerEmployeeIds;
		const evaluationDateUtc = data.evaluationDateUtc;
		const evalutionStatusId = data.evalutionStatusId;
		const updatedByEmployeeId = storageService.getData("profile").employeeId;
		const createdByEmployeeId = storageService.getData("profile").employeeId;
		const updatedOnUtc = new Date().toISOString();
		const createdOnUtc = new Date().toISOString();
		const fromTimeUtc = "15:00:00";
		const toTimeUtc = "15:00:00";
		const interviewDetailsData = {
			candidateId,
			interviewerEmployeeIds,
			evalutionStatusId,
			evaluationDateUtc,
			updatedByEmployeeId,
			createdByEmployeeId,
			updatedOnUtc,
			createdOnUtc,
			fromTimeUtc,
			toTimeUtc,
		};

		const updateStatus = {
			id,
			candidateId,
			evalutionStatusId,
			updatedByEmployeeId,
			updatedOnUtc,
		};

		try {
			if (updateField === "interviewer") {
				//post on interviwer change
				let response = await postData(
					`${API_URL.INTERVIEW_EVALUATION}`,
					interviewDetailsData
				);

				if (response.ok) {
					const responseData = response.json();
					if (responseData.statusCode === 409) {
						toastRef.current.showConflictMessage(responseData.message);
					} else {
						toastRef.current.showSuccessMessage(
							"Interviewer updated successfully!"
						);
					}
					setIsLoading(false);
				} else {
					console.error("Request failed with status:", response.status);
					const errorData = await response.text();
					console.error("Error Data:", errorData);
					if (response.status === 400) {
						toastRef.current.showBadRequestMessage(
							"Bad request: " + response.url
						);
					}
					setIsLoading(false);
				}
			} else {
				let response = await putData(
					`${API_URL.INTERVIEW_EVALUATION}${id}`,
					updateStatus
				);

				if (response.ok) {
					const responseData = await response.json();
					if (responseData.statusCode === 409) {
						toastRef.current.showConflictMessage(responseData.message);
					} else {
						toastRef.current.showSuccessMessage(
							" Interview status updated successfully!"
						);
					}
					setIsLoading(false);
				} else {
					console.error("Request failed with status:", response.status);
					const errorData = await response.text();
					console.error("Error Data:", errorData);
					if (response.status === 400) {
						toastRef.current.showBadRequestMessage(
							"Bad request: " + response.url
						);
					}
					setIsLoading(false);
				}
			}
		} catch (error) {
			console.error("Error:", error);
			setIsLoading(false);
		}

		refreshParentComponent();
	};
	const refreshParentComponent = () => {
		getIntData();
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
			if (interview.evalutionStatusId != 0) {
				let is = interviewStatus.filter(
					(x) => x.id === interview.evalutionStatusId
				);
				return <p className="drop-width">{is[0].status}</p>;
			} else {
				return (
					<p className="drop-width">
						{"\u00A0\u00A0\u00A0\u00A0"}
						{"N/A"}
					</p>
				);
			}
		}

		//dropdown filter
		if ([ROLES.interviewer, ROLES.hr].includes(roleId)) {
			let filterOption = interviewStatus.filter((x) => x.roleId === roleId);
			let opt = filterOption.find((x) => x.id === interview.evalutionStatusId);
			if (opt == null) {
				opt = interviewStatus.find((x) => x.id === interview.evalutionStatusId);
				if (opt != null) {
					filterOption.push(opt);
				}
			}
			return (
				<DropdownComponent
					optionLabel="status"
					optionValue="id"
					className="drop-width"
					options={filterOption}
					value={interview.evalutionStatusId}
					onChange={handleDropdownChange}
					disable={MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId)}
				/>
			);
		}

		return (
			<DropdownComponent
				optionLabel="status"
				optionValue="id"
				className="drop-width"
				options={interviewStatus}
				value={interview.evalutionStatusId}
				onChange={handleDropdownChange}
				disable={MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId)}
			/>
		);
	};

	const onUploadAssginmentClick = (interview) => {
		setCandidateInterviewDetails(interview);
		setshowUploadAssignment(true);
	};

	const attachmentBodyTemplate = (interview) => {
		

		if (interview.attachment) {
			let attachmentLink;
			const fileExtension = interview.attachment.split('.').pop().toLowerCase();
			
			if ( fileExtension === 'docx') {
				// attachmentLink = `ms-word:ofe|u|${encodeURIComponent(FILE_URL.ASSIGNMENT + interview.attachment)}`;
				// attachmentLink = `https://docs.google.com/viewer?url=${encodeURIComponent(FILE_URL.ASSIGNMENT + interview.attachment)}`;
				attachmentLink = FILE_URL.ASSIGNMENT + interview.attachment;
				//alert(attachmentLink);
				return (
					<a href={attachmentLink} target="_blank"  className="int-link-cell">
						View Attachment
					</a>
				);
			} else {
				attachmentLink = interview.attachment;
				return (
					<a href={attachmentLink} target="_blank"  className="int-link-cell">
						View URLs
					</a>
					
				);
			}
		} else if (roleId === ROLES.hr && interview.interviewevaluationId != 0) {
			return (
				<div>
					<a
						className="int-link-cell"
						onClick={(e) => {
							onUploadAssginmentClick(interview);
						}}
					>
						Upload Assignment
					</a>
				</div>
			);
		} else {
			return <p> N/A</p>;
		}
	};

	const interviewerBodyTemplate = (interview, options) => {
		if (roleId === ROLES.hr) {
			return <div>{interview.interviewerName}</div>;
		} else {
			const handleMultiSelectChange = (e) => {
				let interviewDataCopy = [...interviewData];
				let sv = [...saveBttn];
				sv[options.rowIndex] = e.value.length > 0 ? true : false;
				interviewDataCopy[options.rowIndex].interviewerEmployeeIds =
					objToIntArray(e.value, "employeeId").toString();
				setInterviewData(interviewDataCopy);
				setSaveBttn(sv);
				setupdateField("interviewer"); //check if field is updated
			};

			return (
				<MultiSelectDropdown
					
					id="interviewerEmployeeIds"
					options={interviewerData}
					value={arrayToObj(
						interviewerData,
						strToArray(interview.interviewerEmployeeIds),
						"employeeId"
					)}
					onChange={handleMultiSelectChange}
					optionLabel="name"
					placeholder="Select Interviewer"
					className="w-full md:w-20rem"
					// optionValue="employeeId"
					disable={MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId)}
				/>
			);
		}
	};

	const feedbackBodyTemplate = (interview) => {
		// if (roleId !== ROLES.interviewer && interview.evalutionStatusId < 5)
		// 	return "To be updated";
		if (interview.interviewevaluationId == 0) return "To be updated";

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
						roleId={roleId}
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
			return (
				<Button
					icon="pi pi-save "
					className="action_btn"
					onClick={onClickHandleSave}
				/>
			);
		}
		return <Button icon="pi pi-save" className="action_btn" disabled />;
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
			header: "Assignment",
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
					<span style={{ fontWeight: "bold", color: "#d9362b" }}>
						{interviewData[0]?.referenceNo}
					</span>
					{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
					Position Title:{"\u00A0\u00A0"}
					<span style={{ fontWeight: "bold", color: "#d9362b" }}>
						{interviewData[0]?.positionTitle}
					</span>
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
			{setshowUploadAssignment && (
				<AssignmentUpload
					visible={showUploadAssignment}
					data={candidateInterviewDetails}
					onHide={() => setshowUploadAssignment(false)}
					refreshParent={refreshParentComponent}
				/>
			)}
{isLoading && <LoadingSpinner />}  
			<ToastMessages ref={toastRef} />
		</Dialog>
	);
};

export default InterviewSummary;
