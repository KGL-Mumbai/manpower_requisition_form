import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import "../css/DashMrfStatus.css";
import ReferenceBodyTemplate from "./MrfRefStatus";
import { API_URL } from "../constants/config";
import { changeDateFormat, getDataAPI, salaryInLPA } from "../constants/Utils";

const DashMrfStatus = ({
  header,
  visible,
  onHide,
  roleId = null,
  userId = null,
  statusId = null,
}) => {
  const [mrfStatusData, setMrfStatusData] = useState([]);
  const [data, setdata] = useState([]);

  useEffect(() => {
    if (statusId) {
      fetchData();
    }
  }, [statusId]);

  const fetchData = async () => {
    try {
      let result = await getDataAPI(
        `${API_URL.MRF_STATUS_POPUP}statusId=${statusId}&roleId=${roleId}&userId=${userId}`
      );
      let response = await result.json();

      setdata(response.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (data.length < 1) {
    return (
      <Dialog
        header="MRF STATUS"
        visible={visible}
        onHide={onHide}
        draggable={false}
        className="int-card no-res-card"
      >
        No Result Found
      </Dialog>
    );
  }

  const uploadedOnBodyTemplate = (data) => {
    return changeDateFormat(data.createdOnUtc);
  };

  const SalaryTemplate = (mrf) => {
    return <h4 className="mrfdraft-col">{salaryInLPA(mrf.salary)}</h4>;
  };

  const columns = [
    {
      field: "referenceNo",
      header: "MRF ID",
      body: ReferenceBodyTemplate,
      bodyClassName: " mrfdraft-ref-col  ",
      sortable: true,
    },
    {
      field: "positionTitle",
      header: "Position Title",
      bodyClassName: "mrfdraft-col mrfdraft-ref-col  ",
      sortable: true,
    },
    {
      field: "name",
      header: "Created By",
      bodyClassName: "mrfdraft-col mrfdraft-ref-col  ",
      sortable: true,
    },
    {
      field: "createdOnUtc",
      header: "Created On",
      body: uploadedOnBodyTemplate,
      bodyClassName: "mrfdraft-col mrfdraft-ref-col",
      sortable: true,
    },
    {
      field: "updatedOnUtc",
      header: "Last Updated",
      body: uploadedOnBodyTemplate,
      bodyClassName: "mrfdraft-col mrfdraft-ref-col ",
      sortable: true,
    },
    {
      field: "requisitionType",
      header: "Requistion Type",
      bodyClassName: "mrfdraft-col ",
      sortable: true,
    },
    {
      field: "vacancyNo",
      header: "No. of Position",
      bodyClassName: "mrfdraft-col ",
      sortable: true,
    },
    {
      field: "experience",
      header: "Exp Required",
      bodyClassName: "mrfdraft-col ",
      sortable: true,
    },
    {
      field: "salary",
      header: "Salary Range",
      body: SalaryTemplate,
      bodyClassName: "mrfdraft-col mrfdraft-ref-col",
      sortable: true,
    },
    {
      field: "mrfStatus",
      header: "Status",
      bodyClassName: "mrfdraft-col mrfdraft-ref-col ",
      sortable: true,
    },
  ];

  return (
    <Dialog
      header={"MRF STATUS "}
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="mrfdraft-card"
    >
      <DataTable
        value={data}
        paginator={data.length > 10}
        rows={10}
        scrollable
        scrollHeight="400px"
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
    </Dialog>
  );
};

export default DashMrfStatus;
