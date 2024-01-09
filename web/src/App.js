import "./css/App.css";
import "./styles/layout/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "./css/InputComponent.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  detectDevice,
  getData,
  getKeyFromLocation,
  isTouchDevice,
  navigateTo,
} from "./constants/Utils";
import { DEVICE_ACTIONS } from "./reducers/Device_r";
import Login from "./containers/Login";
import HeaderBar from "./components/HeaderBar";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { graphConfig, loginRequest } from "./authConfig";
import { storageService } from "./constants/storage";
import { APP_KEY, ROUTES } from "./constants/config";
import Sidebar from "./components/Sidebar";
import { PAGE_ACTIONS, Page } from "./reducers/Page_r";
import Dashboard from "./containers/Dashboard";
import MyRequisitions from "./containers/MyRequisitions";
import CreateRequisition from "./Pages/CreateRequisition";
import AddCandidate from "./Pages/AddCandidate";
import ViewCandidate from "./Pages/ViewCandidate";
import MyReumes from "./Pages/MyReumes";
import Footer from "./components/Footer";
import EmployeDetails from "./Pages/EmployeDetails";
import EmployeeDtailsEdit from "./Pages/EmployeeDtailsEdit";
function App() {
  const [token, setToken] = useState();
  const [profile, setProfile] = useState();
  const dispatch = useDispatch();
  const { currentPageKey, params } = useSelector(
    (state) => state.page
  );
  const { currentDevice, touchDevice } = useSelector((state) => state.device);

  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (window.localStorage && !window.localStorage.getItem(APP_KEY)) {
      storageService.init();
    }
    let currentDevice = detectDevice();
    dispatch(DEVICE_ACTIONS.setCurrentDevice(currentDevice));

    /**** 
        Description: Calls on window resize or on touch device rotation by the user.
    ****/
    window.addEventListener("resize", function () {
      let currentDevice = detectDevice();
      dispatch(DEVICE_ACTIONS.setCurrentDevice(currentDevice));
    });

    dispatch(DEVICE_ACTIONS.setTouchDevice(isTouchDevice()));
  }, []);

  useEffect(() => {
    if (accounts.length === 0) {
      // debugger
      return;
    }
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        storageService.setData("token", response.accessToken);
        callLoginAPI();
      });
  }, [accounts]);

  async function callLoginAPI() {
    const response = await getData(graphConfig.graphMeEndpoint);
    var oData =
      response && response.hasOwnProperty("result") ? response.result : null;
    if (oData === null) {
      return;
    }
    storageService.setData("profile", oData);
    storageService.setData("isLoggedIn", true);
    setProfile(oData);
    getLocationHash();
  }

  const getLocationHash = () => {
    let initialPageKey = storageService.getData("isLoggedIn")
      ? "dashboard"
      : "login";
    /* added window hash change event so we can detect browser next back*/
    window.onhashchange = function (e) {
      let locationRouteKeyFrom = getKeyFromLocation(),
        routes = ROUTES,
        routeKeys =
          locationRouteKeyFrom && locationRouteKeyFrom.length > 0
            ? locationRouteKeyFrom.split("/")
            : [],
        mainRouteKey = routeKeys[0],
        isValidRoute = routes.hasOwnProperty(mainRouteKey);

      mainRouteKey = !isValidRoute ? initialPageKey : mainRouteKey;

      dispatch(
        PAGE_ACTIONS.setCurrentPageKey({
          pageKey: mainRouteKey,
        })
      );
      navigateTo(mainRouteKey);
    };

    if (window.location.hash === "") {
      console.log("## No Hash ##");
      navigateTo(initialPageKey);
    } else {
      // console.log('## Has Hash ##');
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };
  let Comp = ROUTES[currentPageKey];
  return (
    <div className={"App " + currentDevice + " " + currentPageKey}>
      <AuthenticatedTemplate>
        {profile && profile.roleId && (
          <>
            <HeaderBar
              userFirstName={
                accounts.length > 0 && accounts[0].name.split(" ")[0]
              }
              userLastName={
                accounts.length > 0 && accounts[0].name.split(" ")[1]
              }
            />
            <div className="content">
              <Sidebar roleId={profile.roleId} sPageKey = {currentPageKey}/>
              <div className="content_right_wrapper">
                {currentPageKey === "dashboard" && (
                  <Dashboard
                    roleId={profile.roleId}
                    userId={profile.employeeId}
                  />
                )}
                {currentPageKey === "my_requisition" && (
                  <MyRequisitions
                    roleId={profile.roleId}
                    userId={profile.employeeId}
                  />
                )}
                {currentPageKey === "employee" && (
                  <EmployeDetails
                  />
                )}
                 {currentPageKey === "employee_edit" && (
                  <EmployeeDtailsEdit
                  />
                )}
                {currentPageKey === "add_candidate" && (
                  <AddCandidate 
                  reqId={params.mrfId}
                  referenceNo={params.referenceNo}
                   />
                )}
                {currentPageKey === "create_requisition" && (
                  <CreateRequisition
                  roleId={profile.roleId}
                  />
                )}
                {currentPageKey === "view_candidate" && (
                  <ViewCandidate
                    
                  />
                )}
                {currentPageKey === "my_resume" && (
                  <MyReumes/>
                    
                 
                )}
                {currentPageKey === "edit_requisition" && (
                  <CreateRequisition
                    reqId={params.id}
                    reqstatus={params.statusForTitle}
                    reqRoleId={params.roleId}
                    reqstatusId={params.mrfstatusId}
                  />
                )}
                <Footer/>
              </div>
            </div>
          </>
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Login />
        <div className="login-load">

        <img src="./images/logo.png" alt="mrf logo" />
        </div>
        {/* <h5 className="card-title">
          Please sign-in to see your profile information.
        </h5> */}
      </UnauthenticatedTemplate>
    </div>
  );
}

export default App;
