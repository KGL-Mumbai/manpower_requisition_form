import React, { useState, useEffect, useRef } from "react";
import { commonSettings, applySettingsBasedOnRoleAndStatus } from './commonSettings';
import "../css/InputComponent.css";
import DropdownComponent from "./../components/Dropdown";
import InputTextCp from "./../components/Textbox";
import ButtonC from "./../components/Button";
import CalendarComponent from "./../components/Calendar";
import CheckboxComponent from "./../components/Checkbox";
import InputTextareaComponent from "./../components/InputTextarea";
import { Editor } from "primereact/editor";
import ToastMessages from "./../components/ToastMessages";
import MultiSelectDropdown from "./../components/multiselectDropdown";
import { mrfStatus } from "../components/constant";
import { navigateTo } from "../constants/Utils";
import {
  API_URL,
  FORM_SCHEMA_CR,
  GENDER,
  MAX_EXPERIENCE_OPTIONS,
  MIN_EXPERIENCE_OPTIONS,
  MRF_STATUS,
  REQUISITION_TYPE,
} from "../constants/config";
import { storageService } from "../constants/storage";
import MrfPartialStatus from "../components/MrfPartialStatus";
import { useDispatch } from "react-redux";
import { PAGE_ACTIONS } from "../reducers/Page_r";
import EditorComponent from "../components/EditorComponent";
import InputNumberComponent from "../components/InputNumberComponent";
import DropdownAddNew from "./../components/DropDownAddNew";
import { Message } from "primereact/message";

const CreateRequisitionBody = ({
  getReqId = null,
  getReqRoleId = null,
  status = null,
  mrfStatusId = null,
  roleId = null,   // if we are directly coming to this page for creating mrf
}) => {
  // State to hold all the dropdown data
  const [dropdownData, setDropdownData] = useState({});
  const [subDepartments, setSubDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const RedAsterisk = () => <span className="text-red-500">*</span>;

  //const history = useHistory();
  const dispatch = useDispatch();

  const toastRef = useRef(null);

  // Initialize the formData state using the form schema
  const [formData, setFormData] = useState();

  const OnLoad=()=>
  { fetch(API_URL.GET_CREATE_REQUISITION_DROPDOWN)
    .then((response) => response.json())
    .then((data) => {
      const dropdown = data.result;
      // Store the dropdown data in localStorage using your storageService
      // storageService.set("dropdownData", dropdown);
      // Update the state with the new dropdown data
      setDropdownData(dropdown);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

 

  }
  useEffect(() => {
    setFormData(FORM_SCHEMA_CR);
  }, []);

  useEffect(() => {
    // Fetch the data for all the dropdowns
    OnLoad();
    if (getReqId) {
      const apiUrl = API_URL.GET_CREATE_REQUISITION_DEATILS + getReqId;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((response) => {
          setFormData({ ...formData, ...response });
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    } else {
      setFormData(FORM_SCHEMA_CR);
    }
  
    applySettingsBasedOnRoleAndStatus(getReqRoleId, mrfStatusId, roleId, commonSettings);
    
  }, []);
  const onTextChanged = (val) => {
    setFormData({ ...formData, jobDescription: val });
  };

  const onTextChangedSkill = (val) => {
    setFormData({ ...formData, skills: val });
  };
  const handleMinSalaryChange = (e) => {
    const minSalary = e.target.value;
    if (formData.maxTargetSalary !== 0) {
      if (minSalary > formData.maxTargetSalary) {
        toastRef.current.showWarrningMessage(
          "Min Target Salary is Greater than Max Target salary"
        );
        return;
      }
    }
    setFormData({ ...formData, minTargetSalary: minSalary });
  };

  const handleMaxSalaryChange = (e) => {
    const maxSalary = e.target.value;
    if (maxSalary < formData.minTargetSalary) {
      toastRef.current.showWarrningMessage(
        "Max Target Salary is Less than Min Target salary"
      );
      return;
    }
    setFormData({ ...formData, maxTargetSalary: maxSalary });
  };


  
  const handleMinGradeChange = (e) => {
    setFormData({ ...formData, minGradeId: e.target.value });
    handleMinChange(e);
  };

  const handleMinChange = (e) => {
    const minGradeId = e.target.value;
    if (minGradeId !== "" && formData.maxGradeId !== 0) {
      if (minGradeId > formData.maxGradeId) {
        toastRef.current.showWarrningMessage("Min Grade is greater than Max Grade");
        return;
      }
    }
   setFormData({ ...formData, minGradeId: minGradeId });
  };
  
const handleMaxGradeChange = (e) => {
    setFormData({ ...formData, maxGradeId: e.target.value });
    handleMaxChange(e);
  };

  const handleMaxChange = (e) => {
    const maxGradeId = e.target.value;
    if (maxGradeId !== "" && formData.minGradeId !== 0) {
      if (maxGradeId < formData.minGradeId) {
        toastRef.current.showWarrningMessage("Max Grade is Less than Min Grade");
        return;
      }
    }
    setFormData({ ...formData, maxGradeId: maxGradeId });
  };

  const fetchSubDepartments = (selectedDepartment) => {
    const apiUrl =
      API_URL.GET_CREATE_REQUISITION_DEPARTMENT + selectedDepartment;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((responseData) => {
        if (Array.isArray(responseData.result)) {
          const data = responseData.result;

          setSubDepartments(data);
        } else {
          console.error("API response result is not an array:", responseData);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const AddInDropdwon =async (Name,PosORPr) => {
    let apiUrl = '';
if (PosORPr === 1) {
  apiUrl = API_URL.ADD_POSITIONTITLE;
} else {
  alert(API_URL.ADD_PROJECT);
  apiUrl = API_URL.ADD_PROJECT;
}
     
     try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify({
            name: Name,
            isActive: true,
            
            createdByEmployeeId: storageService.getData("profile").employeeId,
            createdOnUtc: new Date().toISOString(),
            updatedByEmployeeId: storageService.getData("profile").employeeId,
            updatedOnUtc: new Date().toISOString(),
          }),
        });
  
        if (response.ok) {
          OnLoad();
          console.log("Item added successfully");
          toastRef.current.showSuccessMessage("Item added successfully!");
        } else {
          console.error("Failed to add item");
          toastRef.current.showConflictMessage("Failed to add item");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
 

  useEffect(() => {
    if (!formData || formData.departmentId === 0) {
      return;
    }
    fetchSubDepartments(formData.departmentId);
  }, [formData]);

  const strToArray = (s) => {
    s = s ?? "";
    if (typeof s === "string") {
      s = s.split(",").map(Number);
    }
    return s;
  };

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-strike" aria-label="Strike"></button>
        <button
          className="ql-list"
          value="ordered"
          aria-label="Ordered List"
        ></button>
        <button
          className="ql-list"
          value="bullet"
          aria-label="Unordered List"
        ></button>
        <select className="ql-align" aria-label="Align">
          <option value=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <select className="ql-color" aria-label="Color">
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="black"></option>
          <option value="yellow"></option>
        </select>
        <button className="ql-clean" aria-label="Clean"></button>
      </span>
    );
  };
  const header = renderHeader();


  const arrayToObj = (options = [], selectedOpt) => {
    if (Array.isArray(selectedOpt)) {
      return options.filter((e) => selectedOpt.includes(e.employeeId));
    }
  };

  const objToArray = (selectedOpt = []) => {
    return selectedOpt.map((e) => e.employeeId);
  };

  const handleCancel = () => {
    setFormData(FORM_SCHEMA_CR);
    setDropdownData({});
    setSubDepartments([]);
    window.history.back();
  };

  


  return (
    <>
      {formData && (
        <div
          className="border-round-lg bg-white text-black-alpha-90 p-3 flex flex-column justify-content-between"
          style={{ height: "81vh" }}
        >
          {getReqId ? "" : <h3 className="text-xl my-2">Fill the Details</h3>}

          <section
            className="flex flex-column flex-nowrap gap-3 
        border-y-2 border-gray-300 
        py-3 px-1 overflow-y-scroll"
            style={{ height: "95%" }}
          >
            {getReqId ? (
              <div className="flex justify-content-between gap-5">
                <div className="flex flex-column w-6 gap-2">
                  <h4 className="text-xl my-2">
                    Reference Number:{" "}
                    <span className="text-red-600">
                      {formData.referenceNo}
                      {" - "}
                      {`(${status})`}
                    </span>
                  </h4>
                </div>
              </div>
            ) : (
              ""
            )}
 {formData.mrfStatusId == 3 && getReqRoleId == 4 ? (
              <span className="font-bold  ">
                <Message text={`MRF is yet to be ReSubmit`} />{" "}
              </span>
            ) : (
              ""
            )}
            {formData.mrfStatusId == 3 ? (
              <label
                htmlFor="RequisitionType"
                className="font-semibold text-base"
              >
                <span className="font-bold text-red-600 text-lg">Note: </span>
                {formData.note}
              </label>
            ) : (
              ""
            )}
           
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="RequisitionType" className="font-bold text-sm">
                  Requisition Type
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="name"
                  optionValue="code"
                  type="RequisitionType"
                  options={REQUISITION_TYPE}
                  disable={commonSettings.setReadOnly}
                  value={
                    formData.requisitionType ||
                    (REQUISITION_TYPE.length > 0
                      ? REQUISITION_TYPE[0].code
                      : null)
                  }
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      requisitionType: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="position-title" className="font-bold text-sm">
                  Position Title
                  <RedAsterisk />
                </label>
                <DropdownAddNew
                  optionLabel="name"
                  optionValue="id"
                  type="position"
                  options={dropdownData.position}
                  value={formData.positionTitleId}
                  disable={commonSettings.setReadOnly}

                  onChange={(e) => {
                    setFormData({ ...formData, positionTitleId: e.target.value });
                  }}
                  onAddItem={(newItem) => {

                     AddInDropdwon(newItem,1);
                  }}
                 
                />
              </div>
            </div>

            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="department" className="font-bold text-sm">
                  Department
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="name"
                  optionValue="id"
                  type="Department"
                  options={dropdownData.departments}
                  value={formData.departmentId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) => {
                    setFormData({ ...formData, departmentId: e.target.value });
                  }}
                  
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="sub-department" className="font-bold text-sm">
                  Sub-Department
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="name"
                  optionValue="id"
                  type="subDepartmentId"
                  options={subDepartments}
                  disable={commonSettings.setReadOnly}
                  value={formData.subDepartmentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subDepartmentId: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="project" className="font-bold text-sm">
                  Project
                  <RedAsterisk />
                </label>
                <DropdownAddNew
                  optionLabel="name"
                  optionValue="id"
                  type="project"
                  options={dropdownData.projects}
                  disable={commonSettings.setReadOnly}
                  value={formData.projectId}
                  onChange={(e) => {
                    setFormData({ ...formData, projectId: e.target.value });
                  }}
                  onAddItem={(newItem) => {

                    AddInDropdwon (newItem,2);
                  }}
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="location" className="font-bold text-sm">
                  Location
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="location"
                  optionValue="id"
                  type="location"
                  options={dropdownData.location}
                  value={formData.locationId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, locationId: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label
                  htmlFor="position-reporting"
                  className="font-bold text-sm"
                >
                  Position Reporting to
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="name"
                  optionValue="id"
                  type="reportingTo"
                  options={dropdownData.reportingTo}
                  value={formData.reportsToEmployeeId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reportsToEmployeeId: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="initiation-date" className="font-bold text-sm">
                  Requirement Date
                  <RedAsterisk />
                </label>
                <CalendarComponent
                  id="initiation-date"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.requisitionDateUtc)}
                  disable={commonSettings.setReadOnly}
                  minDate={new Date()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requisitionDateUtc: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label
                  htmlFor="employment-type-req"
                  className="font-bold text-sm"
                >
                  Type of employment required
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="type"
                  optionValue="id"
                  type="employmenttypes"
                  options={dropdownData.employmentTypes}
                  value={formData.employmentTypeId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentTypeId: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="mingrade" className="font-bold text-sm">
                  Grade of the proposed employee
                  <RedAsterisk />
                </label>

                <div className="p-col-7">
                  <label className="font-bold text-sm label-with-padding-right">
                    Min
                  </label>
                  <DropdownComponent
                    value={formData.minGradeId}
                    options={dropdownData.grades}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Min"
                    disable={commonSettings.setReadOnly}
                    onChange={(e) =>
                      handleMinGradeChange(e)
                    }
                  />

                  <label className="font-bold text-sm label-with-padding-left label-with-padding-right">
                    Max
                  </label>
                  <DropdownComponent
                    value={formData.maxGradeId}
                    options={dropdownData.grades}
                    optionLabel="name"
                    optionValue="id"
                    placeholder="Max"
                    disable={commonSettings.setReadOnly}
                    onChange={(e) =>
                      handleMaxGradeChange(e)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="no-vacancies" className="font-bold text-sm">
                  Number of Vacancies
                  <RedAsterisk />
                </label>
                <InputNumberComponent
                  id="vaccancies"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vacancyNo: e.target.value,
                    })
                  }
                  value={formData.vacancyNo}
                  disable={commonSettings.setReadOnly}
                />
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="vacancy-type" className="font-bold text-sm">
                  Type of vacancy
                  <RedAsterisk />
                </label>
                <DropdownComponent
                  optionLabel="type"
                  optionValue="id"
                  type="vaccancy"
                  options={dropdownData.vaccancies}
                  value={formData.vacancyTypeId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, vacancyTypeId: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5 ">
              <div className="flex flex-column w-5 gap-2">
                <label htmlFor="experience" className="font-bold text-sm">
                  Experience
                  
                </label>
                <div className="p-col-7">
                  <label className="font-bold text-sm label-with-padding-right">
                    Min
                  </label>
                  <DropdownComponent
                    value={formData.minExperience}
                    options={MIN_EXPERIENCE_OPTIONS}
                    optionLabel="label"
                    placeholder="Min"
                    disable={commonSettings.setReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minExperience: e.target.value,
                      })
                    }
                    className="custom-width" 
                  />

                  <label className="font-bold text-sm label-with-padding-left label-with-padding-right">
                    Max
                  </label>
                  <DropdownComponent
                    value={formData.maxExperience}
                    options={MAX_EXPERIENCE_OPTIONS}
                    optionLabel="label"
                    placeholder="Max"
                    disable={commonSettings.setReadOnly}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxExperience: e.target.value,
                      })
                    }
                    className="custom-width" 
                  />
                </div>
              </div>
              <div className="flex flex-column w-6 row-gap-2">
                <label htmlFor="gender" className="font-bold text-sm">
                  Gender
                 
                </label>
                <DropdownComponent
                  optionLabel="label"
                  optionValue="id"
                  type="Gender"
                  options={GENDER}
                  disable={commonSettings.setReadOnly}
                  value={formData.genderId}
                  onChange={(e) =>
                    setFormData({ ...formData, genderId: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="qualification" className="font-bold text-sm">
                  Qualification
                  
                </label>
                <DropdownComponent
                  optionLabel="type"
                  optionValue="id"
                  type="Qualification"
                  options={dropdownData.qualification}
                  value={formData.qualificationId}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      qualificationId: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-row align-items-center h-3rem w-5 gap-2 px-4 border-round-sm border-1 border-300 bg-gray-100">
                <CheckboxComponent
                  inputId="replacement"
                  checked={formData.isReplacement}
                  disable={commonSettings.setReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, isReplacement: e.checked })
                  }
                />
                <label htmlFor="replacement" className="font-bold text-sm">
                  Replacement for the employee
                </label>
              </div>
            </div>
            {formData.isReplacement && (
              <>
                <div className="flex justify-content-between gap-5">
                  <div className="flex flex-column w-6 gap-2">
                    <label htmlFor="employeeName" className="font-bold text-sm">
                      Employee Name
                    </label>
                    <InputTextCp
                      id="employeeName"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeName: e.target.value,
                        })
                      }
                      value={formData.employeeName}
                      disable={commonSettings.setReadOnly}
                    />
                  </div>

                  <div className="flex flex-column w-6 gap-2">
                    <label
                      htmlFor="lastworkingDate"
                      className="font-bold text-sm"
                    >
                      Last Working Date
                    </label>
                    <CalendarComponent
                      id="lastworkingDate"
                      inputClassName="bg-gray-100"
                      value={new Date(formData.lastWorkingDate)}
                      disable={commonSettings.setReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastWorkingDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-content-between gap-5">
                  <div className="flex flex-column w-6 gap-2">
                    <label
                      htmlFor="EmployeeEmail"
                      className="font-bold text-sm"
                    >
                      Employee Email
                    </label>
                    <InputTextCp
                      id="EmployeeEmail"
                      onChange={(e) =>
                        setFormData({ ...formData, emailId: e.target.value })
                      }
                      value={formData.emailId}
                      disable={commonSettings.setReadOnly}
                    />
                  </div>

                  <div className="flex flex-column w-6 gap-2">
                    <label htmlFor="EmployeeCode" className="font-bold text-sm">
                      Employee Code
                    </label>
                    <InputNumberComponent
                    id="EmployeeCode"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeCode: e.target.value,
                      })}
                      value={formData.employeeCode}
                      disable={commonSettings.setReadOnly}
                  />

                    
                  </div>
                </div>
                <div className="flex justify-content-between gap-5">
                  <div className="flex flex-column w-6 gap-2">
                    <label htmlFor="AnnualCTC" className="font-bold text-sm">
                      Annual CTC
                    </label>
                    <InputNumberComponent
                    id="AnnualCTC"
                    onChange={(e) =>
                      setFormData({ ...formData, annualCtc: e.target.value })
                    }
                    value={formData.annualCtc}
                    disable={commonSettings.setReadOnly}
                  />
                    
                    <label htmlFor="AnnualGross" className="font-bold text-sm">
                      Annual Gross
                    </label>
                    <InputNumberComponent
                     id="AnnualGross"
                     onChange={(e) =>
                       setFormData({
                         ...formData,
                         annualGross: e.target.value,
                       })
                     }
                     value={formData.annualGross}
                     disable={commonSettings.setReadOnly}
                  />
                    
                  </div>

                  <div className="flex flex-column w-6 gap-2">
                    <label
                      htmlFor="ReplaceJustification"
                      className="font-bold text-sm"
                    >
                      Replacement Justification
                    </label>
                    <InputTextareaComponent
                      autoResize
                      id="ReplaceJustification"
                      className="bg-gray-100"
                      value={formData.replaceJustification}
                      disable={commonSettings.setReadOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          replaceJustification: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column mb-2 w-6 gap-2">
                <label htmlFor="jobDescription" className="font-bold text-sm">
                  Job Description
                  <RedAsterisk />
                </label>
                <EditorComponent
                  value={formData.jobDescription}
                  headerTemplate={header}
                  onTextChanged={onTextChanged}
                  disable={commonSettings.setReadOnly}
                />
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="skills" className="font-bold text-sm">
                  Skills
                 
                </label>
                <EditorComponent
                  value={formData.skills}
                  headerTemplate={header}
                  onTextChanged={onTextChangedSkill}
                  disable={commonSettings.setReadOnly}
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5 ">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="Justification" className="font-bold text-sm">
                  Justification
                  
                </label>

                <InputTextareaComponent
                  autoResize
                  id="Justification"
                  className="bg-gray-100"
                  rows={6}
                  cols={10}
                  value={formData.justification}
                  onChange={(e) =>
                    setFormData({ ...formData, justification: e.target.value })
                  }
                  disable={commonSettings.setReadOnly}
                />
              </div>
              <div className="flex flex-column gap-4 w-6">
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="MinTargetSalary"
                    className="font-bold text-sm"
                  >
                    Min Target Salary
                    
                  </label>
                  <InputNumberComponent
                    id="MaxTargetSalary"
                    onChange={handleMinSalaryChange}
                    value={formData.minTargetSalary}
                    disable={commonSettings.setReadOnly}
                  />
                </div>
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="MaxTargetSalary"
                    className="font-bold text-sm"
                  >
                    Max Target Salary
                   
                  </label>
                  <InputNumberComponent
                    id="MaxTargetSalary"
                    onChange={handleMaxSalaryChange}
                    value={formData.maxTargetSalary}
                    disable={commonSettings.setReadOnly}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-content-between gap-5">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="resumeReviewer" className="font-bold text-sm">
                  Resume Reviewer
                </label>

                <MultiSelectDropdown
                  id="resumeReviewer"
                  options={dropdownData.resumereviewer}
                  value={arrayToObj(
                    dropdownData.resumereviewer,
                    strToArray(formData.resumeReviewerEmployeeIds)
                  )}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resumeReviewerEmployeeIds: objToArray(e.value),
                    })
                  }
                  optionLabel="name"
                  disable={commonSettings.setReadOnly}

                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="interviewer" className="font-bold text-sm">
                  Interviewer/Panel
                </label>

                <MultiSelectDropdown
                  id="interviewer"
                  options={dropdownData.interviewReviewer}
                  value={arrayToObj(
                    dropdownData.interviewReviewer,
                    strToArray(formData.interviewerEmployeeIds)
                  )}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interviewerEmployeeIds: objToArray(e.value),
                    })
                  }
                  disable={commonSettings.setReadOnly}
                  optionLabel="name"
                  // optionValue="employeeId"
                />
              </div>
            </div>
            { getReqRoleId  && (
              <>
            <div className="flex justify-content-between">
              <h1 className="my-2 ">
                EMAIL APPROVAL/SIGNATURE DATES
                <RedAsterisk />:
              </h1>
            </div>
            <div id="first" className="flex justify-content-evenly gap-4">
              <div className="flex flex-column gap-2">
                <label htmlFor="Position" className="font-bold text-sm">
                  Position
                </label>
                <InputTextCp
                  type="text"
                  id="Position"
                  className="p-disabled"
                  onChange={(e) => setFormData({ ...formData, Position: 7 })}
                  //
                  value="Hiring Manager"
                />
              </div>

              <div className="flex flex-column gap-2 w-3">
                <label htmlFor="Name" className="font-bold text-sm">
                  Name
                </label>
                {/* Assuming DropdownComponent renders an input */}
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="hiringManager"
                  options={dropdownData.hiringManager}
                  value={formData.hiringManagerId}
                  disable={commonSettings.setHiringManager}
                  onChange={(e) => {
                    const selectedHiringManagerId = e.target.value;
                    const selectedHiringManager =
                      dropdownData.hiringManager.find(
                        (manager) =>
                          manager.employeeId === selectedHiringManagerId
                      );

                    if (selectedHiringManager) {
                      setFormData({
                        ...formData,
                        hiringManagerId: selectedHiringManagerId,
                        hiringManagerEmpId: selectedHiringManager.employeeCode,
                      });
                    }
                  }}
                />
              </div>

              <div className="flex flex-column gap-2">
                <label htmlFor="EmployeeCode" className="font-bold text-sm">
                  Employee ID
                </label>
                <InputTextCp
                  id="hiringManagerEmpId"
                  className="p-disabled"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hiringManagerEmpId: e.target.value,
                    })
                  }
                  value={formData.hiringManagerEmpId}
                  disable={commonSettings.setHiringManager}
                />
              </div>

              <div className="flex flex-column gap-2">
                <label htmlFor="ApprovalDate" className="font-bold text-sm">
                  Approval Date
                </label>
                {/* Assuming CalendarComponent renders an input */}
                <CalendarComponent
                  id="ApprovalDate"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.hmApprovalDate)}
                  minDate={new Date()}
                  disable={commonSettings.setHiringManager}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hmApprovalDate: e.target.value,
                    })
                  }
                />
              </div>
            </div> <div id="third" className="flex justify-content-evenly gap-4">
              <div className="flex flex-column gap-2">
                <InputTextCp
                  type="text"
                  id="Position"
                  className="p-disabled"
                  onChange={(e) => setFormData({ ...formData, Position: 9 })}
                  value="Site HR SPOC"
                  
                />
              </div>
              <div className="flex flex-column gap-2 w-3">
                {/* Assuming DropdownComponent renders an input */}
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="siteHRSPOCId"
                  options={dropdownData.siteHRSPOC}
                  value={formData.siteHRSPOCId}
                  disable={commonSettings.setSiteHRSPOCApproval}
                  onChange={(e) => {
                    const selectedsiteHRSPOCId = e.target.value;
                    const selectedsiteHRSPOCEmpId =
                      dropdownData.siteHRSPOC.find(
                        (manager) => manager.employeeId === selectedsiteHRSPOCId
                      );

                    if (selectedsiteHRSPOCEmpId) {
                      setFormData({
                        ...formData,
                        siteHRSPOCId: selectedsiteHRSPOCId,
                        siteHRSPOCEmpId: selectedsiteHRSPOCEmpId.employeeCode,
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-column gap-2">
                <InputTextCp
                  id="siteHRSPOCEmpId"
                  className="p-disabled"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      siteHRSPOCEmpId: e.target.value,
                    })
                  }
                  value={formData.siteHRSPOCEmpId}
                  // disable={commonSettings.setSiteHRSPOCApproval}
                />
              </div>
              <div className="flex flex-column gap-2">
                {" "}
                {/* Assuming CalendarComponent renders an input */}
                <CalendarComponent
                  id="ApprovalDate"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.spApprovalDate)}
                  disable={commonSettings.setSiteHRSPOCApproval}
                  minDate={new Date()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      spApprovalDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div id="second" className="flex justify-content-evenly gap-4">
              <div className="flex flex-column gap-2">
                <InputTextCp
                  type="text"
                  id="Position"
                  className="p-disabled"
                  
                  onChange={(e) => setFormData({ ...formData, Position: 8 })}
                  value="HOD"
                />
              </div>

              <div className="flex flex-column gap-2 w-3">
                {/* Assuming DropdownComponent renders an input */}
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="functionHead"
                  options={dropdownData.functionHead}
                  value={formData.functionHeadId}
                  disable={commonSettings.setHodapprovalName}
                  onChange={(e) => {
                    const selectedfunctionHeadId = e.target.value;
                    const selectedfunctionHead = dropdownData.functionHead.find(
                      (manager) => manager.employeeId === selectedfunctionHeadId
                    );

                    if (selectedfunctionHead) {
                      setFormData({
                        ...formData,
                        functionHeadId: selectedfunctionHeadId,
                        functionHeadEmpId: selectedfunctionHead.employeeCode,
                      });
                    }
                  }}
                />
              </div>

              <div className="flex flex-column gap-2">
                <InputTextCp
                  id="functionHeadEmpId"
                  className="p-disabled"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      functionHeadEmpId: e.target.value,
                    })
                  }
                  value={formData.functionHeadEmpId}
                  // disable={commonSettings.setHodapproval}
                />
              </div>

              <div className="flex flex-column gap-2">
                <CalendarComponent
                  id="fhApprovalDate"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.fhApprovalDate)}
                  disable={commonSettings.setHodapprovalDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fhApprovalDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
           
            <div id="forth" className="flex justify-content-evenly gap-4">
              <div className="flex flex-column gap-2">
                <InputTextCp
                  type="text"
                  id="Position"
                  className="p-disabled"
                  onChange={(e) => setFormData({ ...formData, Position: 10 })}
                  value="Finance Head"
                  
                />
              </div>
              <div className="flex flex-column gap-2 w-3">
                {/* Assuming DropdownComponent renders an input */}
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="financeHead"
                  options={dropdownData.financeHead}
                  value={formData.financeHeadId}
                  disable={commonSettings.setFinanceHeadApprovalName}
                  onChange={(e) => {
                    const selectedfinanceHeadId = e.target.value;
                    const selectedfinanceHeadEmpId =
                      dropdownData.financeHead.find(
                        (manager) =>
                          manager.employeeId === selectedfinanceHeadId
                      );

                    if (selectedfinanceHeadEmpId) {
                      setFormData({
                        ...formData,
                        financeHeadId: selectedfinanceHeadId,
                        financeHeadEmpId: selectedfinanceHeadEmpId.employeeCode,
                      });
                    }
                  }}
                />
              </div>
              <div className="flex flex-column gap-2">
                <InputTextCp
                  id="financeHeadEmpId"
                  className="p-disabled"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financeHeadEmpId: e.target.value,
                    })
                  }
                  value={formData.financeHeadEmpId}
                  // disable={commonSettings.setFinanceHeadApproval}
                />
              </div>
              <div className="flex flex-column gap-2">
                <CalendarComponent
                  id="ApprovalDate"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.fiApprovalDate)}
                  minDate={new Date()}
                  disable={commonSettings.setFinanceHeadApprovalDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fiApprovalDate: e.target.value,
                    })
                  }
                />
              </div>{" "}
            </div>
            <div id="fifth" className="flex justify-content-evenly gap-4">
              <div className="flex flex-column gap-2">
                <InputTextCp
                  type="text"
                  id="Position"
                  className="p-disabled"
                  onChange={(e) => setFormData({ ...formData, Position: 11 })}
                  value="President & COO"
                  // disable={commonSettings.setCooapproval}
                />
              </div>

              <div className="flex flex-column gap-2 w-3">
                {/* Assuming DropdownComponent renders an input */}
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="presidentnCOO"
                  options={dropdownData.presidentnCOO}
                  value={formData.presidentnCOOId}
                  disable={commonSettings.setCooapprovalName}
                  onChange={(e) => {
                    const selectedpresidentnCOOId = e.target.value;
                    const selectedpresidentnCOOEmpId =
                      dropdownData.presidentnCOO.find(
                        (manager) =>
                          manager.employeeId === selectedpresidentnCOOId
                      );

                    if (selectedpresidentnCOOEmpId) {
                      setFormData({
                        ...formData,
                        presidentnCOOId: selectedpresidentnCOOId,
                        presidentnCOOEmpId:
                          selectedpresidentnCOOEmpId.employeeCode,
                      });
                    }
                  }}
                />
              </div>

              <div className="flex flex-column gap-2">
                <InputTextCp
                  id="presidentnCOOEmpId"
                  className="p-disabled"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      presidentnCOOEmpId: e.target.value,
                    })
                  }
                  value={formData.presidentnCOOEmpId}
                />
              </div>

              <div className="flex flex-column gap-2">
                <CalendarComponent
                  id="pcApprovalDate"
                  inputClassName="bg-gray-100"
                  value={new Date(formData.pcApprovalDate)}
                  minDate={new Date()}
                  disable={commonSettings.setCooapprovalDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pcApprovalDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            </>
            )}
          </section>

          <div className="flex flex-wrap justify-content-end gap-5 mt-3">
            {/* <CreateRequisitionButtonHandle getReqId = {getReqId}
    RoleId = {getReqRoleId}
    status = {status}
    formData={formData}
    /> */}

            {(() => {
              if (getReqRoleId == 3) {
                switch (formData.mrfStatusId) {
                  case MRF_STATUS.draft:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={1}
                          label={"SAVE AS DRAFT"}
                          message={"Do you want to Submit this MRF as Draft?"}
                          formData={formData}
                          roleID={getReqRoleId }
                        />

                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={2}
                          label={"SUBMIT"}
                          message={
                            "After submitting you won't be able to edit the MRF details"
                          }
                          formData={formData}
                          roleID={getReqRoleId }
                        />
                      </>
                    );
                  case MRF_STATUS.submToHr:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={9}
                          label={"Withdraw"}
                          formData={formData}

                          message={"Do you want to withdraw this MRF?"}
                        />
                      </>
                    );
                  case MRF_STATUS.closed:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.withdrawn:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.onHold:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.resubReq:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          
                        />
<MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={2}
                          label={"SUBMIT"}
                          message={
                            "After submitting you won't be able to edit the MRF details"
                          }
                          formData={formData}
                          roleID={getReqRoleId }
                        />
                        
                      </>
                    );
                  case MRF_STATUS.rejected:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.open:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={9}
                          label={"Withdraw"}
                          formData={formData}
                          message={"Do you want to withdraw this MRF?"}
                        />
                      </>
                    );
                }
              } else if (getReqRoleId == 4) {
                switch (formData.mrfStatusId) {
                  case MRF_STATUS.submToHr:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                         <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={mrfStatusId}
                          label={"Update"}
                          formData={formData}
                          updatedClick={true}
                          message={"Are you sure you want to update?"}
                          
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={3}
                          header={"Resubmission"}
                          label={"Resubmission Required"}
                          textbox={true}
                          formData={formData}

                        />
  <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={11}
                          label={"Send for HOD approval"}
                          formData={formData}
                          disabled={(formData.functionHeadId != 0)? false:true}
                          message={
                            "Do you want to submit it for HOD approval?"
                          }
                        />
                        

                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={7}
                          label={"On Hold"}
                          formData={formData}

                          message={"Do you want to hold on this MRF?"}
                        />
                      </>
                    );
                  case MRF_STATUS.closed:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          formData={formData}

                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.withdrawn:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          formData={formData}

                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.onHold:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={11}
                          formData={formData}

                          label={"Send to HOD approval"}
                          message={
                            "Do you want to submit it for HOD approval?"
                          }
                        />
                      </>
                    );
                  case MRF_STATUS.hodapproval:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={mrfStatusId}
                          label={"Update"}
                          formData={formData}
                          // updatedClick={true}
                          message={"Are you sure you want to update?"}
                          
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={13}
                          formData={formData}
                          label={"Send to Finance Head approval"}
                          disabled={(formData.financeHeadId != 0)? false:true}
                          // financeHeadClick={true}
                          message={
                            "Do you want to submit it for Finance Head approval?"
                          }
                        />
                      
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={7}
                          label={"On Hold"}
                          formData={formData}
                          message={"Do you want to hold on this MRF?"}
                        />
                      </>
                    );
                  case MRF_STATUS.cooapproval:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      
                         <MrfPartialStatus
                            mrfId={getReqId}
                            mrfStatusId={6}
                            label={"Open"}
                            formData={formData}

                            message={"Do you want to open this MRF?"}
                          /> 
                       
                      </>
                    );
                  case MRF_STATUS.resubReq:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.rejected:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                      </>
                    );
                  case MRF_STATUS.awaitHodApproval:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2  surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                         <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={mrfStatusId}
                          label={"Update"}
                          formData={formData}
                          updatedClick={true}
                          message={"Are you sure you want to update?"}
                          
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={4}
                          formData={formData}
                          label={"Received HOD approval"}
                          // disabled={(formData.presidentnCOOId != 0)? false:true}
                          message={
                            "Do you want to submit it as Received HOD Approval?"
                          }
                        />
                        
                      </>
                    );
                  case MRF_STATUS.awaitfinanceHeadApproval:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={mrfStatusId}
                          label={"Update"}
                          formData={formData}
                          updatedClick={true}
                          message={"Are you sure you want to update?"}
                          
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={15}
                          formData={formData}
                          label={"By Pass"}
                          message={"Do you want to ByPass MRF?"}
                        />
                         <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={14}
                          formData={formData}
                          label={"Received Finance Head approval"}
                          // disabled={(formData.presidentnCOOId != 0)? false:true}
                          message={
                            "Do you want to submit it as Received Finance Head approval?"
                          }
                        />
                        
                      </>
                    );
                    case MRF_STATUS.recivedfinanceHeadApproval:
                      return (
                        <>
                          <ButtonC
                            label="CANCEL"
                            className=" w-2 surface-hover border-red-600 text-red-600"
                            onClick={handleCancel}
                            formData={formData}
                            outlined="true"
                            // disable="true"
                          />
                           <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={12}
                          formData={formData}
                          label={"Send to COO approval"}
                          cooClick={true}
                          disabled={(formData.presidentnCOOId != 0)? false:true}
                          message={
                            "Do you want to submit it for COO approval?"
                          }
                        /> 
                        
                          
                        </>
                      );
                      case MRF_STATUS.bypassFinanceHeadApproval:
                      return (
                        <>
                          <ButtonC
                            label="CANCEL"
                            className=" w-2 surface-hover border-red-600 text-red-600"
                            onClick={handleCancel}
                            formData={formData}
                            outlined="true"
                            // disable="true"
                          />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={12}
                          formData={formData}
                          label={"Send to COO approval"}
                          // cooClick={true}
                          disabled={(formData.presidentnCOOId != 0)? false:true}
                          message={
                            "Do you want to submit it for COO approval?"
                          }
                        />
                    
                        </>
                      );
                  case MRF_STATUS.awaitCooApproval:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={mrfStatusId}
                          label={"Update"}
                          formData={formData}
                          updatedClick={true}
                          message={"Are you sure you want to update?"}
                          
                        />
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={5}
                          formData={formData}
                          // disabled={(formData.financeHeadId != 0)? false:true}

                          label={"Received COO approval"}
                          message={"Do you want to submit it as Received COO Approval?"}
                        />
                      </>
                    );
                  case MRF_STATUS.open:
                    return (
                      <>
                        <ButtonC
                          label="CANCEL"
                          className=" w-2 surface-hover border-red-600 text-red-600"
                          onClick={handleCancel}
                          outlined="true"
                          // disable="true"
                        />
                        
                        <ButtonC
                          label="Add Resume"
                          className="w-2 bg-red-600 border-red-600"
                          onClick={() => {
                            dispatch(
                              PAGE_ACTIONS.setParams({
                                params: {
                                  mrfId: getReqId,
                                  referenceNo: formData.referenceNo,
                                },
                              })
                            );
                            navigateTo("add_candidate");
                          }}
                          // disable="true"
                        />
                      </>
                    );
                }
              } else {
                return (
                  <>
                    <ButtonC
                      label="CANCEL"
                      className=" w-2  surface-hover border-red-600 text-red-600"
                      onClick={handleCancel}
                      outlined="true"
                      // disable="true"
                    />
                    <MrfPartialStatus
                      mrfId={getReqId}
                      mrfStatusId={1}
                      label={"SAVE AS DRAFT"}
                      message={"Do you want to Submit this MRF as Draft?"}
                      formData={formData}
                      roleID={getReqRoleId }
                      
                    />

                    <MrfPartialStatus
                      mrfId={getReqId}
                      mrfStatusId={2}
                      label={"SUBMIT"}
                      message={
                        "After submitting you won't be able to edit the MRF details"
                      }
                      formData={formData}
                      roleID={roleId }
                    />
                  </>
                );
              }
            })()}

            <ToastMessages ref={toastRef} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateRequisitionBody;
