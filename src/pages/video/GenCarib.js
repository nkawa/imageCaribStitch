
import React, {  useEffect , useState, useCallback} from "react";
import { Col, Row, Card, Button, Image,Form } from 'react-bootstrap';
import axios from "axios";
import getCookie from "pages/video/csrfUtil";


// 各カメラから、チェスボードを認識して、
// その結果から、キャリブレーション　matrix を作成して、保存！


// caribBase
const caribBase = ['A','B','C','D','E','F','G'];
const caribCount = [1,2,3,4,5,6,7,8,9,10,11,12];

export default (props) => {
//  console.log("Real",caribInfo);
  const {match} = props;
//  console.log("ViewVideo props",props,match)
//  let playerRef = useRef(null);
  const [imageURLs, setImageURLs] = useState([]);
  const [convURLs, setConvURLs] = useState([]);
//  const [caribTxt, setCaribTxt] = useState("test carib data");
//  const src = "/static/"+match.params.camera+"/"+match.params.fname
  const isrc = match.params.camera+"/"+match.params.fname

  const [caribCam, setCaribCam] = useState("A");
  const [caribNum, setCaribNum] = useState(1);

  const changeCaribCam = (e) => {
    setCaribCam(e.target.value);
  };

  const changeCaribNum = (e) => {
    setCaribNum(e.target.value);
  };

  const convImg = (f,i) =>{
    const c = document.getElementById("cam").value;
    const n = document.getElementById("num").value;
//    console.log("Convert image ",f,"with", c,n);
    axios.post('/api/findChecker',{
        conv: c+n,
        fname: f,
        num: i,
    }).then(res=>{
        const imlist =res.data;
        console.log(imlist);
        let nurls = [...convURLs]
        nurls[imlist.time]= "/static/"+imlist.cfile;
        setConvURLs(nurls);

    });
    
  };

  // ファイル一覧に対し、checkerを探し、キャリブレーションを行う
  const GenCaribAll = ()=>{
    axios.post('/api/genCarib',{
          fname: match.params.fname,
    }).then((res)=>{
      const iconv =res.data;
      console.log(iconv);
      let nurls = [...convURLs]
      nurls[0]="/static/"+iconv.cfile;      
      setConvURLs(nurls);

    });

  }


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
//          console.log("Response:",imlist);
          let urls = [], curls=[]
          for(var im of imlist){
            if (im.cfile.indexOf('_plane.png')>0){
              urls.push("/static/"+im.cfile);
              curls.push("");
            }
          }
          setImageURLs(urls);
          setConvURLs(curls);

//          setImageURL("/static/"+res.data.cfile);
//          console.log("SetTime:",res.data.time);
  //        plr.plyr.currentTime = res.data.time;
//          console.log("GetTime:",plr.plyr.currentTime);

      });
  },[match]);
//  const listCallback = useCallback(handle)
useEffect(()=>{
    let csrftoken = getCookie('csrftoken');
    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken' : csrftoken };
  handleList(null);
},[handleList]);

  return (
    <>
      <Row className="justify-content-center mt-4">
        <Col xs={12}>       
          <Button type="button" variant="primary" className="d-inline-flex align-items-center mb-3 mb-md-0"
            onClick={(e)=> {
              handleList(e);
            }}
          >
            {/*<PencilAltIcon className="icon icon-xs me-2" />*/}
            ShowList
          </Button>
          <Button type="button" variant="secondary" className="d-inline-flex align-items-center mb-3 mb-md-0"
            onClick={GenCaribAll}
          >
            GenCarib
          </Button>
          <Form.Select id="cam" value={caribCam} className="fmxw-200 d-none d-md-inline" onChange={changeCaribCam}>
            {caribBase.map(c=>
              <option key={c} value={c}>{c}</option>)
            }
          </Form.Select>
          <Form.Select id="num" value={caribNum} className="fmxw-200 d-none d-md-inline" onChange={changeCaribNum}>
            {caribCount.map(c=>
              <option key={c} value={c}>{c}</option>)
            }
          </Form.Select>　
          <Button type="button" href={"/#/video/view/"+isrc}>Capt</Button>　
          <Button type="button" href={"/#/video/image/"+isrc}>ImageList</Button>　
          <Button type="button" href={"/#/video/carib/"+isrc}>Conv</Button>
          
            {/* ここにキャプチャ画像を貼りたい */}
          <Card>
            {
              imageURLs.map((t,i)=>
              <div key={i}>
              {t}
              <Row >
              <Col xs={6}>
              <Image src={t} />
              <Button onClick={()=>convImg(t,i)} size="sm">
              Detect Checker</Button>
              </Col>
              <Col xs={6}>
              <Image src={convURLs[i]}/>
              </Col>
              </Row>
              </div>
              )

            }
            </Card>
        </Col>
      </Row>
    </>
  );
};
