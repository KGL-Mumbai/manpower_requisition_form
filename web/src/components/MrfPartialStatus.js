import React, { useState, useRef } from "react";
import { API_URL, MRF_STATUS, REQUISITION_TYPE } from "../constants/config";
import { storageService } from "../constants/storage";
import { Knob } from "primereact/knob";
import {
  formatDateToYYYYMMDD,
  navigateTo,
  postData,
  putData,
  isFormDataEmptyForSaveasDraft,
  isFormDataEmptyForSubmit,
  deleteData,
} from "../constants/Utils";
import { Dialog } from "primereact/dialog";
import ButtonC from "./Button";
import InputTextareaComponent from "./InputTextarea";
import ToastMessages from "./ToastMessages";
import LoadingSpinner from "./LoadingSpinner";
import { throttle } from "lodash";
import "../css/MrfPartialstatus.css";
const MrfPartialStatus = ({
  mrfId = null,
  mrfStatusId = null,
  label = null,
  message = null,
  textbox = false,
  header = null,
  formData = {},
  disabled = null,
  updatedClick = null,
  roleID = null,
  refreshParent,
  outlined,
  siteHRUpdateClick = false,
  hiringManagerUpdateClick = false,
  bypassClicked = false,
  className,
  emailErrors,
  deleteApi,
}) => {
  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState("");
  const toastRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const [maxCharacterCount, setMaxCharacterCount] = useState(500);
  const strToArray = (s) => {
    s = s ?? "";
    if (s !== "" && typeof s === "string") {
      s = s.split(",").map(Number);
    }
    return s;
  };

  const footerContent = (value) => {
    return (
      <div>
        {(() => {
          if (
            (roleID == 3 && mrfStatusId == MRF_STATUS.new) ||
            mrfStatusId == MRF_STATUS.draft
          ) {
            return (
              <ButtonC
                label="Yes"
                className="Dialog_submit_btn"
                onClick={() => {
                  handleSubmit(value);
                }}
              />
            );
          } else if (textbox) {
            return (
              <ButtonC
                label="Yes"
                disable={note.length == 0}
                className="Dialog_submit_btn"
                onClick={() => {
                  submitPartial(value);
                }}
              />
            );
          } else if (deleteApi) {
            return (
              <ButtonC
                label="Yes"
                className="Dialog_submit_btn"
                onClick={() => {
                  handleDeleteDraftMrf();
                }}
              />
            );
          } else {
            return (
              <ButtonC
                label="Yes"
                className="Dialog_submit_btn"
                onClick={() => {
                  submitPartial(value);
                }}
              />
            );
          }
        })()}

        <ButtonC
          label="No"
          className="Dialog_submit_btn"
          onClick={() => {
            setVisible(false);
          }}
        />
      </div>
    );
  };

  const handleDeleteDraftMrf = async () => {
    setIsLoading(true);
    try {
      let response = await deleteData(`${API_URL.DELETE_DRAFTED_MRF + mrfId}`);

      if (response.id > 0) {
        toastRef.current.showSuccessMessage("MRF Deleted successfully");
        setVisible(false);

        setTimeout(() => {
          navigateTo("my_requisition");
        }, 1000);
        setIsLoading(false);
      } else {
        toastRef.current.showBadRequestMessage("Bad request: " + response.url);

        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const formatAndShowErrorMessage = (emptyFields) => {
    const formattedEmptyFields = emptyFields.map((field) =>
      field.replace(/Id$/, "")
    );
    const errorMessage = `Some required fields are empty: ${formattedEmptyFields.join(
      ", "
    )}`;
    toastRef.current.showWarrningMessage(errorMessage);
  };

  const handleSubmit = async (mrfStatusId) => {
    setIsLoading(true);
    const data = {
      referenceNo: formData.referenceNo,
      requisitionType:
        formData.requisitionType == ""
          ? REQUISITION_TYPE[0].code
          : formData.requisitionType,
      positionTitleId: formData.positionTitleId,
      departmentId: formData.departmentId,
      subDepartmentId: formData.subDepartmentId,
      projectId: formData.projectId,
      vacancyNo: Number(formData.vacancyNo),
      genderId: formData.genderId,
      qualification: formData.qualification,
      requisitionDateUtc: formatDateToYYYYMMDD(formData.requisitionDateUtc),
      reportsToEmployeeId: formData.reportsToEmployeeId,
      minGradeId: formData.minGradeId,
      maxGradeId: formData.maxGradeId,
      employmentTypeId: formData.employmentTypeId,
      minExperience: formData.minExperience,
      maxExperience: formData.maxExperience,
      vacancyTypeId: formData.vacancyTypeId,
      isReplacement: formData.isReplacement,
      mrfStatusId: mrfStatusId,
      jdDocPath: "string",
      locationId: formData.locationId,
      qualificationId: formData.qualificationId,
      createdByEmployeeId: storageService.getData("profile").employeeId,
      createdOnUtc: new Date().toISOString(),
      updatedByEmployeeId: storageService.getData("profile").employeeId,
      updatedOnUtc: new Date().toISOString(),
      justification: formData.justification,
      jobDescription: formData.jobDescription,
      skills: formData.skills,
      minTargetSalary: formData.minTargetSalary,
      maxTargetSalary: formData.maxTargetSalary,
      employeeName: formData.employeeName,
      emailId: formData.emailId,
      note: formData.note,
      hrId: formData.hrId,
      employeeCode: formData.employeeCode == null ? 0 : formData.employeeCode,
      lastWorkingDate: formatDateToYYYYMMDD(formData.lastWorkingDate),
      annualCtc: formData.annualCtc,
      annualGross: formData.annualGross,
      replaceJustification: formData.replaceJustification,
      resumeReviewerEmployeeIds: strToArray(
        formData.resumeReviewerEmployeeIds
      ).toString(),
      interviewerEmployeeIds: strToArray(
        formData.interviewerEmployeeIds
      ).toString(),
      hiringManagerId: formData.hiringManagerId,
      hiringManagerEmpId: formData.hiringManagerEmpId,
      functionHeadId: formData.functionHeadId,
      functionHeadEmpId: formData.functionHeadEmpId,
      siteHRSPOCId: formData.siteHRSPOCId,
      siteHRSPOCEmpId: formData.siteHRSPOCEmpId,
      financeHeadId: formData.financeHeadId,
      financeHeadEmpId: formData.financeHeadEmpId,
      presidentnCOOId: formData.presidentnCOOId,
      presidentnCOOEmpId: formData.presidentnCOOEmpId,
    };

    try {
      let response = await postData(`${API_URL.POST_CREATE_REQUISITION}`, data);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        if (responseData.statusCode === 409) {
          setVisible(false);
          setIsLoading(false);
          toastRef.current.showConflictMessage(responseData.message);
        } else {
          if (mrfStatusId == 1) {
            toastRef.current.showSuccessMessage(
              "The MRF has been saved as Draft!"
            );
          } else {
            toastRef.current.showSuccessMessage("Form submitted successfully!");
          }
          setTimeout(() => {
            navigateTo("my_requisition");
          }, 1000);
          setVisible(false);
          setIsLoading(false);
        }
      } else {
        console.error("Request failed with status:", response.status);
        const errorData = await response.text();
        console.error("Error Data:", errorData);
        if (response.status === 400) {
          setVisible(false);
          setIsLoading(false);
          toastRef.current.showBadRequestMessage(
            "Bad request: " + response.url
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setVisible(false);
      setIsLoading(false);
    }
  };

  const submitPartial = async () => {
    let hiringManagerId,
      hiringManagerEmpId,
      siteHRSPOCId,
      siteHRSPOCEmpId,
      fiApprovalDate;
    if (siteHRUpdateClick) {
      siteHRSPOCId = formData.siteHRSPOCId;
      siteHRSPOCEmpId = formData.siteHRSPOCEmpId;
    }
    if (hiringManagerUpdateClick) {
      hiringManagerId = formData.hiringManagerId;
      hiringManagerEmpId = formData.hiringManagerEmpId;
    }

    if (bypassClicked) {
      fiApprovalDate = formatDateToYYYYMMDD(new Date());
    } else {
      fiApprovalDate = formatDateToYYYYMMDD(formData.fiApprovalDate);
    }
    setIsLoading(true);
    const partialsUpdate = {
      mrfStatusId,
      note: note || null,
      updatedByEmployeeId: storageService.getData("profile").employeeId,
      updatedOnUtc: new Date().toISOString(),

      hiringManagerId,
      hiringManagerEmpId,
      siteHRSPOCId,
      siteHRSPOCEmpId,

      functionHeadId: formData.functionHeadId,
      functionHeadEmpId:  formData.functionHeadEmpId,
      financeHeadId:  formData.financeHeadId,
      financeHeadEmpId:  formData.financeHeadEmpId,
      presidentnCOOId:  formData.presidentnCOOId,
      presidentnCOOEmpId:  formData.presidentnCOOEmpId,
      pcApprovalDate: formatDateToYYYYMMDD(formData.pcApprovalDate),
      fhApprovalDate: formatDateToYYYYMMDD(formData.fhApprovalDate),
      fiApprovalDate,
      hmApprovalDate: formatDateToYYYYMMDD(formData.hmApprovalDate),
      spApprovalDate: formatDateToYYYYMMDD(formData.spApprovalDate),
    };

    try {
      console.log("Form data is valid. Submitting...");
      let response = await putData(
        `${API_URL.MRF_PARTIAL_STATUS_UPDATE + mrfId}`,
        partialsUpdate
      );
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.statusCode === 409) {
          setVisible(false);
          setIsLoading(false);
          toastRef.current.showConflictMessage(responseData.message);
        } else {
          setVisible(false);
          setIsLoading(false);
          toastRef.current.showSuccessMessage("Action Submitted");
          // setTimeout(() => {
          //   navigateTo("my_requisition");
          // }, 1000);
          refreshParent();
        }
      } else {
        console.error("Request failed with status:", response.status);
        const errorData = await response.text();
        console.error("Error Data:", errorData);
        if (response.status === 400) {
          setVisible(false);
          setIsLoading(false);

          toastRef.current.showBadRequestMessage(
            "Bad request: " + response.url
          );
        }
      }
    } catch (error) {
      setVisible(false);
      setIsLoading(false);

      console.error("Error:", error);
    } finally {
      setVisible(false);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxCharacterCount) {
      setNote(value);
    } else {
      toastRef.current.showWarrningMessage("Character limit Exceed: " + maxCharacterCount);
    }
  };

  const remaingletter = maxCharacterCount - note.length;

  const HandleError = () => {
    if (formData.isReplacement && emailErrors) {
      toastRef.current.showWarrningMessage("Invalid Employee Email format");
      setVisible(false);
      return;
    }

    if (formData.maxTargetSalary < formData.minTargetSalary) {
      toastRef.current.showWarrningMessage("Min Target Salary is Greater than Max Target salary");
      setVisible(false);
      return;
    }

    if ((roleID === 3 && mrfStatusId == 2) && isFormDataEmptyForSubmit(formData).length > 0) {
      const emptyFields = isFormDataEmptyForSubmit(formData);
      formatAndShowErrorMessage(emptyFields);
      // setVisible(false);

    } else if (
      mrfStatusId == 1 &&
      isFormDataEmptyForSaveasDraft(formData).length > 0
    ) {
      const emptyFields = isFormDataEmptyForSaveasDraft(formData);
      formatAndShowErrorMessage(emptyFields);
      // setVisible(false);
    } else {
      setVisible(true);
    }
  };
  return (
    <>
      {label && (
        <>
          <ButtonC
            label={label}
            ref={buttonRef}
            className={className}
            onClick={() => HandleError()}
            disable={disabled}
            outlined={outlined}
          ></ButtonC>

          <Dialog
            className={textbox ? "w-5" : "w-4"}
            visible={visible}
            header={header}
            draggable={false}
            onHide={() => setVisible(false)}
            footer={footerContent(mrfStatusId)}
          >
            {textbox && (
              <div>
                <label className="font-bold text-sm">Add Note:</label>
                <br />
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <InputTextareaComponent
                    value={note}
                    onChange={handleChange}
                    rows={4}
                    cols={62}
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
                      value={maxCharacterCount - remaingletter}
                      max={maxCharacterCount}
                      readOnly
                      size={50}
                      rangeColor="#aaaaaa"
                      valueColor="#d32f2e"
                      textColor="#000000"
                    />
                  </div>
                </div>
              </div>
            )}

            {message && <h3>{message}</h3>}
            {isLoading && <LoadingSpinner />}
          </Dialog>
        </>
      )}
      <ToastMessages ref={toastRef} />
    </>
  );
};

export default MrfPartialStatus;
