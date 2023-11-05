import { createContext, useContext, useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./assets/images/logo/logo.png";
import loadedQuestion from "./loadQuestion";
import imgResBlue from "./assets/images/results/ipwblue.png";
import imgResGold from "./assets/images/results/ipwgold.png";
import imgResGreen from "./assets/images/results/ipwgreen.png";
import imgResOrange from "./assets/images/results/ipworange.png";

const API_KEY = "AIzaSyD9nH36p5WN-gA4cjLZRouVhUp5bZ12UlU";
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";

var dummyData = [
  {
    question: "Saya amat selesa dengan pengekalan cara hidup tradisi.",
    isTrue: false,
    isShow: false,
  },
];

const AppContext = createContext();
function App() {
  const [curQuestion, setCurQuestion] = useState(0);
  const [questions, setQuestion] = useState(dummyData);
  const [viewResult, setViewResult] = useState(false);
  const [results, setResults] = useState({
    gold: 0,
    green: 0,
    blue: 0,
    orange: 0,
  });

  useEffect(() => {
    setQuestion(loadedQuestion);
  }, []);

  const handleNextQuestion = () => {
    setCurQuestion((curQuestion) => {
      if (curQuestion + 1 === questions.length) return curQuestion;
      else {
        setQuestion((questions) => {
          let newQues = questions;
          newQues[curQuestion].isShow = false;
          newQues[curQuestion + 1].isShow = true;
          return newQues;
        });

        return curQuestion + 1;
      }
    });
  };

  const handlePrevQuestion = () => {
    setCurQuestion((curQuestion) => {
      console.log(curQuestion);
      if (curQuestion - 1 < 0) return curQuestion;
      else {
        setQuestion((questions) => {
          let newQues = questions;
          newQues[curQuestion].isShow = false;
          newQues[curQuestion - 1].isShow = true;
          return newQues;
        });

        return curQuestion - 1;
      }
    });
  };

  const handleCalculateAnswer = () => {
    // 0 - gold
    // 1 - green
    // 2 - blue
    // 3 - orange

    let resArr = [0, 0, 0, 0];

    questions.forEach((data, index) => {
      let { isTrue } = data;
      if (isTrue) resArr[Math.floor(index / 25)]++;
    });

    setResults({
      ...results,
      gold: resArr[0],
      green: resArr[1],
      blue: resArr[2],
      orange: resArr[3],
    });
    setViewResult(true);
  };

  return (
    <AppContext.Provider
      value={{
        setQuestion,
        handleNextQuestion,
        questions,
        results,
      }}
    >
      <div className="wrapper position-relative">
        <div className="container-fluid">
          <InstructionModal></InstructionModal>
          <div className="logo_area px-auto ps-md-5 py-auto my-4">
            <a href="index.html">
              <img
                src={logo}
                alt="image_not_found"
                style={{ width: "350px" }}
              />
            </a>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {viewResult ? (
              <QuizResult></QuizResult>
            ) : (
              <div className="col-11 col-md-8 m-auto">
                <form className="multisteps_form">
                  {questions.map((data, index) => {
                    let { question, isTrue, isShow } = data;

                    return isShow ? (
                      <QuizFunction
                        key={`q${index}`}
                        question={question}
                        isTrue={isTrue}
                        questionNo={index}
                        questionLength={questions.length}
                      ></QuizFunction>
                    ) : (
                      ""
                    );
                  })}

                  <div className="mx-auto d-flex form-content p-0 m-0 mt-5 control-button-container">
                    <button
                      type="button"
                      className="f_btn prev_btn border-0 text-white mx-auto"
                      id="prevBtn"
                      onClick={() => {
                        handlePrevQuestion();
                      }}
                    >
                      Soalan Sebelum
                    </button>

                    {curQuestion !== questions.length - 1 ? (
                      <button
                        type="button"
                        className="f_btn next_btn border-0 text-white mx-auto"
                        id="nextBtn"
                        onClick={() => {
                          handleNextQuestion();
                        }}
                      >
                        Soalan Seterusnya
                      </button>
                    ) : (
                      ""
                    )}

                    {curQuestion === questions.length - 1 ? (
                      <button
                        type="button"
                        className="f_btn submit_btn border-0 text-white mx-auto"
                        id="nextBtn"
                        onClick={() => {
                          handleCalculateAnswer();
                        }}
                      >
                        Personaliti saya
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

const QuizFunction = ({ question, isTrue, questionNo, questionLength }) => {
  let { setQuestion, handleNextQuestion } = useContext(AppContext);

  return (
    <div className="multisteps_form_panel step active pb-3">
      <div className="form_content position-relative mt-5">
        <div className="content_box bg-white mt-1 mx-auto d-flex position-relative flex-wrap">
          <div className="container-fluid d-flex">
            <div className="progress my-auto mx-auto" style={{ width: "80%" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${questionNo + 1}%` }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <h5 className="my-auto text-primary px-1">
              {" "}
              {`${questionNo + 1}/${questionLength}`}
            </h5>
          </div>

          <div className="my-auto">
            <div
              className="question_title text-center text-md-start ms-0 ps-md-5 pt-5"
              style={{ overflow: "hidden" }}
            >
              <h6 className="px-3 animate__animated animate__fadeInDown animate_50ms ">
                {questionNo + 1}. {question}
              </h6>
            </div>
            <div className="form_items pt-4 d-flex mt-5 justify-content-around">
              <label
                htmlFor={`q${questionNo}1`}
                className={
                  `position-relative animate__animated animate__fadeInDown animate_50ms ` +
                  (isTrue ? "active" : "")
                }
                style={{ width: "fit-content" }}
              >
                Ya
                <input
                  id={`q${questionNo}1`}
                  name={`q${questionNo}1`}
                  type="radio"
                  value="true"
                  onClick={() => {
                    setQuestion((questions) => {
                      let newQuestionsState = [...questions];
                      newQuestionsState[questionNo].isTrue = true;
                      return newQuestionsState;
                    });
                    setTimeout(handleNextQuestion, 200);
                  }}
                />
              </label>
              <label
                htmlFor={`q${questionNo}2`}
                className={
                  `position-relative animate__animated animate__fadeInDown animate_50ms ` +
                  (isTrue ? "" : "active")
                }
                style={{ width: "fit-content" }}
              >
                Tidak
                <input
                  id={`q${questionNo}2`}
                  name={`q${questionNo}2`}
                  type="radio"
                  value="false"
                  onClick={() => {
                    setQuestion((questions) => {
                      let newQuestionsState = [...questions];
                      newQuestionsState[questionNo].isTrue = false;
                      return newQuestionsState;
                    });
                    setTimeout(handleNextQuestion, 200);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizResult = () => {
  const { results, questions } = useContext(AppContext);
  const inputName = useRef();
  const inputEmail = useRef();
  const inputPhone = useRef();

  let { gold, green, blue, orange } = results;
  let resTranslateMap = {
    gold: "EMAS",
    green: "HIJAU",
    blue: "BIRU",
    orange: "OREN",
  };

  // async function saveObjectToTxtFile(obj) {
  //   const data = JSON.stringify(obj, null, 2);

  //   const textData = data;

  //   // Create an XMLHttpRequest object
  //   const xhr = new XMLHttpRequest();

  //   // Configure the request
  //   xhr.open("POST", "your_server_endpoint_url", true);
  //   xhr.setRequestHeader("Content-Type", "application/json"); // Set appropriate content type

  //   // Set up the event handler for when the request is complete
  //   xhr.onreadystatechange = function () {
  //     if (xhr.readyState === 4 && xhr.status === 200) {
  //       // Handle the response from the server
  //       resultDiv.innerHTML = xhr.responseText;
  //     }
  //   };

  //   // Send the data to the server
  //   xhr.send(JSON.stringify({ text: textData }));
  // }

  //const newData = [['New Value 1', 'New Value 2']];

  useEffect(() => {}, []);

  const handleForm = (e) => {
    e.preventDefault();
    let dateObj = new Date();

    let date = `${dateObj.getMonth()}/${dateObj.getDate()}/${dateObj.getFullYear()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
    let email = inputEmail.current.value;
    let name = inputName.current.value;
    let phone = inputPhone.current.value;

    let sentData = [[date, email, name, phone, gold, green, blue, orange]];

    questions.forEach((ques) => {
      if (ques.isTrue) sentData[0].push("Ya");
      else sentData[0].push("Tidak");
    });
    // // to Local txt file
    // saveObjectToTxtFile(sentData);

    // to google API
    document.sendDataToSheet(sentData);
  };

  const renderResult = (resList) => {
    let maxValue = Math.max(...resList);
    let resTextList = [];
    for (let color in results) {
      if (results[color] === maxValue) resTextList.push(resTranslateMap[color]);
    }

    return (
      <p>
        {" "}
        {resTextList.map((color) => {
          return `${color} `;
        })}{" "}
      </p>
    );
  };

  return (
    <div className="col-11 m-auto">
      <div className="content_box bg-white mx-auto container-fluid py-2">
        <h2 className="text-center my-3">
          PERSONALITI ANDA CENDERUNG:{" "}
          {renderResult([gold, green, blue, orange])}{" "}
          <button
            type="button"
            className="btn btn-primary btn-lg my-5 mx-auto"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Muat Turun Dan Hantar
          </button>
        </h2>

        <div className="container-fluid position-relative p-0">
          <p className="position-absolute result_mark">( {gold} )</p>
          <img src={imgResGold} alt="resgold" className="img-fluid"></img>
        </div>

        <div className="container-fluid position-relative p-0">
          <p className="position-absolute result_mark">( {blue} )</p>
          <img src={imgResBlue} alt="resblue" className="img-fluid"></img>
        </div>

        <div className="container-fluid position-relative p-0">
          <p className="position-absolute result_mark">( {green} )</p>
          <img src={imgResGreen} alt="resgreen" className="img-fluid"></img>
        </div>

        <div className="container-fluid position-relative p-0">
          <p className="position-absolute result_mark">( {orange} )</p>
          <img src={imgResOrange} alt="resorange" className="img-fluid"></img>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {" "}
              <form
                className="my-5"
                onSubmit={(e) => {
                  handleForm(e);
                }}
              >
                <div className="input-group my-2">
                  <input
                    ref={inputName}
                    name="name"
                    type="text"
                    className="form-control py-3"
                    placeholder="Nama"
                  ></input>
                </div>
                <div className="input-group my-2">
                  <input
                    ref={inputEmail}
                    name="email"
                    type="email"
                    className="form-control py-3"
                    placeholder="Email"
                  ></input>
                </div>
                <div className="input-group my-2">
                  <input
                    ref={inputPhone}
                    name="phoneno"
                    type="phone"
                    className="form-control py-3"
                    placeholder="Phone No"
                  ></input>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Muat Turun dan Hantar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstructionModal = () => {
  let Modalbtn = useRef();

  useEffect(() => {
    Modalbtn.current.click();
  }, []);

  return (
    <>
      <button
        ref={Modalbtn}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#instructionModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="instructionModal"
        tabindex="-1"
        aria-labelledby="instructionModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mx-auto" id="instructionModalLabel">
                ARAHAN CARA MENJAWAB
              </h5>
            </div>
            <div className="modal-body">
              <h2>
                Online Quiz ini mempunyai 100 Soalan. Sila pilih (YA) sekiranya
                anda merasakan item berkenaan selesa atau bersesuaian atau
                bertepatan dengan diri anda dan pilih (TIDAK) jika sebaliknya.
              </h2>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary mx-auto"
                data-bs-dismiss="modal"
              >
                Mula Menjawab
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
