import React from 'react'
import Intro from './components/Intro'
import BackgroundWrapper from './components/BackgroundWrapper'
import {decode} from 'html-entities';
import { clsx } from 'clsx';

function App() {
  const [startScreen, setStartScreen] = React.useState(true)
  const [allAnswersSubmitted, setAllAnswersSubmitted] = React.useState(false)
  const [questions, setQuestions] = React.useState(null) //Gathering the entire API call
  const [answers, setAnswers] = React.useState({}) //to combine all 4 answer options
  const [userAnswers, setUserAnswers] = React.useState([])
  const [totalScore, setTotalScore] = React.useState(0) 

  const startQuiz = () => {
    setStartScreen(prevStatus => !prevStatus)
  }
  
  const combineAllAnswers = (correct, incorrect) => {
    const allAnswers = [...incorrect]
    const randomIndex = Math.floor(Math.random() * (incorrect.length + 1))
    allAnswers.splice(randomIndex,0, correct)
    return allAnswers
  }
  
  React.useEffect(()=>{
    const fetchData = async () => {
      const res = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
      const data = await res.json()
      
      const readyQuestions = data.results.map(question => ({
        ...question, allAnswers: combineAllAnswers(question.correct_answer, question.incorrect_answers)
      }))
      
      setQuestions(readyQuestions)
    }
    
    fetchData()
  },[])
  console.log("all data ready",questions)
  
  const questionSection = questions
  //MAPPING OVER QUESTIONS
  ? questions.map((oneQuestion, questionIndex) => { 
    const allAnswersArr = oneQuestion.allAnswers

    {/*MAPPING OVER QUESTIONS */}
    return (
      <div key={oneQuestion.question} className="question-block">
      <h2>{decode(oneQuestion.question)}</h2>

  {/*MAPPING OVER ANSWERS */}
      <div className="answers-btns-div">
      {allAnswersArr.map((oneAnswer, answerIndex) => (
        <div key={oneAnswer} className="answer-wrapper">
        <input 
        type="radio" 
        id={`${questionIndex}-${answerIndex}`}
        value={oneAnswer}
        name={`answer-${questionIndex}`}
        checked={answers[questionIndex] === oneAnswer}
        className="hidden"
        readOnly //to avoid react warning
        />
        <button
        type="button"
        onClick={()=> saveAnswer(questionIndex, oneAnswer)} //doing the { 0 : firstAnswer, 1 : secondAnswer} in the state
        className={`answer-btn ${answers[questionIndex] === oneAnswer ? "selected" : ""}`}
        aria-pressed={answers[questionIndex] === oneAnswer}
        >
        {decode(oneAnswer)}
        </button>
      </div>))}
      </div>
        <hr className="divider" />
    </div>
)})
: null

console.log(answers)

const saveAnswer = (questionIndex, oneAnswer) => {
  setAnswers(prev => ({...prev, [questionIndex]: oneAnswer}))
  console.log(questions, "questions")
  console.log(answers, "answers")
}

const checkAnswers = () => {
  questions.forEach((question, index) => {
  const correctAnswer = decode(question.correct_answer)
  const userAnswer = decode(answers[index])
  // const wrongUserAnswer = userAnswer && !correct
  setUserAnswers(prev => [...prev, userAnswer])

  if(userAnswer === correctAnswer) {
    setTotalScore(prev => prev + 1)
  }
})
  console.log(userAnswers)
  setAllAnswersSubmitted(prev => !prev)
}


const newGame = () => {
  setStartScreen(prev => !prev)
  console.log("new game")
}
  return (
    <main>
      <BackgroundWrapper/>
      {startScreen && (<Intro startQuiz={startQuiz}/>)}
      {!startScreen && (
        <>
        <div className="questions-div">
          {questionSection}
        </div>
        { !allAnswersSubmitted && <button className="check-answers-btn" onClick={checkAnswers}>Check answers</button>}
        {allAnswersSubmitted && <section className="gameover"><h3>You scored {totalScore} / {questions.length} correct answers</h3> <button className="purple-btn" onClick={newGame}>Play again</button></section>}
        </>
      )}
    </main>
  )
}

export default App

// I need to disable btn to check answers if not all answered