
import React, { useRef, useEffect ,useCallback, useState} from "react";
import Plyr from "plyr";
//import "plyr-react/plyr.css";
import { Col, Row, Card, Button, Image } from 'react-bootstrap';
//  , Table, Badge, Image, ListGroup 
//import { videoOverlay } from "leaflet";
//import { ArchiveIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MailIcon, MailOpenIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
//import {  Button, Dropdown, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
//import { Link } from "react-router-dom";
//import { Routes } from "routes";
import axios from "axios";
import getCookie from "pages/video/csrfUtil";

export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
  const playerRef = useRef({});
  const [imageURL, setImageURL] = useState("");
  const [timeTxt, setTimeTxt] = useState("0");
  const src = "/static/"+match.params.camera+"/"+match.params.fname
  const isrc = match.params.camera+"/"+match.params.fname

//  var csrftoken
  const setupPlyr = useCallback(() => {
    playerRef.current.plyr =
      new Plyr(document.getElementById('plyr'), {
        title: match.params.fname,
        source: {
          type: "video",
          sources: [{
            src: src,
            provider: "html5"
          }],
        },
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "captions",
          "settings",
          "pip",
          "fullscreen"
        ],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2, 4, 8] },
      }
    );
    playerRef.current.plyr.on('timeupdate', ()=>{
      setTimeTxt(playerRef.current.plyr.currentTime.toString(10));
    });
  },[match,src]);


  useEffect(()=>{
    let csrftoken = getCookie('csrftoken');
    console.log("Got CSRF token ",csrftoken);
    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken' : csrftoken };
    setupPlyr()
  },[setupPlyr]);

  const handleCapture = (e)=>{
    const plr = playerRef.current
    console.log("Capture!", plr);
    console.log("Capture!", plr.plyr);
    
    axios.post('/api/captureVideo', {
      fname: match.params.fname,
      camera: match.params.camera,
      time: playerRef.current.plyr.currentTime
    })
      .then((res) => {
          setImageURL("/static/"+res.data.cfile);
      });
  }

  const handleCapturePlane = (e)=>{
   
    axios.post('/api/captureVideoPlane', {
      fname: match.params.fname,
      camera: match.params.camera,
      time: playerRef.current.plyr.currentTime
    })
      .then((res) => {
          setImageURL("/static/"+res.data.cfile);
      });
  }



//  console.log("Rerender!?");
  return (
    <>
      <Row className="justify-content-center mt-4">
        <Col xs={12} xl={9}>

        　
          <Button type="button" href={"/#/video/image/"+isrc}>Image</Button>　
          <Button type="button" href={"/#/video/carib/"+isrc}>Capt</Button>　
          <Button type="button" href={"/#/video/genCarib/"+isrc}>Carib</Button>
          
          <Card border="0" className="shadow position-relative p-4 p-md-5">
              {src}:{timeTxt}
              {/* plyr-react を使うと、なぜか rewriteされる */}
              <video id="plyr">
                  <source src={src} type="video/mp4" />
              </video>
          </Card>
        
          <Button type="button" variant="primary" className="d-inline-flex align-items-center mb-3 mb-md-0"
            onClick={(e)=> {
              handleCapture(e);
            }}
            >
            {/*<PencilAltIcon className="icon icon-xs me-2" />*/}
            CaptureCarib
          </Button>
          <Button type="button" variant="secondary" className="d-inline-flex align-items-center mb-3 mb-md-0"
            onClick={(e)=> {
              handleCapturePlane(e);
            }}          
          >
            CapturePlane
          </Button>
            {/* ここにキャプチャ画像を貼りたい */}
          <Card>
            <Image src={imageURL} />

            </Card>
        </Col>
      </Row>
    </>
  );
};
