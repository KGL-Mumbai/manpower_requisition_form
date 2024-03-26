import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
// import { Dialog } from "primereact/dialog";
import "../css/DashMrfStatus.css";
import ReferenceBodyTemplate from "./MrfRefStatus";
import { API_URL, ROLES } from "../constants/config";
import { changeDateFormat, convertToDays, getDataAPI, navigateTo, salaryInLPA } from "../constants/Utils";
import { useSelector } from "react-redux";

const DashMrfStatus = ({
 /*  header,
  visible,
  onHide, */
  roleId = null,
  userId = null/* ,
  statusId = null,
  dialogHeader */
}) => {
  const [mrfStatusData, setMrfStatusData] = useState({});
  const [data, setdata] = useState([]);

  const {locationParams} = useSelector((state)=> state.page);

  useEffect(() => {
    setMrfStatusData({id: locationParams[0].mrfStatusId, status: locationParams[1].status})
  }, [])
  useEffect(() => {
    if (roleId === ROLES.resumeReviwer) {
      navigateTo("dashboard")
      return;
    }
    if (mrfStatusData.id) {
      fetchData();
    }
  }, [mrfStatusData, roleId]);

  const fetchData = async () => {
    try {
      let result = await getDataAPI(
        `${API_URL.MRF_STATUS_POPUP}statusId=${mrfStatusData.id}&roleId=${roleId}&userId=${userId}`
      );
      let response = await result.json();

      setdata(response.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 

  const uploadedOnBodyTemplate = (data) => {
    return changeDateFormat(data.createdOnUtc);
  };

  const SalaryTemplate = (mrf) => {
    return <h4 className="mrfdraft-col">{salaryInLPA(mrf.salary)}</h4>;
  };
  const convertToDayBodytemplate = (mrf) => {
    return <>{convertToDays(mrf)} Days</>;
  };
  const columns = [
    {
      // field: "referenceNo",
      header: "Sr. No.",
      body: (data, options) => options.rowIndex + 1,
      bodyClassName: " sr_No  ",
    },
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
      field: "createdOnUtc",
      header: "MRF Open Since",
      body: convertToDayBodytemplate,
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
    <>{/* <Dialog
    header={dialogHeader+" MRF"}
      visible={visible}
      onHide={onHide}
      draggable={false}
      className="mrfdraft-card"
    > */}
     <div className="mrf_summary_cont">
        <h3 className="dashboard_title"><a className="breadcrum_link" href="#/dashboard">My Dashboard</a> / {mrfStatusData.status+" MRF"}</h3>
        <DataTable
          value={data}
          paginator={data.length > 10}
          rows={10}
          scrollable
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50]} 
          // scrollHeight="flex"
          className="dashmrf_status_table"
        >
          {columns.map((col,index) => (
            <Column
            key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              bodyClassName={col.bodyClassName}
              sortable={col.sortable}
            />
          ))}
        </DataTable>
      </div>
    {/* </Dialog> */}
    </>
  );
};

export default DashMrfStatus;
