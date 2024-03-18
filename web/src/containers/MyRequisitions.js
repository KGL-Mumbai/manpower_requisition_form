import React, { useEffect, useState } from "react";
import {
  changeDateFormat,
  convertToDays,
  formatDateToYYYYMMDD,
  getData,
  getDataAPI,
  salaryInLPA,
} from "../constants/Utils";
import { API_URL } from "../constants/config";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../css/MyRequisitions.css";
import ReferenceBodyTemplate from "../components/MrfRefStatus";
import { legacy_createStore } from "redux";
import InputTextCp from "../components/Textbox";
import { FilterMatchMode } from "primereact/api";

// const roleId = 4

const convertToDayBodytemplate = (mrf) => {
  return <>{convertToDays(mrf)} Days</>;
};

const createdOnBodyTemplate = (mrf) => {
  return changeDateFormat(mrf.createdOnUtc);
};
const updatedOnBodyTemplate = (mrf) => {
  return changeDateFormat(mrf.updatedOnUtc);
};

const salaryTemplate = (mrf) => {
  return salaryInLPA(mrf.salary);
};

const MyRequisitions = ({ roleId, userId }) => {
  const [reqData, setReqData] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // referenceNo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    // positionTitle: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  useEffect(() => {
    async function getReqData() {
      const result = await getDataAPI(
        `${API_URL.MY_REQUISITION}?statusId=0&roleId=${roleId}&userId=${userId}`
      );
      const response = await result.json();
      setReqData(response.result);
    }

    if (roleId) {
      getReqData();

      const refreshInterval = setInterval(() => {
        getReqData();
      }, 300000);

      // Clean up interval when component unmounts
      return () => clearInterval(refreshInterval);
    }
  }, [roleId]);


  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["name", "referenceNo", "positionTitle", "global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const renderHeader = () => {
    return (
      <div className="dash_table_header ">
        <h5 className="dash_summary_title"> </h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" style={{ top: "50%" }} />
          <InputTextCp
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="  border-round-3xl h-2rem text-sm"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();

  const columns = [
    {
      // field: "referenceNo",
      header: "Sr. No.",
      body: (data, options) => options.rowIndex + 1,
      bodyClassName: "sr_No ",
    },
    {
      field: "referenceNo",
      header: "MRF ID",
      body: ReferenceBodyTemplate,
      bodyClassName: "ref-col",
    },
    {
      field: "positionTitle",
      header: "Position Title",
      bodyClassName: " mrfdraft-ref-col  ",
      sortable: true,
    },
    {
      field: "name",
      header: "Created By",
      sortable: true,
    },
    {
      field: "createdOnUtc",
      header: "Created On",
      body: createdOnBodyTemplate,
      sortable: true,
    },
    {
      field: "updatedOnUtc",
      header: "Last Updated",
      body: updatedOnBodyTemplate,
      sortable: true,
    },
    {
      field: "createdOnUtc",
      header: "MRF Open Since",
      body: convertToDayBodytemplate,
      sortable: true,
    },
    {
      field: "requisitionType",
      header: "Requisition Type",
      sortable: true,
    },
    {
      field: "vacancyNo",
      header: "No. of Positions",
      sortable: true,
    },
    {
      field: "experience",
      header: "Exp Required",
      sortable: true,
    },
    {
      field: "salary",
      header: "Salary Range",
      body: salaryTemplate,
      sortable: true,
    },
    {
      field: "mrfStatus",
      header: "Status",
      bodyClassName: "stat-col",
      sortable: true,
    },
  ];

  return (
    <div className="my-req">
      <h3 className="my-req-title">My Requisition</h3>
      <div className="req-table">
        <DataTable
          value={reqData}
          header={header}
          paginator={reqData.length > 10}
          removableSort
          rows={10}
scrollable
          filters={filters}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          showGridlines
        // scrollHeight="flex"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              bodyClassName={"req-col " + col.bodyClassName}
              sortable={col.sortable}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
};
export default MyRequisitions;
