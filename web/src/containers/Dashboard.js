import React, { useEffect, useState } from "react";
import "./../css/Dashboard.css";
import { getData } from "../constants/Utils";
import { API_URL, ROLES } from "../constants/config";
import { storageService } from "../constants/storage";
import InterviewSummary from "../containers/InterviewSummary";
import DashMrfStatus from "../components/DashMrfStatus";
import ResumeSummary from "../containers/ResumeSummary";
import DashBoardDataTable from "../components/DashBoardDataTable";
import InterviewSummaryAllStatus from "../containers/InterviewSummaryAllStatus";
import {
  filterSelectedColumn,
  filterResultGroupByCandidatestatus,
} from "../constants/Utils";
import { Dialog } from "primereact/dialog";
// import HrResumeSummary from "../components/HrResumeSummary";
 
function Dashboard({ roleId, userId }) {
  const [mrfStatus, setMrfStatus] = useState([]);
  const [resumeSummary, setResumeSummary] = useState([]);
  const [interviewSummary, setInterviewSummary] = useState([]);
  const [interviewPopup, setInterviewPopup] = useState(false);
  const [interviewPopupId, setInterviewPopupId] = useState(null);
  const [mrfStatusPopup, setMrfStatusPopup] = useState(false);
  const [mrfStatusPopupId, setrfStatusPopupId] = useState(null);
  const [resumePopup, setResumePopup] = useState(false);
  const [resumePopupId, setResumePopupId] = useState(null);
  const [InterviewStatus, setInterviewStatusPopup] = useState(false);
  useEffect(() => {
    getSummaryData();
  }, []);
  async function getSummaryData() {
    const mrfStatusData = await getData(API_URL.MRF_STATUS_SUMMARY + "?roleId=" + roleId + "&userId=" + userId);
    // const mrfStatusData = API_URL.MRF_STATUS_SUMMARY;
    const resumeSummaryData = await getData(API_URL.RESUME_SUMMARY + "?Count=0&roleId=" + roleId + "&userId=" + userId);
    const interviewSummaryData = await getData(API_URL.INTERVIEW_SUMMARY + "?Count=0&roleId=" + roleId + "&userId=" + userId);
    setMrfStatus(mrfStatusData.result);
 
    if (roleId === ROLES.interviewer) {
      var filterInterviewerResumtSumData = [];
      resumeSummaryData.result.map((data) => {
        data.resultGroups.map((res) => {
          if (res.candidatestatus === "Shortlisted" && res.totalstatusCount > 0) {
            filterInterviewerResumtSumData.push(data)
          }
        })
      })
      setResumeSummary(filterInterviewerResumtSumData);
    } else {
      setResumeSummary(resumeSummaryData.result);
    }
 
    setInterviewSummary(interviewSummaryData.result);
  }
  const interviewSummaryTableData = filterResultGroupByCandidatestatus(
    interviewSummary,
    ["Selected", "Assignment Received", "Onboarded", "Assignment Sent"]
  );
 
  const onMRFIdClicked = (e) => {
    setrfStatusPopupId(e);
    setMrfStatusPopup(true);
  };
 
  const onInterviewMRFIdClicked = (e) => {
    setInterviewPopupId(e);
    setInterviewPopup(true);
  };
  const onResumeMRFIdClicked = (e) => {
    setResumePopupId(e);
    setResumePopup(true);
  };
 
  const mrfIdInterviewRefernceTemplate = (rowData) => {
    return (
      <div>
        <a
          className="btn_mrf_id"
          onClick={(e) => onInterviewMRFIdClicked(rowData.mrfId)}
        >
          {rowData.referenceno}
        </a>
 
      </div>
    );
  };
  const mrfIdResumeRefernceTemplate = (rowData) => {
    return (
      <div>
        <a
          // Make sure to add a unique key for each element in the array
          className="btn_mrf_id"
          onClick={(e) => onResumeMRFIdClicked(rowData.mrfId)}
        >
          {rowData.referenceno}
        </a>
      </div>
    );
  };

  const handlePopupOpen = () => {
    setInterviewStatusPopup(true);
  };
   let resumeSummaryColums = [
    {
      field: "referenceno",
      header: "MRF ID",
      body: mrfIdResumeRefernceTemplate,
      bodyClassName:"dash_status_col_mrfid",
    },
    {
      field: "positionTitle",
      header: "Position Title",
      bodyClassName:"dash_status_col",
    },
    {
      field: "New",
      header: <h5 className="dashborad_table_sub_header">New</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "New"),
      bodyClassName:"dash_status_col",
    },
 
    {
      field: "Shortlisted",
      header: <h5 className="dashborad_table_sub_header">Shortlisted</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Shortlisted"),
      bodyClassName:"dash_status_col",
    },
 
    {
      field: "Rejected",
      header: <h5 className="dashborad_table_sub_header">Rejected</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Rejected"),
      bodyClassName:"dash_status_col",
    },
    {
      field: "On Hold",
      header: <h5 className="dashborad_table_sub_header">On Hold</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "On Hold"),
      bodyClassName:"dash_status_col",
    },
  ];
 
  const interviewSummaryColums = [
    {
      field: "referenceno",
      header: "MRF ID",
      body: mrfIdInterviewRefernceTemplate,
      bodyClassName:"dash_status_col_mrfid",
    },
    {
      field: "positionTitle",
      header: "Position Title",
      // header: <h5 className="dashborad_table_sub_header" >Position Title</h5>,

      bodyClassName:"dash_status_col",
    },
    {
      field: "Selected",
      header: <h5 className="dashborad_table_sub_header" >Selected</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Selected"),
      bodyClassName:"dash_status_col",
    },
    {
      field: "Onboarded",
      header: <h5 className="dashborad_table_sub_header">Onboarded</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Onboarded"),
      bodyClassName:"dash_status_col",
    },
    {
      field: "new",
      header: <h5 className="dashborad_table_sub_header">Assignment Sent</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Assignment Sent"),
      bodyClassName:"dash_status_col",
    },
 
    {
      field: "Assignment Received",
      header: <h5 className="dashborad_table_sub_header">Assignment Received</h5>,
      body: (rowData) => filterSelectedColumn(rowData, "Assignment Received"),
      bodyClassName:"dash_status_col",
    },
  ];
 
  if (roleId === ROLES.interviewer) {
    resumeSummaryColums = resumeSummaryColums.filter(column => column.field !== "New" &&
    column.field !== "Rejected" && column.field !== "On Hold");
   };
   
  return (
    <div className="dashboard_wrapper">
      <h3 className="dashboard_title">My Dashboard</h3>

      {roleId === ROLES.resumeReviwer && (
        <>
          <div className="resume-viwer-table">
            <ResumeSummary roleId={roleId} userId={userId} mrfId={0} />
          </div>
        </>
      )}
      <div className="dashboard_body">
        {(roleId === ROLES.hr || roleId === ROLES.mrfOwner) && (
          <div className="dashboard_body_left">
            <div className="mrf_status_summary">
              <div className="header">
                <h4>MRF Summary</h4>
                <DashMrfStatus
                  visible={mrfStatusPopup}
                  onHide={() => setMrfStatusPopup(false)}
                  statusId={mrfStatusPopupId}
                  userId={userId}
                  roleId={roleId}
                />
              </div>
              <table className="mrf_table">
                <thead>
                  <tr>
                    <th className="table_status">Status</th>
                    <th className="table_count">Total Count</th>
                  </tr>
                </thead>
                <tbody className="mrf_table_body">
                  {mrfStatus.map((data, index) => {
 
                    return (
                      <tr key={"mrf_" + index}>
                        <td>{data.status}</td>
                        <td
                          className={
                            data.totalCount > 0
                              ? "mrf_summary_total_count"
                              : "mrf_summary_total_count count_zero"
                          }
                        >
                          {data.totalCount > 0 && (
                            <a onClick={(e) => onMRFIdClicked(data.mrfStatusId)}>
                              {data.totalCount}
                            </a>
                          )}
                          {data.totalCount === 0 && data.totalCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
)}
       
       {(roleId === ROLES.hr ||
            roleId === ROLES.mrfOwner ||
            roleId === ROLES.interviewer) && (
            <div className="dashboard_body_right">
              <DashBoardDataTable
                value={interviewSummaryTableData}
                column={interviewSummaryColums}
                headerHeading={<>
                  <h4 style={{ margin:"0px", marginLeft: "150px", padding:"0px"}}>
         Interview Status
         <span style={{ marginLeft: "120px" ,color:"#d32f2e"}}>
           <a href="#" style={{ marginLeft: "120px" ,color:"#d32f2e"}} onClick={handlePopupOpen}>
             More status<span style={{fontSize:"15px",}}>&gt;</span>
           </a>
         </span>
       </h4> 
                 </>}


               
                table_title={"Interview Summary"}
              />
              <InterviewSummary
                visible={interviewPopup}
                onHide={() => setInterviewPopup(false)}
                mrfId={interviewPopupId}
                roleId={roleId}
                userId={userId}
              />
              <InterviewSummaryAllStatus
                visible={InterviewStatus}
                onHide={() => setInterviewStatusPopup(false)}
                roleId={roleId}
                userId={userId}
              />

              <DashBoardDataTable
               value={resumeSummary}
               column={resumeSummaryColums}
               headerHeading={<h4 className="resume_status_dash_table_heading">Resume Status</h4>}
               table_title={"Resume Summary"}
             />
             <ResumeSummary  visible={resumePopup}
                onHide={() => setResumePopup(false)} 
                 mrfId={resumePopupId}
                roleId={roleId}
                userId={userId} />
              
            </div>
          )}
        </div>
      
    </div>
  );
}

export default Dashboard;
