
import React, { useState, useEffect, useRef } from "react";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../css/InputComponent.css";
import "../css/MyResume.css";
import { navigateTo, putData } from "../constants/Utils";
import { API_URL, FILE_URL, MRF_STATUS_FOR_DISABLE, ROLES } from "../constants/config";
import {
  arrayToObj,
  objToIntArray,
  getData,
  strToArray,
} from "../constants/Utils";
import ToastMessages from "../components/ToastMessages";
import InputTextareaComponent from "../components/InputTextarea";
import MultiSelectDropdown from "../components/multiselectDropdown";
import DropdownComponent from "../components/Dropdown";
import ButtonC from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
const MyResume = ({roleId =null, mrfId =  0, userId=null}) => {
  const [statusData, setStatusData] = useState({});
  const [forwardData, setForwardData] = useState({});
  const [values, setValues] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const toastRef = useRef(null);
  const [isFlag,setIsFlag]=useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getResumeData();
  }, []);
 
  async function getResumeData() {
    const resumeData = await getData(API_URL.GET_MYRESUME+ "?id=0&roleId=" + roleId + "&userId=" + userId);
    if (roleId === ROLES.resumeReviwer) {
      var filterInterviewerResumtSumData = [];
      resumeData.result.candidateDetails.map(( res) => {
          if (!MRF_STATUS_FOR_DISABLE(roleId,res.mrfStatus)) {
            filterInterviewerResumtSumData.push(res)
          }
      })
      setValues(filterInterviewerResumtSumData);
      setForwardData(resumeData.result.resumereviewer);
      setStatusData(resumeData.result.status);
      const isFlagArray = resumeData.result.candidateDetails.map((res) => res.candidateStatusId === 2 || res.candidateStatusId === 3);
      setIsFlag(isFlagArray);
    }
    else{
      setValues(resumeData.result.candidateDetails);
      setForwardData(resumeData.result.resumereviewer);
      setStatusData(resumeData.result.status);
    }
   
  }
  const SingleSelect = (data, options) => {
    const handleDropdownChange = (e) => {
      let statusdataCopy = [...values];
      let sv = [...saveBttn];
      sv[options.rowIndex] = true;
      statusdataCopy[options.rowIndex].candidateStatusId = e.target.value;
      setValues(statusdataCopy);
      setSaveBttn(sv);
    };
    return (
      <DropdownComponent
        optionLabel="status"
        optionValue="id"
        className="w-full md:w-15rem"
        options={statusData}
        disable={isFlag[options.rowIndex]}
        value={data.candidateStatusId}
        placeholder={"Select Status"}
        onChange={handleDropdownChange}
      />
    );
  };
 
  
 
  const MultiSelect = (data, options) => {
    const handleMultiSelectChange = (e) => {
      let interviewDataCopy = [...values];
      let sv = [...saveBttn];
      sv[options.rowIndex] = e.value.length > 0 ? true : false;
      interviewDataCopy[options.rowIndex].resumeReviewerEmployeeIds  = objToIntArray(
        e.value,
        "employeeId"
      ).toString();
      setValues(interviewDataCopy);
      setSaveBttn(sv);
    };
 
    return (
      <MultiSelectDropdown
        // className="drop-width"
        options={forwardData}
        value={arrayToObj(
          forwardData,
          strToArray(data.resumeReviewerEmployeeIds
            ),
          "employeeId"
        )}
        placeholder={"Select Resume Reviwer"}
        onChange={handleMultiSelectChange}
        optionLabel="name"
        disable={isFlag[options.rowIndex]}
        className="w-full md:w-15rem"
      
      />
    );
  };
  const updateData = async (rowData) => {
    setIsLoading(true);
    const reviewedByEmployeeIds = rowData.resumeReviewerEmployeeIds;
    const name =  rowData.candidateName; // this because we are handling data in backend it not save as string
    const emailId = "string";
    const id = rowData.candidateId;
    const candidateStatusId = rowData.candidateStatusId;
    const mrfId = rowData.mrfId;
    const contactNo = "string";
    const reason = rowData.reason;
    const resumePath = rowData.resumePath;
    const createdByEmployeeId = rowData.createdByEmployeeId;
    const createdOnUtc = rowData.createdOnUtc;
    const candidateName=rowData.candidateName;
    const candidateDetailsData = {
      id,
      mrfId,
      name,
      contactNo,
      emailId,
      resumePath,
      candidateStatusId,
      reviewedByEmployeeIds,
      createdByEmployeeId,
      createdOnUtc,
      reason,
    };
    let response = await putData(`${API_URL.RESUME_SUMMARY_POST + id}`,candidateDetailsData);
    if (response.ok) {
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      toastRef.current.showSuccessMessage("Update successfully!");
      setTimeout(() => {
        navigateTo("dashboard");
        setIsLoading(false);
      }, 100);
      
    } else {
      console.error("Request failed with status:", response.status);
      if (response.status === 400) {
        toastRef.current.showBadRequestMessage(
          "Bad request: " + response.url
        );
      }
      setIsLoading(false);
    }
  };
 
 
  const textEditor = (data, options) => {
    const TextChange = (e) => {
      let statusdataCopy = [...values];
 
      let sv = [...saveBttn];
      sv[options.rowIndex] = true;
 
      statusdataCopy[options.rowIndex].reason = e.target.value;
 
      setValues(statusdataCopy);
      setSaveBttn(sv);
    };
    return (
      <InputTextareaComponent
      readOnly={isFlag[options.rowIndex]}
        value={data.reason}
        rows={2}  
        cols={55}
        onChange={TextChange}
        placeholder={"Enter Reason"}
 
      />
    );
  };
  const actionBodyTemplate = (rowData, options) => {
    //console.log(rowData);
    if (saveBttn[options.rowIndex]) {
      return (
        <React.Fragment>
          <ButtonC
            icon="pi pi-save"
            rounded
            className="myaction_btn"
            onClick={() => {
              updateData(rowData);
            }}
          />
          <ToastMessages ref={toastRef} />
        </React.Fragment>
      );
    }
    return <ButtonC icon="pi pi-save" disable={true} className="myaction_btn"/>;
 
  };
  const resumeBodyTemplate = (interview) => {
    let resumeLink = FILE_URL.RESUME + interview.resumePath;
    return (
      <a href={resumeLink} target="_blank" className="int-link-cell">
        {interview.resumePath}
      </a>
    );
  };
 
  const columns = [
    {
      header: "Sr. No.",
      body: (data, options) => options.rowIndex + 1,
      //bodyClassName: "int-edit-col",
      bodyClassName: "my_resume-col",
    },
    
    {
      field: "candidateName",
      header: "Name",
      bodyClassName: "my_resume-col",
      sortable: true,
    },
    {
      field: "resumePath",
      header: "Resume",
      body: resumeBodyTemplate,
      sortable: true,
      bodyClassName: "my_resume-col",
    },
   
    {
      field: "candidateStatusId",
      header: "Status",
      body: SingleSelect,
      bodyClassName: "my_resume-col",
      sortable: true,
    },
    {
      field: "reviewedByEmployeeIds",
      header: "Forward To",
      body: MultiSelect,
      bodyClassName: "my_resume-col",
      sortable: true,
    },
    {
      field: "reason",
      header: "Reason",
      body: textEditor,
      sortable: true,
    },
    {
      header: "Action",
      body: actionBodyTemplate,
      bodyClassName: "my_resume-col",
    },
  ];
  return (
    <div className="my-resume">
      <h3 className="my-resume-title">My Resumes</h3>
 
      <div className="my-resume-table">
        <DataTable
          value={values}
          paginator={values.length > 10}
          removableSort
          rows={10}
          scrollable
          scrollHeight="flex"
        >
          {columns.map((col,index) => (
            <Column
              field={col.field}
              header={col.header}
              body={col.body}
 rowClassname={col.rowClassName}
              bodyClassName={"int-col " + col.bodyClassName}
              sortable={col.sortable}
            />
          ))}
 
        </DataTable>
        {isLoading && <LoadingSpinner/>}
      </div>
    </div>
  );
};
export default MyResume;