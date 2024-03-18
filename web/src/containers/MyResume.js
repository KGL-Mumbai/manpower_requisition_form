import React, { useState, useEffect, useRef } from "react";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../css/InputComponent.css";
import "../css/MyResume.css";
import { navigateTo, putData, resumeBodyTemplate } from "../constants/Utils";
import { API_URL, FILE_URL, ROLES } from "../constants/config";
import {
  arrayToObj,
  objToIntArray,
  getData,
  strToArray,
  MRF_STATUS_FOR_DISABLE,
} from "../constants/Utils";
import ToastMessages from "../components/ToastMessages";
import InputTextareaComponent from "../components/InputTextarea";
import MultiSelectDropdown from "../components/multiselectDropdown";
import DropdownComponent from "../components/Dropdown";
import ButtonC from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import InputTextCp from "../components/Textbox";
import { FilterMatchMode } from "primereact/api";
const MyResume = ({ roleId = null, mrfId = 0, userId = null }) => {
  const [statusData, setStatusData] = useState({});
  const [forwardData, setForwardData] = useState({});
  const [values, setValues] = useState([]);
  // const [saveBttn, setSaveBttn] = useState([]);
  const toastRef = useRef(null);
  // const [isFlag, setIsFlag] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },

  });
  useEffect(() => {
    getResumeData();
  }, []);

  async function getResumeData() {
    const resumeData = await getData(
      API_URL.GET_MYRESUME + "?id=0&roleId=" + roleId + "&userId=" + userId
    );

    var filterInterviewerResumtSumData = [];
    resumeData.result.candidateDetails.map((res) => {
      if (!MRF_STATUS_FOR_DISABLE(roleId, res.mrfStatus)) {
        if (res.candidateStatusId === 2 || res.candidateStatusId === 3) {
          res.disable = true;
        } else {
          res.disable = false;
        }
        filterInterviewerResumtSumData.push(res);
      }
    });
    setValues(filterInterviewerResumtSumData);
    setForwardData(resumeData.result.resumereviewer);
    setStatusData(resumeData.result.status);

    // const isFlagArray = resumeData.result.candidateDetails.map(
    //   (res) => res.candidateStatusId === 2 || res.candidateStatusId === 3
    // );
    // setIsFlag(isFlagArray);
    // console.log(isFlagArray)
  }
  const SingleSelect = (data, options) => {
    const handleDropdownChange = (e) => {
      let statusdataCopy = [...values],
        index = statusdataCopy.indexOf(data),
        oCurrentData = statusdataCopy[index];

      oCurrentData.candidateStatusId = e.target.value;
      oCurrentData.actionBtnEnable = true;
      statusdataCopy[index] = oCurrentData;
      /* statusdataCopy.map((val, index)=>{
        if(val.candidateId === data.candidateId){
          val.candidateStatusId = e.target.value;
          val.actionBtnEnable = true;
        }
      }) */
      // let sv = [...saveBttn];
      // sv[options.rowIndex] = true;
      // statusdataCopy[options.rowIndex].candidateStatusId = e.target.value;
      // statusdataCopy[options.rowIndex].actionBtnEnable = true;
      setValues(statusdataCopy);
      // setSaveBttn(sv);
    };
    return (
      <DropdownComponent
        optionLabel="status"
        optionValue="id"
        className="w-full md:w-15rem"
        options={statusData}
        disable={data.disable}
        value={data.candidateStatusId}
        placeholder={"Select Status"}
        onChange={handleDropdownChange}
      />
    );
  };

  const MultiSelect = (data, options) => {
    const handleMultiSelectChange = (e) => {
      let interviewDataCopy = [...values],
        index = interviewDataCopy.indexOf(data),
        oCurrentData = interviewDataCopy[index];

      oCurrentData.resumeReviewerEmployeeIds = objToIntArray(e.value, "employeeId").toString();
      oCurrentData.actionBtnEnable = true;
      interviewDataCopy[index] = oCurrentData;
      // let sv = [...saveBttn];
      // sv[options.rowIndex] = e.value.length > 0 ? true : false;
      // interviewDataCopy[options.rowIndex].actionBtnEnable = true;
      // interviewDataCopy[options.rowIndex].resumeReviewerEmployeeIds = objToIntArray(e.value, "employeeId").toString();
      /* TODO: Change the below strategy as it is itterating all data and updating it */
      /* interviewDataCopy.map((val, index)=>{
        if(val.candidateId === data.candidateId){
          val.resumeReviewerEmployeeIds = objToIntArray(e.value, "employeeId").toString();
          val.actionBtnEnable = true;
        }
      }) */
      setValues(interviewDataCopy);
      // setSaveBttn(sv);
    };

    return (
      <MultiSelectDropdown
        // className="drop-width"
        options={forwardData}
        value={arrayToObj(
          forwardData,
          strToArray(data.resumeReviewerEmployeeIds),
          "employeeId"
        )}
        placeholder={"Select Resume Reviwer"}
        onChange={handleMultiSelectChange}
        optionLabel="name"
        disable={data.disable}
        className="w-full md:w-15rem"
      />
    );
  };
  const updateData = async (rowData) => {
    setIsLoading(true);
    const reviewedByEmployeeIds = rowData.resumeReviewerEmployeeIds;
    const name = rowData.candidateName; // this because we are handling data in backend it not save as string
    const emailId = "string";
    const id = rowData.candidateId;
    const candidateStatusId = rowData.candidateStatusId;
    const mrfId = rowData.mrfId;
    const contactNo = "string";
    const reason = rowData.reason;
    const resumePath = rowData.resumePath;
    const createdByEmployeeId = rowData.createdByEmployeeId;
    const createdOnUtc = rowData.createdOnUtc;
    const updatedOnUtc = new Date().toISOString();
    const candidateName = rowData.candidateName;
    const candidateDetailsData = {
      id,
      mrfId,
      name,
      contactNo,
      emailId,
      resumePath,
      candidateStatusId,
      reviewedByEmployeeIds,
      createdByEmployeeId,
      createdOnUtc,
      reason,
      updatedOnUtc
    };
    let response = await putData(
      `${API_URL.RESUME_SUMMARY_POST + id}`,
      candidateDetailsData
    );
    if (response.ok) {
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      toastRef.current.showSuccessMessage("Update successfully!");
      setTimeout(() => {
        navigateTo("dashboard");
        setIsLoading(false);
      }, 100);
    } else {
      console.error("Request failed with status:", response.status);
      if (response.status === 400) {
        toastRef.current.showBadRequestMessage("Bad request: " + response.url);
      }
      setIsLoading(false);
    }
  };

  const textEditor = (data, options) => {
    const TextChange = (e) => {
      let statusdataCopy = [...values],
        index = statusdataCopy.indexOf(data),
        oCurrentData = statusdataCopy[index];

      oCurrentData.reason = e.target.value;
      oCurrentData.actionBtnEnable = true;
      statusdataCopy[index] = oCurrentData;

      // let sv = [...saveBttn];
      // sv[options.rowIndex] = true;
      // statusdataCopy[options.rowIndex].actionBtnEnable = true;
      // statusdataCopy[options.rowIndex].reason = e.target.value;
      /*  statusdataCopy.map((val, index)=>{
         if(val.candidateId === data.candidateId){
           val.reason = e.target.value;
           val.actionBtnEnable = true;
         }
       }) */

      setValues(statusdataCopy);
      // setSaveBttn(sv);
    };
    return (
      <InputTextareaComponent
        readOnly={data.disable}
        value={data.reason}
        rows={2}
        cols={55}
        onChange={TextChange}
        placeholder={"Enter Reason"}
      />
    );
  };
  const actionBodyTemplate = (rowData, options) => {
    if (rowData && (rowData.actionBtnEnable && rowData.resumeReviewerEmployeeIds)) {
      return (
        <React.Fragment>
          <ButtonC
            icon="pi pi-save"
            rounded
            className="myaction_btn"
            onClick={() => {
              updateData(rowData);
            }}
          />
          <ToastMessages ref={toastRef} />
        </React.Fragment>
      );
    }
    return (
      <ButtonC icon="pi pi-save" disable={true} className="myaction_btn" />
    );
  };

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
      header: "Sr. No.",
      body: (data, options) => options.rowIndex + 1,
      //bodyClassName: "int-edit-col",
      bodyClassName: "sr_No ",
    },

    {
      field: "candidateName",
      header: "Name",
      bodyClassName: "my_resume-col",
      sortable: true,
    },
    {
      field: "resumePath",
      header: "Resume",
      body: resumeBodyTemplate,
      sortable: true,
      bodyClassName: "my_resume-col",
    },
    {
      field: "positionTitle",
      header: "Position Title",
      // body: resumeBodyTemplate,
      sortable: true,
      bodyClassName: "my_resume-col",
    },

    {
      field: "candidateStatusId",
      header: "Status",
      body: SingleSelect,
      bodyClassName: "my_resume-col",
    },
    {
      field: "reviewedByEmployeeIds",
      header: "Forward To",
      body: MultiSelect,
      bodyClassName: "my_resume-col",
    },
    {
      field: "reason",
      header: "Reason",
      body: textEditor,
    },
    {
      header: "Action",
      body: actionBodyTemplate,
      bodyClassName: "my_resume-col",
    },
  ];
  return (
    <div className="my-resume">
      <h3 className="my-resume-title">My Resumes</h3>

      <div className="my-resume-table">
        <DataTable
          value={values}
          header={header}
          paginator={values.length > 10}
          removableSort
          filters={filters}
          rows={10}
          showGridlines
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          scrollable
        // scrollHeight="flex"
        >
          {columns.map((col, index) => (
            <Column
              key={index}
              field={col.field}
              header={col.header}
              body={col.body}
              rowClassname={col.rowClassName}
              bodyClassName={"int-col " + col.bodyClassName}
              sortable={col.sortable}
            />
          ))}
        </DataTable>
        {isLoading && <LoadingSpinner />}
      </div>
    </div>
  );
};
export default MyResume;
