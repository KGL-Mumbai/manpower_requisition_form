import React, { useState, useEffect, useRef } from "react";
import {
  commonSettings,
  applySettingsBasedOnRoleAndStatus,
} from "../components/commonSetting";
import "../css/InputComponent.css";
import DropdownComponent from "./../components/Dropdown";
import InputTextCp from "./../components/Textbox";
import ButtonC from "./../components/Button";
import CalendarComponent from "./../components/Calendar";
import CheckboxComponent from "./../components/Checkbox";
import InputTextareaComponent from "./../components/InputTextarea";
import InputNumberamount from "./../components/InputNumberAmount";
import { Editor } from "primereact/editor";
import ToastMessages from "./../components/ToastMessages";
import MultiSelectDropdown from "./../components/multiselectDropdown";
import '../css/CreateRequistionBody.css';
import {
  getData1,
  getDataAPI,
  navigateTo,
  removeHtmlTags,
} from "../constants/Utils";
import {
  API_URL,
  FORM_SCHEMA_CR,
  GENDER,
  MAX_EXPERIENCE_OPTIONS,
  MIN_EXPERIENCE_OPTIONS,
  MRF_STATUS,
  REQUISITION_TYPE,
  ROLES,
  emailRegex,
} from "../constants/config";
import { storageService } from "../constants/storage";
import MrfPartialStatus from "../components/MrfPartialStatus";
import { useDispatch, useSelector } from "react-redux";
import { PAGE_ACTIONS } from "../reducers/Page_r";
import EditorComponent from "../components/EditorComponent";
import InputNumberComponent from "../components/InputNumberComponent";
import DropdownAddNew from "./../components/DropDownAddNew";
import { Message } from "primereact/message";
import { Knob } from "primereact/knob";

const CreateRequisitionBody = ({
  getReqId = null,
  getReqRoleId = null,
  // status = null,
  // mrfStatusId = null,
  roleId = null, // if we are directly coming to this page for creating mrf
}) => {
  // State to hold all the dropdown data
  const [dropdownData, setDropdownData] = useState({});
  const [subDepartments, setSubDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const RedAsterisk = () => <span className="text-red-500">*</span>;
  const [minSal, setMinSal] = useState(0.0);
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const [formData, setFormData] = useState();
  const [emailError, setEmailError] = useState(false);
  const [siteHrSpocBtnDisable, setSiteHrSpocBtnDisable] = useState(true);
  const [hiringManagerBtnDisable, setHiringManagerBtnDisable] = useState(true);
  const [siteHrSpocValue, setSiteHrSpocValue] = useState(0);
  const [hiringManagerValue, setHiringManagerValue] = useState(0);
  const { profile } = useSelector((state) => state.page);

  const OnLoad = async () => {
    const result = await getDataAPI(API_URL.GET_CREATE_REQUISITION_DROPDOWN);
    const dropDowndata = await result.json();
    // setDropdownData(dropDowndata.result);
    return dropDowndata.result;
  };

  useEffect(() => {
    // Fetch the data for all the dropdowns

    setData();
  }, []);
  const setData = async () => {
    const dropData = await OnLoad();
    GetData(dropData);
  };
  const GetData = async (dropData) => {
    if (getReqId) {
      let result = await getDataAPI(
        API_URL.GET_CREATE_REQUISITION_DEATILS + getReqId
      );
      let response = await result.json();
      setDropdownData(dropData);
      // setFormData({
      //   ...formData,
      //   siteHrSpocCheckValu: response.siteHRSPOCId,
      //   siteHrSpocCheckValu: response.hiringManagerId,
      // });
      setSiteHrSpocValue(response.siteHRSPOCId);
      setHiringManagerValue(response.hiringManagerId);
      setFormData({ ...formData, ...response });

      if (response && response.departmentId > 0) {
        fetchSubDepartments(response.departmentId);
      }
      if (profile.roleId === ROLES.resumeReviwer || profile.roleId === ROLES.interviewer) {
        navigateTo("dashboard");
      }
      if ((response.siteHRSPOCId > 0) && (profile.roleId === ROLES.hr && response.siteHRSPOCId != storageService.getData("profile").employeeId) ||
        ((response.siteHRSPOCId > 0) && (profile.roleId === ROLES.mrfOwner && response.hiringManagerId != storageService.getData("profile").employeeId))) {
        navigateTo("dashboard");
      }

    } else {
      setDropdownData(dropData);
      setFormData(FORM_SCHEMA_CR);

      if (roleId === 4 || profile.roleId === ROLES.resumeReviwer || profile.roleId === ROLES.interviewer) {
        navigateTo("dashboard");
      }
    }
  };
  if (getReqId && formData) {
    applySettingsBasedOnRoleAndStatus(
      getReqRoleId,
      formData.mrfStatusId,
      roleId,
      commonSettings
    );

  } else {
    applySettingsBasedOnRoleAndStatus(
      getReqRoleId,
      null,
      roleId,
      commonSettings
    );
  }

  const handleMinSalaryChange = (e) => {
    const minSalary = e.target.value;
    if (formData.maxTargetSalary !== 0) {
      if (minSalary > formData.maxTargetSalary) {
        toastRef.current.showWarrningMessage(
          "Min Target Salary is Greater than Max Target salary"
        );

      }
    }

    setFormData({ ...formData, minTargetSalary: minSalary });
  };

  const refreshParentComponent = () => {
    setSiteHrSpocBtnDisable(true);
    setHiringManagerBtnDisable(true);
    setData();
  };

  // const handleMaxSalaryChange = (e) => {
  //   const maxSalary = e.target.value;

  //   setFormData((prevFormData) => {
  //     if (minSal !== 0) {
  //       if (maxSalary < minSal) {
  //         toastRef.current.showWarrningMessage(
  //           "Max Target Salary is Less than Min Target salary"
  //         );
  //         return prevFormData;
  //       } else {
  //         return {
  //           ...prevFormData,
  //           minTargetSalary: minSal,
  //           maxTargetSalary: maxSalary,
  //         };
  //       }
  //     } else if (maxSalary < prevFormData.minTargetSalary) {
  //       toastRef.current.showWarrningMessage(
  //         "Max Target Salary is Less than Min Target salary"
  //       );
  //       return prevFormData;
  //     }

  //     return { ...prevFormData, maxTargetSalary: maxSalary };
  //   });
  // };

  const handleMaxSalaryChange = (e) => {
    const maxSalary = e.target.value;

    if (formData.minTargetSalary > maxSalary) {
      toastRef.current.showWarrningMessage(
        "Min Target Salary is Greater than Max Target salary"
      );

    }

    setFormData({ ...formData, maxTargetSalary: maxSalary });
  }


  const handleMinGradeChange = (e) => {
    // setFormData({ ...formData, minGradeId: e.target.value });
    handleMinChange(e);
  };

  const handleMinChange = (e) => {
    const minGradeId = e.target.value;
    if (minGradeId !== "" && formData.maxGradeId !== 0) {
      if (minGradeId > formData.maxGradeId) {
        toastRef.current.showWarrningMessage(
          "Min Grade is greater than Max Grade"
        );
        return;
      }
    }
    setFormData({ ...formData, minGradeId: minGradeId });
  };

  const handleMaxGradeChange = (e) => {
    // setFormData({ ...formData, maxGradeId: e.target.value });
    handleMaxChange(e);
  };

  const handleMaxChange = (e) => {
    const maxGradeId = e.target.value;
    if (maxGradeId !== "" && formData.minGradeId !== 0) {
      if (maxGradeId < formData.minGradeId) {
        toastRef.current.showWarrningMessage(
          "Max Grade is Less than Min Grade"
        );
        return;
      }
    }
    setFormData({ ...formData, maxGradeId: maxGradeId });
  };

  const handleEmail = (e) => {
    const emailValue = formData.emailId;
    if (!emailRegex.test(emailValue)) {
      toastRef.current.showWarrningMessage("Invalid Email format");
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const maxCharacterCountJustification = 500;
  const handleChangeJustification = (e) => {
    const value = e.target.value;

    if (value.length <= maxCharacterCountJustification) {
      setFormData({ ...formData, justification: value });
    } else {
      toastRef.current.showWarrningMessage("Character limit Exceed: " + maxCharacterCountJustification)
    }
  };

  let remaningCharacterJustification = 0;
  if (formData) {
    remaningCharacterJustification =
      maxCharacterCountJustification - formData.justification.length;
  }

  const onTextChangedSkill = (oVal) => {
    setFormData({ ...formData, skills: oVal.htmlText, skillsText: oVal.text });
  };

  const onTextChangedJobDesc = (oVal) => {
    setFormData({
      ...formData,
      jobDescription: oVal.htmlText,
      jobDescriptionText: oVal.text,
    });
  };

  const handleMinExpChange = (e) => {
    const minExp = e.target.value;
    if (formData.maxExperience !== 0) {
      if (minExp > formData.maxExperience) {
        toastRef.current.showWarrningMessage(
          "Min Experience is Greater than Max Experience"
        );
        return;
      }
    }
    setFormData({ ...formData, minExperience: minExp });
    //setFormData({ ...formData, maxExperience: minExp });
  };

  const handleMaxExpChange = (e) => {
    const maxExp = e.target.value;

    if (maxExp < formData.minExperience) {
      toastRef.current.showWarrningMessage(
        "Max Experience is Less than Min Experience"
      );
      return;
    }
    setFormData({ ...formData, maxExperience: maxExp });
  };

  const fetchSubDepartments = async (selectedDepartment) => {
    let result = await getDataAPI(
      API_URL.GET_CREATE_REQUISITION_DEPARTMENT + selectedDepartment
    );
    let response = await result.json();
    setSubDepartments(response.result);
  };
  const AddInDropdwon = async (Name, PosORPr) => {
    let apiUrl = "";
    if (PosORPr === 1) {
      apiUrl = API_URL.ADD_POSITIONTITLE;
    } else {
      //alert(API_URL.ADD_PROJECT);
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
        toastRef.current.showSuccessMessage("Item added successfully!");
        const dropdata = await OnLoad();
        setDropdownData(dropdata);
      } else {
        console.error("Failed to add item");
        toastRef.current.showConflictMessage("Failed to add item");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  /* useEffect(() => {
    if (!formData || formData.departmentId === 0) {
      return;
    }
  }, [formData]); */

  const setDepartment = (value) => {
    setFormData({ ...formData, departmentId: value });
    fetchSubDepartments(value);
  }
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

        <span></span>
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

        >
          {getReqId ? "" : <h3 className="text-xl my-2">Fill the Details</h3>}

          <section
            className="flex flex-column flex-nowrap gap-3 
      
        py-3 px-1 overflow-y-scroll"
            style={{ height: "95%" }}
          >
            {getReqId ? (
              <div className="flex justify-content-between gap-5">
                <div className="flex flex-column w-19 gap-2 ">
                  <h4 className="text-xl my-2 flex flex-row align-items-center gap-2  ">
                    Reference Number:{" "}
                    <span className="text-red-600 flex flex-row align-items-center gap-2  ">
                      {formData.referenceNo}

                      <span className="status_message" >{`${formData.mrfStatus}`} </span>
                      {/* {`(${formData.mrfStatus})`} */}
                    </span>
                  </h4>
                </div>
              </div>
            ) : (
              ""
            )}
            {/* {formData.mrfStatusId == 3 && getReqRoleId == 4 ? (
              <span className="font-bold  ">
                <Message text={`MRF is yet to be ReSubmit`} />{" "}
              </span>
            ) : (
              ""
            )} */}
            {formData.mrfStatusId == 3 ? (
              <label
                htmlFor="RequisitionType"
                className="font-semibold text-base"
              >
                <span className="font-bold text-red-600 text-lg flex flex-column ">Note:</span>
                <p className="note_message"   >{formData.note}</p>
                {/* {formData.note} */}
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
                    setFormData({
                      ...formData,
                      positionTitleId: e.target.value,
                    });
                  }}
                  onAddItem={(newItem) => {
                    AddInDropdwon(newItem, 1);
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
                    setDepartment(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="sub-department" className="font-bold text-sm">
                  Sub-Department
                </label>
                <DropdownComponent
                  inputClassName="bg-gray-100"
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
                    AddInDropdwon(newItem, 2);
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
                  filter={true}
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

              <div className="flex flex-column w-6 gap-2 ">
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
                    onChange={(e) => handleMinGradeChange(e)}
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
                    onChange={(e) => handleMaxGradeChange(e)}
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
                  maxLength={2}
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
                  <RedAsterisk />
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
                    onChange={handleMinExpChange}
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
                    onChange={handleMaxExpChange}
                    className="custom-width"
                  />
                </div>
              </div>
              <div className="flex flex-column w-6 row-gap-2">
                <label htmlFor="gender" className="font-bold text-sm">
                  Gender
                  <RedAsterisk />
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
                  <RedAsterisk />
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
                      <RedAsterisk />
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
                      <RedAsterisk />
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
                      <RedAsterisk />
                    </label>
                    <InputTextCp
                      id="EmployeeEmail"
                      onChange={(e) =>
                        setFormData({ ...formData, emailId: e.target.value })
                      }
                      value={formData.emailId}
                      onBlur={handleEmail}
                      disable={commonSettings.setReadOnly}
                    />
                  </div>

                  <div className="flex flex-column w-6 gap-2">
                    <label htmlFor="EmployeeCode" className="font-bold text-sm">
                      Employee Code
                      <RedAsterisk />
                    </label>
                    <InputNumberComponent
                      id="EmployeeCode"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeCode: e.target.value,
                        })
                      }
                      maxLength={6}
                      useGrouping={false}
                      value={formData.employeeCode}
                      disable={commonSettings.setReadOnly}
                    />
                  </div>
                </div>
                <div className="flex justify-content-between gap-5">
                  <div className="flex flex-column w-6 gap-2">
                    <label htmlFor="AnnualCTC" className="font-bold text-sm">
                      Annual CTC (in LPA)
                      <RedAsterisk />
                    </label>
                    <InputNumberamount
                      id="AnnualCTC"
                      onChange={(e) =>
                        setFormData({ ...formData, annualCtc: e.target.value })
                      }
                      value={formData.annualCtc}
                      disable={commonSettings.setReadOnly}
                    />

                    <label htmlFor="AnnualGross" className="font-bold text-sm">
                      Annual Gross (in LPA)
                      <RedAsterisk />
                    </label>
                    <InputNumberamount
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
                      <RedAsterisk />
                    </label>
                    <InputTextareaComponent
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
                  onTextChanged={onTextChangedJobDesc}
                  disable={commonSettings.setReadOnly}
                  max={6000}
                />
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="skills" className="font-bold text-sm">
                  Skills
                  <RedAsterisk />
                </label>
                <EditorComponent
                  value={formData.skills}
                  headerTemplate={header}
                  onTextChanged={onTextChangedSkill}
                  disable={commonSettings.setReadOnly}
                  max={500}
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-5 ">
              <div className="flex flex-column relative inline-block w-6 gap-2">
                <label htmlFor="Justification" className="font-bold text-sm">
                  Justification <RedAsterisk />
                </label>

                <InputTextareaComponent
                  id="Justification"
                  value={formData.justification}
                  onChange={handleChangeJustification}
                  rows={6}
                  cols={90}
                  readOnly={commonSettings.setReadOnly}
                  className="justification_textbox"
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "7px",
                    right: "20px",
                    zIndex: "100",
                    textAlign: "right",
                  }}
                >
                  <Knob
                    value={
                      maxCharacterCountJustification -
                      remaningCharacterJustification
                    }
                    max={maxCharacterCountJustification}
                    readOnly
                    size={50}
                    rangeColor="#aaaaaa"
                    valueColor="#d32f2e"
                    textColor="#000000"
                  />
                </div>
              </div>
              <div className="flex flex-column gap-4 w-6">
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="MinTargetSalary"
                    className="font-bold text-sm"
                  >
                    Min Target Salary (in LPA)
                    <RedAsterisk />
                  </label>
                  <InputNumberamount
                    id="MinTargetSalary"
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
                    Max Target Salary (in LPA)
                    <RedAsterisk />
                  </label>
                  <InputNumberamount
                    id="MaxTargetSalary"
                    onChange={handleMaxSalaryChange}
                    value={formData.maxTargetSalary}
                    disable={commonSettings.setReadOnly}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-content-between gap-4">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="resumeReviewer" className="font-bold text-sm">
                  Resume Reviewer
                  <RedAsterisk />
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
                      resumeReviewerEmployeeIds: objToArray(e.value).toString(),
                    })
                  }
                  display={"chip"}
                  optionLabel="name"
                  disable={commonSettings.setReadOnly}
                />
              </div>
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="interviewer" className="font-bold text-sm">
                  Interviewer
                  <RedAsterisk />
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
                      interviewerEmployeeIds: objToArray(e.value).toString(),
                    })
                  }
                  display={"chip"}
                  disable={commonSettings.setReadOnly}
                  optionLabel="name"
                // optionValue="employeeId"
                />
              </div>
            </div>
            <div className="flex justify-content-between gap-3">
              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="siteHRSPOCId" className="font-bold text-sm">
                  HR
                </label>
                <DropdownComponent
                  optionLabel="name"
                  optionValue="employeeId"
                  type="siteHRSPOCId"
                  options={dropdownData.siteHRSPOC}
                  value={formData.hrId ? formData.hrId : undefined}
                  disable={commonSettings.setReadOnly}
                  filter={true}
                  className="Hr_dropdown"
                  clearIcon={true}
                  onChange={(e) => {
                    setFormData({ ...formData, hrId: e.target.value });
                  }}
                />
              </div>
            </div>

            {(getReqRoleId === 4 ||
              (getReqRoleId === 3 &&
                formData.mrfStatusId !== MRF_STATUS.draft &&
                formData.mrfStatusId !== MRF_STATUS.resubReq)) && (
                <>
                  <div className="flex justify-content-between">
                    <h1 className="my-2 ">
                      EMAIL APPROVAL/SIGNATURE DATES
                      <RedAsterisk />:
                    </h1>
                  </div>
                  <div id="first" className="flex justify-content-evenly gap-3">
                    <div className="flex flex-column gap-2 ">
                      <label htmlFor="Position" className="font-bold text-sm">
                        Position
                      </label>
                      <InputTextCp
                        type="text"
                        id="Position"
                        className="p-disabled email_textbox"
                        onChange={(e) =>
                          setFormData({ ...formData, Position: 7 })
                        }
                        //
                        value="Hiring Manager"
                      />
                    </div>

                    <div className="flex flex-column gap-2 ">
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
                        placeholder={"Select Hiring Manager"}
                        className="email_dropdown"
                        onChange={(e) => {
                          const selectedHiringManagerId = e.target.value;
                          const selectedHiringManager =
                            dropdownData.hiringManager.find(
                              (manager) =>
                                manager.employeeId === selectedHiringManagerId
                            );
                          setHiringManagerBtnDisable(false);
                          if (selectedHiringManager) {
                            setFormData({
                              ...formData,
                              hiringManagerId: selectedHiringManagerId,
                              hiringManagerEmpId:
                                selectedHiringManager.employeeCode,
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-column gap-2 ">
                      <label htmlFor="EmployeeCode" className="font-bold text-sm">
                        Employee ID
                      </label>
                      <InputTextCp
                        id="hiringManagerEmpId"
                        className="p-disabled email_empId_textbox"
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
                        minDate={new Date(formData.createdOnUtc)}
                        maxDate={new Date()}
                        className={"email_calendar"}
                        disable={hiringManagerBtnDisable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hmApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    {(() => {
                      if (getReqRoleId == 4) {
                        return (
                          <>
                            <div className="flex flex-column gap-2 	">
                              <label
                                htmlFor="ApprovalDate"
                                className="font-bold text-sm"
                              >
                                Action
                              </label>
                              <MrfPartialStatus
                                mrfId={getReqId}
                                mrfStatusId={formData.mrfStatusId}
                                label={"Update"}
                                formData={formData}
                                className={"update_btn"}
                                refreshParent={refreshParentComponent}
                                hiringManagerUpdateClick={true}
                                disabled={hiringManagerBtnDisable}
                                message={"Are you sure you want to update?"}
                              />
                            </div>

                            <div className=" gap-4  w-5  ">
                              <label
                                htmlFor="ApprovalDate"
                                className="font-bold text-sm gap-3 "
                              >
                                Status
                              </label>

                              <div className=" gap-2 ">
                                {hiringManagerValue > 0 ? (
                                  <h4 className="show_status">Updated</h4>
                                ) : (
                                  <h4 className="show_status">Yet to be Updated</h4>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      }


                    })()}
                  </div>
                  <div id="third" className="flex justify-content-evenly gap-3">
                    <div className="flex flex-column gap-2">
                      <InputTextCp
                        type="text"
                        id="Position"
                        className="p-disabled email_textbox"
                        onChange={(e) =>
                          setFormData({ ...formData, Position: 9 })
                        }
                        value="Site HR SPOC"
                      />
                    </div>
                    <div className="flex flex-column gap-2 ">
                      <DropdownComponent
                        optionLabel="name"
                        optionValue="employeeId"
                        type="siteHRSPOCId"
                        options={dropdownData.siteHRSPOC}
                        value={formData.siteHRSPOCId}
                        placeholder={"Select Site HR SPOC"}
                        className="email_dropdown"
                        disable={commonSettings.setSiteHRSPOCApproval}
                        onChange={(e) => {
                          const selectedsiteHRSPOCId = e.target.value;
                          const selectedsiteHRSPOCEmpId =
                            dropdownData.siteHRSPOC.find(
                              (manager) =>
                                manager.employeeId === selectedsiteHRSPOCId
                            );
                          setSiteHrSpocBtnDisable(false);
                          if (selectedsiteHRSPOCEmpId) {
                            setFormData({
                              ...formData,
                              siteHRSPOCId: selectedsiteHRSPOCId,
                              siteHRSPOCEmpId:
                                selectedsiteHRSPOCEmpId.employeeCode,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-column gap-2  ">
                      <InputTextCp
                        id="siteHRSPOCEmpId"
                        className="p-disabled email_empId_textbox"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            siteHRSPOCEmpId: e.target.value,
                          })
                        }
                        value={formData.siteHRSPOCEmpId}
                      />
                    </div>
                    <div className="flex flex-column gap-2">
                      <CalendarComponent
                        id="ApprovalDate"
                        inputClassName="bg-gray-100"
                        value={new Date(formData.spApprovalDate)}
                        disable={siteHrSpocBtnDisable}
                        minDate={new Date(formData.createdOnUtc)}
                        maxDate={new Date()}
                        className="email_calendar"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            spApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>



                    {(() => {
                      if (getReqRoleId == 4) {
                        return (
                          <>
                            <div className="flex flex-column gap-2 ">
                              <MrfPartialStatus
                                mrfId={getReqId}
                                mrfStatusId={formData.mrfStatusId}
                                label={"Update"}
                                formData={formData}
                                className={"update_btn"}
                                refreshParent={refreshParentComponent}
                                siteHRUpdateClick={true}
                                disabled={siteHrSpocBtnDisable}
                                message={"Are you sure you want to update?"}
                              />
                            </div>
                            {/* <div className=" gap-3 w-6   	  "> */}
                            <div className=" gap-2 w-6  ">
                              {siteHrSpocValue > 0 ? (
                                <h4 className="show_status">Updated</h4>
                              ) : (
                                <h4 className="show_status">Yet to be Updated</h4>
                              )}
                            </div>
                            {/* </div> */}
                          </>
                        );
                      }
                    })()}
                  </div>
                  <div id="second" className="flex justify-content-evenly gap-3">
                    <div className="flex flex-column gap-2">
                      <InputTextCp
                        type="text"
                        id="Position"
                        className="p-disabled email_textbox"
                        onChange={(e) =>
                          setFormData({ ...formData, Position: 8 })
                        }
                        value="HOD"
                      />
                    </div>

                    <div className="flex flex-column gap-2">
                      {/* Assuming DropdownComponent renders an input */}
                      <DropdownComponent
                        optionLabel="name"
                        optionValue="employeeId"
                        type="functionHead"
                        options={dropdownData.functionHead}
                        value={formData.functionHeadId}
                        placeholder={"Select HOD"}
                        disable={commonSettings.setHodapprovalName}
                        className="email_dropdown"
                        onChange={(e) => {
                          const selectedfunctionHeadId = e.target.value;
                          const selectedfunctionHead =
                            dropdownData.functionHead.find(
                              (manager) =>
                                manager.employeeId === selectedfunctionHeadId
                            );

                          if (selectedfunctionHead) {
                            setFormData({
                              ...formData,
                              functionHeadId: selectedfunctionHeadId,
                              functionHeadEmpId:
                                selectedfunctionHead.employeeCode,
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="flex flex-column gap-2 ">
                      <InputTextCp
                        id="functionHeadEmpId"
                        className="p-disabled email_empId_textbox"
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
                        className="email_calendar"
                        minDate={new Date(formData.createdOnUtc)}
                        maxDate={new Date()}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fhApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    {(() => {
                      if (getReqRoleId == 4) {
                        switch (formData.mrfStatusId) {
                          case MRF_STATUS.new:
                          case MRF_STATUS.onHold:
                            return (
                              <>
                                <div className="flex flex-column gap-2  ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={11}
                                    label={"Send to HOD Approval "}
                                    formData={formData}
                                    refreshParent={refreshParentComponent}
                                    className={"hod_btn"}
                                    disabled={
                                      formData.functionHeadId != 0 ? false : true
                                    }
                                    message={
                                      "Do you want to submit it for HOD approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6 ">
                                  <h4 className="show_status">Yet to be Approved</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.awaitHodApproval:
                            return (
                              <>
                                <div className="flex flex-column gap-2 ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={4}
                                    formData={formData}
                                    refreshParent={refreshParentComponent}
                                    className={"acknowledge_btn"}
                                    label={"Acknowledge"}
                                    message={
                                      "Do you want to submit it as Received HOD Approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6 ">
                                  <h4 className="show_status">Awaiting HOD approval</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.rejected:
                            if (formData.functionHeadId === formData.updatedByEmployeeId) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={4}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"acknowledge_btn"}
                                      label={"Acknowledge"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received HOD Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Rejected</h4>

                                  </div>
                                </>
                              );
                            }
                          default:
                            if (formData.functionHeadId === 0) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={11}
                                      label={"Send to HOD Approval "}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"hod_btn"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it for HOD approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Yet to be Approved</h4>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={4}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"acknowledge_btn"}
                                      label={"Acknowledge"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received HOD Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Received HOD Approval</h4>

                                  </div>
                                </>
                              );
                            }
                        }
                      }
                    })()}
                  </div>
                  <div id="forth" className="flex justify-content-evenly gap-3">
                    <div className="flex flex-column gap-2 ">
                      <InputTextCp
                        type="text"
                        id="Position"
                        className="p-disabled email_textbox"
                        onChange={(e) =>
                          setFormData({ ...formData, Position: 10 })
                        }
                        value="Finance Head"
                      />
                    </div>
                    <div className="flex flex-column gap-2 ">
                      {/* Assuming DropdownComponent renders an input */}
                      <DropdownComponent
                        optionLabel="name"
                        optionValue="employeeId"
                        type="financeHead"
                        options={dropdownData.financeHead}
                        value={formData.financeHeadId}
                        placeholder={"Select Finance Head"}
                        className={"email_dropdown"}
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
                              financeHeadEmpId:
                                selectedfinanceHeadEmpId.employeeCode,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-column gap-2 ">
                      <InputTextCp
                        id="financeHeadEmpId"
                        className="p-disabled email_empId_textbox"
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
                        className="email_calendar"
                        minDate={new Date(formData.createdOnUtc)}
                        maxDate={new Date()}
                        disable={commonSettings.setFinanceHeadApprovalDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fiApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    {(() => {
                      if (getReqRoleId == 4) {
                        switch (formData.mrfStatusId) {
                          case MRF_STATUS.hodapproval:
                            return (
                              <>
                                <div className="flex flex-column gap-2 ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={13}
                                    formData={formData}
                                    refreshParent={refreshParentComponent}
                                    className={"finance_btn"}
                                    label={"Send to Fin. Head Approval"}
                                    disabled={
                                      formData.financeHeadId != 0 ? false : true
                                    }
                                    // financeHeadClick={true}
                                    message={
                                      "Do you want to submit it for Finance Head approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6">
                                  <h4 className="show_status">Yet to be Approved</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.awaitfinanceHeadApproval:
                            return (
                              <>
                                <div className="flex flex-column gap-2 ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={14}
                                    formData={formData}
                                    className={"acknowledge_btn"}
                                    refreshParent={refreshParentComponent}
                                    label={"Acknowledge"}
                                    message={
                                      "Do you want to submit it as Received Finance Head approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6">
                                  <h4 className="show_status">Awaiting Fin. Head approval</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.onHold:
                            return (
                              <>
                                <div className="flex flex-column gap-2  ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={13}
                                    formData={formData}
                                    refreshParent={refreshParentComponent}
                                    className={"finance_btn"}
                                    label={"Send to Fin. Head Approval"}
                                    disabled={true}
                                    // financeHeadClick={true}
                                    message={
                                      "Do you want to submit it for Finance Head approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6 ">
                                  <h4 className="show_status">Yet to be Approved</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.rejected:
                            if (formData.financeHeadId === formData.updatedByEmployeeId) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2 ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={4}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"acknowledge_btn"}
                                      label={"Acknowledge"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received HOD Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6">
                                    <h4 className="show_status">Rejected</h4>
                                  </div>
                                </>
                              );
                            }
                          default:
                            if (formData.financeHeadId === 0) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={13}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"finance_btn"}
                                      label={"Send to Fin. Head Approval"}
                                      disabled={true}
                                      // financeHeadClick={true}
                                      message={
                                        "Do you want to submit it for Finance Head approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Yet to be Approved</h4>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <div className="flex flex-column gap-2 ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={4}
                                      formData={formData}
                                      refreshParent={refreshParentComponent}
                                      className={"acknowledge_btn"}
                                      label={"Acknowledge"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received HOD Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6">
                                    <h4 className="show_status">Received Fin. Head Approval</h4>
                                  </div>
                                </>
                              );
                            }


                        }
                      }
                    })()}
                  </div>
                  <div id="fifth" className="flex justify-content-evenly gap-3">
                    <div className="flex flex-column gap-2">
                      <InputTextCp
                        type="text"
                        id="Position"
                        className="p-disabled email_textbox"
                        onChange={(e) =>
                          setFormData({ ...formData, Position: 11 })
                        }
                        value="President & COO"
                      // disable={commonSettings.setCooapproval}
                      />
                    </div>

                    <div className="flex flex-column gap-2 ">
                      {/* Assuming DropdownComponent renders an input */}
                      <DropdownComponent
                        optionLabel="name"
                        optionValue="employeeId"
                        type="presidentnCOO"
                        options={dropdownData.presidentnCOO}
                        value={formData.presidentnCOOId}
                        className={"email_dropdown"}
                        placeholder={"Select President & COO"}
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

                    <div className="flex flex-column gap-2 ">
                      <InputTextCp
                        id="presidentnCOOEmpId"
                        className="p-disabled email_empId_textbox"
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
                        maxDate={new Date()}
                        minDate={new Date(formData.createdOnUtc)}
                        disable={commonSettings.setCooapprovalDate}
                        className="email_calendar"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pcApprovalDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    {(() => {
                      if (getReqRoleId == 4) {
                        switch (formData.mrfStatusId) {
                          case MRF_STATUS.recivedfinanceHeadApproval:
                          case MRF_STATUS.bypassFinanceHeadApproval:
                            return (
                              <>
                                <div className="flex flex-column gap-2  ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={12}
                                    formData={formData}
                                    label={"Send to COO Approval"}
                                    cooClick={true}
                                    refreshParent={refreshParentComponent}
                                    className={"coo_btn"}
                                    disabled={
                                      formData.presidentnCOOId != 0 ? false : true
                                    }
                                    message={
                                      "Do you want to submit it for COO approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6 ">
                                  <h4 className="show_status">Yet to be Approved</h4>

                                </div>
                              </>
                            );
                          case MRF_STATUS.awaitCooApproval:
                            return (
                              <>
                                <div className="flex flex-column gap-2">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={5}
                                    formData={formData}
                                    className={"acknowledge_btn "}
                                    label={"Acknowledge"}
                                    refreshParent={refreshParentComponent}
                                    message={
                                      "Do you want to submit it as Received COO Approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6">
                                  <h4 className="show_status">Awaiting COO approval</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.onHold:
                            return (
                              <>
                                <div className="flex flex-column gap-2  ">
                                  <MrfPartialStatus
                                    mrfId={getReqId}
                                    mrfStatusId={12}
                                    formData={formData}
                                    label={"Send to COO Approval"}
                                    cooClick={true}
                                    refreshParent={refreshParentComponent}
                                    className={"coo_btn"}
                                    disabled={true}
                                    message={
                                      "Do you want to submit it for COO approval?"
                                    }
                                  />
                                </div>
                                <div className=" w-6 ">
                                  <h4 className="show_status">Yet to be Approved</h4>
                                </div>
                              </>
                            );
                          case MRF_STATUS.rejected:
                            if (formData.presidentnCOOId === formData.updatedByEmployeeId) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={5}
                                      formData={formData}
                                      className={"acknowledge_btn "}
                                      label={"Acknowledge"}
                                      refreshParent={refreshParentComponent}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received COO Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Rejected</h4>
                                  </div>
                                </>
                              );
                            }
                          default:
                            if (formData.presidentnCOOId === 0) {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={12}
                                      formData={formData}
                                      label={"Send to COO Approval"}
                                      cooClick={true}
                                      refreshParent={refreshParentComponent}
                                      className={"coo_btn"}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it for COO approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Yet to be Approved</h4>
                                  </div>
                                </>
                              );
                            } else {
                              return (
                                <>
                                  <div className="flex flex-column gap-2  ">
                                    <MrfPartialStatus
                                      mrfId={getReqId}
                                      mrfStatusId={5}
                                      formData={formData}
                                      className={"acknowledge_btn "}
                                      label={"Acknowledge"}
                                      refreshParent={refreshParentComponent}
                                      disabled={true}
                                      message={
                                        "Do you want to submit it as Received COO Approval?"
                                      }
                                    />
                                  </div>
                                  <div className=" w-6 ">
                                    <h4 className="show_status">Received Fin. Head Approval</h4>
                                  </div>
                                </>
                              );
                            }


                        }
                      }
                    })()}
                  </div>
                </>
              )}
          </section>

          <div className="flex flex-wrap justify-content-end gap-5 mt-3">
            <ButtonC
              label="Back"
              // className=" w-2 surface-hover border-red-600 text-red-600"
              className="cancel_btn"
              onClick={handleCancel}
              outlined="true"
            // disable="true"
            />
            {(() => {
              if (getReqRoleId == 3) {
                switch (formData.mrfStatusId) {
                  case MRF_STATUS.draft:
                    return (
                      <>
                        <MrfPartialStatus
                          mrfId={getReqId}
                          label={"Delete Draft"}
                          className={"save_draft_btn"}
                          message={"Do you want to Delete this MRF ?"}
                          formData={formData}
                          roleID={getReqRoleId}
                          deleteApi={true}
                        />

                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={1}
                          emailErrors={emailError}
                          label={"Save as Draft"}
                          className={"save_draft_btn"}
                          message={"Do you want to Submit this MRF as Draft?"}
                          formData={formData}
                          roleID={getReqRoleId}
                        />

                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={2}
                          label={"Submit"}
                          className={"submit_btn"}
                          emailErrors={emailError}
                          message={
                            "After submitting you won't be able to edit the MRF details"
                          }
                          formData={formData}
                          roleID={getReqRoleId}
                        />
                      </>
                    );
                  case MRF_STATUS.new:
                  case MRF_STATUS.hodapproval:
                  case MRF_STATUS.awaitHodApproval:
                  case MRF_STATUS.cooapproval:
                  case MRF_STATUS.awaitCooApproval:
                  case MRF_STATUS.recivedfinanceHeadApproval:
                  case MRF_STATUS.awaitfinanceHeadApproval:
                    return (
                      <>
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={9}
                          label={"Withdraw"}
                          formData={formData}
                          refreshParent={refreshParentComponent}
                          className={"submit_btn"}
                          message={"Do you want to withdraw this MRF?"}
                        />
                      </>
                    );
                  case MRF_STATUS.resubReq:
                    return (
                      <>
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={2}
                          label={"SUBMIT"}
                          message={
                            "After submitting you won't be able to edit the MRF details"
                          }
                          className={"submit_btn"}
                          formData={formData}
                          roleID={getReqRoleId}
                        />
                      </>
                    );
                  case MRF_STATUS.open:
                    return (
                      <>
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={9}
                          label={"Withdraw"}
                          className={"submit_btn"}
                          refreshParent={refreshParentComponent}
                          formData={formData}
                          message={"Do you want to withdraw this MRF?"}
                        />
                      </>
                    );
                }
              } else if (getReqRoleId == 4) {
                switch (formData.mrfStatusId) {
                  case MRF_STATUS.cooapproval:
                    return (
                      <>
                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={6}
                          label={"Open"}
                          refreshParent={refreshParentComponent}
                          className={"w-20 px-7 bg-red-600 border-red-600"}
                          formData={formData}
                          message={"Do you want to open this MRF?"}
                        />
                      </>
                    );
                  case MRF_STATUS.open:
                    return (
                      <>

                        <MrfPartialStatus
                          mrfId={getReqId}
                          mrfStatusId={10}
                          label={"Close"}
                          refreshParent={refreshParentComponent}
                          className={"w-20 px-7 bg-red-600 border-red-600"}
                          formData={formData}
                          message={"Do you want to Close this MRF?"}
                        />
                        <ButtonC
                          label="Add Resume"
                          className="w-2 bg-red-600 border-red-600"
                          onClick={() => {
                            // dispatch(
                            //   PAGE_ACTIONS.setParams({
                            //     params: {
                            //       mrfId: getReqId,
                            //       referenceNo: formData.referenceNo,
                            //     },
                            //   })
                            // );

                            let data = {
                              mrfId: getReqId,
                              mrfRefenceNo: formData.referenceNo,
                            };

                            let mrfDataAddcandidate = JSON.stringify(data);

                            sessionStorage.setItem(
                              "mrfAddcandidate",
                              mrfDataAddcandidate
                            );

                            navigateTo("add_candidate");
                            // navigateTo("add_resume");
                          }}
                        />
                      </>
                    );
                  default:
                    return (
                      <>
                        {(formData.mrfStatusId === MRF_STATUS.new ||
                          formData.mrfStatusId === MRF_STATUS.onHold) && (
                            <>
                              <MrfPartialStatus
                                mrfId={getReqId}
                                mrfStatusId={3}
                                header={"Resubmission"}
                                refreshParent={refreshParentComponent}
                                label={"Resubmission Required"}
                                className={"w-20 px-7 bg-red-600 border-red-600"}
                                textbox={true}
                                formData={formData}
                              />
                            </>
                          )}
                        {formData.mrfStatusId !== MRF_STATUS.closed &&
                          formData.mrfStatusId !== MRF_STATUS.rejected &&
                          formData.mrfStatusId !== MRF_STATUS.withdrawn && (
                            <>
                              <MrfPartialStatus
                                mrfId={getReqId}
                                mrfStatusId={8}
                                label={"Reject"}
                                refreshParent={refreshParentComponent}
                                formData={formData}
                                className={
                                  "w-20 px-7 bg-red-600 border-red-600"
                                }
                                message={"Do you want to Reject this MRF?"}
                              />
                              {formData.mrfStatusId !== MRF_STATUS.onHold && (
                                <MrfPartialStatus
                                  mrfId={getReqId}
                                  mrfStatusId={7}
                                  label={"On Hold"}
                                  refreshParent={refreshParentComponent}
                                  formData={formData}
                                  className={
                                    "w-20 px-7 bg-red-600 border-red-600"
                                  }
                                  message={"Do you want to hold on this MRF?"}
                                />
                              )}
                            </>
                          )}
                      </>
                    );
                }
              } else {
                return (
                  <>
                    <MrfPartialStatus
                      mrfId={getReqId}
                      mrfStatusId={1}
                      label={"SAVE AS DRAFT"}
                      className={"save_draft_btn"}
                      message={"Do you want to Submit this MRF as Draft?"}
                      formData={formData}
                      roleID={getReqRoleId}
                      emailErrors={emailError}
                    />

                    <MrfPartialStatus
                      mrfId={getReqId}
                      mrfStatusId={2}
                      label={"SUBMIT"}
                      className={"submit_btn"}
                      message={
                        "After submitting you won't be able to edit the MRF details"
                      }
                      formData={formData}
                      roleID={roleId}
                      emailErrors={emailError}
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
