import { useEffect, useState } from "react";

const App = () => {
  const [number, setNumber] = useState(10);
  const [max, setMax] = useState(10);
  const [time, setTime] = useState(60);
  const [score, setScore] = useState(0);
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState([])
  const [sign, setSign] = useState('multiplication')

  const startGame = () => setStep(1)

  const stopGame = () => setStep(2)

  const back = () => {
    setScore(0);
    setStep(0)
    setErrors([])
  }

  return <>
    {step === 0 && <Setup max={max} number={number} setNumber={setNumber} setMax={setMax} startGame={startGame} time={time} setTime={setTime} sign={sign} setSign={setSign} />}
    {step === 1 && <Game max={max} number={number} time={time} stopGame={stopGame} score={score} setScore={setScore} errors={errors} setErrors={setErrors} sign={sign} />}
    {step === 2 && <Results number={number} score={score} back={back} errors={errors} sign={sign} />}
  </>

}

const Setup = ({ max, number, setMax, setNumber, startGame, setTime, time, sign, setSign }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    startGame()
  }
  return (
    <form onSubmit={onSubmit}>
      <center>
        <label>Max table</label>
        <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />

        <label>Number of questions</label>
        <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />

        <label>Time in seconds</label>
        <input type="number" value={time} onChange={(e) => setTime(e.target.value)} />

        <label>Operation</label>
        <select type="number" value={sign} onChange={(e) => setSign(e.target.value)} >
          <option value="multiplication">Multiplication</option>
          <option value="addition">Addition</option>
          <option value="subtraction">Subtraction</option>
        </select>

        <button type="submit">Start game</button>
      </center>
    </form>
  )
}

const getNumber = (max) => Math.round(0.5 + Math.random() * max);

const symbols = {
  addition: "+",
  subtraction: "-",
  multiplication: "*"
}

const getResult = (first, second, sign) => {
  switch (sign) {
    case "addition":
      return first + second;
    case "subtraction":
      return first - second;
    case "multiplication":
      return first * second;
    default:
      return 0;
  }
}

const getOperation = (max, sign) => {
  const first = getNumber(max);
  const second = getNumber(10);
  return {
    result: String(getResult(first, second, sign)),
    first,
    second,
    question: `${first} ${symbols[sign]} ${second}`
  }
}

const getOperations = (max, number, sign) => {
  const operations = [];
  for (let i = 0; i < number; i++) {
    operations.push(getOperation(max, sign));
  }
  return operations;
}


const Game = ({ number, max, time, setScore, score, stopGame, errors, setErrors, sign }) => {
  const [count, setCount] = useState(1);
  const [operations] = useState(getOperations(max, number, sign));

  const onAnswer = (answer) => {
    if (answer === operations[count - 1].result) {
      setScore(score + 1);
    } else {
      setErrors([...errors, operations[count - 1]]);
    }
    if (count < operations.length) {
      setCount(count + 1);
    } else {
      stopGame()
    }
  }

  return <Question question={operations[count - 1].question} onAnswer={onAnswer} score={score} number={number} time={time} stopGame={stopGame} />
}

const Score = ({ score, total }) => <h2>Score: {score} / {total}</h2>

const Question = ({ question, onAnswer, score, number, time, stopGame }) => {
  const [answer, setAnswer] = useState("");

  const onChange = (e) => setAnswer(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    onAnswer(answer);
    setAnswer("");
  }

  return <form onSubmit={onSubmit}>
    <center>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Timer time={time} stopGame={stopGame} />
        <Score score={score} total={number} /></div>
      <label><h1>{question}</h1></label>
      <input type="number" value={answer} onChange={onChange} />
      <button type="submit" style={{ marginTop: 36 }}>Answer</button>
    </center>
  </form >
}

const Results = ({ number, score, errors, back, sign }) => <center>
  <h4>Number of questions: {number}</h4>
  <h4>Score: {score}</h4>
  <h4>Errors: {errors.length}</h4>
  <h4>Missed: {number - (score + errors.length)}</h4>
  {!!errors.length &&
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
      <h2>Mistakes:</h2>
      {errors.map(({ first, second, question, result }, index) => (
        <div key={question + index}>
          <Error first={first} second={second} result={result} sign={sign} />
        </div>
      ))}
    </div>
  }
  <button onClick={back}>Back</button>
</center>

const Error = ({ first, second, result, sign }) => <div style={{ display: "flex", flexDirection: "column", maxWidth: 250 }}>
  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", }}>
    <h3>{first}</h3><h4>{symbols[sign]}</h4><h3>{second}</h3><h4>=</h4><h3>{result}</h3>
  </div>
</div>

const Timer = ({ time, stopGame }) => {
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearTimeout(timer);
      stopGame()
    }
    return () => clearTimeout(timer);
  }, [stopGame, time, timeLeft])

  return <center><h3>Time: {timeLeft}</h3></center>
}

export default App;
