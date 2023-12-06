import { useState } from "react";
import axios from "axios";
import Post from './Post';
import style from '../css/EstateCreate.module.css';

function App() {
    // 평수&제곱미터
    const [areas, setAreas] = useState({ area: '', squareMeter: '' });

    // 평수, 제곱미터
    const handleAreaChange = (e) => {
        const { name, value } = e.target;

        // 입력한 값이 평수일 떄
        if (name === 'area') {
            if (value === NaN) {
                value = 0;
            }

            // 제곱미터 계산
            const pyeongValue = parseFloat(value);
            const squareMeterValue = pyeongValue * 3.30578; // 1평 = 3.30578㎡

            setRealEstate(prev => ({ ...prev, [name]: value }));
            setAreas({ area: value, squareMeter: squareMeterValue.toFixed(2) });
        }
    }

    // 우편 번호
    const [enroll_company, setEnroll_company] = useState({
        zipcode: '',
        address: ''
    });

    // 주소 검색 팝업
    const [popup, setPopup] = useState(false);

    const handleAddress = (e) => {
        const { name, value } = e.target;

        if (name === 'address') {
            setEnroll_company({
                ...enroll_company,
                [name]: value,
            });
        }
    }

    // 주소 검색 팝업창 닫기
    const handleComplete = (data) => {
        setPopup(!popup);
    }

    // 보낼 데이터
    const [realEstate, setRealEstate] = useState({
        roomCode: "",
        buildingCode: "",
        heatingCode: "",
        area: "",
        zipcode: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        handleAreaChange(e);
        handleAddress(e);

        setRealEstate(prev => ({ ...prev, zipcode: enroll_company.zipcode, address: enroll_company.address }));
        setRealEstate(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = () => {
        console.log(realEstate);
        axios.post("/api/estateManage/", realEstate).then(resp => {
            console.log(resp);
        }).catch(e => {

        });
    }

    return (
        <div className="container">
            <h1 className={style.title}>매물 정보</h1>
            <table border="1">
                <tr>
                    <th>종류 선택<span>*</span></th>
                    <td>
                        <input type="radio" id="r1" name="roomCode" value="r1" onChange={handleChange} /><label for="r1">원룸</label>
                        <input type="radio" id="r2" name="roomCode" value="r2" onChange={handleChange} /><label for="r2">투룸</label>
                        {/* <input type="radio" id="r3" name="room_code" value="r3" /><label for="r3">쓰리룸</label>
          <input type="radio" id="r4" name="room_code" value="r4" /><label for="r4">오피스텔(도시형)</label>
          <input type="radio" id="r5" name="room_code" value="r5" /><label for="r5">아파트</label> */}
                    </td>
                </tr>
                <tr>
                    <th>건물 유형<span>*</span></th>
                    <td>
                        <input type="radio" id="b1" name="buildingCode" value="b1" onChange={handleChange} /><label for="b1">단독주택</label>
                        <input type="radio" id="b2" name="buildingCode" value="b2" onChange={handleChange} /><label for="b2">다가구주택</label>
                        <input type="radio" id="b3" name="buildingCode" value="b3" onChange={handleChange} /><label for="b3">빌라/연립/다세대</label>
                        <input type="radio" id="b4" name="buildingCode" value="b4" onChange={handleChange} /><label for="b4">상가주택</label>
                    </td>
                </tr>
                <tr>
                    <th>주소<span>*</span></th>
                    <td>
                        <div>
                            <div>
                                <input type="text" placeholder="우편번호" name="zipcode" onChange={handleChange} value={enroll_company.zipcode} /><button onClick={handleComplete}>우편번호 찾기</button>
                            </div>
                            <div>
                                <input type="text" placeholder="주소" name="address" onChange={handleChange} value={enroll_company.address} />
                            </div>
                            {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>매물크기<span>*</span></th>
                    <td>
                        <div>전용면적</div>
                        <div className={style.ScaleDiv}>
                            <input type="number" name="area" onChange={handleChange} value={areas.area} />
                            <p className={style.Scale}>평</p>
                        </div>
                        =
                        <div className={style.ScaleDiv}>
                            <input type="number" value={areas.squareMeter} readOnly />
                            <p className={style.Scale}>㎡</p>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>난방 종류<span>*</span></th>
                    <td>
                        <input type="radio" id="h1" name="heatingCode" value="h1" onChange={handleChange} /><label for="h1">개별난방</label>
                        <input type="radio" id="h2" name="heatingCode" value="h2" onChange={handleChange} /><label for="h2">중앙난방</label>
                    </td>
                </tr>
            </table>


            {/* <h1 className="title">거래 정보</h1>
      <table border="1">
        <tr>
          <th>거래 종류<span>*</span></th>
          <td>
            <input type="radio" id="t1" name="transaction_code" value="t1" /><label for="t1">월세</label>
            <input type="radio" id="t2" name="transaction_code" value="t2" /><label for="t2">전세</label>
            <input type="checkbox" id="o1" value="" /><label for="o1">단기가능</label>
          </td>
        </tr>
        <tr>
          <th>가격 정보<span>*</span></th>
          <td>
            <div>전세가</div>
            <div className="Scale-div">
              <input type="number" name="" />
              <p className="Scale">만원</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>공용관리비<span>*</span></th>
          <td>
            <div>관리비</div>
            <div className="Scale-div">
              <input type="radio" id="m1" name="maintenance" value="" /><label for="m1">없음</label>
              <input type="radio" id="m2" name="maintenance" value="" /><label for="m2">있음</label>
              <input type="number" name="maintenance_cost" />
              <p className="Scale">원</p>
            </div>
          </td>
        </tr>
      </table>



      <h1 className="title">추가 정보</h1>
      <table border="1">
        <tr>
          <th>층수<span>*</span></th>
          <td>
            <div>
              전체 층 수
              <select name="languages" id="lang">
                <option value="javascript">JavaScript</option>
                <option value="php">PHP</option>
                <option value="java">Java</option>
                <option value="golang">Golang</option>
                <option value="python">Python</option>
                <option value="c#">C#</option>
                <option value="C++">C++</option>
                <option value="erlang">Erlang</option>
              </select>
            </div>
            <div>
              해당 층 수
              <select name="languages" id="lang">
                <option value="javascript">JavaScript</option>
                <option value="php">PHP</option>
                <option value="java">Java</option>
                <option value="golang">Golang</option>
                <option value="python">Python</option>
                <option value="c#">C#</option>
                <option value="C++">C++</option>
                <option value="erlang">Erlang</option>
              </select>
            </div>
          </td>
        </tr>
        <tr>
          <th>가격 정보<span>*</span></th>
          <td>
            <div>전세가</div>
            <div className="Scale-div">
              <input type="number" name="" />
              <p className="Scale">만원</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>주차여부<span>*</span></th>
          <td>
            <div className="Scale-div">
              <input type="radio" id="m1" name="maintenance" value="" /><label for="m1">불가능</label>
              <input type="radio" id="m2" name="maintenance" value="" /><label for="m2">가능</label>
              <input type="number" name="maintenance_cost" />
              <p className="Scale">원</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>옵션항목</th>
          <td>
            <input type="checkbox" /><label>엘리베이터</label>
            <input type="checkbox" /><label>반려동물</label>
            <input type="checkbox" /><label>베란다/발코니</label>
            <input type="checkbox" /><label>에어컨</label>
            <input type="checkbox" /><label>세탁기</label>
            <input type="checkbox" /><label>침대</label>
            <input type="checkbox" /><label>책상</label>
            <input type="checkbox" /><label>옷장</label>
            <input type="checkbox" /><label>TV</label>
            <input type="checkbox" /><label>신발장</label>
            <input type="checkbox" /><label>냉장고</label>
            <input type="checkbox" /><label>가스레인지</label>
            <input type="checkbox" /><label>인덕션</label>
            <input type="checkbox" /><label>전자레인지</label>
            <input type="checkbox" /><label>전자도어락</label>
            <input type="checkbox" /><label>비데</label>
          </td>
        </tr>
      </table>


      <h1 className="title">사진 등록</h1>
      <table border={1}>
        <tr>
          <th>일반 사진<span>*</span></th>
          <td>
            <input type="file"></input>
          </td>
        </tr>
      </table>


      <h1 className="title">상세 설명</h1>
      <table border={1}>
        <tr>
          <th>제목<span>*</span></th>
          <td>
            <input type="text" placeholder="제목을 입력해주세요."></input>
          </td>
        </tr>
        <tr>
          <th>상세설명<span>*</span></th>
          <td>
            <input type="text" placeholder="설명을 입력해주세요."></input>
          </td>
        </tr>
      </table> */}

            <button onClick={handleSubmit}>매물 등록</button>
        </div>
    );
}

export default App;
