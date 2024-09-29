import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import { changeTheme } from "./utils/store/themeSlice.js";
import { routes } from "./routes/index.js";

import AppLayout from "./Layouts/App-Layout.jsx";
import GuestLayout from "./Layouts/Guest-Layout.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/Auth/Login.jsx";
import EmailVerification from "./Pages/Auth/EmailVerification.jsx";

import Users from "./Pages/Users/Index.jsx";
import WebsiteUrls from "./Pages/WebsiteUrls/Index.jsx";
import WebsiteUrlCreate from "./Pages/WebsiteUrls/Create.jsx";
import Domains from "./Pages/Domains/Index.jsx"
import CreateUser from "./Pages/Users/Create.jsx";
import EditUser from "./Pages/Users/Edit.jsx";
import CreateDomain from "./Pages/Domains/Create.jsx";
import EditDomain from "./Pages/Domains/Edit.jsx";
import PendingDomains from "./Pages/PendingDomains/Index.jsx"
import PendingUsers from "./Pages/PendingUsers/Index.jsx"
import AccountInformation from "./Pages/AccountInformations/Index.jsx"
import Notices from "./Pages/Notices/Index.jsx"
import CreateNotice from "./Pages/Notices/Create.jsx"
import EditNotice from "./Pages/Notices/Edit.jsx"
import Supports from "./Pages/Supports/Index.jsx"
import CreateSupport from "./Pages/Supports/Create.jsx"
import EditSupport from "./Pages/Supports/Edit.jsx"
import Profile from "./Pages/Profile.jsx";

import Orders from "./Pages/Orders/Index.jsx";
import PendingOrders from "./Pages/PendingOrders/Index.jsx";

import Packages from "./Pages/Packages/Index.jsx";

function App() {
  const theme = useSelector((state) => state.theme?.value)
  const dispatch = useDispatch()

  useEffect(() => {

    if(!theme){
      dispatch(changeTheme('light'))
    }

    themeChange(false)
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />} >
          <Route path={routes.home} element={<Dashboard />}/>
          <Route path={routes.overview} element={<Dashboard />}/>

          <Route path={routes.users} element={<Users />}/>
          <Route path={routes.createUser} element={<CreateUser />}/>
          <Route path={`${routes.users}/:id`} element={<EditUser />}/>
          <Route path={routes.pendingUsers} element={<PendingUsers />}/>

          <Route path={routes.websiteUrls} element={<WebsiteUrls />}/>
          <Route path={routes.createWebsiteUrl} element={<WebsiteUrlCreate />}/>

          <Route path={routes.domains} element={<Domains />}/>
          <Route path={routes.createDomain} element={<CreateDomain />}/>
          <Route path={`${routes.domains}/:id`} element={<EditDomain />}/>
          <Route path={routes.pendingDomains} element={<PendingDomains />}/>

          <Route path={routes.accountInformation} element={<AccountInformation />}/>

          <Route path={routes.notices} element={<Notices />}/>
          <Route path={routes.createNotice} element={<CreateNotice />}/>
          <Route path={`${routes.notices}/:id`} element={<EditNotice />}/>

          <Route path={routes.supports} element={<Supports />}/>
          <Route path={routes.createSupport} element={<CreateSupport />}/>
          <Route path={`${routes.supports}/:id`} element={<EditSupport />}/>

          <Route path={routes.profile} element={<Profile />} />
          
          <Route path={routes.orders} element={<Orders />} />
          
          <Route path={routes.pendingOrders} element={<PendingOrders />} />
          
          <Route path={routes.packages} element={<Packages />} />
          
        </Route>
        <Route element={<GuestLayout />} >
          <Route path={routes.login} element={<Login />}/>

          <Route path={`${routes.emailVerification}/:token`} element={<EmailVerification />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
