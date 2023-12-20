import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Row,
  Col,
  Container,
  Form,
  FormLabel,
  Button,
  FormControl,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

// import BreadcrumbsComponent from "../../components/BreadCumbsComponent";

//getCustomers, bompartsCustomer, assyPartCustomer, assyInsertPartCustomer,
const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function PartList() {
  //  const alert = useAlert();
  let navigate = useNavigate();
  //    console.log("CustPartListPage");
  const isFirstClickRef = useRef(true);

  const [custarray, setCustArray] = useState([]);
  const [selectedCust, setSelectedCust] = useState({});
  const [custcode, setCustCode] = useState("");
  const [custName, setCustName] = useState("");
  const [custbomparts, setCustBomParts] = useState([]);

  const [custassydetails, setCustAssyDetails] = useState([]);

  const [selectedCustAssy, setSelectedCustAssy] = useState({});

  const [custpartdetails, setCustPartDetails] = useState([]);
  let [selectedAssyCustId, setSelectedAssyCustId] = useState("");

  let [formpartid, setFormPartId] = useState("");
  let [formpartdesc, setFormPartDesc] = useState("");
  let [formcustpartid, setFormCustPartId] = useState("");
  let [formcustpartdesc, setFormCustPartDesc] = useState("");

  let [assmpartid, setAssmPartId] = useState("");
  let [assmid, setAssmId] = useState("");
  let [selectedPartId, setSelectedPartId] = useState("");
  let [btnaddnew, setBtnAddNew] = useState(false);
  let [btnupdate, setBtnUpdate] = useState(true);
  let [btnasmprtnew, setBtnAsmPrtNew] = useState(false);
  let [btnasmprtdel, setBtnAsmPrtDel] = useState(true);

  // let [formdescription,setFormDescription] = useState("");
  // let [formmtrlcost, setFormMtrlCost] = useState("");
  // let [formjwcost, setFormJwCost] = useState("");
  let [status, setStatus] = useState("");
  let [qty, setQty] = useState("");
  let [mtrlcost, setMtrlcost] = useState("");
  let [lbrcost, setLbrcost] = useState("");
  let [Statusss, setStatusss] = useState("");
  let [selectedbompartId, setSelectedbompartId] = useState("");
  let [selectedbomassyid, setSelectedbomassyid] = useState("");
  // setFormMtrlCost("");
  // setStatus("** Select ***");

  useEffect(() => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    setBtnAsmPrtNew(true);
    setBtnAsmPrtDel(true);
    async function getCustomersData() {
      postRequest(endpoints.getCustomers, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        setCustArray(data);
      });
    }
    getCustomersData();
    // getCustomers((data) => {
    //     setCustArray(data);
    // });
  }, []);

  // const handleCustChange = async (e) => {
  //     const cust = custarray.find((cust) => cust["Cust_Code"] === e.target.value);
  //     console.log(cust);
  //     setSelectedCust(cust);
  //     postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
  //         // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
  //         if (data.length > 0) {
  //             setCustAssyDetails(data);
  //         } else {
  //             setCustAssyDetails([]);
  //         }
  //     });
  // };

  let handleCustChange = async (evt) => {
    // let custdet = evt.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    // let cdet = custdet.substring(0, 4)
    // console.log(cdet);
    // setCustCode(custdet.substring(0, 4));
    console.log("cust data = ", evt);
    console.log("cust code = ", evt[0].Cust_Code);
    console.log("table customer = ", custarray);
    const cust = custarray.find(
      (cust) => cust["Cust_Code"] === evt[0].Cust_Code
    ); // custdet.substring(0, 4));
    console.log(cust);
    setSelectedCust(cust);
    setCustCode(cust["Cust_Code"]);

    clearAssydata();
    clearcustBOM();

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: evt[0].Cust_Code },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    postRequest(
      endpoints.assyPartCustomer,
      { custcode: evt[0].Cust_Code },
      (data) => {
        // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {

        if (data.length > 0) {
          setCustAssyDetails(data);
        } else {
          setCustAssyDetails([]);
        }
      }
    );
    // postRequest(endpoints.custbomAssemblyParts, { custcode: evt.target.value }, (data) => {
    //     bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         console.log(data)
    //         setCustPartDetails(data);
    //     } else {
    //         setCustPartDetails([]);
    //     }
    // });

    postRequest(
      endpoints.getCustBOMParts,
      { custcode: cust["Cust_Code"] },
      (partsdata) => {
        console.log(partsdata);
        if (partsdata.length > 0) {
          setCustBomParts(partsdata);
        } else {
          setCustBomParts([]);
        }
      }
    );
    // postRequest(endpoints.assyPartCustomer, { custcode: cust["Cust_Code"] }, (data) => {
    //     // assyPartCustomer({ custcode: cust["Cust_Code"] }, (data) => {
    //     if (data.length > 0) {
    //         setCustAssyDetails(data);
    //     } else {
    //         setCustAssyDetails([]);
    //     }
    // });
    postRequest(
      endpoints.custbomAssemblyParts,
      { custcode: cust["Cust_Code"] },
      (data) => {
        // bompartsCustomer({ custcode: cust["Cust_Code"] }, (data) => {
        if (data.length > 0) {
          console.log(data);
          setCustPartDetails(data);
        } else {
          setCustPartDetails([]);
        }
      }
    );
  };

  const addBOMPart = async (e) => {
    e.preventDefault();
    let partid = e.target.elements.formpartid.value;
    let partdesc = e.target.elements.formpartdesc.value;
    if (!partid || !partdesc) {
      toast.error("Please enter part id and description");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }

    postRequest(
      endpoints.saveCustBOMParts,
      {
        partid: partid,
        partdescription: partdesc,
        custcode: selectedCust["Cust_Code"],
      },
      (response) => {
        if (response.status == "Success") {
          setCustBomParts((olddata) => [
            ...olddata,
            {
              partid: partid,
              partdesc: partdesc,
              magodpartid: response["MagodPartId"],
            },
          ]);
          toast.success("Added PartId Successfully..");

          // if (isFirstClickRef.current) {
          //   isFirstClickRef.current = false;
          // }

          clearcustBOM();
          postRequest(
            endpoints.getCustBOMParts,
            { custcode: selectedCust["Cust_Code"] },
            (partsdata) => {
              console.log(partsdata);
              if (partsdata.length > 0) {
                setCustBomParts(partsdata);
              } else {
                setCustBomParts([]);
              }
              clearcustBOM();
            }
          );
        } else {
          toast.error("Duplicate Part Id for this Customer..");

          // if (isFirstClickRef.current) {
          //   isFirstClickRef.current = false;
          // }

          return;
        }
        clearcustBOM();
      }
    );
    clearcustBOM();
    console.log(custbomparts);
  };

  function clearcustBOM() {
    setFormPartId("");
    setFormPartDesc("");
  }

  function clearAssydata() {
    document.getElementById("formmagodid").value = "";
    document.getElementById("formassyid").value = "";
    document.getElementById("formdescription").value = "";
    document.getElementById("formstatus").value = "";
    document.getElementById("formmtrlcost").value = "";
    document.getElementById("formjwcost").value = "";
  }

  const addAssemblyDetails = async (e) => {
    e.preventDefault();
    console.log(e.target.elements.formstatus.value);
    let assyid = e.target.elements.formassyid.value;
    let formdescription = e.target.elements.formdescription.value;
    let assmstatus = e.target.elements.formstatus.value;
    let formmtrlcost = e.target.elements.formmtrlcost.value;
    let formjwcost = e.target.elements.formjwcost.value;
    // setCustAssyDetails((custassydetails => [custassydetails,{"MagodCode": resp["magodassmid"], "AssyCust_PartId": assyid, "AssyDescription": formdescription, "MtrlCost": formmtrlcost, "JobWorkCost": formjwcost, assystatus: assmstatus}]));
    setBtnAsmPrtNew(false);
    setBtnAsmPrtDel(true);

    clearcustAssydata(e);
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    postRequest(
      endpoints.chkAssyDupl,
      { custcode: selectedCust["Cust_Code"], partid: assyid },
      (data) => {
        if (data.status == "Duplicate") {
          // toast.error("PartId Already Exists for selected Customer");
          return;
        } else {
          postRequest(
            endpoints.assyInsertPartCustomer,
            {
              custcode: selectedCust["Cust_Code"],
              partid: assyid,
              partdescription: formdescription,
              mtrlcost: formmtrlcost,
              jwcost: formjwcost,
              assystatus: "Edit",
            },
            (resp) => {
              console.log(resp);
              setCustAssyDetails((olddata) => [
                ...olddata,
                {
                  MagodCode: resp["magodassmid"],
                  AssyCust_PartId: assyid,
                  AssyDescription: formdescription,
                  MtrlCost: formmtrlcost,
                  JobWorkCost: formjwcost,
                  assystatus: assmstatus,
                },
              ]);
            }
          );
          toast.success("Assembly added successfully");
        }
      }
    );
  };

  const clearcustAssydata = (e) => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    console.log("Clearing Assy Data ");
    e.target.elements.formassyid.value = "";
    e.target.elements.formdescription.value = "";
    e.target.elements.formstatus.value = "";
    e.target.elements.formmtrlcost.value = "";
    e.target.elements.formjwcost.value = "";
  };

  const addCustPart = async (e) => {
    // debugger;
    e.preventDefault();
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    if (!selectedCustAssy["AssyCust_PartId"]) {
      toast.error("Please select an assembly");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    let selcustassy = selectedCustAssy["AssyCust_PartId"];
    // console.log(selectedCust["Cust_Code"])
    // console.log(formcustpartid);
    let partid = formcustpartid;
    let qty = e.target.elements.formqty.value;
    if (!partid || !qty) {
      toast.error("Please enter part id and qty");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    if (!selectedCust["Cust_name"]) {
      toast.error("Please select a customer");

      // if (isFirstClickRef.current) {
      //   isFirstClickRef.current = false;
      // }

      return;
    }
    let partdesc = custbomparts.find((part) => part["PartId"] === partid)[
      "PartDescription"
    ];

    // console.log("ENTERING INTO toCheckBomParts");

    // toCheck BOM parts

    for (let i = 0; i < custpartdetails.length; i++) {
      if (custpartdetails[i].partid == partid) {
        toast.error("Duplicate Part Id.. Please check..");

        return;
      }
    }

    // await postRequest(
    //   endpoints.toCheckBomParts,
    //   {
    //     custcode: selectedCust["Cust_Code"],
    //     assyPartId: selcustassy,
    //     partid: partid,
    //   },
    //   (resp) => {
    //     console.log("RESPONSEE was came");
    //     console.log("RESPONSEE", resp);
    //     console.log("RESPONSEE", resp.status);
    //     if (resp.status === "Duplicates") {
    //       console.log("Duplicate partid");
    //       toast.error("This partId is already used in another assembly.");
    //     } else {
    //       console.log(" No Duplicates present");
    //       toast.success("Part added successfully");
    //       if (partid !== null || partid !== "") {
    //         setCustPartDetails((olddata) => [
    //           ...olddata,
    //           {
    //             assyPartId: selcustassy,
    //             partid: partid,
    //             partdesc: partdesc,
    //             qty: qty,
    //           },
    //         ]);

    //         console.log(custpartdetails);
    //       }
    //     }
    //   }
    // );

    // const CheckBom = () => {
    // for (let i = 0; i < checkbom.length; i++) {
    //   console.log(checkbom[i].PartId);
    //   if (checkbom[i].PartId === partid) {
    //     console.log(
    //       "This part is used alrady in other assemly , please chose other"
    //     );
    //     toast.error(
    //       "This part is used alrady in other assemly , please chose other"
    //     );
    //     return;
    //   }
    // }
    // };
    // CheckBom();

    // if (custpartdetails.find((part) => part["assyPartId"] === selectedCustAssy["AssyCust_PartId"])) {
    //     alert("Part already added");
    //     return;
    // }
    toast.success("Part added successfully");
    console.log("Part id : " + partid);
    // debugger;
    if (partid !== null || partid !== "") {
      //setCustPartDetails((olddata => [...olddata, { assyPartId: selectedCustAssy["AssyCust_PartId"], partid: partid, partdesc: partdesc, qty: qty }]));
      setCustPartDetails((olddata) => [
        ...olddata,
        {
          assyPartId: selcustassy,
          partid: partid,
          partdesc: partdesc,
          qty: qty,
        },
      ]);

      //   console.log(custpartdetails);
    }
  };

  let renderBomItemList = (part) => {
    return (
      <tr className="">
        <td>{part["MagodPartId"]}</td>
        <td>{part["PartId"]}</td>
        <td>{part["PartDescription"]}</td>
      </tr>
    );
  };

  let renderassemblydetails = (assmpart, id) => {
    // console.log(assmpart);
    // console.log(assmpart["Status"]);
    // console.log(id);
    return (
      <tr
        className=""
        style={{
          backgroundColor: selectedAssyCustId === id ? "#98A8F8" : "",
          // fontFamily: "Roboto",
          // fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => selectAssemblyPart(assmpart, id)}
      >
        <td>{assmpart["MagodCode"]}</td>
        <td>{assmpart["AssyCust_PartId"]}</td>
        <td>{assmpart["AssyDescription"]}</td>
        <td>{assmpart["MtrlCost"]}</td>
        <td>{assmpart["JobWorkCost"]}</td>
        <td hidden>{assmpart["Status"]}</td>
      </tr>
    );
  };

  // RENDER BOM TABLEDATA
  let rendercustpartdetail = (custpart, id) => {
    console.log("updatingggg");
    console.log("CUSTPARTTTT", custpart);
    console.log("custpartid", custpart.partid);
    console.log("custassyid", custpart.assyPartId);
    // setSelectedbompartId(custpart.partid);
    // setSelectedbomassyid(custpart.assyPartId);

    // console.log("custpartid", custpart["partid"]);
    // console.log("custassyid", custpart["assyPartId"]);
    let custpartid = custpart["partid"];
    console.log(custpartid);

    // write if condetion to remove the default assypartidissue
    if (custpartid === null) {
    } else {
      return (
        <tr
          className=""
          style={{
            backgroundColor: selectedPartId === id ? "#98A8F8" : "",
            overflowY: "scroll",
            cursor: "pointer",
          }}
          id={id}
          onClick={() => selectItem(custpart, id)}
        >
          <td>{custpart["assyPartId"]}</td>
          <td>{custpart["partid"]}</td>
          <td>{custpart["partdesc"]}</td>
          <td>{custpart["qty"]}</td>
        </tr>
      );
    }
  };

  let selectedPart = (e) => {
    setFormCustPartId(e.target.value);
  };

  let selectAssemblyPart = (part, id) => {
    console.log("entering into onclick assy");
    setBtnAddNew(true);
    setBtnUpdate(false);
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    setSelectedAssyCustId(id);
    document.getElementById("formmagodid").value = part["MagodCode"];
    document.getElementById("formassyid").value = part["AssyCust_PartId"];
    document.getElementById("formdescription").value = part["AssyDescription"];
    document.getElementById("formmtrlcost").value = part["MtrlCost"];
    document.getElementById("formjwcost").value = part["JobWorkCost"];
    document.getElementById("formstatus").value = "Create"; // part["Status"];
    console.log(part["Status"]);
    setStatusss(part["Status"]);
    console.log(part);
    setSelectedCustAssy(part);
    console.log(part["AssyCust_PartId"]);
    console.log(part["MtrlCost"]);
    console.log(part["JobWorkCost"]);
    let cstasmid = part["AssyCust_PartId"];
    postRequest(
      endpoints.custbomAssemblyParts,
      {
        custcode: selectedCust["Cust_Code"],
        custassyid: cstasmid, // part["AssyCust_PartId"],
      },
      (resp) => {
        console.log("custbomassemblyParts : " + resp.length);
        console.log("response", resp);
        //    if(resp.length > 0) {
        //         if(resp.partid != null){

        setCustPartDetails(resp);
        //     }

        //     console.log(custPartDetails)
        // }
      }
    );
  };

  console.log("Statusss", Statusss);

  const updateAssembly = (e) => {
    console.log("entering into updateassy");
    setBtnAddNew(false);
    setBtnUpdate(true);
    let mmagodid = document.getElementById("formmagodid").value;
    let assmstatus = document.getElementById("formstatus").value;
    let assmdesc = document.getElementById("formdescription").value;
    let mtrlcost = document.getElementById("formmtrlcost").value;
    let jobworkcost = document.getElementById("formjwcost").value;

    postRequest(
      endpoints.UpdateBOMAssembly,
      { mmagodid, assmstatus, assmdesc, mtrlcost, jobworkcost },
      (data) => {
        console.log(data);
        if (data.status == "success") {
          // if (isFirstClickRef.current) {
          toast.success("Updated Assembly Details Successfully");
          //   isFirstClickRef.current = false;
          // }
        }
      }
    );
  };

  let saveBomAssemblyParts = async () => {
    setBtnAddNew(false);
    setBtnUpdate(true);
    console.log("saveBomAssemblyParts");
    console.log(custpartdetails);
    postRequest(
      endpoints.bomAssemblyParts,
      { custcode: selectedCust["Cust_Code"], dataarray: custpartdetails },
      (resp) => {
        //  bomAssemblyParts({

        //  }, (resp) => {
        if (resp.status == "success") {
          // if (isFirstClickRef.current) {
          toast.success("Bom Assembly Parts saved successfully");
          //   isFirstClickRef.current = false;
          // }

          //    window.location.reload();
        }
        //       console.log(resp);
      }
    );
  };

  let selectItem = (item, id) => {
    // console.log(item);
    setBtnAsmPrtDel(false);
    setBtnAsmPrtNew(true);
    setSelectedPartId(id);
    setAssmPartId(item.partid);
    setAssmId(item.assyPartId);
    // setStatus();
  };

  // let deleteassmparts = async () => {
  //   console.log("deleteassmparts");
  //   setBtnAsmPrtDel(true);
  //   setBtnAsmPrtNew(false);
  //   if (isFirstClickRef.current) {
  //     toast.success("Deleted successfully");
  //     isFirstClickRef.current = false;

  //     console.log("custpartsdetails", custpartdetails);
  //     let olddata = custpartdetails;
  //     let newdata = olddata.filter(
  //       (data) => data.assyid !== assmid && data.partid != assmpartid
  //     );
  //     setCustPartDetails(newdata);
  //     postRequest(
  //       endpoints.DeleteBOMAssemblyPart,
  //       { assmid, assmpartid },
  //       (deldata) => {
  //         if (deldata.status == "success") {
  //           console.log("Delete Success");
  //         }
  //       }
  //     );
  //   }
  // };

  // new solution to partid delete issue
  let deleteassmparts = async (custpart) => {
    console.log("entering into delete");
    // console.log("entering into delete", selectedbompartId);
    // console.log("entering into delete", selectedbomassyid);

    console.log("custpartid", custpart.partid);
    console.log("custassyid", custpart.assyPartId);

    // debugger;
    setBtnAsmPrtDel(true);
    setBtnAsmPrtNew(false);
    let olddata = custpartdetails;
    let newdata = olddata.filter(
      (data) => data.assyid !== assmid && data.partid != assmpartid
    );
    console.log(olddata);
    console.log(newdata);
    setCustPartDetails(newdata);
    postRequest(
      endpoints.DeleteBOMAssemblyPart,
      // { assmid, assmpartid },
      { olddata, newdata },
      (deldata) => {
        if (deldata.status == "success") {
          toast.success("Part Deleted Successfully");
          console.log("Delete Success");
        }
      }
    );
  };

  let handleChangeQtyNumeric = (evt) => {
    console.log("evt.target.value", evt.target.value);
    const mvalue = evt.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", mvalue);
    setQty(mvalue);
  };
  let handleChangeMtrlCost = (evt) => {
    const mvalue = evt.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", mvalue);
    setMtrlcost(mvalue);
  };
  let handleChangeLbrCost = (evt) => {
    const mvalue = evt.target.value.replace(/[^0-9]/gi, "");
    console.log("mvalve", mvalue);
    setLbrcost(mvalue);
  };
  let handleKeyDown = (evt) => {
    // Prevent entering the letter "e" (101 or 69 in key codes)
    if (evt.key === "e" || evt.keyCode === 101 || evt.keyCode === 69) {
      evt.preventDefault();
    }
    // Allow decimals for two digits only
    const value = evt.target.value;
    const decimalIndex = value.indexOf(".");
    if (decimalIndex !== -1 && value.substring(decimalIndex + 1).length >= 2) {
      evt.preventDefault();
    }
  };

  return (
    // <Container>
    //     <div className="addquotecard">
    //         {/* <Row className="justify-content-md-center"> */}
    //         <h4 className="addquotecard-header">Customer BOM</h4>
    <div>
      {/* <BreadcrumbsComponent /> */}
      <h4 className="title">Customer BOM</h4>

      <div className="form-style"></div>
      <Row>
        <Col xs={6}>
          <Form.Group controlId="formCustName">
            <Form.Label>Customer</Form.Label>
            <Form.Label
              style={{
                color: "#f20707",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              *
            </Form.Label>
            {/* <Form.Select
              aria-label="Select Customer"
              onChange={(e) => {
                handleCustChange(e);
              }}
            >
              <option selected disabled>
                Select Customer
              </option>
              {custarray.length > 0
                ? custarray.map((cust) => {
                    return (
                      <option value={cust["Cust_Code"]}>
                        {cust["Cust_name"]}
                      </option>
                    );
                  })
                : null}
            </Form.Select> */}
            <Typeahead
              id="formCustName"
              // onChange={selectCust}
              options={custarray}
              placeholder="Select Customer"
              // selected={selected}
              /*onInputChange={(label) => {
                  console.log("input change :", label);
                }}
                onChange={(label) => {
                  console.log("onchange :", label);
                }}*/
              onChange={(label) => handleCustChange(label)}
            />
          </Form.Group>
        </Col>
        <Col xs={3} style={{ display: "flex" }}>
          <Form.Group as={Row}>
            <Form.Label>Code </Form.Label>
            <input id="formCustCode" disabled value={custcode} />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <div>
            <button
              className="button-style mt-3 "
              id="btnclose"
              type="submit"
              onClick={() => navigate("/customer")}
            >
              Close{" "}
            </button>
          </div>
        </Col>
      </Row>
      <Row>
        <Tabs defaultActiveKey="bomitemslist" className="mb-1  tab_font mt-4">
          <Tab
            eventKey="bomitemslist"
            title="Customer BOM Items List"
            style={{ padding: 0, marginRight: "20px" }}
          >
            <Container fluid style={{ padding: 0, marginRight: "20px" }}>
              <Row>
                <Col xs={8} style={{ overflowY: "scroll", height: "300px" }}>
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor tablebody">
                      <tr>
                        <th>Magod Part ID</th>
                        <th>Part ID</th>
                        <th>Part Description</th>
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {custbomparts != null
                        ? custbomparts.map((part) => renderBomItemList(part))
                        : null}
                    </tbody>
                  </Table>
                </Col>
                <Col xs={4} style={{ backgroundColor: "#e6e6e6" }}>
                  <Form onSubmit={addBOMPart} autoComplete="off">
                    <Form.Text>
                      <u>Part as identified in Customer Drawing</u>
                    </Form.Text>
                    <Form.Group className="mb-2">
                      <Form.Label>Part ID</Form.Label>
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
                        id="formpartid"
                        className="in-fields"
                        type="text"
                        placeholder="Enter Part ID"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Part Description</Form.Label>
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
                        id="formpartdesc"
                        className="in-fields"
                        type="text"
                        placeholder="Enter Part Description"
                        required
                      />
                    </Form.Group>
                    <button
                      variant="primary"
                      type="submit"
                      className="button-style justify-content-center"
                    >
                      Add Part
                    </button>
                  </Form>
                </Col>
              </Row>
            </Container>
          </Tab>

          <Tab eventKey="custpartassmlist" title="Customer Assembly List">
            <Row>
              <Col xs={8} style={{ maxHeight: "500px", overflowY: "scroll" }}>
                <Table striped className="table-data border">
                  <thead className="tableHeaderBGColor tablebody">
                    <tr>
                      {[
                        "Magod Code",
                        "Assm Cust PartID",
                        "Assm Description",
                        "Mtrl Cost",
                        "JW Cost",
                      ].map((item) => {
                        return <th>{item}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody className="tablebody">
                    {custassydetails != null
                      ? custassydetails.map((part, id) =>
                          renderassemblydetails(part, id)
                        )
                      : null}
                  </tbody>
                </Table>
              </Col>
              <Col xs={4} style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addAssemblyDetails} autoComplete="off">
                  <Form.Text>
                    <u>Part / Assembly Details</u>
                  </Form.Text>
                  <Form.Group>
                    <Form.Label>Magod ID</Form.Label>
                    <input
                      id="formmagodid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Magod ID"
                      disabled
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Assembly ID</Form.Label>
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
                      id="formassyid"
                      className="in-fields"
                      type="text"
                      placeholder="Enter Assembly ID"
                      required
                    />
                  </Form.Group>

                  {/* <Row> */}
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
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
                      id="formdescription"
                      className="in-fields"
                      as="textarea"
                      type="text"
                      placeholder="Enter Description"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Label
                      style={{
                        color: "#f20707",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      *
                    </Form.Label>

                    <select
                      className="ip-select dropdown-field"
                      id="formstatus"
                      aria-label="Select Status"
                      // value={Statusss}
                      defaultValue={Statusss}
                    >
                      <option selected>Select Status</option>
                      {["Create", "Edit", "Locked", "Closed"].map((st) => {
                        return <option value={st}>{st}</option>;
                      })}
                    </select>
                  </Form.Group>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Form.Group>
                    <Form.Label>Mtrl Cost</Form.Label>
                    <input
                      id="formmtrlcost"
                      className="in-fields"
                      type="text"
                      // onKeyDown={handleKeyDown}
                      min="0"
                      onChange={handleChangeMtrlCost}
                      // value={mtrlcost}
                      defaultValue={mtrlcost}
                      placeholder="Enter Mtrl Cost"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Labour Cost</Form.Label>
                    <input
                      id="formjwcost"
                      className="in-fields"
                      type="text"
                      // onKeyDown={handleKeyDown}
                      min="0"
                      onChange={handleChangeLbrCost}
                      defaultValue={lbrcost}
                      // value={lbrcost}
                      placeholder="Enter Labour Cost"
                    />
                  </Form.Group>

                  {/* <Form.Group as={Row} className="mb-1">
                    <Form.Label>Labour Cost</Form.Label>
                    <input
                      id="formjwcost"
                      className="in-fields"
                      type="text"
                      min="0"
                      onChange={handleChangeLbrCost}
                      // defaultValue={lbrcost}
                      value={lbrcost}
                      placeholder="Enter Labour Cost"
                    />
                  </Form.Group> */}
                  {/* </Row> */}
                  <div>
                    <Form.Group className="mb-1" style={{ marginLeft: "25px" }}>
                      <div className="justify-content-center">
                        <Button
                          style={{
                            width: "100px",
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
                          variant="primary"
                          disabled={btnaddnew}
                          type="submit"
                        >
                          Add New
                        </Button>
                        <Button
                          style={{
                            width: "110px",
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
                          variant="primary"
                          disabled={btnupdate}
                          onClick={updateAssembly}
                        >
                          Update
                        </Button>
                        <Button
                          style={{
                            width: "110px",
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
                          variant="primary"
                          onClick={() => {
                            saveBomAssemblyParts();
                          }}
                        >
                          Save{" "}
                        </Button>
                      </div>
                    </Form.Group>
                  </div>
                </Form>
              </Col>
            </Row>
            <h4 className="form-title  mt-2">Bill of Materials (BOM)</h4>
            <hr className="horizontal-line" />
            <Row>
              <Col xs={7} style={{ maxHeight: "230px", overflowY: "scroll" }}>
                <div style={{ overflowY: "scroll" }}>
                  <Table striped className="table-data border">
                    <thead className="tableHeaderBGColor tablebody">
                      <tr>
                        {["Assm PartId", "Part ID", "Description", "Qty"].map(
                          (item) => {
                            return <th>{item}</th>;
                          }
                        )}
                      </tr>
                    </thead>
                    <tbody className="tablebody">
                      {custpartdetails != null
                        ? custpartdetails.map((part, id) =>
                            rendercustpartdetail(part, id)
                          )
                        : null}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col xs={5} style={{ backgroundColor: "#e6e6e6" }}>
                <Form onSubmit={addCustPart} autoComplete="off">
                  <Form.Text>
                    <u>Part Details</u>
                  </Form.Text>
                  <Form.Group as={Row}>
                    <Form.Label>Part ID </Form.Label>

                    <select
                      className="ip-select dropdown-field"
                      id="formcustpartid"
                      aria-label="Select Customer Part ID"
                      onChange={selectedPart}
                    >
                      <option selected disabled>
                        Select Customer Part ID
                      </option>
                      {custbomparts.length > 0
                        ? custbomparts.map((part1) => {
                            return (
                              <option value={part1.PartId}>
                                {part1.PartId} - {part1.PartDescription}
                              </option>
                            );
                          })
                        : null}
                    </select>
                  </Form.Group>

                  <Form.Group as={Row}>
                    <Form.Label>Qty</Form.Label>
                    <input
                      className="in-fields"
                      id="formqty"
                      type="text"
                      onChange={(e) => handleChangeQtyNumeric(e)}
                      value={qty}
                      placeholder="Enter Quantity"
                      min="0"
                    />
                  </Form.Group>

                  <div className="row mt-4 mb-4 justify-content-center">
                    <Button
                      style={{
                        width: "200px",
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
                      variant="primary"
                      type="submit"
                      disabled={btnasmprtnew}
                      // onClick={() => {
                      //   saveBomAssemblyParts();
                      // }}
                    >
                      Add Assm Parts{" "}
                    </Button>
                    <Button
                      style={{
                        width: "200px",
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
                      variant="primary"
                      disabled={btnasmprtdel}
                      onClick={deleteassmparts}
                    >
                      Delete Assm Parts{" "}
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
            {/* </Container> */}
          </Tab>
        </Tabs>
      </Row>
    </div>
    // </Container>
  );
}

export default PartList;
