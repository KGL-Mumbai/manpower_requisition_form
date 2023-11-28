import React, { useState, useEffect, useRef } from "react";
import DropdownComponent from "../Components/Dropdown";
import MultiSelectDropdown from "../Components/multiselectDropdown";
import "primeicons/primeicons.css";
import ButtonC from "../Components/Button";
import { InputTextarea } from "primereact/inputtextarea";
import { constantResumePath } from "../Components/constant";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import DashboardHeader from "./Header";
import LeftPanel from "./LeftPanel";
import "../styles/layout/InputComponents.css";
import "../styles/layout/myResume.css"

const MyReumes = () => {
  const [myResumeData, setMyResumeData] = useState({});
  const [statusData, setStatusData] = useState({});
  const [forwardData, setForwardData] = useState({});
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        fetch(
          "https://localhost:7128/api/Candidatedetail/GetResumeDropdownlist"
        )
          .then((response) => response.json())
          .then((data) => {
            setMyResumeData(data.result);
            setValues(data.result.candidateDetails);
            setForwardData(data.result.resumereviewer);
            setStatusData(data.result.status);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // const  TextBoxComponent = (reason,param) => {
  //    const [textBoxValue, setTextBoxValue] = useState(reason.reason);
  //   const handleTextBoxChange = (e) => {
  //   console.log(e.target.value);
  //  // setTextBoxValue(e.target.value);
  //   reason.editorCallback(e.target.value);
  //    };
  // return (
  //     <InputTextarea  value={textBoxValue} onChange={handleTextBoxChange} rows={2} cols={30}  />
  //     );
  // };

  const openPdfInNewTab = (pdfLink) => {
    window.open(pdfLink, "_blank");
  };
  const SingleSelect = (statusdata) => {
    const id = statusdata.candidateStatusId;
    const [selectStatus, setSelectedststatus] = useState(id);
    return (
      <DropdownComponent
        optionLabel="status"
        optionValue="id"
        value={statusdata.candidateStatusId}
        options={statusData || []}
        placeholder="Select Status"
        className="w-full md:w-23rem "
        onChange={(e) => statusdata.editorCallback(e.target.value)}
        style={{color:"red"}}
      />
    );
  };

  const MultiSelectTemplate = (options) => {
    return <div></div>;
  };

  const MultiSelect = (data) => {
    console.log("multiselect", data);
    const [review, setreviewedByEmployeeId] = useState();

    return (
      
      <MultiSelectDropdown
        // id="resumeReviewer"
        //options={dropdownData.resumereviewer}
        options={forwardData}
        value={arrayToObj(forwardData, strToArray(data.reviewedByEmployeeIds))}
        onChange={(e) => {
          console.log(e.value);
          //setreviewedByEmployeeId(objToArray(e.value));
          data.editorCallback(e.value);
        }}
        className="w-full md:w-23rem"
        // style={{color: "#d32f2e", fontFamily: "Poppins", fontWeight: 500 , fontSize:"14px"}}
               

        optionLabel="name"
        // optionValue="employeeId"
      />
    );
  };
  const updateData = (
    id,
    name,
    emailId,
    contactNo,
    resumePath,
    reviewedByEmployeeId,
    reviewedByEmployeeIds,
    candidateStatusId,
    reason
  ) => {
    const empdata = {
      name,
      emailId,
      contactNo,
      resumePath,
      reviewedByEmployeeId,
      reviewedByEmployeeIds,
      candidateStatusId,
      reason,
    };
    fetch("https://localhost:7128/api/Candidatedetail/Put/" + id, {
      method: "Put",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(empdata),
    })
      .then((res) => {
        alert("updated successfully.");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const header = <h3 className="req-header">My Resumes</h3>;

  
  const textEditor = (options) => {
    console.log("reason", options.value);
    return (
      <InputTextarea
        type="text"
        value={options.value}
        rows={2}
        cols={28}
        autoResize
        style={{color: "#6d6d6d", fontFamily: "Poppins", fontWeight: 500 , fontSize:"14px"}}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    console.log("click", rowData);
    return (
      <React.Fragment>
        <ButtonC
          icon="pi pi-save"
          rounded
          outlined
          className="mr-2 text-white"
          onClick={() => {
            updateData(
              rowData.id,
              rowData.name,
              rowData.emailId,
              rowData.contactNo,
              rowData.resumePath,
              rowData.reviewedByEmployeeId,
              rowData.reviewedByEmployeeIds,
              rowData.candidateStatusId,
              rowData.reason
            );
          }}
        />
      </React.Fragment>
    );
  };
  const strToArray = (s) => {
    if (typeof s === "string") {
      s = s.split(",").map(Number);
    }
    return s;
  };

  const arrayToObj = (options = [], selectedOpt) => {
    if (Array.isArray(selectedOpt)) {
      return options.filter((e) => selectedOpt.includes(e.employeeId));
    }
  };

  const objToArray = (selectedOpt = []) => {
    return selectedOpt.map((e) => e.employeeId);
  };
  const ResumeHyperLink = (resume) => {
    console.log(resume);
    let resumeLink = `${constantResumePath}/Resume/${resume.resumePath}`;

    return (
      <div>
        <a
          href={resumeLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            openPdfInNewTab(resumeLink);
          }}
          style={{ color: "#d32f2e", fontFamily: "Poppins", fontWeight: 500 , fontSize:"14px"}}
        >
          {resume.name}
          {".pdf"}
        </a>
      </div>
    );
  };
  return (
    <>
      <div>
        <div>
          <DashboardHeader />
        </div>
        <div style={{ display: "flex" }}>
          <div className=" ">
            <LeftPanel />
          </div>
          <div className="MyResume">
            <div >
              <h3 className="text-black-alpha-90	text-2xl font-bold  m-4">
                My Resumes
              </h3>
            </div>
            <div >
              <DataTable
                value={values}
                paginator
                removableSort
                rows={6}
                scrollable
                header={header}
                scrollHeight="62vh"
              >
                <Column field="id" header="Sr No."></Column>
                <Column
                  field="resumePath"
                  header="Resume"
                  body={ResumeHyperLink}
                ></Column>
                <Column
                  field="candidateStatusId"
                  header="Status"
                  body={SingleSelect}
                  editor={(options) => SingleSelect(options)}
                ></Column>
                <Column
                  field="reviewedByEmployeeId"
                  header="Forward To"
                  body={MultiSelect}
                  editor={(options) => MultiSelect(options)}
                ></Column>
                <Column
                  field="reason"
                  header="Reason"
                  // body={TextBoxComponent}
                  // style={{ width: '10%' }}
                  editor={(options) => textEditor(options)}
                ></Column>

                <Column
                  headerStyle={{ width: "10%", minWidth: "8rem" }}
                  bodyStyle={{ textAlign: "center" }}
                  body={actionBodyTemplate}
                ></Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyReumes;
