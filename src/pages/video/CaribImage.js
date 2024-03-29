import React, { useState, useEffect } from "react";
import { CheckIcon, CogIcon, HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown } from 'react-bootstrap';

//import { TransactionsTable } from "components/Tables";
//import TRANSACTIONS_DATA from "data/transactions";
import { CaribImageTable } from "components/Tables";
//import FILE_DATA from "data/transactions";
import axios from "axios";

export default () => {
  //const [transactions, setTransactions] = useState(TRANSACTIONS_DATA.map(t => ({ ...t, show: true })));
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("all");
  // eslint-disable-next-line
  // ここでデータを出したい。。。
  const [files, setFiles] = useState([]); //FILE_DATA.map(f =>({...f, show:true})));

  const changeSearchValue = (e) => {
    const newSearchValue = e.target.value;
    const newFiles = files.map(t => {
      let shouldShow = true;
      if (t.fname.indexOf(newSearchValue) === -1){
        shouldShow = false;
      }
//      console.log("NewFiles!!",e,t)
/*      const subscription = t.subscription.toLowerCase();
      const shouldShow = subscription.includes(newSearchValue)
        || t.status.includes(newSearchValue)
        || `${t.invoiceNumber}`.includes(newSearchValue);
*/
      return ({ ...t, show: shouldShow });
    });

    setSearchValue(newSearchValue);
    setFiles(newFiles);
//    setTransactions(newTransactions);
  };

  const changeStatusValue = (e) => {
    const newStatusValue = e.target.value;
    const newFiles = files.map(u => ({ ...u, show: u.status === newStatusValue || newStatusValue === "all" }));
    setStatusValue(newStatusValue);
    setFiles(newFiles);
  };

  // １回だけ実行させる
  useEffect(()=>{
    getFileList()
  },[])

  const getFileList = () => {
//    console.log("GetFileList!")
//    axios.get('http://192.168.175.106:8000/api/fileList')
    axios.get('/api/imageList')
      .then((res) => {
//        console.log("Response:",res);
        let fdata = [];
        let dt = res.data;
        for(let i = 0; i < dt.length; i++){
          fdata.push({...dt[i], key: i, show:true});
        }
//        const fdata = res.data.map(f =>({...f, show:true}));
//        console.log("Fdata set!", fdata.length);
        setFiles(fdata);
      });
  }

  // plane キャプチャファイルのオブジェクトを作成する依頼！
  const genPlaneFile = () => {
    //    console.log("GetFileList!")
    //    axios.get('http://192.168.175.106:8000/api/fileList')
        axios.get('/api/genPlaneFileList')
          .then((res) => {
    //        console.log("Response:",res);
            let fdata = [];
            let dt = res.data;
            for(let i = 0; i < dt.length; i++){
              fdata.push({...dt[i], key: i, show:true});
            }
    //        const fdata = res.data.map(f =>({...f, show:true}));
    //        console.log("Fdata set!", fdata.length);
            setFiles(fdata);
          });
      }
    


  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><HomeIcon className="icon icon-xs" /></Breadcrumb.Item>
            {/* <Breadcrumb.Item>Vold</Breadcrumb.Item> */}
            <Breadcrumb.Item active>FileList</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Caribrated Videos</h4>
          <p className="mb-0"> 対象とするビデオを確認してください</p>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button variant="gray-800" size="sm" className="d-inline-flex align-items-center" onClick={genPlaneFile}>
            <PlusIcon className="icon icon-xs me-2" /> GenPlaneFile
          </Button>
          {/* <ButtonGroup className="ms-2 ms-lg-3">
            <Button variant="outline-gray-600" size="sm">Share</Button>
            <Button variant="outline-gray-600" size="sm">Export</Button>
          </ButtonGroup> */}
        </div>
      </div>

      <div className="table-settings mb-4">
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs={9} lg={8} className="d-md-flex">
            <InputGroup className="me-2 me-lg-3 fmxw-400">
              <InputGroup.Text>
                <SearchIcon className="icon icon-xs" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search orders"
                value={searchValue}
                onChange={changeSearchValue}
              />
            </InputGroup>
            <Form.Select value={statusValue} className="fmxw-200 d-none d-md-inline" onChange={changeStatusValue}>
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="due">Due</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </Col>
          <Col xs={3} lg={4} className="d-flex justify-content-end">
            <Dropdown as={ButtonGroup}>
              <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-1">
                <CogIcon className="icon icon-sm" />
                <span className="visually-hidden">Toggle Dropdown</span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-end pb-0">
                <small className="ps-3 fw-bold text-dark">Show</small>
                <Dropdown.Item className="d-flex align-items-center fw-bold">
                  10 <CheckIcon className="icon icon-xxs ms-auto" />
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                <Dropdown.Item className="fw-bold rounded-bottom">30</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      <CaribImageTable
        files={files.filter(t => t.show)}
      />
    </>
  );
};
