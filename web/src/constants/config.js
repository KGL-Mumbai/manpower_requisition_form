export const APP_KEY = "MRF_v1.0";
const APP = "https://10.22.11.101:90";
//const APP="https://localhost:7128";
const APIPath=`${APP}/api/`;
export const API_URL = {
  MRF_STATUS_SUMMARY: `${APIPath}Dashboard/GetMrfStatusSummary`,
  RESUME_SUMMARY: `${APIPath}Dashboard/GetMrfResumeSummary/Count`,
  INTERVIEW_SUMMARY: `${APIPath}Dashboard/GetMrfInterviewSummary/Count`,
  INTERVIEW_SUMMARY_POPUP: `${APIPath}Mrfinterviewermap/GetInterviewDetails/GetInterviewDetails`,
  MRF_STATUS_POPUP: `${APIPath}Mrfdetail/GetMrfDetails/GetMrfDetails?`,
  MY_REQUISITION: `${APIPath}Mrfdetail/GetMrfDetails/GetMrfDetails`,
  RESUME_SUMMARY_POPUP: `${APIPath}Mrfresumereviewermap/GetResumeStatusDetails/GetResumeStatusDetails?`,
  RESUME_SUMMARY_POST: `${APIPath}Candidatedetail/Put/`,
  INTERVIEW_FEEDBACK: `${APIPath}CandidateInterviewFeedback/GetByCandidate`,
  INTERVIEW_FEEDBACK_POST: `${APIPath}CandidateInterviewFeedback/POST`,
  INTERVIEW_EVALUATION: `${APIPath}interviewevaluation/`,
  INTERVIEW_FEEDBACK_MASTER: `${APIPath}Evaluationfeedback`,
  MRF_PARTIAL_STATUS_UPDATE: `${APIPath}Mrfdetail/PartialUpdateMRFStatus/`,
  GET_CREATE_REQUISITION_DEPARTMENT: `${APIPath}Subdepartment/GetInfo/`,
  GET_CREATE_REQUISITION_DEATILS: `${APIPath}Mrfdetail/GetRequisition/`,
  GET_CREATE_REQUISITION_DROPDOWN: `${APIPath}Mrfdetail/GetMRFDropdownlist`,
  POST_CREATE_REQUISITION: `${APIPath}mrfdetail/POST`,
  ADD_CANDIDATE: `${APIPath}Candidatedetail/Post`,
  ADD_SOURCE_NAME: `${APIPath}Source`,
  RESUME_UPLOAD: `${APIPath}Upload?ResumeOrAssign=Resume&FileName=`,
  ADD_POSITIONTITLE: `${APIPath}PositionTitle`,
  ADD_PROJECT: `${APIPath}Project`,
  GET_CANDIDATE_DETAILS: `${APIPath}Candidatedetail/GetReferenceNoAndPositiontitle`,
  GET_EMPLOYEE_DETAILS: `${APIPath}Employeedetails/GetEmployee`,
  ALL_EMPLOYEE: `${APIPath}GetLDAPEmployee`,
  UPDATE_EMPLOYEE:`${APIPath}Employeedetails/Put/`,
  GET_ROLE:`${APIPath}Role`,
  GET_MYRESUME: `${APIPath}Candidatedetail/GetResumeDropdownlist`,
  ASSIGNMENT_UPLOAD: `${APIPath}Upload?ResumeOrAssign=Assignment&FileName=`,
  ASSIGNMENT_POST:`${APIPath}Attachment`,
  CREATE_EMPLOYEE:`${APIPath}Employeedetails/Post/`,
  GET_EMPLOYEE_BY_EMP_CODE: `${APIPath}Employeedetails/GetEmployeeByEmpCode`,
  GET_EMPLOYEE:`${APIPath}Employeedetails/GetAllEmpRoleWithEmpCode`,
};

export const FILE_URL = {
  RESUME: `${APP}/Resume/`,
  ASSIGNMENT: `${APP}/Assignment/`,
};

export const ROUTES = {
  /* DASHBOARD: "dashboard",
    CREATE_REQUISITION: "create_requisition",
    MY_REQUISITION: "my_requisition" */
  dashboard: "dashboard",
  my_requisition: "my_requisition",
  create_requisition: "create_requisition",
  edit_requisition: "edit_requisition",
  mrf_details: "mrf_details",
  add_candidate: "add_candidate",
  view_candidate: "view_candidate",
  resume_summary:"resume_summary",
  my_resume:"my_resume",
  employee_edit:"employee_edit",
  employee:"employee",
  allemployees:"allemployees",
};

export const MRF_STATUS = {
  draft: 1,
  new: 2,
  resubReq: 3,
  hodapproval: 4,
  cooapproval: 5,
  open: 6,
  onHold: 7,
  rejected: 8,
  withdrawn: 9,
  closed: 10,
  awaitHodApproval: 11,
  awaitCooApproval: 12,
  awaitfinanceHeadApproval: 13,
  recivedfinanceHeadApproval: 14,
  bypassFinanceHeadApproval:15,
  mrfTransferToNew: 16,
};

export const MRF_STATUS_FOR_DISABLE =(roleId,mrfstatusId)=>{
  if((roleId === ROLES.hr || roleId === ROLES.mrfOwner || roleId === ROLES.resumeReviwer)  && [
    MRF_STATUS.closed,MRF_STATUS.rejected,MRF_STATUS.withdrawn
  ].includes(mrfstatusId)
  ){
    return  true;
  }
 return  false;
}
export const CANDIDATE_STATUS_FOR_DISABLE =(candidatestatusId)=>{
    if(candidatestatusId===3||candidatestatusId===4)
  {
    return  true;
  }
  else{
    return  false;
  }
 
}
export const COUNTRIES = [
  { name:<> <span><img src="./images/india_flag.png" width={"20px"} height={"12px"}/></span><span style={{ marginRight: '50px' }}> India </span><span>+91</span></>, code: 'IN' },
  { name:<><span><img src="./images/us_flag.png" width={"20px"} height={"12px"}/></span> <span style={{ marginRight: '75px' }}> US </span><span>+1</span></>, code: 'US' },
];

export const ROLES = {
  superAdmin: 1,
  admin: 2,
  mrfOwner: 3,
  hr: 4,
  resumeReviwer: 5,
  interviewer: 6,
  hiringManager: 7,
};

export const REQUISITION_TYPE = [
  { name: "FR", code: "FR" },
  { name: "RP", code: "RP" },

  // Add more options as needed
];

export const GENDER = [
  { label: "Male", id: 1 },
  { label: "Female", id: 2 },
  { label: "Other", id: 3 },
];

export const MIN_EXPERIENCE_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  label: i.toString(),
  value: i,
}));
export const MAX_EXPERIENCE_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  label: i.toString(),
  value: i,
}));

export const FORM_SCHEMA_CR = {
  referenceNo: "",
  positionTitleId: "",
  requisitionType: "",
  departmentId: 0,
  subDepartmentId: 0,
  projectId: 0,
  vacancyNo: 0,
  genderId: 0,
  qualification: "",
  requisitionDateUtc: new Date(),
  reportsToEmployeeId: 0,
  minGradeId: 0,
  maxGradeId: 0,
  employmentTypeId: 0,
  minExperience: 0,
  maxExperience: 0,
  vacancyTypeId: 0,
  isReplacement: false,
  mrfStatusId: 0,
  jdDocPath: "",
  locationId: 0,
  qualificationId: 0,
  justification: "",
  softwaresRequired: "",
  hardwaresRequired: "",
  minTargetSalary: 0,
  maxTargetSalary: 0,
  employeeName: "",
  emailId: "",
  employeeCode: 0,
  lastWorkingDate: new Date(),
  annualCtc: 0,
  annualGross: 0,
  replaceJustification: "",
  jobDescription: "",
  skills: "",
  resumeReviewerEmployeeIds:"",
  interviewerEmployeeIds: "",
  hiringManagerId: 0,
  hiringManagerEmpId: 0,
  functionHeadId: 0,
  functionHeadEmpId: 0,
  siteHRSPOCId: 0,
  siteHRSPOCEmpId: 0,
  financeHeadId: 0,
  financeHeadEmpId: 0,
  presidentnCOOId: 0,
  presidentnCOOEmpId: 0,
  fiApprovalDate:new Date(),
  pcApprovalDate:new Date(),
  spApprovalDate:new Date(),
  fhApprovalDate:new Date(),
  hmApprovalDate:new Date(),

  
};

export const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  