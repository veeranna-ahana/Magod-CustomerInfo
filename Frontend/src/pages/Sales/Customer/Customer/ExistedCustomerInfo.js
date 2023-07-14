import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Row,
  Col,
  Form,
  FormLabel,
  FormCheck,
  Button,
  Toast,
} from "react-bootstrap";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";
//import { useAlert } from 'react-alert'
import moment from "moment";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

const { postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function UpdateCustomerDetails() {
  let navigate = useNavigate();

  const isFirstClickRef = useRef(true);
  //   const alert = useAlert();
  let [statedata, setStatedata] = useState([]);
  let [crtermsdata, setCrTermsdata] = useState([]);
  let [mtrlsourcedata, setMtrlSourcedata] = useState([]);
  let [custContactData, setCustContactData] = useState([]);
  let [custContTeleData, setCustContTeleData] = useState([]);
  let [customerdata, setCustomerdata] = useState([]);
  let [custdata, setCustdata] = useState([]);
  let [CustName, setCustName] = useState("");
  let [selectedRecord, setSelectedRecord] = useState("");

  // Form data
  let [newCustName, setNewCustName] = useState("");
  let [branchName, setBranchName] = useState("");
  let [custcode, setCustCode] = useState("");
  let [pincode, setPinCode] = useState("");
  let [country, setCountry] = useState("");
  let [custcity, setCustCity] = useState("");
  let [custstate, setCustState] = useState("");
  let [gstdisabled, setGSTDisabled] = useState(true);
  let [pandisabled, setPANDisabled] = useState(true);

  let [custaddress, setCustAddress] = useState("");
  let [compemail, setCompEmail] = useState("");
  let [crterms, setCrTerms] = useState("");
  let [maxcredit, setMaxCredit] = useState("");
  let [creditdays, setCreditDays] = useState("");
  let [avepaydays, setAvePayDays] = useState("");
  let [firstbillingdt, setFirstBillingDt] = useState("");
  let [lastbillingdt, setLastBillingDt] = useState("");
  let [gstno, setGSTNO] = useState("");
  let [panno, setPANNO] = useState("");
  let [custfoldername, setCustFolderName] = useState("");
  let [delivery, setDelivery] = useState("");
  let [govtorg, setGovtOrg] = useState(false);
  let [isexport, setIsExport] = useState(false);
  let [custcurrent, setCustCurrent] = useState(false);
  let [statecd, setStateCd] = useState("");
  let [custstateid, setCustStateId] = useState("");

  // Contact Details
  let [conid, setConid] = useState([]);
  let [conName, setContactName] = useState([]);
  let [conDept, setDept] = useState([]);
  let [conDesignation, setDesignation] = useState([]);
  let [conE_mail, setCEmail] = useState([]);
  let [conTele_Office, setTele_Office] = useState([]);
  let [conTele_Mobile, setTele_Mobile] = useState([]);
  let [btnnew, setBtnNew] = useState(false);
  let [btnupd, setBtnUpd] = useState(true);
  let [btndel, setBtnDel] = useState(true);

  let [rawCustState, setRawCustState] = useState({});

  // select row function
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
  };
  let customerMenu = () => {
    window.location.href = "/customer";
  };

  useEffect(() => {
    setBtnNew(false);
    async function fetchData() {
      postRequest(endpoints.getCustomers, {}, (custdetdata) => {
        for (let i = 0; i < custdetdata.length; i++) {
          custdetdata[i].label = custdetdata[i].Cust_name;
        }
        setCustdata(custdetdata);
        console.log("custdetdata", custdetdata);
        // setLoaded(true);
      });
      postRequest(endpoints.getStates, {}, (data) => {
        console.log("states", data);
        setStatedata(data);
      });
      postRequest(endpoints.getCreditTerms, {}, (crdata) => {
        console.log("crdata", crdata);
        setCrTermsdata(crdata);
      });
      postRequest(endpoints.getMtrlSources, {}, (mtlsrcdata) => {
        console.log("mtlsrcdata", mtlsrcdata);
        setMtrlSourcedata(mtlsrcdata);
      });
    }
    fetchData();
  }, []);

  // let selectCust = (evt) => {
  //     console.log(evt.target.value);
  // }

  let selectCust = async (e) => {
    console.log("cust data = ", e);
    console.log("cust code = ", e[0].Cust_Code);
    console.log("table customer = ", custdata);
    let cust;
    for (let i = 0; i < custdata.length; i++) {
      if (custdata[i]["Cust_Code"] === e[0].Cust_Code) {
        cust = custdata[i];
        break;
      }
    }
    setCustCode(cust.Cust_Code);
    console.log("asdfghjkl", cust.Cust_Code);
    // let custdet = evt.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    //   setCustCode(cust.Cust_Code)
    postRequest(
      endpoints.getCustomerDetails,
      {
        //     custcode: custdet.substring(0, 4),
        custcode: cust.Cust_Code,
      },
      (resp) => {
        console.log(resp);
        let excustdata = resp[0];
        setCustCode(cust.Cust_Code);
        setNewCustName(excustdata.customerName);
        //
        //    console.log("After postRequesy : "+custdet);
        //  setCustCode(custdet.substring(0, 4));
        // setNewCustName(excustdata.substring(6, custdet.length));
        //            console.log(excustdata.Branch);
        setBranchName(excustdata.Branch);
        setAvePayDays("");
        setAvePayDays(
          excustdata.AveragePymtPeriod ? excustdata.AveragePymtPeriod : ""
        );
        if (excustdata.EMail != null || excustdata.EMail != "undefined") {
          setCompEmail(excustdata.EMail);
        } else {
          setCompEmail("");
        }
        setCountry(excustdata.Country);
        setCrTerms(excustdata.CreditTerms);
        setCreditDays(excustdata.CreditTime);
        setCustAddress(excustdata.Address);
        setCustCity(excustdata.City);
        setCustCurrent(excustdata.CURRENT);
        setCustFolderName(excustdata.DWG ? excustdata.DWG : custcode);

        //  console.log(excustdata.StateId, excustdata.State)

        if (excustdata.StateId != null && excustdata.State == "undefined") {
          postRequest(
            endpoints.getStateName,
            { statecd: excustdata.StateId },
            (stnmdata) => {
              setCustState(stnmdata.State);
              setCustStateId(excustdata.StateId);
            }
          );
        } else if (
          (excustdata.StateId == null || excustdata.StateId == "") &&
          (excustdata.State != null || excustdata.State != "undefined")
        ) {
          console.log("State Name Present");
          postRequest(
            endpoints.getStateCode,
            { statenm: excustdata.State },
            (stdata) => {
              setCustState(excustdata.State);
              setCustStateId(stdata.StateCode);
            }
          );
        } else {
          setCustState(excustdata.State);
          setCustStateId(excustdata.StateId);
        }
        setDelivery(excustdata.Delivery);
        setFirstBillingDt("");
        setFirstBillingDt(
          excustdata.FirstBilling
            ? moment(excustdata.FirstBilling).format("DD/MM/YYYY")
            : ""
        );
        setLastBillingDt("");
        setLastBillingDt(
          excustdata.LastBilling
            ? moment(excustdata.LastBilling).format("DD/MM/YYYY")
            : ""
        );
        setMaxCredit(excustdata.CreditLimit);

        // if ((excustdata.GSTNO).substr(0, 2) != custstateid) {
        setGSTNO(custstateid + excustdata.GSTNo);
        // }
        //else {
        //   setGSTNO(excustdata.GSTNo);
        // }
        setGovtOrg(excustdata.IsGovtOrg);
        setIsExport(excustdata.IsForiegn);
        setCustCurrent(excustdata.CURRENT);
        setPANNO(excustdata.PAN_No);
        setPinCode(excustdata.Pin_Code);
        setCustomerdata(resp);
      }
    );
    postRequest(
      endpoints.getCustomerContactDets,
      {
        // custcode: custdet.substring(0, 4),
        custcode: cust.Cust_Code,
      },
      async (custcontacts) => {
        console.log("customer contacts", custcontacts);
        setCustContactData(custcontacts);
      }
    );
  };

  let selectState = async (e) => {
    //  for (let i = 0; i < statedata.length; i++) {
    //     if (statedata[i]["Id"] == e.target.value) {
    // stat = statedata[i];
    //        console.log(statedata[i]["Id"]);
    setCustStateId(e.target.value);

    postRequest(
      endpoints.getStateName,
      { statecd: e.target.value },
      (stnmdata) => {
        console.log(stnmdata[0]["State"]);
        setCustState(stnmdata[0]["State"]);
      }
    );

    //  setStateCd(statedata[i]["StateCode"]);
    if (gstno == null) {
      setGSTNO(e.target.value);
    } else {
      if (gstno.substr(0, 2) != e.target.value) {
        setGSTNO(e.target.value);
      } else {
        setGSTNO(gstno);
      }
    }
    console.log(statedata["State"]);
    //       break;
    // }
    // }
  };

  let selectCrTerms = async (e) => {
    console.log(e.target.value);
    for (let i = 0; i < crtermsdata.length; i++) {
      if (crtermsdata[i]["PaymentTerm"] === e.target.value) {
        setCrTerms(crtermsdata[i]["PaymentTerm"]);
        setCreditDays(crtermsdata[i]["CreditDays"]);
        break;
      }
    }
  };

  let selectMtrlSource = async (e) => {
    //    console.log(e.target.elements.MtrlSource.value);
    let mtlsrc;
    for (let i = 0; i < mtrlsourcedata.length; i++) {
      if (mtrlsourcedata[i]["MtrlSource"] === e.target.value) {
        mtlsrc = mtrlsourcedata[i];
        break;
      }
    }
    setDelivery(mtlsrc["MtrlSource"]);
  };

  let updateCustomerData = (e) => {
    e.preventDefault();

    if (custContactData.length <= 0) {
      toast.error("Contact Details are required");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    console.log("updateCustomerData" + custaddress);
    let custAddress = custaddress;
    let city = e.target.elements.city.value;
    let pincode = 0;
    if (e.target.elements.pincode.value > 0)
      pincode = e.target.elements.pincode.value;
    //  if (isFirstClickRef.current) {
    else toast.error("Pincode should be numeric");
    //   isFirstClickRef.current = false;
    // }

    let cstate = custstate;
    //        console.log("stateCD  ", statecd.length);
    let stateid = custstateid; //.substring(0, 2); // custstateid;
    //   let statecd = statecd;
    let country = e.target.elements.country.value;

    let compemail = e.target.elements.compemail.value;
    // let crterms = crterms; //e.target.elements.crterms.value;
    let maxcredit = e.target.elements.maxcredit.value;
    let creditdays = e.target.elements.creditdays.value;
    let avepaydays = e.target.elements.avepaydays.value;
    let firstbillingdt = e.target.elements.firstbillingdt.value
      ? e.target.elements.firstbillingdt.value
      : "";
    let lastbillingdt = e.target.elements.lastbillingdt.value
      ? e.target.elements.lastbillingdt.value
      : "";

    let gstno = e.target.elements.gstno.value;

    if (gstno.includes("~!@#$%^&*().,`[]{}|?><")) {
      toast.error("Special Characters are not allowed..");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    if (
      e.target.elements.gstno.value.length < 3 ||
      e.target.elements.gstno.value == ""
    ) {
      gstno = "UnRegistered";
    } else {
      //  gstno = custstateid + e.target.elements.gstno.value.substr(2, 15);
      // gstno = e.target.elements.gstno.value;
      setGSTNO(gstno);
    }

    let panno = e.target.elements.panno.value;

    //let govtorg = govtorg;
    //let isexport = isexport;
    let custfoldername = e.target.elements.custfoldername.value;
    let ccurent = custcurrent.checked ? 1 : 0;

    postRequest(
      endpoints.updateCustomer,
      {
        custcode: custcode,
        customerName: newCustName,
        branchName: branchName,
        custAddress: custAddress,
        city: city,
        pincode: pincode,
        state: custstate,
        stateid: custstateid,
        country: country,
        compemail: compemail,
        maxcredit: maxcredit,
        crterms: crterms,
        creditdays: creditdays,
        avepaydays: avepaydays,
        firstbillingdt: moment(firstbillingdt).format("DD/MM/YYYY"),
        lastbillingdt: moment(lastbillingdt).format("DD/MM/YYYY"),
        gstno: gstno,
        panno: panno,
        govtorg: govtorg,
        isexport: isexport,
        custfoldername: custfoldername,
        custcurent: custcurrent,
        delivery: delivery,
        custContactData: custContactData, //,
      },
      (resp) => {
        console.log(resp);
        console.log(custContactData);

        //        clearDataCustomer()
      }
    );

    console.log("GST No : " + gstno);
    // postRequest(endpoints.insertContactTeleNos, {custcode : custcode, custContTeleData: custContTeleData}, (respdata) => {
    //     console.log(respdata)
    // })

    // alert("Customer data updated sucessfully");
    // const notify = () => toast("Wow so easy!");
    toast.success("Customer data updated sucessfully");

    // if (isFirstClickRef.current) {
    //   isFirstClickRef.current = false;
    // }

    // toast.success("Contacts details updated sucessfully");

    //    clearDataCustomer();
    //window.location.href = "/customer/createcustomer";
  };

  function clearDataCustomer() {
    setCustCode("");
    setNewCustName("");
    setBranchName("");
    setCustAddress("");
    setCustCity("");
    setPinCode("");
    setCustStateId("");
    setCustState("");
    setCountry("");
    setCompEmail("");
    // setEmail("");
    setCrTerms("");
    setMaxCredit("");
    setCreditDays("");
    setAvePayDays("");
    setFirstBillingDt("");
    setLastBillingDt("");
    setGSTNO("");
    setPANNO("");
    setGovtOrg("");
    setIsExport("");
    setCustFolderName("");
    setCustCurrent(false);
    setDelivery("");
    //  setCustContTeleData([]);
    setCustContactData([]);
  }

  // let dateconv = (da) => {
  //     let cdate = new Date(da);
  //     return cdate.getDay().toString().padStart(2, "0") + "/" + cdate.getMonth().toString().padStart(2, "0") + "/" + cdate.getFullYear();
  // }

  let addContactData = async () => {
    console.log("Add Contact Data");
    console.log(conName);
    if (conName.length > 0) {
      setCustContactData([
        ...custContactData,
        {
          id: custContactData.length + 1,
          conName,
          conDesignation,
          conDept,
          conE_mail,
          conTele_Office,
          conTele_Mobile,
        },
      ]);

      clearData();
    }
  };

  let updContactData = async () => {
    console.log("Update Contact Data ");
    console.log(custContactData.length);
    // if ((conName != null) || (conName != '')) {
    for (let i = 0; i < custContactData.length; i++) {
      if (conName == custContactData[i]["conName"]) {
        custContactData[i]["conDesignation"] = conDesignation;
        custContactData[i]["conDept"] = conDept;
        custContactData[i]["conE_mail"] = conE_mail;
        custContactData[i]["conTele_Office"] = conTele_Office;
        custContactData[i]["conTele_Mobile"] = conTele_Mobile;
      }
    }
    console.log(custContactData);
    // }
    clearData();
  };

  // Tele Data\
  // let addContTeleData = async () => {
  //     console.log(custContactData.conteleno)
  //    // if ((conteleno.length > 0)) {
  //         console.log("contact tele condition macthed")
  //         setCustContTeleData([...custContTeleData, { id: custContTeleData.length + 1, conteleno, conteletype }])
  //         clearTeleData();
  //     //}
  // }

  let clearData = () => {
    setBtnDel(true);
    setBtnUpd(true);
    setBtnNew(false);
    setContactName("");
    setDept("");
    setDesignation("");
    setCEmail("");
    setTele_Office("");
    setTele_Mobile("");
  };

  let selectItem = (item) => {
    setBtnDel(false);
    setBtnUpd(false);
    setBtnNew(true);
    setSelectedRow(item.id);
    // setConid(item.id);
    setConid(item.ContactID);

    //  setSelectedContId(item.Id);
    setContactName(item.conName ? item.conName : ".");
    console.log(item.conName);
    setDept(item.conDept);
    setDesignation(item.conDesignation);
    setCEmail(item.conE_mail);
    setTele_Office(item.conTele_Office);
    setTele_Mobile(item.conTele_Mobile);
  };

  let removeContactData = async () => {
    toast.success("deleted successfully");
    let olddata = custContactData;
    // console.log(olddata);
    console.log("Remove Contact");
    let newdata = olddata.filter(
      (data) =>
        data.conName !== conName ||
        data.conE_mail !== conE_mail ||
        data.conTele_Office !== conTele_Office
    );
    setCustContactData(newdata);
    clearData();
  };

  // let clearTeleData = () => {
  //      setContactName("")
  //     setTeleNo(0);
  //     setTeleType("");
  // }

  // let selectTeleItem = (item) => {
  //      setContactName(item.contactname)
  //     setTeleNo(item.conteleno)
  //     setTeleType(item.conteletype)
  // }

  // let removeCustTeleData = async () => {
  //     let olddata = custContTeleData
  //     let newdata = olddata.filter(data => (data.conteleno !== conteleno))
  //     setCustContTeleData(newdata)
  //     clearTeleData();
  // }

  const handleChangeNumeric = (e) => {
    const mvalue = e.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", mvalue);
    if (e.target.value.length > 6) {
      // alert("Pin Code Only 6 digits are allowed..");
      toast.error("Pin Code Only 6 digits are allowed..");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    setPinCode(mvalue);
  };

  const handleChangePhNo = (e) => {
    const mvalue = e.target.value.replace(/[^0-9 ]/gi, "");
    // mvalue = e.target.value.length > 15 ? e.target.value.substring(0, 15) : e.target.value;
    if (mvalue < 0) {
      // alert("Contact No1 cannot be blank..");
      toast.error("Contact No1 cannot be blank..");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    }
    setTele_Office(mvalue);
  };

  const handleChangePhNo1 = (e) => {
    const mvalue = e.target.value.replace(/[^0-9 ]/gi, "");
    //   mvalue = e.target.value.length > 15 ? e.target.value.substring(0, 15) : e.target.value;
    setTele_Mobile(mvalue);
  };

  const handleChangeAlpha = (e) => {
    const mvalue = e.target.value.replace(/[^A-Za-z ]/gi, "");
    if (mvalue.length < 0) {
      // alert("Please enter valid name");
      toast.error("Please enter valid name");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    } else {
      setContactName(mvalue);
    }
  };

  const chkgstpan = (e) => {
    console.log(e.target.value);

    if (e.target.value == "GST") {
      setGSTDisabled(false);
      setPANDisabled(true);
    } else if (e.target.value == "PAN") {
      console.log("PAN ");
      setGSTDisabled(true);
      setPANDisabled(false);
      console.log(gstdisabled);
      console.log(pandisabled);
    }
  };

  const valPanNo = (e) => {
    const mpanno = e.target.value.replace(/[^A-Za-z0-9]/gi, "");
    //console.log(mpanno);
    // console.log(gstno);
    // if (((mpanno != '') || (mpanno != null)) && (gstno.length > 2)) {
    //     if (gstno.substring(2, (mpanno.length + 2)) !== mpanno) {
    //         alert('Please check GST No / PAN No');
    //         return;
    //     }
    // }
    setPANNO(mpanno);
  };

  const HandleGSTNo = (e) => {
    const avalue = e.target.value.replace(/[^A-Za-z0-9]/gi, "");
    if (avalue.length > 15) {
      // alert("Please enter valid GST No");
      toast.error("Please enter valid GST No");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
    } else {
      setGSTNO(avalue);
      setPANNO(avalue.substr(2, 10));
    }
  };

  const funccreditdays = (e) => {
    console.log("funccreditdays");
    const crdysvalue = e.target.value.replace(/[^0-9]/gi, "");

    setCreditDays(crdysvalue);
  };

  const funcmaxCredit = (e) => {
    console.log("funcmaxCredit");
    const crvalue = e.target.value.replace(/[^0-9.]/gi, "");
    if (crvalue < 0) {
      // alert("Please enter positive value");
      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
      toast.error("Please enter positive value");

      return;
    }
    setMaxCredit(crvalue);
  };

  const valemail = (e) => {
    const vcemail = e.target.value.replace(/[^A-Za-z0-9.@]/gi, "");
    if (vcemail.includes("@@") || vcemail.includes("..")) {
      // alert("Invalid Email Address...");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
      toast.error("Invalid Email Address...");

      return;
    }
    setCompEmail(vcemail);
  };

  const valconemail = (e) => {
    const vcnemail = e.target.value.replace(/[^A-Za-z0-9.@]/gi, "");
    if (vcnemail.includes("@@") || vcnemail.includes("..")) {
      // alert("Invalid Email Address...");
      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }
      toast.error("Invalid Email Address...");

      return;
    }
    setCEmail(vcnemail);
  };

  async function checkBranch(e) {
    const brhnm = e.target.value.replace(/[^A-Za-z0-9. -]/gi, "");
    setBranchName(brhnm);
  }

  return (
    <div>
      <h4 className="title">Customer Details</h4>

      <div className="form-style">
        <Col xs={12}>
          <div className="addquotecard">
            <Form onSubmit={updateCustomerData} autoComplete="off">
              <div className="row">
                <div className="col-md-4">
                  {" "}
                  <Form.Group controlId="CustName">
                    <label className="form-label">Name</label>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    {custdata.length > 0 ? (
                      // <Form.Select
                      //   className="ip-select "
                      //   controlId="CustName"
                      //   onChange={selectCust}
                      // >
                      //   <option value="" disabled selected>
                      //     {" "}
                      //     Select Customer
                      //   </option>
                      //   {custdata.map((cust) => {
                      //     return (
                      //       <option value={cust["Cust_Code"]}>
                      //         {cust["Cust_name"]}
                      //       </option>
                      //     );
                      //   })}
                      // </Form.Select>
                      <Typeahead
                        id="basic-example"
                        // onChange={selectCust}
                        options={custdata}
                        placeholder="Select Customer"
                        // selected={selected}
                        /*onInputChange={(label) => {
                  console.log("input change :", label);
                }}
                onChange={(label) => {
                  console.log("onchange :", label);
                }}*/
                        onChange={(label) => selectCust(label)}
                      />
                    ) : (
                      ""
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group as={Row}>
                    <label className="form-label">Code</label>
                    <input
                      type="text"
                      id="custcode"
                      disabled
                      value={custcode}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <label className="form-label">Branch</label>
                    <input
                      type="text"
                      id="branchName"
                      onChange={checkBranch}
                      value={branchName}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <Form.Group>
                    <FormLabel>City </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    <input
                      type="text"
                      id="city"
                      onChange={(e) => setCustCity(e.target.value)}
                      value={custcity}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>Address </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    <input
                      type="textarea"
                      id="custaddress"
                      rows={2}
                      onChange={(e) => setCustAddress(e.target.value)}
                      value={custaddress}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <FormLabel>Pin Code </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    <input
                      type="text"
                      id="pincode"
                      maxLength="6"
                      onChange={(e) => handleChangeNumeric(e)}
                      value={pincode}
                      required
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <Form.Group>
                    <FormLabel>State </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    {statedata.length > 0 ? (
                      <select
                        className="ip-select "
                        id="custstate"
                        onChange={selectState}
                        value={custstateid}
                        required
                      >
                        <option value="" disabled selected>
                          {" "}
                          Select State
                        </option>
                        {statedata.map((stat) => {
                          return (
                            <option
                              style={{ fontFamily: "Roboto", fontSize: "12px" }}
                              value={stat["StateCode"]}
                            >
                              {stat["State"]}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>Country </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    <input
                      type="text"
                      id="country"
                      onChange={(e) => setCountry(e.target.value)}
                      value={country}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>E mail</FormLabel>
                    <input
                      type="email"
                      id="compemail"
                      onChange={valemail}
                      value={compemail}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <Form.Group>
                    <FormLabel>Cr Terms </FormLabel>

                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    {crtermsdata.length > 0 ? (
                      <select
                        className="ip-select"
                        id="crterms"
                        onChange={selectCrTerms}
                        required
                      >
                        <option value={crterms} disabled selected>
                          {crterms}
                        </option>
                        {crtermsdata.map((crterm) => {
                          return (
                            <option value={crterm["PaymentTerm"]}>
                              {crterm["PaymentTerm"]}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      ""
                    )}
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>Max. Credit </FormLabel>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>
                    <input
                      type="text"
                      id="maxcredit"
                      onChange={funcmaxCredit}
                      value={maxcredit}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <FormLabel>Cr Days</FormLabel>
                    <input
                      type="text"
                      id="creditdays"
                      onChange={funccreditdays}
                      value={creditdays}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>Ave. Payment Days</FormLabel>
                    <input
                      disabled
                      id="avepaydays"
                      type="text"
                      onChange={(e) => setAvePayDays(e.target.value)}
                      value={avepaydays}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  {" "}
                  <Form.Group>
                    <FormLabel>First Billing</FormLabel>
                    <input
                      id="firstbillingdt"
                      type="text"
                      value={firstbillingdt}
                      disabled
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group>
                    <FormLabel>Last Billing</FormLabel>
                    <input
                      id="lastbillingdt"
                      type="text"
                      value={lastbillingdt}
                      disabled
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row mt-4 justify-content-center">
                <button
                  className="button-style"
                  id="btnSaveAllDetails"
                  style={{ width: "206px" }}
                  type="submit"
                  // onClick={updateCustomerData()}
                  // onClick={notify}
                >
                  Save Customer Details
                </button>
                <button
                  id="btncustupdateclose"
                  className="button-style"
                  style={{ width: "110px" }}
                  onClick={() => navigate("/Customer")}
                >
                  Close{" "}
                </button>
              </div>

              <div className="p-2">
                <h4 className="form-title  mt-2">Commercial Info</h4>
                <hr className="horizontal-line" />

                <div className="row">
                  <div className="col-md-1 mt-1">
                    {" "}
                    <FormLabel>Select</FormLabel>
                    <select
                      controlId="gstpan"
                      className="ip-select"
                      onChange={chkgstpan}
                    >
                      <option value="Select">Select</option>
                      <option value="GST">GST</option>
                      <option value="PAN">PAN</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    {" "}
                    <Form.Group>
                      <FormLabel>GST No</FormLabel>
                      <input
                        type="text"
                        id="gstno"
                        disabled={gstdisabled}
                        maxLength={15}
                        onChange={HandleGSTNo}
                        value={gstno}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-3">
                    <Form.Group>
                      <FormLabel>PAN No</FormLabel>
                      <input
                        type="text"
                        id="panno"
                        disabled={pandisabled}
                        maxLength={10}
                        onChange={valPanNo}
                        value={panno}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-3 mt-5">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="govtorg"
                        onChange={() => setGovtOrg(!govtorg)}
                        checked={govtorg}
                      />
                      <label
                        className="form-check-label checkBoxStyle"
                        htmlFor="flexCheckDefault"
                      >
                        Is Government Organization
                      </label>
                    </div>
                  </div>
                  <div className="col-md-2 mt-5">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="isexport"
                        onChange={() => setIsExport(!isexport)}
                        checked={isexport}
                      />
                      <label
                        className="form-check-label checkBoxStyle"
                        htmlFor="flexCheckDefault"
                      >
                        Is Export
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-md-4 mt-3">
                    {" "}
                    <Form.Group as={Row} controlId="govtorg">
                      <FormCheck
                        type="checkbox"
                        style={{
                          flex: "0",
                          marginTop: "5px",
                        }}
                        onChange={() => setGovtOrg(!govtorg)}
                        checked={govtorg}
                      />
                      <FormCheckLabel
                        style={{
                          flex: "0.4",
                        }}
                      >
                        {" "}
                        Is Govt Organization{" "}
                      </FormCheckLabel>
                    </Form.Group>
                  </div> */}
                  {/* <div className="col-md-4 mt-3">
                    <Form.Group
                      as={Row}
                      className="mt-2"
                      style={{ display: "flex" }}
                      controlId="isexport"
                    >
                      <FormCheck
                        type="checkbox"
                        style={{
                          flex: "0.06",
                          marginTop: "5PX",
                        }}
                        onChange={() => setIsExport(!isexport)}
                        checked={isexport}
                      />
                      <FormCheckLabel
                        style={{
                          flex: "0.7",
                        }}
                      >
                        Is Export{" "}
                      </FormCheckLabel>
                    </Form.Group>
                  </div> */}
                </div>
                <div className="row">
                  <div className="col-md-3">
                    {" "}
                    <Form.Group className="mt-2">
                      <FormLabel>Folder Name </FormLabel>
                      <Form.Label
                        style={{
                          color: "#f20707",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        *
                      </Form.Label>
                      <input
                        type="text"
                        id="custfoldername"
                        onChange={(e) => setCustFolderName(e.target.value)}
                        value={custfoldername}
                        required
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-4 ">
                    <Form.Group as={Row} className="mt-2">
                      <FormLabel>Delivery </FormLabel>
                      {mtrlsourcedata.length > 0 ? (
                        <select
                          className="ip-select mt-1"
                          id="delivery"
                          onChange={selectMtrlSource}
                          value={delivery}
                        >
                          <option value="" disabled selected>
                            ** Select **
                          </option>
                          {mtrlsourcedata.map((mtlsrc) => {
                            return (
                              <option
                                value={mtlsrc["MtrlSource"]}
                                style={{
                                  fontFamily: "Roboto",
                                  fontSize: "12px",
                                }}
                              >
                                {mtlsrc["MtrlSource"]}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        ""
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-md-2 mt-5">
                    {/* <Form.Group
                      as={Row}
                      className="mt-2"
                      controlId="custcurrent"
                      style={{ display: "flex" }}
                    >
                      <FormCheck
                        type="checkbox"
                        style={{
                          flex: "0.06",

                          marginTop: "5px",
                        }}
                        onChange={(e) => setCustCurrent(!custcurrent)}
                        checked={custcurrent}
                      />
                      <FormCheckLabel
                        style={{
                          flex: "0.5",
                        }}
                      >
                        Current{" "}
                      </FormCheckLabel>
                    </Form.Group> */}
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="custcurrent"
                        onChange={(e) => setCustCurrent(!custcurrent)}
                        checked={custcurrent}
                      />
                      <label
                        className="form-check-label checkBoxStyle"
                        htmlFor="flexCheckDefault"
                      >
                        Current
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row mt-2"
                style={{ marginLeft: "-3px", marginBottom: "50px" }}
              >
                {/* <NabTab /> */}
                <div className="p-2">
                  <h4 className="form-title  mt-1">Contact Details</h4>
                  <hr className="horizontal-line" />
                  <div className="row">
                    <div className="col-md-8">
                      <div
                        style={{
                          height: "520px",
                          overflowY: "scroll",
                          border: "solid #c0c4c2 1px",
                        }}
                      >
                        <Table striped className="table-data border">
                          <thead className="tableHeaderBGColor tablebody">
                            <tr className="">
                              <th className="">Name</th>
                              <th className="">Designation</th>
                              <th className="">Dept</th>
                              <th className="">E Mail</th>
                              <th className="">Contact No1</th>
                              <th className="">Contact No2</th>
                            </tr>
                          </thead>
                          <tbody className="tablebody">
                            {custContactData.map((ccont) => {
                              console.log(ccont);
                              return (
                                <tr
                                  className=""
                                  key={ccont.id}
                                  style={{
                                    backgroundColor:
                                      conid === ccont.ContactID
                                        ? "#98A8F8"
                                        : "",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => selectItem(ccont)}
                                >
                                  <td className="">{ccont.conName}</td>
                                  <td className="">{ccont.conDesignation}</td>
                                  <td className="">{ccont.conDept}</td>
                                  <td className="">{ccont.conE_mail}</td>
                                  <td className="">{ccont.conTele_Office}</td>
                                  <td className="">{ccont.conTele_Mobile}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div
                        className="ip-box"
                        style={{ backgroundColor: "#e6e6e6" }}
                      >
                        <div className="row">
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Name</FormLabel>
                              <Form.Label
                                style={{
                                  color: "#f20707",
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                *
                              </Form.Label>
                              <input
                                className="in-fields"
                                controlId="conName"
                                maxLength={30}
                                onChange={(e) => handleChangeAlpha(e)}
                                value={conName}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Designation</FormLabel>
                              <input
                                className="in-fields"
                                controlId="conDesignation"
                                onChange={(e) => setDesignation(e.target.value)}
                                value={conDesignation}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Dept</FormLabel>
                              <input
                                className="in-fields"
                                type="text"
                                controlId="conDept"
                                onChange={(e) => setDept(e.target.value)}
                                value={conDept}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Email</FormLabel>
                              <input
                                className="in-fields"
                                controlId="conE_mail"
                                onChange={valconemail}
                                value={conE_mail}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Contact No 1</FormLabel>
                              <input
                                className="in-fields"
                                type="text"
                                controlId="conTele_Office"
                                maxLength={15}
                                onChange={handleChangePhNo}
                                value={conTele_Office}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 ">
                              <FormLabel className="">Contact No 2</FormLabel>
                              <input
                                className="in-fields"
                                type="text"
                                controlId="conTele_Mobile"
                                maxLength={15}
                                onChange={handleChangePhNo1}
                                value={conTele_Mobile}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row justify-content-center  ">
                          <Button
                            style={{
                              width: "90px",
                              height: "39px",
                              border: "none",
                              marginRight: "10px",
                              backgroundColor: "#2b3a55",
                              color: " #ffffff",
                              borderRadius: " 5px",
                              padding: " 3px",
                              marginTop: "23px",
                              fontSize: "18px",
                            }}
                            disabled={btnnew}
                            onClick={() => addContactData()}
                          >
                            New
                          </Button>
                          <Button
                            style={{
                              width: "90px",
                              height: "39px",
                              border: "none",
                              marginRight: "10px",
                              backgroundColor: "#2b3a55",
                              color: " #ffffff",
                              borderRadius: " 5px",
                              padding: " 3px",
                              marginTop: "23px",
                              fontSize: "18px",
                            }}
                            disabled={btnupd}
                            onClick={() => updContactData()}
                          >
                            Update
                          </Button>
                          <Button
                            style={{
                              width: "90px",
                              height: "39px",
                              border: "none",
                              marginRight: "10px",
                              backgroundColor: "#2b3a55",
                              color: " #ffffff",
                              borderRadius: " 5px",
                              padding: " 3px",
                              marginTop: "23px",
                              fontSize: "18px",
                            }}
                            disabled={btndel}
                            onClick={() => removeContactData()}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </div>
    </div>
  );
}

export default UpdateCustomerDetails;
