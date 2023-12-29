export const APP_KEY = "MRF_v1.0";
//const APIPath="https://localhost:7128/api/";
const APIPath="https://10.22.11.101:90/api/";
export const API_URL = {
  MRF_STATUS_SUMMARY: 
  `${APIPath}Dashboard/GetMrfStatusSummary`,
  RESUME_SUMMARY:
  `${APIPath}Dashboard/GetMrfResumeSummary/Count`,
  INTERVIEW_SUMMARY:
  `${APIPath}Dashboard/GetMrfInterviewSummary/Count`,
  INTERVIEW_SUMMARY_POPUP: `${APIPath}Mrfinterviewermap/GetInterviewDetails/GetInterviewDetails`,
  MRF_STATUS_POPUP: `${APIPath}Mrfdetail/GetMrfDetails/GetMrfDetails?`,
  MY_REQUISITION: `${APIPath}Mrfdetail/GetMrfDetails/GetMrfDetails`,
  RESUME_SUMMARY_POPUP: `${APIPath}Mrfresumereviewermap/GetResumeStatusDetails/GetResumeStatusDetails?`,
  RESUME_SUMMARY_POST: `${APIPath}Candidatedetail/Put/`,
  INTERVIEW_FEEDBACK: `${APIPath}CandidateInterviewFeedback`,
  INTERVIEW_FEEDBACK_MASTER: `${APIPath}evaluationfeedbackmaster`,
  MRF_PARTIAL_STATUS_UPDATE: `${APIPath}Mrfdetail/PartialUpdateMRFStatus/`,
  GET_CREATE_REQUISITION_DEPARTMENT: `${APIPath}Subdepartment/GetInfo/`,
  GET_CREATE_REQUISITION_DEATILS: `${APIPath}Mrfdetail/GetRequisition/`,
  GET_CREATE_REQUISITION_DROPDOWN: `${APIPath}Mrfdetail/GetMRFDropdownlist`,
  POST_CREATE_REQUISITION: `${APIPath}mrfdetail/POST`,
  ADD_CANDIDATE: `${APIPath}Candidatedetail/Post`,
  ADD_SOURCE_NAME : `${APIPath}Source`,
  RESUME_UPLOAD: `${APIPath}Upload?ResumeOrAssign=Resume&FileName=`,
  ADD_POSITIONTITLE: `${APIPath}PositionTitle`,
  ADD_PROJECT: `${APIPath}Project`,
  GET_CANDIDATE_DETAILS:`${APIPath}Candidatedetail/GetReferenceNoAndPositiontitle`
};

export const FILE_URL = {
	RESUME: `${APIPath}Resume/`,
	ASSIGNMENT: `${APIPath}Assignment/`,
	
};

export const ROUTES = {
  /* DASHBOARD: "dashboard",
    CREATE_REQUISITION: "create_requisition",
    MY_REQUISITION: "my_requisition" */
  dashboard: "dashboard",
  my_requisition: "my_requisition",
  create_requisition: "create_requisition",
  edit_requisition: "edit_requisition",
  add_candidate: "add_candidate",
  view_candidate: "view_candidate",
};

export const MRF_STATUS = {
  draft: 1,
  submToHr: 2,
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
  mrfTransferToNew: 13,
};

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
  requisitionDateUtc: "",
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
  employeeCode: "",
  lastWorkingDate: "",
  annualCtc: 0,
  annualGross: 0,
  replaceJustification: "",
  jobDescription: "",
  skills: "",
  resumeReviewerEmployeeIds: [],
  interviewerEmployeeIds: [],
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
};

