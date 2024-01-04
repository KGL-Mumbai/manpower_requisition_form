import { useState } from "react";
import { mrfStatus } from "./constant";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { storageService } from "../constants/storage";
import { useDispatch } from "react-redux";
import { PAGE_ACTIONS } from "../reducers/Page_r";
import { navigateTo } from "../constants/Utils";
import "../css/MrfRefStatus.css";
import { MRF_STATUS } from "../constants/config";

const MrfLink = ({ mrfRef, mrfId = null, status = null, role = null ,statusId=null }) => {
  // const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  // console.log(message)
  const handleAClick = (id, status, role,statusId) => {
    dispatch(
      PAGE_ACTIONS.setParams({
        params: { id: id, statusForTitle: status, roleId: role, mrfstatusId:statusId},
        // statusForTitle: status,
        // roleId: role,
        // statusId
      })
    );
    // console.log(params)
    navigateTo("edit_requisition");
  };

  return (
    <div className="mrf-ref-cell">
      <button
        onClick={(e) => handleAClick(mrfId, status, role,statusId)}
        className="mrf-ref-link"
      >
        {mrfRef}
      </button>
    </div>
  );
};

const ReferenceBodyTemplate = (mrf) => {
  // const roleId = storageService.getData("profile").roleId;
  // const roleId = mrf.roleId;
  const mrfRef = mrf.referenceNo;
// console.log(mrf)
  switch (mrf.mrfStatusId) {
    case MRF_STATUS.draft:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          role={mrf.roleId}
          status={mrf.mrfStatus}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.submToHr:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.open:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          role={mrf.roleId}
          status={mrf.mrfStatus}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.resubReq: 
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.rejected:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.closed:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.withdrawn:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.onHold:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    // case MRF_STATUS.hodapproval:
    //   return (
    //     <MrfLink
    //       mrfRef={mrfRef}
    //       mrfId={mrf.mrfId}
    //       status={mrf.mrfStatus}
    //       role={mrf.roleId}
    //       statusId={mrf.mrfStatusId}
    //     />
    //   );
    // case MRF_STATUS.cooapproval:
    //   return (
    //     <MrfLink
    //       mrfRef={mrfRef}
    //       mrfId={mrf.mrfId}
    //       status={mrf.mrfStatus}
    //       role={mrf.roleId}
    //       statusId={mrf.mrfStatusId}
    //     />
    //   );
    case MRF_STATUS.awaitCooApproval:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.awaitHodApproval:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
    case MRF_STATUS.awaitfinanceHeadApproval:
    
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
   
    case MRF_STATUS.recivedfinanceHeadApproval:
      return (
        <MrfLink
          mrfRef={mrfRef}
          mrfId={mrf.mrfId}
          status={mrf.mrfStatus}
          role={mrf.roleId}
          statusId={mrf.mrfStatusId}
        />
      );
  }
};

export default ReferenceBodyTemplate;
