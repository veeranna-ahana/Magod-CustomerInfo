import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Customer from "./customer/Customer";
import WithNav from "./Layout/WithNav";
import Parentroute from "./Layout/Parentroute";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import HomeOne from "./pages/HomeOne";
import Order from "./pages/Sales/Customer/Orders/Order";
import CustomerNew from "./pages/Sales/Customer/Customer/CustomerNew";
import CustomerInfo from "./pages/Sales/Customer/Customer/CustomerInfo";
import ExistedCustomerInfo from "./pages/Sales/Customer/Customer/ExistedCustomerInfo";
import Commercial from "./pages/Sales/Customer/Commercial/Outstanding_summary/Commercial";
import Custinvandpayments from "./pages/Sales/Customer/Commercial/Invoices_and_payments/Custinvandpayments";
import DrawingList from "./pages/Sales/Customer/DrawingList/DrawingList";
import Material from "./pages/Sales/Customer/Material/Material";
import PartList from "./pages/Sales/Customer/PartList/PartList";
import UserRolesModules from "./pages/admin/userrolesmodules";
import CreateUsers from "./pages/admin/createusers";
import MenuRoleMapping from "./pages/admin/menurolemapping";
import SendMail from "./pages/sendmail/sendmails";
import { QuotationProvider } from "./context/QuotationContext";
import { OrderProvider } from "./context/OrderContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <QuotationProvider>
        <OrderProvider>
          <Routes>
            <Route element={<Login />} path="/" />
            <Route path="/home" element={<Home />} />
            <Route path="/salesHome" element={<HomeOne />} />

            <Route element={<WithNav />}>
              <Route exact path="/Mailer" element={<SendMail />} />

              <Route path="/Customer" element={<Parentroute />}>
                <Route path="Customers">
                  <Route path="CustomerNew" element={<CustomerNew />} />
                  <Route path="CustomerInfo" element={<CustomerInfo />} />
                  <Route
                    path="ExistedCustomerInfo"
                    element={<ExistedCustomerInfo />}
                  />
                </Route>
                <Route path="Commercial">
                  <Route path="Outstandings" element={<Commercial />} />
                  <Route path="CustomerInvoiceAndPayments">
                    <Route index={true} element={<Custinvandpayments />} />
                  </Route>
                </Route>
                <Route path="DrawingList" element={<DrawingList />} />
                <Route path="Material" element={<Material />} />
                <Route path="Orders">
                  <Route path="OrdersCreated" element={<Order />} />
                  <Route path="OrdersRecorded" element={<Order />} />
                  <Route path="OrdersProcessing" element={<Order />} />
                  <Route path="OrdersProduced" element={<Order />} />
                  <Route path="OrdersReady" element={<Order />} />
                  <Route path="OrdersDispatched" element={<Order />} />
                  <Route path="OrdersAll" element={<Order />} />
                </Route>
                <Route path="PartList" element={<PartList />} />
              </Route>

              <Route path="/admin" element={<Parentroute />}>
                <Route index={true} />
                <Route path="Roles" element={<UserRolesModules />} />
                <Route path="Mapping" element={<MenuRoleMapping />} />
                <Route path="Users" element={<CreateUsers />} />
              </Route>
            </Route>
          </Routes>
        </OrderProvider>
      </QuotationProvider>
    </BrowserRouter>
  );
}

export default App;
