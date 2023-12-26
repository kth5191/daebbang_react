//
import { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import ItemsCarousel from "react-items-carousel";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

//
import style from "./Info.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import backImg from "../assets/back.png";
import backImg_2 from "../assets/back_2.png";
import medal from "../assets/medal.png";
import textFile from "../assets/textFile.png";

import proExam from "../assets/proExam.PNG";

//
function Info(args, estate) {
  const info_scroll = useRef(null);

  const location = useLocation();
  const [markerInfo, setMarkerInfo] = useState(location.state); // markerInfo를 useState로 관리

  const navigate = useNavigate();

  useEffect(() => {
    // markerInfo가 변경될 때 실행될 콜백 함수
    // 이곳에서 markerInfo에 따른 원하는 동작을 수행할 수 있음
    console.log("markerInfo가 변경됨:", markerInfo);
  }, [markerInfo]);

  const handleCarouselItemClick = (estate) => {
    setMarkerInfo(estate); // markerInfo를 업데이트하는데 useState를 사용
  };

  const { kakao } = window;

  // 캐러셀 넓이
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;

  // 공인중개사의 게시물 10개 가져오기
  const [estateListLimit, setEstateListLimit] = useState([{}]);

  // markerInfo.images 배열에서 이미지 URL을 생성
  const imageUrls = markerInfo.images.map(
    (image) => `/uploads/estateImages/${image.sysName}`
  );

  useEffect(() => {
    // markerInfo.images 배열에서 이미지 URL을 생성
    const imageUrls = markerInfo.images.map(
      (image) => `/uploads/estateImages/${image.sysName}`
    );
  }, [markerInfo]);

  // 공인중개사의 다른 게시물 10개 이미지 usl
  const [imageUrlsEstateLimit, setImageUrlsEstateLimit] = useState([]);

  // 지도 밖에서 생성
  useEffect(() => {
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(markerInfo.latitude, markerInfo.longitude),
      level: 4,
    };
    var map = new kakao.maps.Map(container, options);

    // 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(
      markerInfo.latitude,
      markerInfo.longitude
    );

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [markerInfo]);

  // 돌아가기 버튼 이벤트
  const back = function () {
    window.history.back();
  };

  // 스크롤 감지 이벤트
  const handleScroll = () => {
    // info_scroll의 속성 중 scrollTop(탑)을 나타냄
    const scrollTop = info_scroll.current.scrollTop;

    // 만약 탑이 0이라면을 가지고 조건문을 검 --------
    if (scrollTop === 0) {
      //console.log('최상단입니다.');
      toggleVisibility_drag(true);
    } else {
      toggleVisibility_drag(false);
      //console.log(scrollTop);
    }
  };

  // 드래그 display 이벤트
  const [isVisible_drag, setIsVisible_drag] = useState(true);

  const toggleVisibility_drag = (state) => {
    if (state == true) {
      setIsVisible_drag(!isVisible_drag);
    } else {
      if (!isVisible_drag) {
        return;
      } else {
        setIsVisible_drag(!isVisible_drag);
      }
    }
  };

  useEffect(() => {
    // markerInfo가 변경될 때 실행될 콜백 함수
    // 이곳에서 markerInfo에 따른 원하는 동작을 수행할 수 있음
    console.log("markerInfo가 변경됨:", markerInfo);

    // 스크롤 엘리먼트가 존재하고 markerInfo가 변경될 때 스크롤을 최상단으로 이동
    if (info_scroll.current) {
      info_scroll.current.scrollTop = 0;
    }
  }, [markerInfo]);

  // box_2 더보기 창 이벤트
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // box_4 모두보기 창 이벤트
  const [isVisible_more, setIsVisible_more] = useState(true);

  const toggleVisibility_more = () => {
    setIsVisible_more(!isVisible_more);
  };

  // 공인 중개사의 최신 10개 게시물 가져오기
  useEffect(() => {
    const email = markerInfo.realEstateAgent.email;
    axios
      .get(`/api/map/getAgentContentLimit`, {
        params: {
          email: email, // 쿼리 매개변수로 이메일을 전달
        },
      })
      .then((resp) => {
        console.log(resp);
        const fetchedData = resp.data;
        setEstateListLimit(fetchedData);

        const imageUrls = resp.data.map((item) => {
          // images 배열이 존재하고 첫 번째 요소가 있는 경우 해당 이미지의 URL을 생성
          if (item.images && item.images.length > 0) {
            return `/uploads/estateImages/${item.images[0].sysName}`;
          }
          // images 배열이 비어있는 경우 기본 이미지 URL을 사용
          return "기본이미지URL";
        });

        setImageUrlsEstateLimit(imageUrls);
      })
      .catch((err) => {
        console.log("API 호출 오류:", err);
      });
  }, [markerInfo]);

  //  LoginId
  const loginId = sessionStorage.getItem("loginId");

  // 문의하기 모달
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  // 문의하기 버튼 클릭 이벤트
  const buttonEvent = () => {
    const estateId = markerInfo.estateId;

    // 로그인 확인
    if (loginId == null) {
      Swal.fire({
        icon: "error",
        title: "로그인한 사용자만 이용할 수 있는 기능입니다.",
        text: "로그인 해주세요.",
      });
      return; // 로그인하지 않은 경우 여기서 함수 종료
    }

    // 사용자에게 확인 요청
    Swal.fire({
      title: "문의를 진행하시겠습니까?",
      text: "공인중개사에게 문의를 보냅니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "다시 한번 생각해볼께요",
      confirmButtonText: "네, 진행합니다!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 사용자가 '네'를 선택했을 때
        axios
          .post("/api/reviewApproval/", {
            estateCode: estateId,
            userId: loginId,
          })
          .then((resp) => {
            console.log(resp);
            Swal.fire("성공!", "문의가 정상적으로 등록되었습니다.", "success");
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire("오류!", "문의 등록 중 문제가 발생했습니다.", "error");
          });
      }
    });
  };

  // 리뷰 목록 가져오기
  const [review, setReview] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/review/${markerInfo.estateId}`)
      .then((resp) => {
        setReview(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 리뷰 삭제하기
  const delReview = (seq) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`/api/review/${seq}`)
        .then((resp) => {
          alert("리뷰가 삭제되었습니다");
          setReview((prev) => [...review.filter((e) => e.seq !== seq)]);
        })
        .catch((err) => {
          alert("리뷰 삭제에 실패하였습니다");
          console.log(err);
        });
    }
  };

  // (전세, 월세) 숫자 포맷팅
  function formatPrice(price) {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000);
      const remainder = price % 10000;
      return `${billion}억${
        remainder > 0 ? ` ${remainder.toLocaleString()}` : ""
      }`;
    }
    return price.toLocaleString();
  }

  // 관리비 숫자 포맷팅
  function formatMaintenanceCost(cost) {
    if (cost >= 10000) {
      const tenThousands = Math.floor(cost / 10000);
      const thousands = Math.floor((cost % 10000) / 1000);
      const hundreds = Math.floor((cost % 1000) / 100);
      const tens = Math.floor((cost % 100) / 10);
      const ones = cost % 10;

      return (
        `${tenThousands}만` +
        (thousands > 0 ? ` ${thousands}천` : "") +
        (hundreds > 0 ? ` ${hundreds}백` : "") +
        (tens > 0 ? ` ${tens}십` : "") +
        (ones > 0 ? ` ${ones}원` : "원")
      );
    }
    return cost.toLocaleString() + "원";
  }

  // 작성 날짜 포맷팅
  function formatWriteDate(writeDate) {
    const writeDateTime = new Date(writeDate).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - writeDateTime) / 1000);

    if (diffInSeconds < 60) {
      // 1분 미만
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      // 1시간 미만
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      // 1일 미만
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else if (diffInSeconds < 2592000) {
      // 30일 미만
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    } else {
      // 30일 이상인 경우 실제 작성 날짜 반환
      return new Date(writeDate).toLocaleDateString();
    }
  }

  // 주소 뒷자리 포맷팅
  function filterAddress(address) {
    const indexOfParenthesis = address.indexOf("");
    if (indexOfParenthesis !== -1) {
      return address.substring(0, indexOfParenthesis).trim();
    }
    return address;
  }

  return (
    <div
      ref={info_scroll}
      className={style.info_main}
      onScroll={() => handleScroll(info_scroll.current)}
    >
      {markerInfo && (
        <div>
          {/* 정보 표기 구역*/}

          <div>
            {/* 드래그 이벤트에 의한 최상단 박스 (구현 못함 현재 display:none 상태임)*/}
            {isVisible_drag ? null : (
              <div className={style.address_box} style={{ display: "block" }}>
                <div onClick={() => back()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 text-gray-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                {/*주소*/}
                {markerInfo.address2}
              </div>
            )}

            {/* 드래그 이벤트에 의한 최상단 박스 끝*/}

            {/* 슬라이드 쇼*/}
            <div className={style.info_img}>
              <div className={style.info_img_top} onClick={() => back()}>
                <img src={backImg}></img>
              </div>

              <div>
                {" "}
                <ItemsCarousel
                  requestToChangeActive={setActiveItemIndex}
                  activeItemIndex={activeItemIndex}
                  numberOfCards={1}
                  gutter={10}
                  leftChevron={
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "25px",
                        border: "none",
                        fontWeight: "bold",
                        textShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
                        transform: "scaleX(1.1)",
                        marginRight: "7px",
                      }}
                    >
                      {"<"}
                    </button>
                  }
                  rightChevron={
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "none",
                        fontSize: "25px",
                        fontWeight: "bold",
                        textShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
                        transform: "scaleX(1.1)",
                        marginLeft: "7px",
                      }}
                    >
                      {">"}
                    </button>
                  }
                  outsideChevron={false}
                  chevronWidth={chevronWidth}
                >
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      style={{ height: "300px", background: "#EEE" }}
                    >
                      <img
                        src={url}
                        alt={`Item ${index}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ))}
                </ItemsCarousel>
              </div>
            </div>

            {/* box_1 */}
            <div className={style.info_title}>
              <div className={style.info_title_top}>
                <div className={style.info_idx}>
                  등록번호 {/*등록번호 넣기*/}
                  {markerInfo.estateId}
                </div>
                <div className={style.info_day}>
                  {/*몇일 전 넣기*/}
                  {formatWriteDate(markerInfo.writeDate)}
                </div>
              </div>

              <div className={style.info_address}>
                {/*주소*/}
                {markerInfo.address2}
              </div>
              {/* 월세*/}
              <div className={style.info_cost}>
                {markerInfo.transaction.transactionType}{" "}
                {markerInfo.deposit === 0
                  ? `${formatPrice(markerInfo.price)}`
                  : `${formatPrice(markerInfo.deposit)} / ${formatPrice(
                      markerInfo.price
                    )}`}
              </div>
              <div className={style.info_maintenance_cost}>
                {/*관리비*/}{" "}
                {markerInfo.maintenanceCost === 0
                  ? "관리비 없음"
                  : `관리비 ${formatMaintenanceCost(
                      markerInfo.maintenanceCost
                    )}`}
              </div>
            </div>

            {/* box_2 */}
            <div className={style.info_subbox}>
              <div style={{ margin: "10px 0 0 0" }}>{markerInfo.title}</div>
              {/* 몇 평인지*/}
              <div className={style.subbox_bold}>
                <span>icon</span>전용 {markerInfo.area}평
              </div>
              {/* 집 타입*/}
              <div className={style.subbox_bold}>
                <span>icon</span>
                {markerInfo.structure.structureType}
              </div>
              {/* 집 주차 여부*/}
              <div>
                <span>icon</span>
                {markerInfo.optionList &&
                markerInfo.optionList.length > 0 &&
                markerInfo.optionList.some(
                  (option) => option.optionTitle.optionName === "주차장"
                )
                  ? "주차 가능"
                  : "주차 불가능"}
              </div>
              {/* 층수 정보 */}
              <div>
                <span>icon</span>
                {markerInfo.roomFloors === -1
                  ? "반지하"
                  : markerInfo.roomFloors === 0
                  ? "옥탑방"
                  : `${markerInfo.roomFloors}층 / ${markerInfo.buildingFloors}층`}
              </div>
              {/* 단기 가능 정보 */}
              <div>
                <span>icon</span>
                {markerInfo.optionList &&
                markerInfo.optionList.length > 0 &&
                markerInfo.optionList.some(
                  (option) => option.optionTitle.optionName === "단기가능"
                )
                  ? "단기 임대 가능"
                  : "단기 임대 불가능"}
              </div>
              <div onClick={toggleVisibility} className={style.more_info}>
                더보기
              </div>{" "}
              {/* 여기서 더보기 옆에서 > 뺌*/}
            </div>

            {/* box_2 더보기 창 */}

            {/* 조건에 따라 display: none을 적용하려면 삼항 연산자를 사용합니다. */}
            {isVisible ? null : (
              <div className={style.more_info_box} style={{ display: "block" }}>
                <div className={style.more_info_box_top}>
                  <div onClick={toggleVisibility}>
                    {" "}
                    {/* 뒤로가기 아이콘 넣을것 */}X{" "}
                  </div>
                  매물 정보
                </div>

                {/* 평수 */}
                <div className={style.more_div_bold}>
                  <span>icon</span>전용 {markerInfo.area}평
                </div>

                {/* 건물 구조 */}
                <div className={style.more_div_bold}>
                  <span>icon</span>
                  {markerInfo.structure.structureType}
                </div>

                {/* 주차 가능 여부 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "주차장"
                  )
                    ? "주차 가능"
                    : "주차 불가능"}
                </div>

                {/* 층수 여부 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.roomFloors === -1
                    ? "반지하"
                    : markerInfo.roomFloors === 0
                    ? "옥탑방"
                    : `${markerInfo.roomFloors}층 / ${markerInfo.buildingFloors}층`}
                </div>

                {/* 단기 임대 여부 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "단기가능"
                  )
                    ? "단기 임대 가능"
                    : "단기 임대 불가능"}
                </div>

                {/* 단기 임대 여부 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "엘리베이터"
                  )
                    ? "엘리베이터 있음"
                    : "엘리베이터 없음"}
                </div>

                {/* 건물 구조 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.building.buildingType}
                </div>

                {/* 난방 구조 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {markerInfo.heatingSystem.heatingType}
                </div>

                {/* 주소 */}
                <div className={style.more_div}>
                  <span>icon</span>
                  {filterAddress(markerInfo.address1)}
                </div>

                {/* 등록번호 */}
                <div className={style.more_div}>
                  <span>icon</span>등록번호 {markerInfo.estateId}
                </div>

                <div onClick={toggleVisibility} className={style.close_btn}>
                  확인
                </div>
              </div>
            )}

            {/* box_3*/}
            {/*  
        <div className={style.info_maintenancebox}>
          <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
            관리비 9만원
          </div>
          <div style={{ margin: "15px 0 0 0" }}>포함 : 수도, 인터넷, TV</div>
          <div>별도 : 전기세, 가스, 난방비</div>
        </div>
        */}

            {/* box_4 */}
            <div className={style.info_optionbox}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                옵션 정보
              </div>
              <div className={style.info_optiontable_parent}>
                <div className={style.info_optiontable}>
                  {markerInfo.optionList &&
                  markerInfo.optionList.filter(
                    (option) =>
                      option.optionTitle.optionName !== "주차장" &&
                      option.optionTitle.optionName !== "엘리베이터"
                  ).length > 0 ? (
                    markerInfo.optionList
                      .filter(
                        (option) =>
                          option.optionTitle.optionName !== "주차장" &&
                          option.optionTitle.optionName !== "엘리베이터"
                      )
                      .slice(0, 4)
                      .map((option, index) => (
                        <div key={index} className={style.option_box}>
                          <div>
                            {option.optionTitle.optionName === "에어컨" && (
                              <img src="에어컨이미지경로" alt="에어컨" />
                            )}
                            {option.optionTitle.optionName === "세탁기" && (
                              <img src="세탁기이미지경로" alt="세탁기" />
                            )}
                            {option.optionTitle.optionName === "침대" && (
                              <img src="침대이미지경로" alt="침대" />
                            )}
                            {option.optionTitle.optionName === "책상" && (
                              <img src="책상이미지경로" alt="책상" />
                            )}
                            {option.optionTitle.optionName === "옷장" && (
                              <img src="옷장이미지경로" alt="옷장" />
                            )}
                            {option.optionTitle.optionName === "TV" && (
                              <img src="TV이미지경로" alt="TV" />
                            )}
                          </div>
                          <div>{option.optionTitle.optionName}</div>
                        </div>
                      ))
                  ) : (
                    <div>옵션 정보가 없습니다.</div>
                  )}
                </div>
              </div>

              <div className={style.option_more_info_parent}>
                {markerInfo.optionList.filter(
                  (option) =>
                    option.optionTitle.optionName !== "주차장" &&
                    option.optionTitle.optionName !== "엘리베이터"
                ).length > 4 && (
                  <div
                    className={style.option_more_info}
                    onClick={toggleVisibility_more}
                  >
                    {`${
                      markerInfo.optionList.filter(
                        (option) =>
                          option.optionTitle.optionName !== "주차장" &&
                          option.optionTitle.optionName !== "엘리베이터"
                      ).length
                    }개 모두 보기`}
                  </div>
                )}
              </div>
            </div>

            {/* box_4 모두보기 창 */}

            {/* 조건에 따라 display: none을 적용하려면 삼항 연산자를 사용합니다. */}
            {isVisible_more ? null : (
              <div className={style.more_info_box} style={{ display: "block" }}>
                <div className={style.more_info_box_top}>
                  <div onClick={toggleVisibility_more}>
                    {" "}
                    {/* 뒤로가기 아이콘 넣을겅 */}X{" "}
                  </div>
                  옵션 정보
                </div>

                <div className={style.more_div}>
                  <span>icon</span>싱크대
                </div>
                <div className={style.more_div}>
                  <span>icon</span>싱크대
                </div>
                <div className={style.more_div}>
                  <span>icon</span>싱크대
                </div>
                <div className={style.more_div}>
                  <span>icon</span>싱크대
                </div>

                <div
                  onClick={toggleVisibility_more}
                  className={style.close_btn}
                >
                  확인
                </div>
              </div>
            )}

            {/* box_5 */}
            <div className={style.info_detail}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                상세 설명
              </div>

              <div style={{ margin: "15px 0 15px 0" }}>
                {markerInfo.contents}
              </div>
            </div>

            {/* box_6 */}
            <div className={style.info_location}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                위치
              </div>

              <div style={{ margin: "20px 0 0 0" }}>
                {/*주소*/}
                {markerInfo.address2}
              </div>
              <div className={style.info_map} id="map"></div>
            </div>

            {/* box_7 */}
            <div className={style.seller_box}>
              <div className={style.seller_info}>
                <div className={style.seller_img}>
                  <img
                    src={proExam}
                    style={{ width: "100%", borderRadius: "50%" }}
                  ></img>
                </div>
                <div className={style.seller_title}>
                  <div>
                    {markerInfo.realEstateAgent.manners_temperature >= 45 ? (
                      <span className={style.recommend}>
                        <b>추천</b>
                      </span>
                    ) : (
                      ""
                    )}

                    <span className={style.grade}>
                      {markerInfo.realEstateAgent.manners_temperature}도
                    </span>
                  </div>
                  <b>{markerInfo.realEstateAgent.estateName}</b>
                </div>
              </div>
              {markerInfo.realEstateAgent.manners_temperature >= 45 ? (
                <div className={style.safe_seller}>추천중개사</div>
              ) : (
                ""
              )}
              {markerInfo.realEstateAgent.manners_temperature >= 45 ? (
                <div className={style.seller_box_1}>
                  <div>
                    <img src={medal} style={{ height: "100%" }}></img>
                  </div>
                  <div style={{ paddingLeft: "15px" }}>
                    {markerInfo.realEstateAgent.estateName}는 매너 온도가 높은
                    추천 중개사입니다.
                  </div>
                </div>
              ) : (
                ""
              )}
              {markerInfo.realEstateAgent.manners_temperature >= 45 ? (
                <div className={style.seller_best}>추천중개사란?</div>
              ) : (
                ""
              )}
              <div className={style.seller_box_2}>
                <div>
                  <img src={textFile} style={{ height: "100%" }}></img>
                </div>
                <div style={{ paddingLeft: "15px" }}>안녕 나 김은총이다.</div>
              </div>
              <div className={style.more_info}>더보기</div>{" "}
              {/* 여기서 더보기 옆에서 > 뺌*/}
            </div>

            {/* box_8 */}
            <div className={style.seller_slide_box}>
              <div
                style={{ margin: "10px 0 0 0" }}
                className={style.bold_text_small}
              >
                <b>중개사무소의 다른 집</b>
              </div>
              <div className={style.slide_frame}>
                {/* <div className={style.slide_item_box}>
              <div>사진</div>
              <div>
                <span className={style.bold_text_small}>월세 300/28</span>
                <span>천안시 서북구 쌍용동</span>
                <span style={{ color: "#808080" }}>원룸-분리형원룸</span>
              </div>
            </div> */}

                <ItemsCarousel
                  requestToChangeActive={setActiveItemIndex}
                  activeItemIndex={activeItemIndex}
                  numberOfCards={2}
                  gutter={130}
                  infiniteLoop={true}
                  leftChevron={
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        fontSize: "25px",
                        border: "none",
                        fontWeight: "bold",
                        textShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
                        transform: "scaleX(1.1)",
                        marginRight: "7px",
                      }}
                    >
                      {"<"}
                    </button>
                  }
                  rightChevron={
                    <button
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "none",
                        fontSize: "25px",
                        fontWeight: "bold",
                        textShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)",
                        transform: "scaleX(1.1)",
                        marginLeft: "7px",
                      }}
                    >
                      {">"}
                    </button>
                  }
                  outsideChevron={false}
                  chevronWidth={chevronWidth}
                >
                  {estateListLimit.map((estate, index) => (
                    <div
                      key={estate.id}
                      className={style.slide_item_box}
                      onClick={() => handleCarouselItemClick(estate)}
                    >
                      <div>
                        <img
                          src={imageUrlsEstateLimit[index]}
                          alt={`Property ${index}`}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                      <div>
                        <span className={style.bold_text_small}>
                          {estate.transaction &&
                            `${estate.transaction.transactionType} ${
                              estate.deposit === 0
                                ? estate.price
                                : `${formatPrice(
                                    estate.deposit
                                  )} / ${formatPrice(estate.price)}`
                            }`}
                        </span>
                        <span>{estate.address2}</span>
                        <span>
                          {estate.room &&
                            `${estate.room.roomType} · ${estate.structure.structureType}`}
                        </span>
                        <span style={{ color: "#808080" }}>
                          {/* 부동산 유형 */}
                        </span>
                      </div>
                    </div>
                  ))}
                </ItemsCarousel>
              </div>
              <div className={style.more_info}>더보기</div>{" "}
              {/* 여기서 더보기 옆에서 > 뺌*/}
            </div>

            {/*리뷰*/}
            <div>
              {review.map((e, i) => (
                <div style={{ border: "1px solid black" }} key={i}>
                  <div>{e.id}</div>
                  <div>
                    <div>교통</div>
                    <div>{e.traffic}</div>
                    <div>주변 환경</div>
                    <div>{e.surroundings}</div>
                    <div>시설</div>
                    <div>{e.facility}</div>
                  </div>
                  <div>
                    <div>사진</div>
                    {e.files.map((e, i) => (
                      <div>
                        <img
                          alt="..."
                          style={{ width: "30px" }}
                          src={`/uploads/review/${e.sysName}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        delReview(e.seq);
                      }}
                    >
                      삭제
                    </button>
                    <Link to="/review/editReview" state={{ seq: e.seq }}>
                      <button>수정</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* 맨 하단 문의하기 구역만큼 밀어서 공간확보 */}
            <div style={{ height: "70px" }}></div>
          </div>

          {/* 문의하기 구역*/}
          <div className={style.bottom_box}>
            {/*월세*/}
            {markerInfo.transaction.transactionType}{" "}
            {markerInfo.deposit === 0
              ? `${formatPrice(markerInfo.price)}`
              : `${formatPrice(markerInfo.deposit)} / ${formatPrice(
                  markerInfo.price
                )}`}
            <div className={style.bottom_btn} onClick={toggle}>
              문의하기
            </div>
            <div>
              <Modal isOpen={modal} toggle={toggle} {...args}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                  {loginId === null ? "로그인 후 이용해 주세요." : "안녕하세요"}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={toggle}>
                    Do Something
                  </Button>{" "}
                  <Button color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
            </div>
          </div>
          {/* <h2>{markerInfo.title}</h2>
      <p>위도: {markerInfo.lat}</p>
      <p>경도: {markerInfo.lng}</p> */}

          <div></div>
        </div>
      )}
    </div>
  );
}

export default Info;
