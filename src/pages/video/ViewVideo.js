
import React, { useRef, useEffect , useState} from "react";
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



const options = {
  enabled: true,
  autoplay: true,
  muted: true,
  playsinline: true,
  clickToPlay: false,
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "mute",
    "volume",
    "captions",
    "settings",
    "pip",
    "airplay",
    "fullscreen"
  ],
  tooltips: { controls: true, seek: true },
  settings: ["captions", "quality", "speed", "loop"],
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
  captions: { active: false, language: "auto", update: true },
  loop: { active: true }
};


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
  let playerRef = useRef({});
  const [imageURL, setImageURL] = useState("");
  const [timeTxt, setTimeTxt] = useState("0");
  const src = "/static/"+match.params.camera+"/"+match.params.fname
//  var csrftoken
  const setupPlyr = () => {
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
  }


  useEffect(()=>{
    let csrftoken = getCookie('csrftoken');
    console.log("Got CSRF token ",csrftoken);
    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken' : csrftoken };
    setupPlyr()
  },[]);

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
