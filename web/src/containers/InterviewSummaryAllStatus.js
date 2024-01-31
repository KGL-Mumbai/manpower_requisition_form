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
    const dynamicColumns = resultGroups.map((group, groupIndex) => {
      const field = `status_${groupIndex}`;

      return (
        <Column
          key={field}
          field={field}
          header={
            <h4 className="all_status_table_heading">
              {group.candidatestatus}
            </h4>
          }
          body={(rowData) =>
            filterSelectedColumn(rowData, group.candidatestatus)
          }
          bodyClassName={"interview_all_status_body"}
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
        <div
          className="dashboard_body_right"
          style={{ width: "100%", fontWeight: "bold", color: "#000000" }}
        >
          Interview Summary
        </div>
      }
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="int-card"
    >
      <DataTable
        paginator={interviewSummary.length > 5}
        rows={5}
        scrollable={true}
        value={interviewSummary}
        scrollHeight="flex"
        className="all_interview"
      >
        <Column
          field="referenceno"
          header="MRF ID"
          body={mrfIdInterviewRefernceTemplate}
        />
        <Column
          field="positionTitle"
          header="Position Title"
          bodyClassName={"interview_all_status_body"}
        />
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
