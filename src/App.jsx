import React from 'react'
import Intro from './components/Intro'
import BackgroundWrapper from './components/BackgroundWrapper'
import {decode} from 'html-entities';

function App() {
  const [startScreen, setStartScreen] = React.useState(true)
  const [answersSubmitted, setAnswersSubmitted] = React.useState(false)
  const [questions, setQuestions] = React.useState(null) //for restart of the game, otherwise no change
  const [answers, setAnswers] = React.useState({}) 
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
  console.log("questions",questions)
  
  const questionSection = questions
  //MAPPING OVER QUESTIONS
  ? questions.map((oneQuestion, questionIndex) => { 
    const allAnswersArr = oneQuestion.allAnswers
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
        onClick={()=> handleAnswerClick(questionIndex, oneAnswer)} //doing the { 0 : firstAnswer, 1 : secondAnswer} in the state
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

const handleAnswerClick = (questionIndex, oneAnswer) => {
  setAnswers(prev => ({...prev, [questionIndex]: oneAnswer}))
  console.log(questions, "questions")
  console.log(answers, "answers")
}

const checkAnswers = () => {

  questions.forEach((question, index) => {
  const correct = decode(question.correct_answer)
  console.log(correct, "correct")
  const userAnswer = decode(answers[index])
  console.log("userAnswer", userAnswer)

  if(userAnswer === correct) {
    setTotalScore(prev => prev + 1)
  }

  console.log(totalScore)
})

  setAnswersSubmitted(prev => !prev)
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
        { !answersSubmitted && <button className="check-answers-btn" onClick={checkAnswers}>Check answers</button>}
        {answersSubmitted && <section className="gameover"><h3>You scored {totalScore} / {questions.length} correct answers</h3> <button className="purple-btn" onClick={newGame}>Play again</button></section>}
        </>
      )}
    </main>
  )
}

export default App
