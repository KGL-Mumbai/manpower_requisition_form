import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ToastMessages from "../components/ToastMessages";
import "../css/ResumeSummary.css";
import "../css/InterviewSummary.css";
import MultiSelectDropdown from "../components/multiselectDropdown";
import { API_URL, FILE_URL, ROLES } from "../constants/config";
import {
  changeDateFormat,
  getDataAPI,
  putData,
  strToArray,
  CANDIDATE_STATUS_FOR_DISABLE,
  MRF_STATUS_FOR_DISABLE,
  resumeBodyTemplate,
  navigateTo,
} from "../constants/Utils";
import { InputTextarea } from "primereact/inputtextarea";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";

const ResumeSummary = ({
  roleId = null,
  /*  visible,
   onHide, */
  /* mrfId = null, */
  dashboard = true,
  userId = null,
}) => {
  const [data, setdata] = useState([]);
  const [resumeReviewer, setResumeReviewer] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const toastRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mrfId, setMrfId] = useState(0);
  const [visible, setVisible] = useState(false);

  const { locationParams } = useSelector((state) => state.page);

  useEffect(() => {
    if (locationParams && locationParams.length > 0) {
      setMrfId(locationParams[0].mrfId);
    } else {
      setMrfId(0)
    }
  }, [])
  useEffect(() => {
    if (roleId === ROLES.resumeReviwer && mrfId !== 0) {
      navigateTo("dashboard");
      return;
    }
    if (mrfId || mrfId === 0) {
      fetchData();
    }
  }, [mrfId, roleId]);

  const fetchData = async () => {
    try {
      let result = await getDataAPI(
        `${API_URL.RESUME_SUMMARY_POPUP}id=${mrfId}&DashBoard=${dashboard}&roleId=${roleId}&userId=${userId}`
      );
      let response = await result.json();
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
      // let array = new Array(response.result.resumeDetails.length).fill(false);
      // setSaveBttn(array);

      if (roleId != ROLES.resumeReviwer && MRF_STATUS_FOR_DISABLE(roleId, response.result.resumeDetails[0]?.mrfStatus)) {
        setVisible(true);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
    if (
      roleId === ROLES.hr ||
      roleId === ROLES.resumeReviwer ||
      roleId === ROLES.interviewer
    ) {
      if (!rowData.resumeReviewerName) {
        return (
          <div>
            <p className="resume-col">To be Updated</p>
          </div>
        );
      }

      return (
        <div>
          <p className="resume-col">{rowData.resumeReviewerName}</p>
        </div>
      );
    } else {
      return (
        <div>
          <MultiSelectDropdown
            id="resumeReviewerEmployeeIds"
            value={arrayToObj(
              resumeReviewer,
              strToArray(rowData.resumeReviewerEmployeeIds)
            )}
            onChange={(e) => {
              // let resumeReviewers = JSON.parse(JSON.stringify(data));
              // let sv = [...saveBttn];
              // sv[options.rowIndex] = e.value.length > 0 ? true : false;
              // resumeReviewers[options.rowIndex].resumeReviewerEmployeeIds =
              //   objToArray(e.value);
              // setSaveBttn(sv);

              let resumeReviewers = [...data],
                index = resumeReviewers.indexOf(rowData),
                oCurrentData = resumeReviewers[index];

              oCurrentData.resumeReviewerEmployeeIds = objToArray(e.value).toString();
              oCurrentData.actionBtnEnable = e.value.length > 0 ? true : false;
              resumeReviewers[index] = oCurrentData;

              setdata(resumeReviewers);
            }}
            options={resumeReviewer}
            optionLabel="name"
            filter
            placeholder="Select Reviewer"
            className="w-full md:w-20rem "
            disable={
              MRF_STATUS_FOR_DISABLE(roleId, rowData.mrfStatus) ||
              CANDIDATE_STATUS_FOR_DISABLE(roleId, rowData.candidateStatusId)
            }
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
    // const onClickHandleSave = () => {
    //   update(rowData);
    //   let sv = [...saveBttn];
    //   sv[options.rowIndex] = false;
    //   setSaveBttn(sv);
    // };
    if (rowData && rowData.actionBtnEnable) {
      return (
        <Button
          icon="pi pi-save "
          className="action_btn"
          onClick={() => {
            update(rowData);
          }}
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
    const updatedOnUtc = new Date().toISOString();
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
      updatedOnUtc
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
        data.actionBtnEnable = false;
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


  const reasonTemplate = (resume) => {
    // console.log(resume);

    if (
      !resume.reason &&
      (resume.candidateStatusId === 1 || resume.candidateStatusId === 4)
    ) {
      return <p className="resume-reason-col">To be Updated</p>;
    } else if (
      !resume.reason &&
      (resume.candidateStatusId === 2 || resume.candidateStatusId === 3)
    ) {
      return (
        <p className="resume-reason-col" style={{ textAlign: "center" }}>
          {" "}
          _
        </p>
      );
    } else {
      return (
        <InputTextarea
          readOnly={true}
          value={resume.reason}
          rows={2}
          cols={50}
        />
      );
    }

    // if (resume.candidateStatusId === 1 || resume.candidateStatusId === 3) {
    //   return <p className="resume-reason-col">To be Updated</p>;
    // } else if (true) {
    // }
    // return (
    //   <InputTextarea readOnly={true} value={resume.reason} rows={2} cols={50} />
    //   // <p className="resume-reason-col">{resume.reason}</p>
    // );
  };

  let columns = [
    {
      field: "referenceNo",
      header: "Sr. No.",
      body: (data, options) => options.rowIndex + 1,
      bodyClassName: "sr_No ",
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
      field: "createdName",
      header: "Uploaded By",
      bodyClassName: "resume-ref-col resume-col",
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
      // sortable: true,
    },
    {
      field: "candidatestatus",
      header: "Resume Status",
      bodyClassName: " resume-col",
      // sortable: true,
    },
    {
      field: "reason",
      header: "Reason",
      body: reasonTemplate,
      bodyClassName: "resume-reason-col resume-col",
      // sortable: true,
    },
    {
      header: "Action",
      bodyClassName: "mrfdraft-col ",
      body: actionBodyTemplate,
      // sortable: true,
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
    return (
      <>
        <DataTable
          value={value}
          paginator={value.length > 5}
          rows={10}
          scrollable
          showGridlines
          draggable={false}
          rowsPerPageOptions={[5, 10, 25, 50]}
          scrollHeight="flex"
          className="resumeSummary_table"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
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
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
      >
        <h3>This MRF ID  <span style={{ fontWeight: "bold", color: "#d9362b" }}>
          {data[0]?.referenceNo}
        </span> is {data[0]?.mrfStatusName} </h3>
      </Dialog>

      {/* if roleId is equal to this then it will show dialog box otherwise show data table*/}
      {roleId != ROLES.resumeReviwer && (
        <div className="resume_summary_cont">
          <h3 className="dashboard_title"><a className="breadcrum_link" href="#/dashboard">My Dashboard</a> / Resume Summary- MRF ID:{"\u00A0\u00A0"}
            <span style={{ fontWeight: "bold", color: "#d9362b" }}>
              {data[0]?.referenceNo}
            </span>
            {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
            Position Title:{"\u00A0\u00A0"}
            <span style={{ fontWeight: "bold", color: "#d9362b" }}>
              {data[0]?.positionTitle}
            </span>
          </h3>
          {/* <Dialog
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
          > */}

          <DataTable
            value={data}
            paginator={data.length > 10}
            rows={10}
            scrollable
            draggable={false}
            showGridlines
            rowsPerPageOptions={[5, 10, 25, 50]}
            // scrollHeight="flex"
            className="resumeSummary_table"
          >
            {columns.map((col, index) => (
              <Column
                key={index}
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
          {/*  </Dialog> */}
        </div>
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
