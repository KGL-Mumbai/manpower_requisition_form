import React, { useState, useEffect } from 'react';
import DropdownComponent from './../components/Dropdown';
import InputTextCp from "./../components/Textbox";
import ButtonC from "./../components/Button"
import { API_URL } from '../constants/config';


const EmployeeDtailsEdit = ({id, updateData}) => {
  useEffect(() => {
    fetchData();
  }, []);
useEffect(() => {
  fetch(API_URL.GET_EMPLOYEE_DETAILS + id).then((res) => {
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

const [name, namechange] = useState("");
const [email, emailchange] = useState("");
const [roleId, setRole] = useState({});
const [contactNo,phonechange] = useState("");
const [isDeleted] = useState(false);
const [employeeCode,employeeChange] = useState("");
const [allowedByEmployeeId] = useState("1");
const [createdByEmployeeId] = useState("1");
const [createdOnUtc] = useState(new Date().toISOString());
const [updatedByEmployeeId] = useState("1");
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
          const options = data.map(x => { return { value: x.id, name: x.name } })
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
  const handlesubmit = (e) => {
    e.preventDefault();
    const empdata = { name, email, contactNo,employeeCode,isDeleted,roleId: roleId.value,isAllowed,allowedByEmployeeId,createdByEmployeeId,
      createdOnUtc,updatedByEmployeeId,updatedOnUtc};


    fetch(API_URL.UPDATE_EMPLOYEE +id, {
      method: "Put",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(empdata)
       
    }).then((res) => {
      alert('updated successfully.')

    }).catch((err) => {
      console.log(err.message)
    })

  }
  return (
    <div >
   {/*  <DashboardHeader /> */}
    <div style={{ display: 'flex' }}>
      {/* <LeftPanel /> */}
    <div
      className="border-round-lg bg-white text-black-alpha-90 p-3 flex flex-column justify-content-between"
      style={{ width: "190vw"} }
    >
      <h3 className="text-xl my-2">Fill the Details</h3>
      
      <section

      >
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
              optionLabel="name"
              optionValue="value"
              value={console.log('roleId>>',roleId) || roleId.length && roleId}
              type="roleId"
              options={roleOptions}
              //placeholder={}
              onChange={e => {
                console.log('e.target.value>>', e.target)
                setRole(e.target)
              }
              }
            />
         
         </div>
         
        </div>
        <div style={{    display: 'flex', flexDirection:'row',width: '50%',
    justifyContent: 'center',
    marginTop: '15px'}}>
        <ButtonC  severity="danger" label="CANCEL" onClick={() => updateEditmode(false)}></ButtonC>
        <ButtonC style={{ marginLeft:'15px'}} label="SUBMIT" severity="primary" onClick={handlesubmit} />
      </div>

         </section> 
      </div>  
      </div>
   
        </div>
  );
};
export default EmployeeDtailsEdit;