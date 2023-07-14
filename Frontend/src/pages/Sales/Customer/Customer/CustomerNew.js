import React, { useState, useEffect, useRef } from "react";
import { Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import AlertModal from "../../../../pages/components/alert";
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function CreateCustomer() {
  let modcust = {};
  const isFirstClickRef = useRef(true);
  let [alertModal, setAlertModal] = useState(false);
  let [saved, setSaved] = useState(false);
  let [custdetdata, setCustDetdata] = useState([]);
  let [custdetdatafiltered, setCustDetdatafiltered] = useState([]);
  let [loaded, setLoaded] = useState(false);

  // Form data
  let [selectedCustomerId, setSelectedCustomerId] = useState("");
  let [newCustName, setNewCustName] = useState("");
  let [branchName, setBranchName] = useState("");
  let [custcode, setCustCode] = useState("");
  let [respo, setRespo] = useState("");
  let [modcustname, setModcustname] = useState("");

  useEffect(() => {
    async function getCustomersdata() {
      postRequest(endpoints.getCustomers, {}, (custdetdata) => {
        setCustDetdata(custdetdata);
        setCustDetdatafiltered(custdetdata);
        setLoaded(true);
      });
    }
    getCustomersdata();
  }, []);

  let rendertable = (cust, id) => {
    // console.log(cust);
    return (
      <tr
        className="custtr"
        style={{
          backgroundColor: selectedCustomerId === id ? "#98A8F8" : "",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          custselector(cust, id);
        }}
      >
        <td className="custtd">{cust["Cust_Code"]}</td>
        <td className="custtd">{cust["Cust_name"]}</td>
        <td className="custtd">{cust["Branch"]}</td>
      </tr>
    );
  };

  async function valCustName(e) {
    let cname = e.target.value.replace("^[A-Za-Z0-9 ");
    setNewCustName(cname);
  }

  let custselector = (cust, id) => {
    console.log(cust);
    setSelectedCustomerId(id);
    setNewCustName(cust["Cust_name"]);
    setBranchName(cust["Branch"]);
    setCustCode(cust["Cust_Code"]);
    localStorage.setItem("LazerCustExist", JSON.stringify(cust));
  };

  let csavedata = async () => {
    let custsavedata = {
      customerName: newCustName,
      branchName: branchName,
      custCode: custcode,
    };
    localStorage.setItem("LazerCustomer", JSON.stringify(custsavedata));
  };

  async function searchCustomer(e) {
    let sarray = [];

    // {custdetdata
    //     .filter(name => name.match(new RegExp(e.target.value.toLowerCase(), "i")))
    //     .map(name => {
    //         sarray.push(element);
    //     //  return <li key={Cust_name}>{Cust_name} </li>
    //     })}

    custdetdata.forEach((element) => {
      let sstring = element["Cust_name"].toLowerCase();
      if (sstring.startsWith(e.target.value.toLowerCase())) {
        // .includes(e.target.value.toLowerCase())) {
        sarray.push(element);
      }
    });
    console.log(sarray);
    if (sarray.length > 0) {
      setCustDetdatafiltered(sarray);
    }
    setNewCustName(e.target.value);
  }

  async function checkBranch(e) {
    e.preventDefault();
    let branName = e.target.value.replace(/[^A-Za-z0-9. -]/g, "");
    //   let branName = e.target.elements.branchName.value.replace(/[^A-Za-z0-9. -]/g, "");
    // if ((branchName === null) || (branchName === "") || (branchName.replaceAll(" ", "") === "")){
    //     alert('Branch Name cannot be blank');
    //     return;
    // }
    //   const brhname = e.target.elements.value.replace(/[^A-Za-z0-9. -]/g, "")
    setBranchName(branName);
  }

  let secbtnc = () => {
    setAlertModal(false);
  };

  let fstbtnc = () => {
    window.location.href = "/Customer/Customers/CustomerInfo";
  };
  async function submitSave(e) {
    setAlertModal(true);
    e.preventDefault();
    let newCustName = e.target.elements.newCustName.value;
    let branchName = e.target.elements.branchName.value;
    var spformat = /[!@#$%^*_+\-=\[\]{};:"\\|,<>\/?]+/;

    if (
      newCustName === null ||
      newCustName === "" ||
      newCustName.replaceAll(" ", "") === "" ||
      newCustName.match(spformat)
    ) {
      // if (isFirstClickRef.current) {
      toast.error("Customer Name cannot be blank or have special characters") &&
        setAlertModal(false);
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    // if (
    //   branchName === null ||
    //   branchName === "" ||
    //   branchName.replaceAll(" ", "") === ""
    // ) {
    //   toast.error("Branch Name cannot be blank") && setAlertModal(false);
    //   return;
    // }
    if (custdetdatafiltered.length > 0) {
      console.log("custdetdatafiltered");
      console.log(custdetdatafiltered);
      for (let i = 0; i < custdetdatafiltered.length; i++) {
        //if((custdetdatafiltered[i]["Cust_name"]==newCustName) && (custdetdatafiltered[i]["Branch"]==branchName)){
        if (custdetdatafiltered[i]["Cust_name"] == newCustName) {
          console.log(custdetdatafiltered[i]);
          setAlertModal(false);
          {
            modcust.customerName != newCustName
              ? toast.error("Customer Already Existed") && setAlertModal(false)
              : setAlertModal(true);
          }
          // {
          //   modcust.customerName == newCustName
          //     ? toast.error("Customer Created Successfully")
          //     : toast.error("Customer Alrady Existed");
          // }

          // if (isFirstClickRef.current) {
          //   setAlertModal(false);
          //   toast.error("Already Existssssssssssssssss");
          //   isFirstClickRef.current = false;
          // }
          // localStorage.setItem(
          //   "LazerCustExist",
          //   custdetdatafiltered[i]["Cust_Code"]
          // );
          // return;
        }
      }
    }

    await csavedata();
    postRequest(
      endpoints.createCustomer,
      { customerName: newCustName, branchName: branchName },
      (resp) => {
        console.log(resp);
        setRespo(resp);
        localStorage.removeItem("LazerCustExist");
        modcust = JSON.parse(localStorage.getItem("LazerCustomer"));
        console.log(modcust.customerName);
        modcustname = modcust.customerName;
        setModcustname(modcust.customerName);
        localStorage.removeItem("LazerCustomer");
        modcust["custcode"] = resp.custcode;
        modcust["customerName"] = newCustName;
        modcust["branchName"] = branchName;
        localStorage.setItem("LazerCustomer", JSON.stringify(modcust));
        console.log(modcust["branchName"]);

        // setAlertModal(true);

        // {
        //   modcust.customerName == newCustName
        //     ? setAlertModal(true)
        //     : toast.error("Customer Alrady Existed");
        // }

        // {
        //   modcust.customerName != newCustName
        //     ? toast.error("Customer Alrady Existed")
        //     : setAlertModal(true);
        // }
        //  alert.success(modcust["customerName"]+" added to Cutomer List with Code No : "+modcust["custcode"]);
        // setAlertModal(true);
        // alert(
        //   modcust["customerName"] +
        //     " added to Cutomer List with Code No : " +
        //     resp.custcode
        // ); //modcust["custcode"]);
        // window.location.href = "/Customer/CustomerInfo";
      }
    );
  }
  console.log(modcustname);

  const handleKeyDown = (event) => {
    if (event.key === " " && event.target.selectionStart === 0) {
      event.preventDefault(); // Prevent adding space at the beginning
    }
  };
  return (
    <div>
      <h4 className="title">Customer Creator Form</h4>
      <div className="form-style">
        <Form onSubmit={submitSave} autoComplete="off">
          <div className="row mt-3">
            <div className="col-md-4">
              <label className="form-label">Name </label>
              <input
                id="newCustName"
                type="text"
                placeholder="Enter Customer Name"
                maxLength={150}
                value={newCustName}
                onKeyDown={handleKeyDown}
                onChange={(e) => searchCustomer(e)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Branch </label>
              <input
                id="branchName"
                type="text"
                placeholder="Enter Branch Name"
                onChange={checkBranch}
                onKeyDown={handleKeyDown}
                value={branchName}
              />
            </div>
            <div className="col-md-4 mt-3">
              <button id="btnnewcustomer" className="button-style">
                Create Customer
              </button>
            </div>
          </div>

          <div className="row mt-3 ">
            <div
              style={{
                height: "375px",
                overflowY: "scroll",
                overflowX: "hidden",
                marginTop: "20px",
              }}
            >
              <Table
                striped
                className="table-data border"
                style={{ marginLeft: "5px", border: "1px" }}
              >
                <thead className="tableHeaderBGColor tablebody">
                  <tr>
                    {["Customer Code", "Customer Name", "Branch"].map((h) => {
                      return <th>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody className="tablebody">
                  {custdetdatafiltered != null
                    ? custdetdatafiltered.map((cust, id) =>
                        rendertable(cust, id)
                      )
                    : ""}
                </tbody>
              </Table>
            </div>
          </div>
        </Form>
        <AlertModal
          modcustname={modcustname}
          respo={respo}
          show={alertModal}
          onHide={(e) => setAlertModal(e)}
          firstbutton={fstbtnc}
          secondbutton={secbtnc}
          title="New Customer to the List"
          message={
            modcustname +
            " added to Cutomer List with Code No : " +
            respo.custcode
          }
          firstbuttontext="Yes"
          secondbuttontext="No"
        />
      </div>
    </div>
  );
}
export default CreateCustomer;
