import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ToastMessages from "../components/ToastMessages";
import "../css/ResumeSummary.css";
import "../css/InterviewSummary.css";
import MultiSelectDropdown from "../components/multiselectDropdown";
import { API_URL, FILE_URL, MRF_STATUS_FOR_DISABLE, ROLES } from "../constants/config";
import { changeDateFormat, getDataAPI, putData, strToArray } from "../constants/Utils";
import { InputTextarea } from "primereact/inputtextarea";
import LoadingSpinner from "../components/LoadingSpinner";

const ResumeSummary = ({
  roleId = null,
  visible,
  onHide,
  mrfId = null,
  dashboard = true,
  userId = null,
}) => {
  const [data, setdata] = useState([]);
  const [resumeReviewer, setResumeReviewer] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const toastRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    const fetchData = async() => {
    try {

      let result=await getDataAPI(`${API_URL.RESUME_SUMMARY_POPUP}id=${mrfId}&DashBoard=${dashboard}&roleId=${roleId}&userId=${userId}`)
let response=await result.json();
          if (roleId === ROLES.interviewer) {
            var filterInterviewerResumtSumData = [];
            response.result.resumeDetails.map((res) => {
              if (res.candidatestatus === "Shortlisted") {
                filterInterviewerResumtSumData.push(res);
              }
            });
            setdata(filterInterviewerResumtSumData);
          } else {
            setdata(response.result.resumeDetails);
          }
          setResumeReviewer(response.result.employeeRoleMap);
          let array = new Array(response.result.resumeDetails.length).fill(false);
          setSaveBttn(array);
        
        
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
  }, [mrfId]);

  

  // if (data.length < 1) {
  //   return (
  //     <Dialog
  //       header="MRF ID (Interview Summary)"
  //       visible={visible}
  //       onHide={onHide}
  //       draggable={false}
  //       className="int-card no-res-card"
  //     >
  //       No Result Found
  //     </Dialog>
  //   );
  // }



  const MultiSelectDrop = (rowData, options) => {
 
    if (roleId === ROLES.hr || roleId === ROLES.resumeReviwer || roleId === ROLES.interviewer ) {
       if(!rowData.resumeReviewerName){
        return (<div><p className="resume-col">To be Updated</p></div>)
       }
      
      return (
        <div>
          <p className="resume-col">{rowData.resumeReviewerName}</p>
        </div>
      );
    } 
    else 
    {
    return (
      <div>
        <MultiSelectDropdown
          id="resumeReviewerEmployeeIds"
          value={arrayToObj(
            resumeReviewer,
            strToArray(rowData.resumeReviewerEmployeeIds)
          )}
          onChange={(e) => {
            let resumeReviewers = JSON.parse(JSON.stringify(data));
            let sv = [...saveBttn];
            sv[options.rowIndex] = e.value.length > 0 ? true : false;
            resumeReviewers[options.rowIndex].resumeReviewerEmployeeIds =
              objToArray(e.value);
            setdata(resumeReviewers);
            setSaveBttn(sv);
          }}
          options={resumeReviewer}
          optionLabel="name"
          filter
          placeholder="Select Reviewer"
          className="w-full md:w-20rem "
          disable={MRF_STATUS_FOR_DISABLE(roleId,rowData.mrfStatus)}
           
        />
      </div>     
    );
  }
};

  const arrayToObj = (options = [], selectedOpt) => {
    if (Array.isArray(selectedOpt)) {
      return options.filter((e) => selectedOpt.includes(e.employeeId));
    }
    // return [selectedOpt];
  };

  const objToArray = (selectedOpt = []) => {
    return selectedOpt.map((e) => e.employeeId);
  };

  const actionBodyTemplate = (rowData, options) => {
    const onClickHandleSave = () => {
      update(rowData);
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
  const update = async (data) => {
    setIsLoading(true);
    const resumeRevierInArray = data.resumeReviewerEmployeeIds;
    const reviewedByEmployeeIds = resumeRevierInArray.toString();
    const name = "string"; // this because we are handling data in backend it not save as string
    const emailId = "string";
    const contactNo = "string";
    const id = data.candidateId;
    const candidateStatusId = data.candidateStatusId;
    const mrfId = data.mrfId;
    const reason = data.reason;
    const resumePath = data.resumePath;
    const createdByEmployeeId = data.createdByEmployeeId;
    const createdOnUtc = data.createdOnUtc;
    const candidateName = data.candidateName;

    const candidateDetailsData = {
      id,
      mrfId,
      name,
      emailId,
      contactNo,
      resumePath,
      candidateStatusId,
      reviewedByEmployeeIds,
      createdByEmployeeId,
      createdOnUtc,
      reason,
      candidateName,
    };

    try {
      let response = await putData(
        `${API_URL.RESUME_SUMMARY_POST}${id}`,
        candidateDetailsData
      );
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.statusCode === 409) {
          toastRef.current.showConflictMessage(responseData.message);
        } else {
          toastRef.current.showSuccessMessage(
            "Resume Reviewers updated successfully!"
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
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const uploadedOnBodyTemplate = (data) => {
    return changeDateFormat(data.createdOnUtc);
  };

  const resumeBodyTemplate = (interview) => {
    let resumeLink = FILE_URL.RESUME + interview.resumePath;
    return (
      <a href={resumeLink} target="_blank" className="int-link-cell">
        {interview.resumePath}
      </a>
    );
  };

  const reasonTemplate = (resume) => {
    if (!resume.reason)
      return <p className="resume-reason-col">To be Updated</p>;
    return (
      <InputTextarea readOnly={true} value={resume.reason} rows={2} cols={50} />
      // <p className="resume-reason-col">{resume.reason}</p>
    );
  };
 
  let columns = [
    {
      header: "Sr.No",
      body: (data, options) => options.rowIndex + 1,
      bodyClassName: " resume-col ",
      sortable: true,
    },
    {
      field: "candidateName",
      header: "Name",
      bodyClassName: " resume-col",
      sortable: true,
    },
    {
      field: "resumePath",
      header: "Resume",
      body: resumeBodyTemplate,
      bodyClassName: " resume-col ",
      sortable: true,
    },
    {
      field: "createdOnUtc",
      header: "Uploaded On",
      body: uploadedOnBodyTemplate,
      bodyClassName: "resume-ref-col resume-col",
      sortable: true,
    },
    {
      field: "resumeReviewerEmployeeIds",
      header: "Resume Reviewers",
      body: MultiSelectDrop,
      bodyClassName: "resume-col resume-ref-col ",
      sortable: true,
    },
    {
      field: "candidatestatus",
      header: "Resume Status",
      bodyClassName: " resume-col",
      sortable: true,
    },
    {
      field: "reason",
      header: "Reason",
      body: reasonTemplate,
      bodyClassName: "resume-reason-col resume-col",
      sortable: true,
    },
    {
      header: "Action",
      bodyClassName: "mrfdraft-col ",
      body: actionBodyTemplate,
      sortable: true,
    },
  ];
  if (
    roleId === ROLES.hr ||
    roleId === ROLES.resumeReviwer ||
    roleId === ROLES.interviewer
  ) {
    columns = columns.filter((column) => column.header !== "Action");
  }

  const DataTableResume = ({ value, columns }) => {

    return (<>
      <DataTable
        value={value}
        paginator={value.length > 5}
        rows={10}
        scrollable
        draggable={false}
        scrollHeight="flex"
      >
        {columns.map((col) => (
          <Column
            field={col.field}
            header={col.header}
            body={col.body}
            bodyClassName={"resume-col" + col.bodyClassName}
            sortable={col.sortable}
          />
        ))}
      </DataTable>
      <ToastMessages ref={toastRef} />
      </>
    );
  };

  return (
    <>
    
      {/* if roleId is equal to this then it will show dialog box otherwise show data table*/}
      {(roleId != ROLES.resumeReviwer) && (
        <>
          <Dialog
            header={
              <div>
                Resume Summary- MRF ID:{"\u00A0\u00A0"}
                <span style={{ fontWeight: "bold", color: "#d9362b" }}>
                  {data[0]?.referenceNo}
                </span>
                {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
                Position Title:{"\u00A0\u00A0"}
                <span style={{ fontWeight: "bold", color: "#d9362b" }}>
                  {data[0]?.positionTitle}
                </span>
              </div>
            }
            visible={visible}
            onHide={onHide}
            draggable={false}
            className="resume-card"
          >
           <DataTable
        value={data}
        paginator={data.length > 5}
        rows={10}
        scrollable
        draggable={false}
        scrollHeight="flex"
      >
        {columns.map((col) => (
          <Column
            field={col.field}
            header={col.header}
            body={col.body}
            bodyClassName={"resume-col" + col.bodyClassName}
            sortable={col.sortable}
          />
        ))}
      </DataTable>
      {isLoading && <LoadingSpinner />}  
      <ToastMessages ref={toastRef} />
          </Dialog>
        </>
      )}

      {roleId === ROLES.resumeReviwer && (
        <>
          <div className="resume-summary-table">
            <DataTableResume value={data} columns={columns} />

          </div>
        </>
      )}
    </>
  );
};

export default ResumeSummary;
