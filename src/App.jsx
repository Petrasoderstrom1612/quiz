import React from 'react'
import Intro from './components/Intro'
import BackgroundWrapper from './components/BackgroundWrapper'
import {decode} from 'html-entities';

function App() {
  const [startScreen, setStartScreen] = React.useState(false)
  const [questions, setQuestions] = React.useState(null)
  const [selectedAnswer, setSelectedAnswer] = React.useState(null)

  const startQuiz = () => {
    setStartScreen(prevStatus => !prevStatus)
  }
  console.log(startScreen)
  
  React.useEffect(()=>{
    const timeoutId = setTimeout(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
      setQuestions(data.results)
    })
    }, 2000);

    return () => clearTimeout(timeoutId);
  },[])
  console.log("questions",questions)
  
  const questionSection = questions
  ? questions.map(oneQuestion => {
    const correctAnswer = oneQuestion.correct_answer
    const wrongAnswers = oneQuestion.incorrect_answers
    const randomIndex = Math.floor(Math.random() * wrongAnswers.length + 1) // Pick a random index between 0 and arr.length as it will be 4 items in it
    const allAnswersArr = [...wrongAnswers.slice(0, randomIndex), correctAnswer, ...wrongAnswers.slice(randomIndex)] // ...-gather together| the first part to chop|item to insert|the other chopped part of the arr
    console.log("randomIndex",randomIndex)
    console.log("correctAnswer",correctAnswer)
    console.log("wrongAnswers",wrongAnswers)
    console.log("allAnswersArr",allAnswersArr)
    return (
    <div key={oneQuestion.question}>
      <h2>{decode(oneQuestion.question)}</h2>

      {allAnswersArr.map(oneAnswer => (
      <div key={oneAnswer} className="answer-wrapper">
        <input 
        type="radio" 
        id={oneAnswer}
        value={oneAnswer}
        name="answer"
        checked={selectedAnswer === oneAnswer}
        onChange={()=> setSelectedAnswer(oneAnswer)}
        className="hidden"
        />
        <button
        type="button"
        onClick={() => setSelectedAnswer(oneAnswer)}
        className={`answer-btn ${selectedAnswer === oneAnswer ? "selected" : ""}`}
        aria-pressed={selectedAnswer === oneAnswer}
        aria-labelledby={oneAnswer}
        >
        {decode(oneAnswer)}
        </button>
      </div>))}
    </div>
)})
  : null

  return (
    <main>
      <BackgroundWrapper/>
      {startScreen && (<Intro startQuiz={startQuiz}/>)}
      {!startScreen && (
        <>
        {questionSection}
        </>
      )}
    </main>
  )
}

export default App
