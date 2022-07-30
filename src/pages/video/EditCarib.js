
import React, {  useEffect , useState, useCallback} from "react";
import { Col, Row, Card, Button, Image,Form} from 'react-bootstrap';
import axios from "axios";
import getCookie from "pages/video/csrfUtil";


// キャリブレーションデータを手作業で修正できるか！？

// まずは１個だけで

// caribBase
const caribBase = ['Z','A','B','C','D','E','F','G'];
const caribCount = [1,2,3,4,5,6,7,8,9,10,11,12];

export default (props) => {
  const {match} = props;
//  console.log("ViewVideo props",props,match)
  const [imageURLs, setImageURLs] = useState([]);
  const [convURLs, setConvURLs] = useState([]);
  const [distVal, setDistVal] = useState([0,0,0,0,0]);
  const [camVal, setCamVal] = useState([0,0,0,0,0,0,0,0,0]);
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
    axios.post('/api/convImage',{
        conv: c+n,
        fname: f,
        num: i,
    }).then(res=>{
        const imlist =res.data;
//        console.log(imlist);
        let nurls = [...convURLs]
        nurls[imlist.time]= "/static/"+imlist.cfile;
        const dst = imlist.json.distortion_coefficients.data;
        const cammat = imlist.json.camera_matrix.data;
        setDistVal(dst);
        setCamVal(cammat);
        setConvURLs(nurls);
    });
  };


// 編集された情報でキャリブレーションしてみる
  const doCalibImg = (f,i) =>{
//    console.log("Convert image ",f,"with", c,n);
    axios.post('/api/doCalibImage',{
        calib: distVal,
        matrix: camVal,
        fname: f,
        num: i,
    }).then(res=>{
        const imlist =res.data;
        console.log(imlist);
        let nurls = [...convURLs]
        nurls[imlist.time]= "/static/"+imlist.cfile;
        const dst = imlist.json.distortion_coefficients.data;
        setDistVal(dst);
        setConvURLs(nurls);
    });
  };


// 編集された情報でキャリブレーションしてみる
const saveCalibInfo = (f,i) =>{
  //    console.log("Convert image ",f,"with", c,n);
      axios.post('/api/saveCalibInfo',{
          calib: distVal,
          matrix: camVal,
          fname: f,
          num: i,
      }).then(res=>{
          const imlist =res.data;
          console.log(imlist);
          let nurls = [...convURLs]
          nurls[imlist.time]= "/static/"+imlist.cfile;
          const dst = imlist.json.distortion_coefficients.data;
          setDistVal(dst);
          setConvURLs(nurls);
      });
    };
  
  


  const handleList = useCallback((e)=>{
//    const plr = playerRef.current
//    console.log("Capture!", plr.plyr.currentTime, src);
    
    axios.get('/api/imageList/',{
      params:{
          fname: match.params.fname,
      }
    })
      .then((res) => {
          const imlist =res.data;
          let urls = [], curls=[]
          for(var im of imlist){
            if (im.cfile.indexOf('_plane.png')>0){
              urls.push("/static/"+im.cfile);
              curls.push("");
//              break; // 今回は１つだけ
            }
          }
          setImageURLs(urls);
          setConvURLs(curls);

      });
  },[match]);

  const changeVal = (i) =>{
    const f = (e) =>{
      const d = [...distVal];
 //     console.log("ChangeVal",i,e);
      d[i]=parseFloat(e.target.value);
      setDistVal(d);
    };
    return f; 
  }

  const changeCam = (i) =>{
    const f = (e) =>{
      const d = [...camVal];
//      console.log("ChangeCam",i,e);
      d[i]=parseFloat(e.target.value);
      setCamVal(d);
    };
    return f; 
  }




// for post CSRF
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
            onClick={handleList}
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
              SetCalib</Button>　
              <Button onClick={()=>doCalibImg(t,i)} size="sm">
              UseEditCalib</Button>　
              <Button onClick={()=>saveCalibInfo(t,i)} size="sm">
              SaveCalibInfo</Button>
              </Col>
              <Col xs={6}>
              <Image src={convURLs[i]}/>
              </Col>
              </Row>
              </div>
              )

            }
            </Card>
            {/* 以下は、キャリブレーションデータを設定したい */}
            <Card>
              {[...Array(5).keys()].map(i=>(
                <div key={"ee"+i}>
                <Form.Label>{distVal[i]} </Form.Label>
                <Form.Range min="-1.0" max="1.0" step="0.001" onChange={changeVal(i)} 
                  value={distVal[i]}
                />
                </div>))

              }  

            </Card>
            matrix
            <Card>
              {[0,2,4,5].map(i=>(
                <div key={"ed"+i}>
                <Form.Label>{camVal[i]} </Form.Label>
                <Form.Range min="500" max="1200" step="1" onChange={changeCam(i)} 
                  value={camVal[i]}
                />
                </div>))

              }  
              
            </Card>

        </Col>
      </Row>
    </>
  );
};
