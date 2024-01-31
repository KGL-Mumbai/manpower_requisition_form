import { Dialog } from "primereact/dialog";
import React, { useRef, useState } from "react";
import ButtonC from "./../components/Button";
import { storageService } from "../constants/storage";
import SingleFileUpload from "./../components/FileUpload";
import { API_URL } from "../constants/config";
import { navigateTo, removeSpaces, postData } from "../constants/Utils";
import ToastMessages from "./../components/ToastMessages";
import { Divider } from "primereact/divider";
import InputTextareaComponent from "../components/InputTextarea";
import LoadingSpinner from "../components/LoadingSpinner";

const AssignmentUpload = ({ visible, data, onHide, refreshParent }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const toastRef = useRef(null);
  const [submitBtnDisable, setSubmitBtnDisable] = useState(true);
  const [urlValue, setUrlValue] = useState("");
  const [disableUploadFile, setDisableUploadFile] = useState(false);
  const [disableUrlTextBox, setDisableUrlTextBox] = useState(false);
const [isLoading,setIsLoading]=useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event);
    console.log(selectedFile);
    setDisableUrlTextBox(true);
    setSubmitBtnDisable(false);
  };

  const handleSubmit = async () => {
    setSubmitBtnDisable(true);
    setIsLoading(true);
    const fileUploadData = new FormData();
    fileUploadData.append("file", selectedFile);

    console.log(fileUploadData);
    let fileName = removeSpaces(data.candidateName) + "assign";
    const interviewEvaluationIDD = data.interviewevaluationId;

    try {
      let fileUploadResponse = false;
      if (!disableUploadFile) {
        fileUploadResponse = await fetch(API_URL.ASSIGNMENT_UPLOAD + fileName, {
          method: "POST",
          body: fileUploadData,
        });
        // fileUploadResponse = await postData(
        //   `${API_URL.ASSIGNMENT_UPLOAD}${fileName}`,
        //   fileUploadData
        // );
      }

      if (fileUploadResponse.ok || !disableUrlTextBox) {
        const uploadData = {
          id: 0,
          interviewEvaluationId: interviewEvaluationIDD,
          filePath: disableUrlTextBox==false? urlValue:fileName+ ".docx",
          createdByEmployeeId: storageService.getData("profile").employeeId,
          createdOnUtc: new Date().toISOString(),
          updatedByEmployeeId: storageService.getData("profile").employeeId,
          updatedOnUtc: new Date().toISOString(),
        };

        try {
          const response = await postData(
            `${API_URL.ASSIGNMENT_POST}`,
            uploadData
          );
          if (response.ok) {
            const responseData = await response.json();
            console.log("Response Data:", responseData);
            toastRef.current.showSuccessMessage(
              "Assignment submitted successfully!"
            );
            onHide();
            refreshParent();
            handleReset();
            setSubmitBtnDisable(false);
            setIsLoading(false);
          } else {
            console.error("Request failed with status:", response.status);
            if (response.status === 400) {
              toastRef.current.showBadRequestMessage(
                "Bad request: " + response.url
              );
                }
               setSubmitBtnDisable(false);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error:", error);
          setSubmitBtnDisable(false);
          setIsLoading(false);
        }
      } else {
        if (fileUploadResponse.status === 400) {
          toastRef.current.showBadRequestMessage(
            "you have to upload Assignment!"
          );
        }
        console.error("Request failed with status:", fileUploadResponse.status);
        setSubmitBtnDisable(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitBtnDisable(false);
        setIsLoading(false);
    }
  };

  const handleTextBox = (e) => {
    setUrlValue(e.target.value);
    setDisableUploadFile(true);
    setSubmitBtnDisable(false);
  };
  const handleReset = () => {
    setUrlValue("");
    setSelectedFile(null);
    setDisableUploadFile(false);
    setDisableUrlTextBox(false);
    setSubmitBtnDisable(true);
  };

  return (
    <>
      <Dialog
        header={"Upload Assignment / Add URL"}
        visible={visible}
        onHide={onHide}
        className="w-6 h-23rem"
      >
        <div className="mt-3 mb-5">
          <SingleFileUpload
            onChange={handleFileChange}
            fileExtension={"docx "}
            disable={disableUploadFile}
          />
        </div>
        <Divider align="center">
          <b>OR</b>
        </Divider>
        <label className="font-bold text-base">Add URL:</label>
        <br></br>
        <InputTextareaComponent
          rows={2}
          cols={60}
          onChange={handleTextBox}
          disable={disableUrlTextBox}
          // placeholder=
          value={urlValue}
        />
        <br />
        <br />
        <ButtonC
          label={"Submit"}
          className={"update_btn"}
          disable={submitBtnDisable}
          onClick={() => handleSubmit()}
        />
        <ButtonC
          label={"Reset"}
          className={"cancel_btn ml-2"}
          onClick={handleReset}
        /> {isLoading && <LoadingSpinner />}  
      </Dialog>
     
      <ToastMessages ref={toastRef} />
    </>
  );
};

export default AssignmentUpload;
