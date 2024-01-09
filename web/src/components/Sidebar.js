import React, { useEffect,useState } from 'react'
import './../css/Sidebar.css'
import { navigateTo } from '../constants/Utils';
import { ROLES } from '../constants/config';
 
const Sidebar = ({roleId,sPageKey}) => {
    const [active, setActive] = useState("dashboard");
    const onLinkClicked = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        var oTarget = e.currentTarget,
            sPageKey = oTarget.getAttribute('href');
           
        setActive(sPageKey);
        navigateTo(sPageKey)
    }
    useEffect(()=>{
        setActive(sPageKey);
    },[sPageKey])
    return (
        <div className='sidebar'>
        <ul>
            {(roleId === ROLES.mrfOwner || roleId === ROLES.hr || roleId === ROLES.interviewer ||
            roleId == ROLES.resumeReviwer) && (
                <>
                    <li>
                        <a className={active === 'dashboard' ? 'active' : ''} href="dashboard" onClick={(e) => onLinkClicked(e)}>
                            <img src="./images/my_dashboard_selected.png" alt="my_dashboard" /><br />My Dashboard
                        </a>
                    </li>
                    <li>
                        <a className={active === 'employee' ? 'active' : ''} href="employee" onClick={(e) => onLinkClicked(e)}>
                            <img src="./images/my_dashboard_selected.png" alt="employee" /><br />Employee
                        </a>
                    </li>
                    {(roleId !== ROLES.hr && roleId !== ROLES.interviewer && roleId !== ROLES.resumeReviwer) &&(
                        <li>
                            <a className={active === 'create_requisition' ? 'active' : ''} href="create_requisition" onClick={(e) => onLinkClicked(e)}>
                                <img src="./images/create_requisition_normal.png" alt="create_requisition" /><br />Create Requisition
                            </a>
                        </li>
                    )}
                {(roleId !== ROLES.interviewer && roleId !== ROLES.resumeReviwer) &&(
                    <li>
                        <a className={active === 'my_requisition' ? 'active' : ''} href="my_requisition" onClick={(e) => onLinkClicked(e)}>
                            <img src="./images/my_requisition_normal.png" alt="my_requisition" /><br />My Requisition
                        </a>
                    </li>
                )}
                    {(roleId !== ROLES.mrfOwner && roleId !== ROLES.interviewer && roleId !== ROLES.resumeReviwer) && (
                    <li>
                        <a className={active === 'view_candidate' ? 'active' : ''} href="view_candidate" onClick={(e) => onLinkClicked(e)}>
                            <img src="./images/my_requisition_normal.png" alt="my_requisition" /><br />View Candidate
                        </a>
                    </li>
                     )}
                     {roleId === ROLES.resumeReviwer && (
                    <li>
                        <a className={active === 'my_resume' ? 'active' : ''} href="my_resume" onClick={(e) => onLinkClicked(e)}>
                            <img src="./images/my_requisition_normal.png" alt="my_requisition" /><br />My Resume
                        </a>
                    </li>
                     )}
                 
                </>
            )}
        </ul>
    </div>
   
 
    )
}
 
export default Sidebar;