import React, { useEffect, useState } from "react";
import "./../css/Dashboard.css";
import { filterSelectedColumn, getData } from "../constants/Utils";
import { API_URL } from "../constants/config";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";

function InterviewSummaryAllStatus({ roleId, userId, visible, onHide }) {
  const [interviewSummary, setInterviewSummary] = useState([]);
  const [interviewPopup, setInterviewPopup] = useState(false);
  const [interviewPopupId, setInterviewPopupId] = useState(null);

  useEffect(() => {
    getSummaryData();
  }, []);

  async function getSummaryData() {
    const interviewSummaryData = await getData( API_URL.INTERVIEW_SUMMARY +"?Count=0&roleId=" +        roleId +
        "&userId=" +
        userId
    );
    setInterviewSummary(interviewSummaryData.result);
  }
  console.log(interviewSummary)

 

  const generateColumns = (resultGroups) => {
    console.log(resultGroups)
    const dynamicColumns = resultGroups.map((group, groupIndex) => {
      const field = `status_${groupIndex}`;
console.log(field)
      return (
        <Column
          key={field}
          field={field}
          header={group.candidatestatus}
          body={(rowData) => filterSelectedColumn(rowData,group.candidatestatus )}
        />
      );
    });

    return dynamicColumns;
  };

  const onInterviewMRFIdClicked = (e) => {
    setInterviewPopupId(e);
    setInterviewPopup(true);
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

  const interviewSummaryColumns =
    interviewSummary.length > 0
      ? generateColumns(interviewSummary[0].resultGroups)
      : [];

      // const interviewSummaryColumsss = [
      //   {
      //     field: "referenceno",
      //     header: "MRF ID",
      //     body: mrfIdInterviewRefernceTemplate,
      //     bodyClassName:"dash_status_col_mrfid",
      //   },
      //   {
      //     field: "positionTitle",
      //     header: "Position Title",
      //     // header: <h5 className="dashborad_table_sub_header" >Position Title</h5>,
    
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Assignment Sent",
      //     header: <h5 className="dashborad_table_sub_header" >Assignment Sent</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Assignment Sent"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Assignment Received",
      //     header: <h5 className="dashborad_table_sub_header" >Assignment Received</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Assignment Received"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Assignment Shortlisted",
      //     header: <h5 className="dashborad_table_sub_header" >Assignment Shortlisted</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Assignment Shortlisted"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Assignment Rejected",
      //     header: <h5 className="dashborad_table_sub_header" >Assignment Rejected</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Assignment Rejected"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Video Interview Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Video Interview Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Video Interview Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Video Interview Not Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Video Interview Not Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Video Interview Not Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Coding Test Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Coding Test Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Coding Test Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Coding Test Not Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Coding Test Not Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Coding Test Not Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Aptitude Test Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Aptitude Test Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Aptitude Test Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Aptitude Test Not Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Aptitude Test Not Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Aptitude Test Not Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Telephonic Interview Not Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Telephonic Interview Not Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Telephonic Interview Not Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Face To Face Interview Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Face To Face Interview Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Face To Face Interview Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Face To Face Interview Not Cleared",
      //     header: <h5 className="dashborad_table_sub_header" >Face To Face Interview Not Cleared</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Face To Face Interview Not Cleared"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Not Selected",
      //     header: <h5 className="dashborad_table_sub_header" >Not Selected</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Not Selected"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Offer Rolledout",
      //     header: <h5 className="dashborad_table_sub_header" >Offer Rolledout</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Offer Rolledout"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Offer Accepted",
      //     header: <h5 className="dashborad_table_sub_header" >Offer Accepted</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Selected"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Offer Accepted & did not join",
      //     header: <h5 className="dashborad_table_sub_header" >Offer Accepted & did not join</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Offer Accepted & did not join"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Offer Rejected",
      //     header: <h5 className="dashborad_table_sub_header" >Offer Rejected</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Offer Rejected"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Offer Accepted and Countered",
      //     header: <h5 className="dashborad_table_sub_header" >Offer Accepted and Countered</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Offer Accepted and Countered"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview Forwarded",
      //     header: <h5 className="dashborad_table_sub_header" >Interview Forwarded</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview Forwarded"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview to be Scheduled",
      //     header: <h5 className="dashborad_table_sub_header" >Interview to be Scheduled</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview to be Scheduled"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview Scheduled",
      //     header: <h5 className="dashborad_table_sub_header" >Interview Scheduled</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview Scheduled"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview Rescheduled",
      //     header: <h5 className="dashborad_table_sub_header" >Interview Rescheduled</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview Rescheduled"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Candidate was Absent",
      //     header: <h5 className="dashborad_table_sub_header" >Candidate was Absent</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Candidate was Absent"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview Canceled",
      //     header: <h5 className="dashborad_table_sub_header" >Interview Canceled</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview Canceled"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Interview on Hold",
      //     header: <h5 className="dashborad_table_sub_header" >Interview on Hold</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Interview on Hold"),
      //     bodyClassName:"dash_status_col",
      //   },
      //   {
      //     field: "Onboarded",
      //     header: <h5 className="dashborad_table_sub_header" >Onboarded</h5>,
      //     body: (rowData) => filterSelectedColumn(rowData, "Onboarded"),
      //     bodyClassName:"dash_status_col",
      //   },
        
      // ];

  return (
    <Dialog
      header={
        <div className="dashboard_body_right" style={{ width: "100%" }}>
          
        </div>
      }
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="int-card"
    >

{/* <DataTable
        value={interviewSummary}
        paginator={true}
        rows={5}
        rowsPerPageOptions={[ 10, 25, 50]}
        scrollable
        scrollHeight="flex"
      >
        {interviewSummaryColums.map((col, index) => {
          return (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              bodyClassName={col.bodyClassName}
            />
          );
        })}
      </DataTable> */}

         <DataTable
    paginator={true}
    rows={10}
    rowsPerPageOptions={[5, 10, 20]}
    scrollable={true}
    value={interviewSummary}
  >
    <Column field="referenceno" header="Reference No" />
    <Column field="positionTitle" header="Position Title" />
   {interviewSummaryColumns}
  </DataTable>
  </Dialog>
  );
}

export default InterviewSummaryAllStatus;
