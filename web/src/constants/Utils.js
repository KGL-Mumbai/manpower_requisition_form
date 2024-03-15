import { FILE_URL, INTERVIEW_EVALUATION, MRF_STATUS, RESUME_STATUS, ROLES } from "./config";
import { storageService } from "./storage";

/**** 
    Description: Sets application state for "currentDevice" depending on screen width. The "currentDevice" state gets added on "App" element which helps to apply css for different resolution.

     case 1: screen max-width = 767px "isMobile" is set.
    case 2: screen max-width = 1024px "isIpad" is set.
    default: screen width greater then 1024px "isDesktop" is set.      
****/
export const detectDevice = () => {
  if (window.matchMedia("(max-width: 767px)").matches) {
    return "mobile";
  } else if (window.matchMedia("(max-width: 1024px)").matches) {
    return "ipad";
  } else {
    return "desktop";
  }
};

/**** 
     Description: Sets the state "isTouchDevice" to "true" or "false" of the application.
****/
export const isTouchDevice = () => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
    // console.log("Touch screen detected");
  }
  return false;
};

export async function getData(url) {
  const accessToken = storageService.getData("token");
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return (
    fetch(url, options)
      .then((response) => response.json())
      // .then((response) => response)
      .catch((error) => error)
  );
}

export async function getDataAPI(url) {
  const accessToken = storageService.getData("token");

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return (
    fetch(url, options)
      // .then((response) => response.json())
      .then((response) => response)
      .catch((error) => error)
  );
}

export async function postData(url, data) {
  const accessToken = storageService.getData("token");

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };

  return fetch(url, options)
    .then((response) => response)
    .catch((error) => error);
}

export async function putData(url, data) {
  const accessToken = storageService.getData("token");

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data), // Convert data to JSON format
  };
  return fetch(url, options)
    .then((response) => response)
    .catch((error) => error);
}

export async function deleteData(url) {
  const accessToken = storageService.getData("token");

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "DELETE",
    headers: headers,
  };
  return fetch(url, options)
    .then((response) => response.json())
    .catch((error) => error);
}

export const getKeyFromLocation = () => {
  var aLocation = window.location.hash.split("#/"), 
  sRouteKey = aLocation[1],
  oParams = (aLocation[1].indexOf('?') > -1) ? getParameterFromLocation(aLocation[1].split('?')[1]) : [],
  oData = {};
  oData['key'] = sRouteKey;
  if(oParams.length > 0){
    oData['params'] = oParams;
  }
  return oData;
};

const getParameterFromLocation = (p_sPath) => {
  var result = [],
    tmp = [];
    
  var items = p_sPath.split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    var obj = {};
    obj[tmp[0]] = decodeURIComponent(tmp[1]);
    result.push(obj);
  }
  return result;
}
export const navigateTo = (sPageKey) => {
  window.location.hash = "#/" + sPageKey;
};

export const changeDateFormat = (d) => {
  //yyyy-mm-dd format
  const localDate = new Date(d);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${day}-${month}-${year}`;
  // return new Date(d).toISOString().slice(0, 10).replaceAll("/", "-");
};

export const strToArray = (s) => {
  // "1,2,3" to [1,2,3]
  if (typeof s === "string") {
    s = s.split(",").map(Number);
  }
  return s;
};

//for multiselect because it doesn't work properly
export const arrayToObj = (options = [], selectedOpt, field) => {
  if (Array.isArray(selectedOpt)) {
    return options.filter((e) => selectedOpt.includes(e[field]));
  }
  return [selectedOpt];
};

export const objToIntArray = (selectedOpt = [], field) => {
  return selectedOpt.map((e) => e[field]);
};

export const salaryInLPA = (value) => {
  return value + " LPA";
};

export const filterSelectedColumn = (rowData, selectedColum) => {
  const filterData = rowData.resultGroups.find(
    (obj) => obj.candidatestatus == selectedColum
  );
  if (filterData) {
    return filterData.totalstatusCount;
  }
};

export const filterResultGroupByCandidatestatus = (data, targetColumn) => {
  const filteredData = data.map((item) => {
    const { mrfId, referenceno, positionTitle, resultGroups } = item;

    const filteredResultGroup = resultGroups.filter((result) =>
      targetColumn.includes(result.candidatestatus)
    );
    return {
      mrfId,
      referenceno,
      positionTitle,
      resultGroups: filteredResultGroup,
    };
  });

  return filteredData;
};

export const formatDateToYYYYMMDD = (date) => {
  // Check if the date is already in "YYYY-MM-DD" format
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date; // Return the input date as it is
  }

  const localDate = new Date(date.toISOString());

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const removeSpaces = (str) => {
  return str.replace(/\s/g, ""); // This regular expression replaces all spaces globally
};

export const isFormDataEmptyForSubmit = (formData) => {
  if (formData === undefined) {
    return true; // Treat it as empty if undefined
  }

  return Object.keys(formData).filter((key) => {
    const value = formData[key];

    // Check specific condition for certain fields, and general check for others
    if (
      (value === "" || value === 0 || value === null || value===undefined) &&
      [
        "positionTitleId",
        "departmentId",
        "projectId",
        "vacancyNo",
        "requisitionDateUtc",
        "employmentTypeId",
        "reportsToEmployeeId",
        "genderId",
        "minGradeId",
        "maxGradeId",
        "locationId",
        "qualificationId",
        "justification",
        "minTargetSalary",
        "maxTargetSalary",
        "vacancyTypeId",
        "jobDescription",
        "resumeReviewerEmployeeIds",
        "interviewerEmployeeIds",
        "skills",
      ].includes(key)
    ) {
      return true;
    }

    // Additional check for fields related to replacements
    if (formData.isReplacement) {
      if (
        [
          "replaceJustification",
          "employeeName",
          "emailId",
          "employeeCode",
          "lastWorkingDate",
          "annualCtc",
          "annualGross",
        ].includes(key) &&
        (value === "" || value === null)
      ) {
        return true;
      }
    }

    return false;
  });
};


export const isFormDataEmptyForSaveasDraft = (formData) => {
  if (formData === undefined) {
    return true; // Treat it as empty if undefined
  }

  return Object.keys(formData).filter((key) => {
    const value = formData[key];

    // Check specific condition for certain fields, and general check for others
    if (
      (value === "" || value === 0 || value === null || value===undefined) &&
      [
        "positionTitleId",
        "departmentId",
        "projectId",
        "vacancyNo",
        "requisitionDateUtc",
        "employmentTypeId",
        "reportsToEmployeeId",
        "minGradeId",
        "maxGradeId",
        "vacancyTypeId",
        "locationId",
      ].includes(key)
    ) {
      return true;
    }

    // Additional check for fields related to replacements
    if (formData.isReplacement) {
      if (
        [
          "replaceJustification",
          "employeeName",
          "emailId",
          "employeeCode",
          "lastWorkingDate",
          "annualCtc",
          "annualGross",
        ].includes(key) &&
        (value === "" || value === null)
      ) {
        return true;
      }
    }

    return false;
  });
};

export const isFormDataEmptyForAddCandidate = (formData) => {
  if (formData === undefined) {
    return true;
  }

  return Object.keys(formData).filter((key) => {
    const value = formData[key];
    if (
      (value === "" || value === 0 || value === null) &&
      ["name", "emailId", "contactNo", "sourceId", "countrycode"].includes(key)
    ) {
      return true;
    }

    return false;
  });
};

// Define a function to remove HTML tags from a string
export const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/(<([^>]+)>)/gi, "");
};


export const convertToDays=(mrf)=>{
  const dateString = changeDateFormat(mrf.createdOnUtc);
  const [day,month,year] = dateString.split("-").map(Number);
  
  const createdDate = new Date(year, month - 1, day);
  const today = new Date();
  const timeDifference = today - createdDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
  return daysDifference;
}

export const MRF_STATUS_FOR_DISABLE =(roleId,mrfstatusId)=>{
  if((roleId === ROLES.hr || roleId === ROLES.mrfOwner || roleId === ROLES.resumeReviwer|| roleId === ROLES.interviewer)  && [
    MRF_STATUS.closed,MRF_STATUS.rejected,MRF_STATUS.withdrawn
  ].includes(mrfstatusId)
  ){
    return  true;
  }
 return  false;
}
export const CANDIDATE_STATUS_FOR_DISABLE =(roleId,candidatestatusId)=>{
    if((roleId == ROLES.mrfOwner) && [
       RESUME_STATUS.Shortlisted , RESUME_STATUS.Rejected,
    ].includes(candidatestatusId))
  {
    return  true;
  }
  if((roleId == ROLES.hr) && [
    RESUME_STATUS.Rejected, RESUME_STATUS.New
  ].includes(candidatestatusId))
{
  return  true;
}
else{
  return  false;
}
 
}
export const INTERVIEW_EVALUATION_FOR_DISABLE =(roleId,evaluationID)=>{
  if((roleId == ROLES.mrfOwner || roleId == ROLES.hr ) && [
    // INTERVIEW_EVALUATION.AssignmentRejected, INTERVIEW_EVALUATION.VideoInterviewNotCleared,
    // INTERVIEW_EVALUATION.CodingTestNotCleared,INTERVIEW_EVALUATION.AptitudeTestNotCleared,
    // INTERVIEW_EVALUATION.TelephonicInterviewNotCleared, INTERVIEW_EVALUATION.FaceToFaceInterviewNotCleared,
    // INTERVIEW_EVALUATION.Selected, INTERVIEW_EVALUATION.NotSelected, INTERVIEW_EVALUATION.OfferRolledout,
    // INTERVIEW_EVALUATION.OfferAccepted,INTERVIEW_EVALUATION.OfferAcceptedAnddidnotjoin,
    // INTERVIEW_EVALUATION.OfferRejected,INTERVIEW_EVALUATION.OfferAcceptedandCountered,
    // INTERVIEW_EVALUATION.Onboarded,

    INTERVIEW_EVALUATION.OfferRejected,INTERVIEW_EVALUATION.Onboarded,INTERVIEW_EVALUATION.OfferacceptedAndDidnotjoin,INTERVIEW_EVALUATION.CandidateNotSelected,INTERVIEW_EVALUATION.FaceToFaceInterviewNotCleared,INTERVIEW_EVALUATION.AssignmentRejected,INTERVIEW_EVALUATION.CodingRoundNotCleared,

  ].includes(evaluationID))
{
  return  true;
}


if((roleId == ROLES.interviewer)&& [INTERVIEW_EVALUATION.InterviewOnHold,INTERVIEW_EVALUATION.CandidateSelected,INTERVIEW_EVALUATION.CandidateNotSelected,INTERVIEW_EVALUATION.FaceToFaceInterviewNotCleared,INTERVIEW_EVALUATION.AssignmentRejected,INTERVIEW_EVALUATION.CodingRoundNotCleared,INTERVIEW_EVALUATION.OfferRejected,INTERVIEW_EVALUATION.Onboarded,INTERVIEW_EVALUATION.OfferacceptedAndDidnotjoin,].includes(evaluationID))
{
  return  true;
}


}


export const resumeBodyTemplate = (data) => {

let resumeString = data.resumePath;
let resumeValue = resumeString.replace(/^[\d-]+\/\//, ''); 

    let resumeLink = FILE_URL.RESUME + data.resumePath;
    return (
      <a href={resumeLink} target="_blank" className="int-link-cell">
   
		{ resumeValue} 
      </a>
    );
  };
