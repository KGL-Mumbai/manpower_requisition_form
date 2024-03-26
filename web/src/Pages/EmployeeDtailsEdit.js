import React, { useState, useEffect,useRef } from 'react';
import DropdownComponent from './../components/Dropdown';
import InputTextCp from "./../components/Textbox";
import ButtonC from "./../components/Button"
import { API_URL } from '../constants/config';
import { navigateTo } from "../constants/Utils";
import ToastMessages from "./../components/ToastMessages";
import { storageService } from "../constants/storage";
const EmployeeDtailsEdit = ({id, updateData}) => {
  useEffect(() => {
    fetchData();
  }, []);
useEffect(() => {
  fetch(API_URL.GET_EMPLOYEE_DETAILS +"/"+id).then((res) => {
    console.log("resut for res  ", res)
      return res.json();
  }).then((result) => {
     namechange(result.result[0].name);
     emailchange(result.result[0].email);
      phonechange(result.result[0].contactNo);
      employeeChange(result.result[0].employeeCode);
      setRole(result.result[0].roleId);
      
  }).catch((err) => {
      console.log(err.message);
  })
}, []);
console.log(updateData);
const toastRef = useRef(null);
const [name, namechange] = useState("");
const [email, emailchange] = useState("");
const [roleId, setRole] = useState({});
const [contactNo,phonechange] = useState("");
const [employeeCode,employeeChange] = useState("");
const allowedByEmployeeId = storageService.getData("profile").employeeId;
const createdByEmployeeId = storageService.getData("profile").employeeId;
const [createdOnUtc] = useState(new Date().toISOString());
const updatedByEmployeeId = storageService.getData("profile").employeeId;
const [isAllowed] = useState(true);
const [updatedOnUtc] = useState(new Date().toISOString());
const [roleOptions, roleOptionchange] = useState([]);
  const fetchData = () => {
    const apiUrl = API_URL.GET_ROLE;
    fetch(apiUrl)
      .then(response => response.json())
      .then(responseData => {
        if (Array.isArray(responseData.result)) {
          const data = responseData.result;
          console.log(data);
          const options = data.map(x => { return { value: x.id,  roleName: x.name } })
          roleOptionchange(options);
        } else {
          console.error('API response result is not an array:', responseData);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });

  };
  const updateEditmode = () =>{
    updateData(false);
  }

  const handlesubmit = async ()  => {
    const empdata = { name, email, contactNo,employeeCode,roleId: roleId,isAllowed,allowedByEmployeeId,createdByEmployeeId,
      createdOnUtc,updatedByEmployeeId,updatedOnUtc};

      try {
        const response = await fetch(API_URL.UPDATE_EMPLOYEE +id, {
          method: "Put",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(empdata),
        });
        if (response.ok) {
          const responseData = await response.json();
          console.log("Response Data:", responseData);
          toastRef.current.showSuccessMessage("Form submitted successfully!");
          setTimeout(() => {
             navigateTo("dashborad");
             window.location.reload();
          }, 1000);
        } else {
          console.error("Request failed with status:", response.status);
          if (response.status === 400) {
            toastRef.current.showBadRequestMessage(
              "Bad request: " + response.url
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
  }
  return (
    <div >
    <div style={{ display: 'flex' }}>
    <div
      className="border-round-lg bg-white text-black-alpha-90 p-3 flex flex-column justify-content-between"
      style={{ width: "190vw"} }
    >
      <h3 className="text-xl my-2">Fill the Details</h3>
      
      <section>
        <div className="flex justify-content-between gap-5">
          <div className="flex flex-column w-6 gap-2">
            <label htmlFor="refno" className="font-bold text-sm">
              Name
            </label>
             
            <InputTextCp id="refno" value={name} onChange={(e) => namechange(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-content-between gap-5">
          <div className="flex flex-column w-6 gap-2">
            <label htmlFor="position-title" className="font-bold text-sm">
              Email Address
            </label>
            <InputTextCp id="position-title" value={email} onChange={(e) => emailchange(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-content-between gap-5">
          <div className="flex flex-column w-6 gap-2">
            <label htmlFor="position-title" className="font-bold text-sm">
              Contact Number
            </label>
            <InputTextCp id="position-title" value={contactNo} onChange={(e) => phonechange(e.target.value)} />
          </div>
          </div>
          <div className="flex justify-content-between gap-5">
          <div className="flex flex-column w-6 gap-2">
            <label htmlFor="position-title" className="font-bold text-sm">
               Employee Id
            </label>
            <InputTextCp id="position-title" value={employeeCode} onChange={(e) => employeeChange(e.target.value)} />
          </div>
          </div> 
        <div className="flex justify-content-between gap-5">
          <div className="flex flex-column w-6 gap-2">
            <label htmlFor="department" className="font-bold text-sm">
              Role
            </label>

            <DropdownComponent
             optionLabel="roleName"
             optionValue="value"
             value={roleId}
             type="roleId"
             options={roleOptions}
             //placeholder={}
             onChange={e => {
               console.log(e.target)
               setRole(e.target.value)
             }
              }
            />
         
         </div>
         
        </div>
        <div style={{    display: 'flex', flexDirection:'row',width: '50%',
    justifyContent: 'center',
    marginTop: '15px'}}>
        <ButtonC  severity="danger" className={"w-20 px-7 bg-red-600 border-red-600"}label="CANCEL" onClick={() => updateEditmode(false)}></ButtonC>
        <ButtonC style={{ marginLeft:'15px'}} className={"w-20 px-7 bg-red-600 border-red-600"}label="SUBMIT" severity="primary" onClick={handlesubmit} />
        <ToastMessages ref={toastRef} />
      </div>

         </section> 
      </div>  
      </div>
   
        </div>
  );
};
export default EmployeeDtailsEdit;