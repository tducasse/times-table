import { useEffect, useState } from "react";

const App = () => {
  const [number, setNumber] = useState(10);
  const [max, setMax] = useState(10);
  const [maxRight, setMaxRight] = useState(10);
  const [time, setTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [sign, setSign] = useState("multiplication");
  const [operations, setOperations] = useState(
    getOperations(max, number, sign, maxRight)
  );

  useEffect(() => {
    setOperations(getOperations(max, number, sign, maxRight));
  }, [sign, max, number, maxRight]);

  const startGame = () => setStep(1);

  const stopGame = () => setStep(2);

  const back = () => {
    setScore(0);
    setStep(0);
    setErrors(0);
  };

  return (
    <>
      {step === 0 && (
        <Setup
          max={max}
          number={number}
          setNumber={setNumber}
          setMax={setMax}
          startGame={startGame}
          time={time}
          setTime={setTime}
          sign={sign}
          setSign={setSign}
          setMaxRight={setMaxRight}
          maxRight={maxRight}
        />
      )}
      {step === 1 && (
        <Game
          setTimeLeft={setTimeLeft}
          timeLeft={timeLeft}
          sign={sign}
          number={number}
          time={time}
          stopGame={stopGame}
          score={score}
          setScore={setScore}
          errors={errors}
          setErrors={setErrors}
          setOperations={setOperations}
          operations={operations}
        />
      )}
      {step === 2 && (
        <Results
          timeSpent={time - timeLeft}
          number={number}
          score={score}
          back={back}
          errors={errors}
          sign={sign}
          operations={operations}
        />
      )}
    </>
  );
};

const Setup = ({
  max,
  number,
  setMax,
  setNumber,
  startGame,
  setTime,
  time,
  sign,
  setSign,
  maxRight,
  setMaxRight,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    startGame();
  };
  return (
    <form onSubmit={onSubmit}>
      <center>
        <label>Max number</label>
        <input
          type="number"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
        <label>Max for the second number</label>
        <input
          type="number"
          value={maxRight}
          onChange={(e) => setMaxRight(e.target.value)}
        />

        <label>Number of questions</label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <label>Time in seconds</label>
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <label>Operation</label>
        <select
          type="number"
          value={sign}
          onChange={(e) => setSign(e.target.value)}
        >
          <option value="multiplication">Multiplication</option>
          <option value="division">Division</option>
          <option value="addition">Addition</option>
          <option value="subtraction">Subtraction</option>
          <option value="simplify">Simplify fraction</option>
          <option value="fracadd">Add fraction</option>
        </select>

        <button type="submit">Start game</button>
      </center>
    </form>
  );
};

const getNumber = (max) => {
  const rand = Math.round(0.5 + Math.random() * max);
  return rand === 1 ? 2 : rand;
};

const symbols = {
  addition: "+",
  subtraction: "-",
  multiplication: "x",
  division: "/",
  simplify: "/",
};

const getResult = (first, second, sign) => {
  switch (sign) {
    case "addition":
      return first + second;
    case "subtraction":
      return first - second;
    case "multiplication":
      return first * second;
    case "division":
      const quotient = Math.floor(first / second);
      const remainder = first % second;
      return `q: ${quotient}, r: ${remainder}`;
    default:
      return 0;
  }
};

const getOperation = (max, sign, maxRight) => {
  let first = getNumber(max);
  let second = getNumber(maxRight);
  switch (sign) {
    case "addition":
      second = getNumber(max);
      if (first < second) {
        [first, second] = [second, first];
      }
      break;
    case "subtraction":
      second = getNumber(first - 1);
      break;
    case "division":
      if (second > first) {
        second = getNumber(first - 1);
      }
      break;
    case "multiplication":
      if (first < second) {
        [first, second] = [second, first];
      }
      break;
    default:
      break;
  }

  return {
    result: String(getResult(first, second, sign)),
    first,
    second,
    question: `${first} ${symbols[sign]} ${second}`,
  };
};

const getOperations = (max, number, sign, maxRight) => {
  const operations = [];
  for (let i = 0; i < number; i++) {
    operations.push(getOperation(max, sign, maxRight));
  }
  return operations;
};

const isCorrect = (result, answer, sign) => {
  if (sign === "division") {
    return result === `q: ${answer.quotient}, r: ${answer.remainder}`;
  }
  return result === answer;
};

const Game = ({
  number,
  time,
  setScore,
  score,
  stopGame,
  errors,
  setErrors,
  operations,
  sign,
  timeLeft,
  setTimeLeft,
}) => {
  const [count, setCount] = useState(1);

  const onAnswer = (answer) => {
    if (answer === "" || (sign === "division" && answer.quotient === ""))
      return;
    const operation = operations[count - 1];
    if (isCorrect(operation.result, answer, sign)) {
      setScore(score + 1);
    } else {
      operation.error = true;
      operation.answer =
        sign === "division"
          ? `q: ${answer.quotient}, r: ${answer.remainder}`
          : answer;
      setErrors(errors + 1);
    }
    if (count < operations.length) {
      setCount(count + 1);
    } else {
      stopGame();
    }
  };

  return (
    <Question
      setTimeLeft={setTimeLeft}
      timeLeft={timeLeft}
      sign={sign}
      question={operations[count - 1].question}
      onAnswer={onAnswer}
      score={score}
      number={number}
      time={time}
      stopGame={stopGame}
    />
  );
};

const Score = ({ score, total }) => (
  <h2>
    Score: {score} / {total}
  </h2>
);

const Question = ({
  question,
  onAnswer,
  score,
  number,
  time,
  stopGame,
  sign,
  timeLeft,
  setTimeLeft,
}) => {
  const [answer, setAnswer] = useState(
    sign === "division" ? { quotient: "", remainder: "" } : ""
  );

  const onChange = (e) => setAnswer(e.target.value);
  const onChangeRemainder = (e) =>
    setAnswer({ ...answer, remainder: e.target.value });
  const onChangeQuotient = (e) =>
    setAnswer({ ...answer, quotient: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    onAnswer(answer);
    setAnswer(sign === "division" ? { quotient: "", remainder: "" } : "");
  };

  return (
    <form onSubmit={onSubmit}>
      <center>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Timer
            time={time}
            stopGame={stopGame}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
          />
          <Score score={score} total={number} />
        </div>
        <label>
          <h1>{question}</h1>
        </label>
        {sign !== "division" && (
          <input type="number" value={answer} onChange={onChange} />
        )}
        {sign === "division" && (
          <>
            <label>quotient</label>
            <input
              type="number"
              value={answer.quotient}
              onChange={onChangeQuotient}
            />
            <label>remainder</label>
            <input
              type="number"
              value={answer.remainder}
              onChange={onChangeRemainder}
            />
          </>
        )}
        <button
          type="submit"
          disabled={
            sign === "division"
              ? answer.quotient === "" || answer.remainder === ""
              : answer === ""
          }
          style={{ marginTop: 36 }}
        >
          Answer
        </button>
      </center>
    </form>
  );
};

const Results = ({
  number,
  score,
  errors,
  back,
  sign,
  operations,
  timeSpent,
}) => (
  <center>
    <h4>Number of questions: {number}</h4>
    <h4>Score: {score}</h4>
    <h4>Mistakes: {errors}</h4>
    <h4>Missed: {number - (score + errors)}</h4>
    <h4>Time spent: {timeSpent}s</h4>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {operations.map(
        ({ first, second, question, result, error, answer }, index) => (
          <div key={question + index}>
            <Result
              first={first}
              error={error}
              second={second}
              answer={answer}
              result={result}
              sign={sign}
            />
          </div>
        )
      )}
    </div>
    <button onClick={back}>Back</button>
  </center>
);

const Result = ({ first, second, result, sign, error, answer }) => (
  <div style={{ display: "flex", flexDirection: "column", maxWidth: 250 }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 3,
        backgroundColor: error ? "#e75959" : "#20c973",
        borderRadius: 10,
        margin: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <h3>{first}</h3>
        <h4>{symbols[sign]}</h4>
        <h3>{second}</h3>
        <h4>=</h4>
        <h3>{result}</h3>
      </div>
      {error && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: "-1.5em",
          }}
        >
          <h4>You answered: {answer}</h4>
        </div>
      )}
    </div>
  </div>
);

const Timer = ({ time, stopGame, timeLeft, setTimeLeft }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearTimeout(timer);
      stopGame();
    }
    return () => clearTimeout(timer);
  }, [setTimeLeft, stopGame, time, timeLeft]);

  return (
    <center>
      <h3>Time: {timeLeft}</h3>
    </center>
  );
};

export default App;
