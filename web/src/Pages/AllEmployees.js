import React, { useEffect, useState, useRef, Children } from "react";
import { Button } from "primereact/button";
import "../css/MyRequistionsBody.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { API_URL } from "../constants/config";
import { getData, getDataAPI, postData, putData } from "../constants/Utils";
import ToastMessages from "../components/ToastMessages";
import DropdownComponent from "../components/Dropdown";
import InputTextCp from "../components/Textbox";
import { FilterMatchMode } from "primereact/api";
import LoadingSpinner from "../components/LoadingSpinner";
export default function AllEmployees() {
  const [mergeDataa, setmergeData] = useState([{}]);
  const [roleId, setRoleId] = useState([]);
  const [saveBttn, setSaveBttn] = useState([]);
  const [roleOptions, roleOptionchange] = useState([]);
  const toastRef = useRef(null);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });

  useEffect(() => {
    setIsLoading(true);
    const onload = async () => {
      let merged = [];
      let options = [];
      const mergeData = (data1, data2) => {
        let temp = {};
        data2.forEach((item) => {
          temp[item.employeeCode] = [item.contactNo, item.roleId];
        });
        data1.forEach((item1) => {
          let commonIdentifier = item1.employeeId;

          let matchingItem2 = temp[commonIdentifier];

          const mergedItem = {
            empcode: item1.employeeId,
            name: item1.userName,
            email: item1.email,
            contact: matchingItem2 ? matchingItem2[0] : null,
            roleid: matchingItem2 ? matchingItem2[1] : null,
          };
          merged.push(mergedItem);
          setIsLoading(false);
        });
      };

      let result = await getDataAPI(API_URL.GET_ROLE);
      let response = await result.json();
      if (Array.isArray(response.result)) {
        const data = response.result;
        options = data.map((x) => {
          return { value: x.id, roleName: x.name };
        });
      } else {
        console.error("API response result is ssnot an array:", response);
      }
      
      const data = await getData(API_URL.GET_EMPLOYEE);
      const dbData = data.result;
      const ldapData = await getData(API_URL.ALL_EMPLOYEE);
      let arr = new Array(ldapData.length).fill(false);
      let roleArr = new Array(ldapData.length).fill(0);
      mergeData(ldapData, dbData);

      setmergeData(merged);
      setSaveBttn(arr);
      setRoleId(roleArr);
      roleOptionchange(options);
    };

    onload();
    
  }, []);

  const roleBodyTemplate = (rowData, options) => {
    const handleDropdownChange = (e) => {
      let mergeedatacopy = [...mergeDataa];
      let sv = [...saveBttn];
      sv[options.rowIndex] = true;
      setSaveBttn(sv);

      mergeedatacopy[options.rowIndex].roleid = e.target.value;
      setmergeData(mergeedatacopy);
    };

    return (
      <DropdownComponent
        optionLabel="roleName"
        optionValue="value"
        value={rowData.roleid}
        type="roleid"
        options={roleOptions}
        onChange={handleDropdownChange}
        placeholder={"Select Role"}
        className="w-full md:w-12rem"
      />
    );
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="dash_table_header ">
        <h5 className="dash_summary_title"> </h5>
        <span className="p-input-icon-left">
          <i className="pi pi-search" style={{ top: "44%" }} />
          <InputTextCp
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="  border-round-3xl h-2rem text-sm"
          />
        </span>
      </div>
    );
  };
  const header = renderHeader();
  const update = async (data) => {
    setIsLoading(true);
    const empdata = {
      name: data.name,
      email: data.email,
      contactNo: "99999999",
      employeeCode: data.empcode,
      isDeleted: false,
      roleId: data.roleid,
      isAllowed: true,
      allowedByEmployeeId: 1,
      createdByEmployeeId: 1,
      createdOnUtc: new Date().toISOString(),
      updatedByEmployeeId: 1,
      updatedOnUtc: new Date().toISOString(),
    };
   

    try {
      let checkEmp = await getData(
        API_URL.GET_EMPLOYEE_BY_EMP_CODE + "/empcode?empcode=" + data.empcode
      );

      if (checkEmp.result.length > 0) {
        const empdataNew = {
          id: checkEmp.result[0].id,
          name: checkEmp.result[0].name,
          email: checkEmp.result[0].email,
          contactNo: checkEmp.result[0].contactNo,
          employeeCode: data.empcode,
          isDeleted: checkEmp.result[0].isDeleted,
          roleId: data.roleid,
          isAllowed: checkEmp.result[0].isAllowed,
          allowedByEmployeeId: 1,
          createdByEmployeeId: 1,
          createdOnUtc: checkEmp.result[0].createdOnUtc,
          updatedByEmployeeId: 1,
          updatedOnUtc: new Date().toISOString(),
        };

        let upEmp = await putData(
          `${API_URL.UPDATE_EMPLOYEE + checkEmp.result[0].id}`,
          empdataNew
        );
        if (upEmp.ok) {
          const responseData = await upEmp.json();
          if (responseData.statusCode === 409) {
            toastRef.current.showConflictMessage(responseData.message);
          } else {
            toastRef.current.showSuccessMessage(
              "Role assigned/updated successfully!"
            );
            setIsLoading(false);
          }
        } else {
          console.error("Request failed with status:", upEmp.status);
          if (upEmp.status === 400) {
            toastRef.current.showBadRequestMessage("Bad request: " + upEmp.url);
            setIsLoading(false);

          }
        }
      } else {
        let response = await postData(API_URL.CREATE_EMPLOYEE, empdata);

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.statusCode === 409) {
            toastRef.current.showConflictMessage(responseData.message);
          } else {
            toastRef.current.showSuccessMessage(
              "Role assigned/updated successfully!"
            );
            setIsLoading(false);

          }
        } else {
          console.error("Request failed with status:", response.status);
          const errorData = await response.text();
          console.error("Error Data:", errorData);
          if (response.status === 400) {
            toastRef.current.showBadRequestMessage(
              "Bad request: " + response.url
            );
            setIsLoading(false);

          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);

    }
  };
  const actionBodyTemplate = (rowData, options) => {
    const onClickHandleSave = () => {
      update(rowData, roleId[options.rowIndex]);
      let sv = [...saveBttn];
      sv[options.rowIndex] = false;
      setSaveBttn(sv);
    };
    if (saveBttn[options.rowIndex]) {
      return (
        <Button
          icon="pi pi-save "
          className="action_btn"
          onClick={onClickHandleSave}
        />
      );
    }
    return <Button icon="pi pi-save" className="action_btn" disabled />;
  };

  const columns = [
    {
      field: "empcode",
      header: "Emp ID",
      sortable: true,
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      sortable: true,
    },
    {
      header: "Role",
      body: roleBodyTemplate,
      sortable: true,
    },
    {
      header: "Action",
      body: actionBodyTemplate,
    },
  ];
  
  return (
    <div className="my-req">
      <>
        <h3 className="my-req-title">All Employees</h3>
        <div className="req-table"> {isLoading && <LoadingSpinner />}
          <DataTable
            header={header}
            value={mergeDataa}
            paginator={mergeDataa.length > 10}
            removableSort
            rows={10}
            filters={filters}
            scrollable
            scrollHeight="flex"
          >
            
            {columns.map((col, index) => (
              <Column
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
                bodyClassName={"req-col " + col.bodyClassName}
                sortable={col.sortable}
              />
            ))}
          </DataTable>
        </div>
        <ToastMessages ref={toastRef} />
      </>
    </div>
  );
}
