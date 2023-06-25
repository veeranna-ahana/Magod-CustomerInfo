import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Table,
  Row,
  Col,
  FormLabel,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function Material() {
  let navigate = useNavigate();
  //let [CustName, setCustName] = useState("");
  let [custdata, setCustdata] = useState("");
  let [custcode, setCustCode] = useState("");
  let [mtrlstkposition, setMtrlStkPositiondata] = useState([]);
  let [custmtrlrectdata, setCustMtrlRectdata] = useState([]);
  let [custmtrlrecdetsdata, setCustMtrlRecDetsdata] = useState([]);
  let [selectedMatRectId, setSelectedMatRectId] = useState("");
  let [selectedMatRect, setSelectedMatRec] = useState(null);
  let [mtrlretpartsdata, setMtrlRetPartsdata] = useState([]);
  let [mtrlretscrapunuseddetsdata, setMtrlRetScrapUnusedDetsdata] = useState(
    []
  );

  useEffect(() => {
    async function fetchCustData() {
      postRequest(endpoints.getCustCodeName, {}, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].label = data[i].Cust_name;
        }
        console.log(data);
        setCustdata(data);
      });
    }
    fetchCustData();
  }, []);

  let selectCust = async (e) => {
    //  console.log(e.target.value);
    // let custdet = e.target.value.replace(/[^A-Za-z0-9. ]/gi, "");
    // if ((custdet.includes("..")) || (custdet == null) || (custdet == "")) {
    //     alert('Please enter Customer Name ..');
    //     return;
    // }

    //  let ccode = custdet.substring(0, 4);
    //  console.log(custdet.substring(0, 4));
    //  setCustCode(custdet.substring(0, 4));
    // setCustCode(ccode);
    // selectedMatRectId("");
    //   console.log(evt.target.value);
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
    //  console.log(cust.Cust_Code);
    setCustCode(cust.Cust_Code);

    postRequest(
      endpoints.mtrlStockCustomer,
      { custcode: cust.Cust_Code },
      (mtrlstkdata) => {
        setMtrlStkPositiondata(mtrlstkdata);
      }
    );

    postRequest(
      endpoints.mtrlReceiptsCustomer,
      { custcode: cust.Cust_Code },
      (mtrlrectsdata) => {
        console.log(mtrlrectsdata);
        setCustMtrlRectdata(mtrlrectsdata);
      }
    );

    postRequest(
      endpoints.mtrlPartsReturnedCustomer,
      { custcode: cust.Cust_Code },
      (mtrlpartsdata) => {
        setMtrlRetPartsdata(mtrlpartsdata);
      }
    );

    postRequest(
      endpoints.mtrlScrapUnusedReturnedCustomer,
      { custcode: cust.Cust_Code },
      (mtrlscrpdata) => {
        setMtrlRetScrapUnusedDetsdata(mtrlscrpdata);
      }
    );
  };

  // let dateconv = (da) => {
  //     let cdate = new Date(da);
  //     return cdate.getDay().toString().padStart(2, "0") + "/" + cdate.getMonth().toString().padStart(2, "0") + "/" + cdate.getFullYear();
  // }

  let matrecselector = async (id, mtrlrects) => {
    setSelectedMatRectId(id);

    postRequest(
      endpoints.mtrlReceiptDetailsCustomer,
      { rvid: mtrlrects["RVID"] },
      (mtrlrectdetsdata) => {
        setCustMtrlRecDetsdata(mtrlrectdetsdata);
      }
    );
  };

  let rendertable = (mtrlstkposn) => {
    return (
      <tr className="custtr">
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["Mtrl_Code"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["DynamicPara1"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["DynamicPara2"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlstkposn["inStock"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          <input type="checkbox" checked={mtrlstkposn["Locked"] != 0} />
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          <input type="checkbox" checked={mtrlstkposn["Scrap"] != 0} />
        </td>
      </tr>
    );
  };

  let rendertabmatrec = (mtrlrects, id) => {
    return (
      <tr
        className="custtr"
        style={{
          backgroundColor: selectedMatRectId === id ? "#98A8F8" : "",
          fontFamily: "Roboto",
          fontSize: "12px",
          cursor: "pointer",
        }}
        id={id}
        onClick={() => {
          matrecselector(id, mtrlrects);
        }}
      >
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrects["CustDocuNo"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrects["RV_No"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {moment(mtrlrects["RV_Date"]).format("DD/MM/YYYY")}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          <input type="checkbox" checked={mtrlrects["updated"] == 1} />
        </td>
      </tr>
    );
  };

  let rendertabmatrecdets = (mtrlrecdets) => {
    return (
      <tr className="custtr" style={{ fontFamily: "Roboto", fontSize: "12px" }}>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px" }}
        >
          {mtrlrecdets["Mtrl_Code"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["DynamicPara1"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["DynamicPara2"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          {mtrlrecdets["Qty"]}
        </td>
        <td
          className="custtd"
          style={{ fontFamily: "Roboto", fontSize: "12px", width: "70px" }}
        >
          <input type="checkbox" checked={mtrlrecdets["updated"] == 1} />
        </td>
      </tr>
    );
  };

  let rendertabmatretparts = (mtrlretparts) => {
    return (
      <tr className="">
        <td>{mtrlretparts.Inv_No}</td>
        <td>{moment(mtrlretparts.Inv_Date).format("DD/MM/YYYY")}</td>
        <td>{mtrlretparts.Material}</td>
        <td>{mtrlretparts.SrlWt}</td>
      </tr>
    );
  };

  let rendertblmatscrpunusedets = (mtrlscrunusedets) => {
    return (
      <tr className="">
        <td>{mtrlscrunusedets.DC_No}</td>
        <td>{moment(mtrlscrunusedets.DC_Date).format("DD/MM/YYYY")}</td>
        <td>{mtrlscrunusedets.Material}</td>
        <td>{parseFloat(mtrlscrunusedets.Total_Wt).toFixed(2)}</td>
      </tr>
    );
  };
  return (
    <div>
      <h4 className="title">Customer Material Information</h4>

      <div className="row">
        <div className="col-md-6 ">
          <label className="form-label">Select Customer</label>
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
            //   className="ip-select"
            //   controlId="CustName"
            //   style={{}}
            //   onChange={selectCust}
            // >
            //   <option value="" disabled selected>
            //     {" "}
            //     Select Customer
            //   </option>
            //   {custdata.map((cust) => {
            //     return (
            //       <option value={cust["Cust_Code"]}>{cust["Cust_name"]}</option>
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
            // <Typeahead
            //   id="basic-example"
            //   className="ip-select"
            //   onChange={setCustdata}
            //   options={custdata}
            //   placeholder="Select Customer"
            //   custdata={custdata}
            // />
            ""
          )}
        </div>

        <div className="col-md-3">
          <label className="form-label">Code</label>
          <input disabled type="text" value={custcode} />
        </div>
        <div className="col-md-2 mt-3">
          <button
            id="btncustmtrlclose"
            type="submit"
            className="button-style"
            onClick={() => navigate("/customer")}
          >
            Close{" "}
          </button>
        </div>
      </div>
      <div>
        {/* <MainTable /> */}
        <div className="row mt-4">
          <Tabs
            defaultActiveKey="mtrlrecpts"
            id="materialdetails"
            className=" tab_font mt-4"
          >
            <Tab
              eventKey="mtrlrecpts"
              title="Material Receipts"
              style={{ margin: "0px" }}
            >
              <div>
                <div className="row mt-3">
                  <div
                    className="col-md-6  mt-3"
                    style={{
                      height: "340px",
                      overflowY: "scroll",
                    }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor tablebody">
                        <tr>
                          {["Cust Doc. No", "RV No", "Date", "Updated"].map(
                            (h) => {
                              return <th>{h}</th>;
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {custmtrlrectdata != null
                          ? custmtrlrectdata.map((mtrlrects, id) =>
                              rendertabmatrec(mtrlrects, id)
                            )
                          : ""}
                      </tbody>
                    </Table>
                  </div>
                  <div
                    className="col-md-6  mt-3"
                    xs={6}
                    style={{ height: "340px", overflowY: "scroll" }}
                  >
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor tablebody">
                        <tr
                          className="custtr "
                          // style={{ fontFamily: "Roboto", fontSize: "12px" }}
                        >
                          {[
                            "Mtrl Code",
                            "Length",
                            "Width",
                            "Quantity",
                            "Updated",
                          ].map((h) => {
                            return (
                              <th
                                className="custth "
                                // style={{
                                //   fontFamily: "Roboto",
                                //   fontSize: "12px",
                                // }}
                              >
                                {h}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {custmtrlrecdetsdata != null
                          ? custmtrlrecdetsdata.map((mtrlrecdets) =>
                              rendertabmatrecdets(mtrlrecdets)
                            )
                          : ""}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey="mtrlrets" title="Material Return">
              <div>
                <div className="row">
                  <div
                    className="col-md-6"
                    xs={6}
                    style={{ maxHeight: "320px" }}
                  >
                    <FormLabel>Returned as Parts</FormLabel>
                    <div style={{ height: "300px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr
                            className=" "
                            //   style={{ fontFamily: "Roboto", fontSize: "12px" }}
                          >
                            {["Inv No", "Inv Date", "Material", "Weight"].map(
                              (h) => {
                                return (
                                  <th
                                    className=" "
                                    //   style={{
                                    //     fontFamily: "Roboto",
                                    //     fontSize: "12px",
                                    //   }}
                                  >
                                    {h}
                                  </th>
                                );
                              }
                            )}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {mtrlretpartsdata != null
                            ? mtrlretpartsdata.map((mtrlretparts) =>
                                rendertabmatretparts(mtrlretparts)
                              )
                            : ""}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div
                    className="col-md-6"
                    xs={6}
                    style={{ maxHeight: "320px" }}
                  >
                    <FormLabel>Returned as Scrap & Unused</FormLabel>
                    <div style={{ height: "300px", overflowY: "scroll" }}>
                      <Table striped className="table-data border ">
                        <thead className="tableHeaderBGColor tablebody">
                          <tr className="custtr ">
                            {["DC No", "DC Date", "Material", "Total Wt."].map(
                              (h) => {
                                return <th className="custth ">{h}</th>;
                              }
                            )}
                          </tr>
                        </thead>
                        <tbody className="tablebody">
                          {mtrlretscrapunuseddetsdata != null
                            ? mtrlretscrapunuseddetsdata.map(
                                (mtrlscrunusedets) =>
                                  rendertblmatscrpunusedets(mtrlscrunusedets)
                              )
                            : ""}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="mtrldets" title="Material Stock Position">
              <div>
                <div className=" row mt-2">
                  <div style={{ height: "325px", overflowY: "scroll" }}>
                    <Table striped className="table-data border ">
                      <thead className="tableHeaderBGColor tablebody">
                        <tr className=" ">
                          {[
                            "Material",
                            "Width",
                            "Length",
                            "InStock",
                            "Locked",
                            "Scrap",
                          ].map((h) => {
                            return <th className="custth ">{h}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody className="tablebody">
                        {mtrlstkposition != null
                          ? mtrlstkposition.map((mtrlstkposn) =>
                              rendertable(mtrlstkposn)
                            )
                          : ""}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Material;
