import React, { useEffect, useState } from "react";
import "./../css/Dashboard.css";
import { filterSelectedColumn, getData } from "../constants/Utils";
import { API_URL } from "../constants/config";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Column } from "primereact/column";
import InterviewSummary from "../containers/InterviewSummary";
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
    
    const dynamicColumns = resultGroups.map((group, groupIndex) => {
      const field = `status_${groupIndex}`;

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

      

  return (
    <Dialog
      header={
        <div className="dashboard_body_right" style={{ width: "100%" }}>
          Interview Summary
        </div>
      }
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="int-card"
    >

         <DataTable
    paginator={true}
    rows={10}
    rowsPerPageOptions={[5, 10, 20]}
    scrollable={true}
    value={interviewSummary}
  >
    <Column field="referenceno" header="Reference No" body={mrfIdInterviewRefernceTemplate}/>
    <Column field="positionTitle" header="Position Title" />
   {interviewSummaryColumns}
  </DataTable>
  <InterviewSummary
                visible={interviewPopup}
                onHide={() => setInterviewPopup(false)}
                mrfId={interviewPopupId}
                roleId={roleId}
                userId={userId}
              />
  </Dialog>
  );
}

export default InterviewSummaryAllStatus;
