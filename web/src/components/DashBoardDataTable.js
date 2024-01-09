import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { FilterMatchMode } from "primereact/api";
import InputTextCp from "./Textbox";
import "../css/DashBoardDataTable.css";

const DashBoardDataTable = ({ value, table_title, headerHeading, column }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const renderHeader = () => {
    return (
      <div className="dash_table_header ">
        <h5 className="dash_summary_title">{table_title} </h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" style={{ top: "44%" }} />
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="MRF ID" rowSpan={2} />
        <Column header="Position Title" rowSpan={2} />
        <Column header={headerHeading} colSpan={4} />
      </Row>
      <Row>
        {column.map((col, index) => {
          if (col.header != "MRF ID" && col.header != "Position Title") {
            return <Column key={index} field={col.field} header={col.header} />;
          }
        })}
      </Row>
    </ColumnGroup>
  );

  const header = renderHeader();

  return (
    <div className="dashBoard_table">
      <DataTable
        value={value}
        paginator={true}
        rows={5}
        // rowsPerPageOptions={[ 10, 25, 50]}
        filters={filters}
        header={header}
        headerColumnGroup={headerGroup}
        scrollable
        scrollHeight="flex"
      >
        {column.map((col, index) => {
          return (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
            />
          );
        })}
      </DataTable>
    </div>
  );
};

export default DashBoardDataTable;
