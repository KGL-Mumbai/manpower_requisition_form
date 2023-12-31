import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ToastMessages from "./ToastMessages";
import "../css/ResumeSummary.css";
import "../css/InterviewSummary.css";
import MultiSelectDropdown from "./multiselectDropdown";
import { API_URL, FILE_URL,ROLES } from "../constants/config";
import { changeDateFormat, strToArray } from "../constants/Utils";


const ResumeSummary = ({roleId =null, visible, onHide, mrfId = null, dashboard = true,userId=null}) => {
  const [data, setdata] = useState([]);
  const [resumeReviewer, setResumeReviewer] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const toastRef = useRef(null);

  useEffect(() => {
    if (mrfId) {
      fetchData();
    }
  }, [mrfId]);

  const fetchData = () => {
    try {
      fetch(`${API_URL.RESUME_SUMMARY_POPUP}id=${mrfId}&DashBoard=${dashboard}&roleId=${roleId}&userId=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setdata(data.result.resumeDetails);
          setResumeReviewer(data.result.employeeRoleMap);
          let array = new Array(data.result.resumeDetails.length).fill(false);
          setSaveBttn(array);
          
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
   
  if (data.length < 1) {
    return (
      <Dialog
        header="MRF ID (Interview Summary)"
        visible={visible}
        onHide={onHide}
        draggable={false}
        className="int-card no-res-card"
      >
        No Result Found
      </Dialog>
    );
  }
  const MultiSelectDrop = (rowData, options) => {
    console.log(rowData);
    if (roleId === ROLES.hr || roleId === ROLES.interviewer) {
      // Return a simple date or any other content for this role
      return (
        <div>
          {rowData.resumeReviewerName}
        </div>
      );
    } else 
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
      return <Button icon="pi pi-save " onClick={onClickHandleSave} />;
    }
    return <Button icon="pi pi-save" disabled />;
  };
  const update = async (data) => {
    console.log(data);
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
    const candidateName=data.candidateName;

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
      const response = await fetch(`${API_URL.RESUME_SUMMARY_POST}${id}`, {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateDetailsData),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.statusCode === 409) {
          toastRef.current.showConflictMessage(responseData.message);
        } else {
          toastRef.current.showSuccessMessage(
            "Resume Reviewers updated successfully!"
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
   const reasonTemplate=(resume)=>{
if(!resume.reason ) return "To be Updated";

return(
  <p className="resume-reason-col">{resume.reason}</p>
)
      }
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
      bodyClassName: "resume-ref-col resume-col",
			sortable: true,
		},
    {
      field: "resumePath",
      header: "Resume",
      body: resumeBodyTemplate,
      bodyClassName: "resume-ref-col  ",
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
      bodyClassName: "resume-ref-col  ",
      sortable: true,
    },
    {
      field: "reason",
      header: "Reason",
      body: reasonTemplate,
      bodyClassName: "resume-reason-col",
      sortable: true,
    },
    {
      header: "Action",
      bodyClassName: "mrfdraft-col ",
      body: actionBodyTemplate,
      sortable: true,
    },
  ];
  
  if (roleId === ROLES.hr || roleId === ROLES.interviewer) {
    columns = columns.filter(column => column.header !== "Action");
   };
  return (
    <div>
       
      <Dialog
       header={
        <div>
           Resume Summary- MRF ID:{"\u00A0\u00A0"}
          <span  style={{ fontWeight: 'bold', color: '#d9362b' }}>
            {data[0].referenceNo}
          </span>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          Position Title:{"\u00A0\u00A0"}
          <span style={{ fontWeight: 'bold', color: '#d9362b' }}>
          {data[0].positionTitle}</span>
        </div>
      }
      // header={"Resume Summary- MRF ID:  "+data[0].referenceNo+"  "+" "+" Position Title: "+data[0].positionTitle+" "}
        visible={visible}
        className="resume-card"
        onHide={onHide}
        draggable={false}
      >
        <DataTable
          value={data}
          paginator={data.length > 10}

          rows={10}
          scrollable
          scrollHeight="400px"
          draggable={false}
        >
           {columns.map((col) => (
              <Column
                field={col.field}
                header={col.header}
                body={col.body}
                bodyClassName={col.bodyClassName}
                sortable={col.sortable}
              />
            ))}
            </DataTable>
         
          
  <ToastMessages ref={toastRef} />
      </Dialog>
      
    </div>
  );
};

export default ResumeSummary;
