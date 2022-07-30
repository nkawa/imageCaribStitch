
import React, {  useCallback, useEffect , useState} from "react";
import { Col, Row, Card, Button, Image } from 'react-bootstrap';
import axios from "axios";

// キャリブレーションされたイメージ一覧
// キャリブありも


export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
//  let playerRef = useRef(null);
  const [imageURLs, setImageURLs] = useState([]);
//  const [caribTxt, setCaribTxt] = useState("test carib data");
  const isrc = match.params.camera+"/"+match.params.fname
  const handleList = useCallback((e)=>{    
    axios.get('/api/imageList/',{
      params:{
          fname: match.params.fname,
      }
    })
      .then((res) => {
          const imlist =res.data;
          console.log("Response:",imlist);
          let urls = []
          for(var im of imlist){
            console.log(im);
            urls.push("/static/"+im.cfile);
          }
          setImageURLs(urls);
      });
  },[match]);

  useEffect(()=>{
    handleList(null);
  },[handleList]);



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
          　
          <Button type="button" href={"/#/video/image/"+isrc}>ImageList</Button>　
          <Button type="button" href={"/#/video/carib/"+isrc}>Conv</Button>
          <Button type="button" href={"/#/video/genCarib/"+isrc}>Carib</Button>　
         
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
