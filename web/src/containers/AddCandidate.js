import React, { useState, useEffect, useRef } from "react";
import InputTextCp from "./../components/Textbox";
import ButtonC from "./../components/Button";
import ToastMessages from "./../components/ToastMessages";
import { storageService } from "../constants/storage";
import "../css/FileUploads.css";
import {
  getDataAPI,
  navigateTo,
  removeSpaces,
  postData,
  isFormDataEmptyForAddCandidate,
  formatDateToYYYYMMDD,
} from "../constants/Utils";
import "../css/AddCandidate.css"
import { InputMask } from "primereact/inputmask";
import { API_URL, COUNTRIES, emailRegex } from "../constants/config";
import DropdownComponent from "../components/Dropdown";
import LoadingSpinner from "../components/LoadingSpinner";
import FileUploads from "../components/FileUploads";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const AddCandidate = (reqId) => {
  const toastRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [submitBtnDisable, setSubmitBtnDisable] = useState(false);
  const [mask, setMask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileUploadRef = useRef(null);
  const [resumeArray, setResumeArray] = useState([]);

  let Data = sessionStorage.getItem("mrfAddcandidate");

  let mrfData = JSON.parse(Data);

  const handleFileChange = (event) => {
    setSelectedFile(event);
  };
  const formSchema = {
    id: 0,
    mrfId: mrfData.mrfId,
    name: "",
    emailId: "",
    countrycode: 0,
    contactNo: "",
    resumePath: "",
    candidateStatusId: 1,
    createdByEmployeeId: storageService.getData("profile").employeeId,
    createdOnUtc: new Date().toISOString(),
    updatedByEmployeeId: storageService.getData("profile").employeeId,
    updatedOnUtc: new Date().toISOString(),
    reason: "",
    sourceId: 0,
  };

  // Initialize the formData state using the form schema
  const [formData, setFormData] = useState(formSchema);
  const [dropdowns, setDropdownData] = useState();

  useEffect(() => {
    fectData();
  }, []);

  const fectData = async () => {
    const result = await getDataAPI(`${API_URL.ADD_SOURCE_NAME}`);
    // Fetch the data for all the dropdowns
    const response = await result.json();
    setDropdownData(response.result);
  };

  useEffect(() => {
    if (formData.countrycode.code === "IN") {
      setMask("99999-99999");
    } else {
      setMask("(999) 999-999");
    }
  }, [formData]);

  const RedAsterisk = () => <span className="text-red-500">*</span>;

  const formatAndShowErrorMessage = (emptyFields) => {
    const formattedEmptyFields = emptyFields.map((field) =>
      field.replace(/Id$/, "")
    );
    const errorMessage = `Some required fields are empty: ${formattedEmptyFields.join(
      ", "
    )}`;
    toastRef.current.showWarrningMessage(errorMessage);
  };
  const handleEmail = (e) => {
    const emailValue = formData.emailId;
    if (!emailRegex.test(emailValue)) {
      toastRef.current.showWarrningMessage("Invalid Email format");
      setSubmitBtnDisable(true);
    } else {
      setSubmitBtnDisable(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitBtnDisable(true);
    if (isFormDataEmptyForAddCandidate(formData).length > 0) {
      const emptyFieldss = isFormDataEmptyForAddCandidate(formData);
      formatAndShowErrorMessage(emptyFieldss);
      setSubmitBtnDisable(false);
    } else {
      setIsLoading(true);
      const fileUploadData = new FormData();
      fileUploadData.append("file", selectedFile);
      try {
        const fileUploadResponse = await fetch(
          API_URL.RESUME_UPLOAD +
          removeSpaces(
            formData.name + "_" + mrfData.mrfRefenceNo.replace(/\//g, "_")
          ),
          {
            method: "POST",
            body: fileUploadData,
          }
        );
        // const fileUploadResponse = await postData(
        //           API_URL.RESUME_UPLOAD + removeSpaces(formData.name),
        //           fileUploadData
        //         );

        if (fileUploadResponse.ok) {
          const data = {
            id: 0,
            mrfId: formData.mrfId,
            name: formData.name,
            emailId: formData.emailId,
            contactNo: formData.contactNo,
            resumePath:
              selectedFile.type === "application/pdf"
                ? removeSpaces(
                  formData.name +
                  "_" +
                  mrfData.mrfRefenceNo.replace(/\//g, "_")
                ) + ".pdf"
                : removeSpaces(
                  formData.name +
                  "_" +
                  mrfData.mrfRefenceNo.replace(/\//g, "_")
                ) + ".docx",
            candidateStatusId: 1,
            reviewedByEmployeeIds: "",
            createdByEmployeeId: formData.createdByEmployeeId,
            createdOnUtc: formData.createdOnUtc,
            updatedByEmployeeId: formData.updatedByEmployeeId,
            updatedOnUtc: formData.updatedOnUtc,
            reason: "",
            sourceId: formData.sourceId,
          };
          try {
            let response = await postData(`${API_URL.ADD_CANDIDATE}`, data);

            if (response.ok) {
              const responseData = await response.json();
              console.log("Response Data:", responseData);
              if (responseData.id === -1) {
                toastRef.current.showWarrningMessage(
                  "Duplicate Candidate  Email"
                );
                setIsLoading(false);
                setSubmitBtnDisable(false);
              } else {
                toastRef.current.showSuccessMessage(
                  "Form submitted successfully!"
                );
                resumeArray.unshift(data);
                //here is succesfull full api call
                setIsLoading(false);
                setSubmitBtnDisable(false);
                setFormData(formSchema);
                setShowTable(true);
                fileUploadRef.current.clearSelectedFile();
              }
            } else {
              console.error("Request failed with status:", response.status);
              if (response.status === 400) {
                toastRef.current.showBadRequestMessage(
                  "Bad request: " + response.url
                );
                setIsLoading(false);
                setSubmitBtnDisable(false);
              }
            }
          } catch (error) {
            console.error("Error:", error);
          }
        } else {
          if (fileUploadResponse.status === 400) {
            toastRef.current.showWarrningMessage("you have to upload Resume!");
            setIsLoading(false);
            setSubmitBtnDisable(false);
          }
          console.error(
            "Request failed with status:",
            fileUploadResponse.status
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //need to change this
  const handleCancel = () => {
    navigateTo("my_requisition");
  };

  const handleMinimumContact = (e) => {
    const ConatctValue = e.target.value;

    if (formData.countrycode.code === "IN" && ConatctValue.length < 11) {
      toastRef.current.showWarrningMessage(
        "Contact Number is less than 10 Digit"
      );
    } else if (formData.countrycode.code === "US" && ConatctValue.length < 13) {
      toastRef.current.showWarrningMessage(
        "Contact Number is less than 9 Digit"
      );
    }
  };

  const ResumeViewColumns = [
    { field: "name", header: "Name" },
    { field: "emailId", header: "Email" },
    { field: "contactNo", header: "Contact No" },
    { field: "resumePath", header: "Resume" },
  ];

  return (
    <div>
      <div className="flex create_requistion">
        <div className="flex flex-column gap-2 w-full p-3 py-2 h-full ">
          <div
            className="border-round-lg bg-white text-black-alpha-90 p-3 flex flex-column justify-content-between"
          
          >
            <h3 className="text-xl my-2">Fill the Details :</h3>
            <section
              className="flex flex-column flex-nowrap gap-3 border-y-2 border-gray-300 py-3 px-1 overflow-y-scroll"
              style={{ height: "95%" }}
            >
              <h4 className="text-xl my-2">
                Reference Number :
                <span className="text-red-600">{mrfData.mrfRefenceNo} </span>
              </h4>
              <div className="flex justify-content-between gap-5">
                <div className="flex flex-column w-6 gap-2">
                  <label htmlFor="name" className="font-bold text-sm">
                    Name
                    <RedAsterisk />
                  </label>
                  <InputTextCp
                    id="name"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    value={formData.name}
                  />
                </div>
                <div className="flex flex-column w-6 gap-2">
                  <label htmlFor="email" className="font-bold text-sm">
                    Email
                    <RedAsterisk />
                  </label>
                  <InputTextCp
                    id="email"
                    onChange={(e) =>
                      setFormData({ ...formData, emailId: e.target.value })
                    }
                    onBlur={handleEmail}
                    value={formData.emailId}
                  />
                </div>
              </div>

              <div className="flex justify-content-between gap-5">
                <div className="flex flex-column w-6 gap-2">
                  <label htmlFor="contact" className="font-bold text-sm">
                    Contact
                    <RedAsterisk />
                  </label>

                  <div className="flex flex-row  gap-2">
                    <div className="flex flex-column gap-2 ">
                      <DropdownComponent
                        options={COUNTRIES}
                        optionLabel="name"
                        placeholder="Country code"
                        value={formData.countrycode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countrycode: e.target.value,
                          })
                        }
                        className="w-full md:w-13rem"
                      />
                    </div>

                    <InputMask
                        mask={mask}
                        value={formData.contactNo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contactNo: e.target.value,
                          })
                        }
                        onBlur={handleMinimumContact}
                        // autoClear={false}
                        className="w-full"
                      />
                  </div>
                </div>
                <div className="flex flex-column w-6 gap-2">
                  <label htmlFor="contact" className="font-bold text-sm">
                    Source Name
                    <RedAsterisk />
                  </label>
                  <DropdownComponent
                    optionLabel="name"
                    optionValue="id"
                    type="source"
                    options={dropdowns}
                    value={formData.sourceId}
                    onChange={(e) => {
                      setFormData({ ...formData, sourceId: e.target.value });
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-column w-6 gap-2">
                <label htmlFor="resume" className="font-bold text-sm">
                  Resume
                  <RedAsterisk />
                </label>
                <FileUploads
                  ref={fileUploadRef}
                  onChange={handleFileChange}
                  fileExtension={"pdf ,docx "}
                />
              </div>
              {showTable && (
                <div className="show_resume_View_DataTable  ">
                  <DataTable
                    value={resumeArray}
                    paginator={resumeArray.length > 5}
                    rows={5}
                    scrollable
                    stripedRows
                    draggable={false}
                    scrollHeight="flex"
                    className=" View_DataTable  "
                  >
                    {ResumeViewColumns.map((col, index) => (
                      <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                      />
                    ))}
                  </DataTable>
                </div>
              )}
            </section>

            <div className="flex flex-wrap justify-content-end gap-5 mt-3">
              <ButtonC
                label="Back"
                outlined
                className="cancel_btn"
                onClick={handleCancel}
              />

              <ButtonC
                label="SUBMIT"
                className="resume_update_btn"
                disable={submitBtnDisable}
                onClick={() => handleSubmit()}
              />
              {isLoading && <LoadingSpinner />}
              <ToastMessages ref={toastRef} position="bottom-center" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
