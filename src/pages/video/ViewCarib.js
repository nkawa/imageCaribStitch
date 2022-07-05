
import React, {  useEffect , useState, useCallback} from "react";
import { Col, Row, Card, Button, Image } from 'react-bootstrap';
import axios from "axios";

// キャリブレーションを変更したい

export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
//  let playerRef = useRef(null);
  const [imageURLs, setImageURLs] = useState([]);
//  const [caribTxt, setCaribTxt] = useState("test carib data");
//  const src = "/static/"+match.params.camera+"/"+match.params.fname

  const handleList = useCallback((e)=>{
//    const plr = playerRef.current
//    console.log("Capture!", plr.plyr.currentTime, src);
    
    axios.get('/api/imageList/',{
      params:{
          fname: match.params.fname,
      }
    })
      .then((res) => {
//          setCaribTxt(res.data.json)
          const imlist =res.data;
          console.log("Response:",imlist);
          let urls = []
          for(var im of imlist){
            console.log(im);
            urls.push("/static/"+im.cfile);
          }
          setImageURLs(urls);

//          setImageURL("/static/"+res.data.cfile);
//          console.log("SetTime:",res.data.time);
  //        plr.plyr.currentTime = res.data.time;
//          console.log("GetTime:",plr.plyr.currentTime);

      });
  },[match]);
//  const listCallback = useCallback(handle)
useEffect(()=>{
  handleList(null);
});

  return (
    <>
      <Row className="justify-content-center mt-4">
        <Col xs={12} xl={9}>        
          <Button type="button" variant="primary" className="d-inline-flex align-items-center mb-3 mb-md-0"
            onClick={(e)=> {
              handleList(e);
            }}
          >
            {/*<PencilAltIcon className="icon icon-xs me-2" />*/}
            ShowList
          </Button>
          <Button type="button" variant="secondary" className="d-inline-flex align-items-center mb-3 mb-md-0">

            List
          </Button>
            {/* ここにキャプチャ画像を貼りたい */}
          <Card>
            {
              imageURLs.map(t=> <div key={t}> {t}<Image src={t} /></div>)
            }
            </Card>
        </Col>
      </Row>
    </>
  );
};
