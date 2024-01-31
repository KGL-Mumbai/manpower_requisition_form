import React, { useEffect, useState } from "react";
import "./../css/Dashboard.css";
import { getData } from "../constants/Utils";
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
    const interviewSummaryData = await getData(
      API_URL.INTERVIEW_SUMMARY +
        "?Count=0&roleId=" +
        roleId +
        "&userId=" +
        userId
    );
    setInterviewSummary(interviewSummaryData.result);
  }

  const generateColumns = (resultGroups) => {
    return resultGroups.map((group, groupIndex) => {
      const key = `status_${groupIndex}`;
      const field = `status_${groupIndex}`;

      return (
        <Column
          key={key}
          field={field}
          header={group.candidatestatus}
          body={group.totalstatusCount}
        />
      );
    });
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
          <DataTable
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20]}
            scrollable={true}
            sortMode="multiple"
            value={interviewSummary}
          >
            <Column field="referenceno" header="Reference No" />
            <Column field="positionTitle" header="Position Title" />
            {interviewSummaryColumns}
          </DataTable>
        </div>
      }
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="int-card"
    ></Dialog>
  );
}

export default InterviewSummaryAllStatus;
