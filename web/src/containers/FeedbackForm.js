import { useEffect, useState,useRef } from "react";
import { Dialog } from 'primereact/dialog';
import DropdownComponent from "./../components/Dropdown";
import "../css/InterviewFeedback.css";
import { postData,getData, getDataAPI } from "../constants/Utils";
import InputTextareaComponent from "./../components/InputTextarea";
import { API_URL } from "../constants/config";
import ButtonC from "./../components/Button";
import { storageService } from "../constants/storage";
import ToastMessages from "./../components/ToastMessages";
import LoadingSpinner from "../components/LoadingSpinner";
const FeedbackForm = ({ visible, onHide, onSubmit, count,candidateId=null, refreshParent })=> {
    
  const [interviewRound, setRound] = useState('');
  const [evaluationFeedBack,setevaluationFeedBack] = useState('');
  const [comments,Setcomments] = useState('');
  const [FeedData, setFeedData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [disablebtn, setDisablebtn] = useState(false);

  const interviewDetailsData = {
    id:0,
    candidateId:candidateId,
    evaluationFeedBack,
    interviewRound:count,
    comments,
    FeedbackAsDraft:1,
    createdByEmployeeId: storageService.getData("profile").employeeId,
    createdOnUtc:new Date().toISOString(),
    updatedByEmployeeId: storageService.getData("profile").employeeId,
    updatedOnUtc:new Date().toISOString()
  };
  
  let [formData, setFormData] = useState({
    ...interviewDetailsData
  });
  const [isPopupVisible, setPopupVisible] = useState(true);


const closePopup = () => {
  setPopupVisible(false);
};

  const RedAsterisk = () => <span className="text-red-500">*</span>;

  const toastRef = useRef(null);
  
  const onLoad =async () => {

    let result=await getDataAPI(API_URL.INTERVIEW_FEEDBACK_MASTER);
let response=await result.json();
   
            setFeedData(response.result);
};

useEffect(() => {
    onLoad();
}, [candidateId]);

  const handleInputChange = (id, value,evId) => {
    setFormData({
      ...formData,
      [id]: value,
      [evId]:evId,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    setDisablebtn(true);
    const evaluationFeedBack = Array.from({ length: FeedData.length }, (_, index) => formData[`ev${index + 1}`]).join(';');
    //const comments3 = Array.from({ length: FeedData.length }, (_, index) => formData[`comments${index + 1}`]).join(';');
 
    const comments = Array.from({ length: FeedData.length }, (_, index) => {
        const data = formData[`comments${index + 1}`];
        return (data !== undefined && data !== "") ? data : false;
    }).join(';');
    
    const isValid = evaluationFeedBack.includes(true);
   // if(!isValid){ alert('d');     }


const data = {
    id:0,
    candidateId:formData.candidateId,
    evaluationFeedBack:evaluationFeedBack,
    interviewRound:count+1,
    comments:comments,
    FeedbackAsDraft:0,
    createdByEmployeeId: formData.createdByEmployeeId,
    createdOnUtc:formData.createdOnUtc,
    updatedByEmployeeId: formData.createdByEmployeeId,
    updatedOnUtc:formData.createdOnUtc};
		try {
		if(data.evaluationFeedBack!=''){
		let response = await postData(`${API_URL.INTERVIEW_FEEDBACK_POST}`,data);
		
		  if (response.ok) {
			const responseData = response.json();
			if (responseData.statusCode === 409) {
			  toastRef.current.showConflictMessage(responseData.message);
        setDisablebtn(false);
			} else {
				
			  toastRef.current.showSuccessMessage(
				"Interview Feedback updated successfully!"
			  );
              setTimeout(() => {
                onHide();
                refreshParent();
              }, 1000);
			}
      setIsLoading(false);
     
		  } else {
			console.error("Request failed with status:", response.status);
			const errorData = await response.text();
			console.error("Error Data:", errorData);
			if (response.status === 400) {
			  toastRef.current.showBadRequestMessage(
				"Bad request: " + response.url
			  );
			}
      setIsLoading(false);
      setDisablebtn(false);
		  }}
		} catch (error) {
		  console.error("Error:", error);
      setIsLoading(false);
      setDisablebtn(false);
		}
	  };
      if (!FeedData || FeedData.length === 0) {
        return <p>No data available.</p>; // You can customize this message
      }
  return (
    <Dialog header="Interview Feedback" visible={visible} onHide={onHide} draggable={false} className="feed-popup feedback-popup">
	
          <label htmlFor="Round" className="font-bold lableRound">
            {`Round ${count+1}`} 
          </label>
      
    <form>
    <div>
    
    <table className="feedback-table">
  <thead>
    <tr>
      <th>Index</th>
      <th>Feedback Type</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>
    {FeedData.map((dataItem, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{dataItem.description}</td>
        <td>
        <InputTextareaComponent
            id={`comments${index + 1}`}
            value={formData[`comments${index + 1}`] || ''}
            onChange={(e) => handleInputChange(`comments${index + 1}`, e.target.value,`ev${dataItem.id}`)}
            className="inputRound bg-gray-100"
            rows={2}
            cols={60}
          />
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
      
      <div className="dvAddFeedback">
        <ButtonC label="Submit Feedback" disable={disablebtn} className="submit_btn_feedback" onClick={handleSubmit} outlined="true" />
      </div>
      <ToastMessages ref={toastRef} />
    </form>
    {isLoading && <LoadingSpinner />}  
	</Dialog>
  );
};

export default FeedbackForm;
