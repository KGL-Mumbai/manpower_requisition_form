import { useEffect, useState, useRef } from "react";
// import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import DropdownComponent from "../components/Dropdown";
import MultiSelectDropdown from "../components/multiselectDropdown";
import InterviewFeedbackComponent from "../containers/InterviewFeedbackComponent";
import { API_URL, FILE_URL, MRF_STATUS, ROLES } from "../constants/config";
import { storageService } from "../constants/storage";
import ToastMessages from "../components/ToastMessages";
import {
  changeDateFormat,
  arrayToObj,
  objToIntArray,
  getData,
  strToArray,
  putData,
  CANDIDATE_STATUS_FOR_DISABLE,
  MRF_STATUS_FOR_DISABLE,
  postData,
  getDataAPI,
  INTERVIEW_EVALUATION_FOR_DISABLE,
  resumeBodyTemplate,
} from "../constants/Utils";
import "../css/InterviewSummary.css";
import AssignmentUpload from "../containers/AssignmentUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";

//const roleId = 3;

const uploadedOnBodyTemplate = (interview) => {
  return changeDateFormat(interview.createdOnUtc);
};



//summary component
const InterviewSummary = ({
  roleId = null,
 /*  visible,
  onHide,
  mrfId = null, */
  userId = null,
}) => {
  const [interviewData, setInterviewData] = useState([]);
  const [interviewStatus, setInterviewStatus] = useState([]);
  const [interviewerData, setInterviewerData] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const [showFeed, setShowFeed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [updateField, setupdateField] = useState([]);
  const [updateData, setUpdateData] = useState();
  const [showUploadAssignment, setshowUploadAssignment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlag, setIsFlag] = useState();
  const [candidateInterviewDetails, setCandidateInterviewDetails] = useState(
    {}
  );
  const {locationParams} = useSelector((state)=> state.page);
  const [mrfId, setMrfId] = useState(0);
  const toastRef = useRef(null);
const [visible,setVisible]=useState(false);

  async function getIntData() {
    const apiUrl =
      API_URL.INTERVIEW_SUMMARY_POPUP +
      `?id=${mrfId}&DashBoard=true&roleId=${roleId}&userId=${userId}`;
    let response = await getData(apiUrl);
    const data = response.result;
    let arr = new Array(data.interviewDetails.length).fill(false);
    var filterInterviewerResumtSumData = [];
    data.interviewDetails.map((res) => {
      if (res.candidateStatusId === 2) {
        if(MRF_STATUS_FOR_DISABLE(roleId, res.mrfStatusId) ||
          INTERVIEW_EVALUATION_FOR_DISABLE(
            roleId,
            res.evalutionStatusId
          )){
            res.disable = true;
          }else{
            res.disable = false;
          }
         
        filterInterviewerResumtSumData.push(res);
      }
    });
    setInterviewData(filterInterviewerResumtSumData);
    setInterviewStatus(data.interviewstatus);
    setInterviewerData(data.interviewReviewer);
    setSaveBttn(arr);
   
    if(MRF_STATUS_FOR_DISABLE(roleId,filterInterviewerResumtSumData[0]?.mrfStatusId)){
      setVisible(true);
    }

  }
  useEffect(() => {
    if(locationParams && locationParams.length > 0){
      setMrfId(locationParams[0].mrfId);
    }else{
      setMrfId(0);
    }
  }, [])
  useEffect(() => {
    if (mrfId) {
      getIntData();
    }
  }, [mrfId, roleId]);

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
    const createdOnUtc = data.createdOnUtc;
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
    // updateInterviewer(interviewDetailsData);
    //updateInterviewStatus(id, updateStatus);
    //return;
   
    try {

      if(updateField[1]) {
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
    
      if (updateField[0]) {
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
          toastRef.current.showBadRequestMessage(
            "Interviewer Not updated successfully!"
          );
          setIsLoading(false);
        }
      } }catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
      
    refreshParentComponent();
  };

  const updateInterviewer = async(interviewDetailsData)=>{
    console.log("interview")
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
      toastRef.current.showBadRequestMessage(
        "Interviewer Not updated successfully!"
      );
      setIsLoading(false);
    }
  }
  const updateInterviewStatus = async(id, updateStatus) =>{
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

  const refreshParentComponent = () => {
    getIntData();
  };


  const statusBodyTemplate = (interview, options) => {

    const handleDropdownChange = (e) => {
      let interviewDataCopy = [...interviewData],
      index = interviewDataCopy.indexOf(interview),
      oCurrentData = interviewDataCopy[index];
    
      oCurrentData.evalutionStatusId = e.target.value;
      oCurrentData.actionBtnEnable = true;
      interviewDataCopy[index] = oCurrentData;


      // let sv = [...saveBttn];
      // sv[options.rowIndex] = interview.interviewerEmployeeIds.length>0? true:false;
      // interviewDataCopy[options.rowIndex].evalutionStatusId = e.target.value;
      // setSaveBttn(sv);
      setInterviewData(interviewDataCopy);
      updateField[1]=true;
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
          // disable={
          //   MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId) ||
          //   INTERVIEW_EVALUATION_FOR_DISABLE(
          //     roleId,
          //     interview.evalutionStatusId
          //   )
          // }
          // disable={isFlag[options.rowIndex]}
          disable={interview.disable}
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
        // disable={
        //   MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId) ||
        //   INTERVIEW_EVALUATION_FOR_DISABLE(roleId, interview.evalutionStatusId)
        // }
        // disable={isFlag[options.rowIndex]}
        disable={interview.disable}
      />
    );
  };

  const onUploadAssginmentClick = (interview) => {
    setCandidateInterviewDetails(interview);
    setshowUploadAssignment(true);
  };

  const attachmentBodyTemplate = (interview,options) => {
    if (interview.attachment) {
      let date=interview.createdOnUtc.substring(0, 10);
      let attachmentLink;
      const fileExtension = interview.attachment.split(".").pop().toLowerCase();

      if (fileExtension === "docx") {
        // attachmentLink = `ms-word:ofe|u|${encodeURIComponent(FILE_URL.ASSIGNMENT + interview.attachment)}`;
        // attachmentLink = `https://docs.google.com/viewer?url=${encodeURIComponent(FILE_URL.ASSIGNMENT + interview.attachment)}`;
        attachmentLink = FILE_URL.ASSIGNMENT +interview.attachment;
       
        return (
          <a href={attachmentLink} target="_blank" className="int-link-cell">
            View Attachment
          </a>
        );
      } else {
        attachmentLink = interview.attachment;
        return (
          <a href={attachmentLink} target="_blank" className="int-link-cell">
            View URL
          </a>
        );
      }
    } else if (
      (roleId === ROLES.hr || roleId === ROLES.mrfOwner) &&
      interview.interviewevaluationId != 0
    ) {

      // if(MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId)){
      //   console.log("uuuuuu")

      // }else{
      return (
        <div className="assignment_upload">
          <a
            // className="int-link-cell "
            className={`int-link-cell ${interview.disable ? 'disabled' : ''}`}
                          onClick={(e) => {
                if (!interview.disable) {
                  onUploadAssginmentClick(interview);
                }
             
            }}
          >
            Upload Assignment
          </a>
        </div>
      );
    // }
    } else {
      return <p> N/A</p>;
    }
  };

  const interviewerBodyTemplate = (interview, options) => {
    if (roleId === ROLES.hr) {
      return <div>{interview.interviewerName}</div>;
    } else {
      const handleMultiSelectChange = (e) => {
        let interviewDataCopy = [...interviewData],
        index = interviewDataCopy.indexOf(interview),
        oCurrentData = interviewDataCopy[index];
    
      oCurrentData.interviewerEmployeeIds = objToIntArray(e.value, "employeeId").toString();
      oCurrentData.actionBtnEnable =  e.value.length > 0 ? true : false;
      interviewDataCopy[index] = oCurrentData;

        // let sv = [...saveBttn];
        // sv[options.rowIndex] = e.value.length > 0 ? true : false;
        // interviewDataCopy[options.rowIndex].interviewerEmployeeIds =
        //   objToIntArray(e.value, "employeeId").toString();
        //   setSaveBttn(sv);
          // setupdateField(updateField[0]=true); //check if field is updated
          setInterviewData(interviewDataCopy);
        updateField[0]=true;
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
          // disable={
          //   MRF_STATUS_FOR_DISABLE(roleId, interview.mrfStatusId) ||
          //   INTERVIEW_EVALUATION_FOR_DISABLE(
          //     roleId,
          //     interview.evalutionStatusId
          //   )
          // }
          // disable={isFlag[options.rowIndex]}
          disable={interview.disable}
        />
      );
    }
  };

  const feedbackBodyTemplate = (interview,options) => {
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
            // disable={isFlag[options.rowIndex]}
            disable={interview.disable}
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

    if (interview && interview.actionBtnEnable) {
      return (
        <Button
          icon="pi pi-save "
          className="action_btn"
          onClick={() => {
            update(interview);
          }}
          // onClick={onClickHandleSave}
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
      bodyClassName: "sr_No ",
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
      // sortable: true,
    },
    {
      field: "evalutionStatusId",
      header: "Interview Status",
      body: statusBodyTemplate,
      bodyClassName: "drop-col",
      // sortable: true,
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
    <>
    {/* <Dialog
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
    > */}

     <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      draggable={false}
    >
      <h3>This MRF ID  <span style={{ fontWeight: "bold", color: "#d9362b" }}>
            {interviewData[0]?.referenceNo} 
          </span> is {interviewData[0]?.mrfStatusName} </h3>
      
      </Dialog>

     <div className="interview_summary_cont">
        <h3 className="dashboard_title"><a className="breadcrum_link" href="#/dashboard">My Dashboard</a> / Interview Summary- MRF ID:{"\u00A0\u00A0"}
          <span style={{ fontWeight: "bold", color: "#d9362b" }}>
            {interviewData[0]?.referenceNo}
          </span>
          {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          Position Title:{"\u00A0\u00A0"}
          <span style={{ fontWeight: "bold", color: "#d9362b" }}>
            {interviewData[0]?.positionTitle}
          </span></h3>
        <DataTable
          value={interviewData}
          paginator={interviewData.length > 10}
          removableSort
          rows={10}
          scrollable
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]} 
          // scrollHeight="flex"
          className="interviewSummary_table"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
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
    {/* </Dialog> */}
      </div>
    </>
  );
};

export default InterviewSummary;
