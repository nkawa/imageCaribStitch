
import React, { useRef, useEffect } from "react";
import Plyr from "plyr-react";
//import "plyr-react/plyr.css";
import { Col, Row, Card, Table, Badge, Image, ListGroup } from 'react-bootstrap';
//import { videoOverlay } from "leaflet";
import { ArchiveIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MailIcon, MailOpenIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import {  Button, Dropdown, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Routes } from "routes";



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

export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
  let playerRef = useRef();
  let src = "/static/"+match.params.camera+"/"+match.params.fname
  useEffect(()=>{

  },[]);

  return (
    <>
      <Row className="justify-content-center mt-4">
        <Col xs={12} xl={9}>
          <Card border="0" className="shadow position-relative p-4 p-md-5">
            <Plyr 
              ref = {playerRef}
              source={{
                type:"video",
                sources:[{
                  src: src,
                  provider: "html5"
                }]
              }}
            />


          </Card>
        
          <Button as={Link} to={Routes.SingleMessage.path} variant="secondary" className="d-inline-flex align-items-center mb-3 mb-md-0">
            <PencilAltIcon className="icon icon-xs me-2" />
            Capture
          </Button>

        
        </Col>
      </Row>
    </>
  );
};
