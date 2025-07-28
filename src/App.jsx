import React from 'react'
import Intro from './components/Intro'
import BackgroundWrapper from './components/BackgroundWrapper'
import {decode} from 'html-entities';
import { clsx } from 'clsx';
import Confetti from './components/Confetti';

function App() {
  const [startScreen, setStartScreen] = React.useState(true)
  const [questions, setQuestions] = React.useState(null) //Gathering the entire API call
  const [userAnswers, setUserAnswers] = React.useState({}) //user answers
  const [totalScore, setTotalScore] = React.useState(0) 
  const [allAnswersSubmitted, setAllAnswersSubmitted] = React.useState(false)

  const startQuiz = () => {
    setStartScreen(prevStatus => !prevStatus)
  }

  const newGame = () => {
    setStartScreen(prev => !prev)
    setAllAnswersSubmitted(false)
    setUserAnswers({})
    setTotalScore(0)
    console.log("new game")
  }
  
  const combineAllAnswerOptions = (correct, incorrect) => {
    const allAnswerOptions = [...incorrect]
    const randomIndex = Math.floor(Math.random() * (incorrect.length + 1))
    allAnswerOptions.splice(randomIndex,0, correct)
    return allAnswerOptions
  }
  
  React.useEffect(()=>{
    if(startScreen !== true){
    const fetchData = async () => {
      const res = await fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
      const data = await res.json()
      
      const readyQuestions = data.results.map(question => ({
        ...question, allAnswerOptions: combineAllAnswerOptions(question.correct_answer, question.incorrect_answers)
      }))
      
      setQuestions(readyQuestions)
    }
    
    fetchData()
  }
  },[startScreen])
  console.log("all data ready",questions)
  
  const questionSection = questions
  //MAPPING OVER QUESTIONS
  ? questions.map((oneQuestion, questionIndex) => { 
    const allAnswerOptionsArr = oneQuestion.allAnswerOptions

    {/*MAPPING OVER QUESTIONS */}
    return (
      <div key={oneQuestion.question} className="question-block">
      <h2>{decode(oneQuestion.question)}</h2>

  {/*MAPPING OVER ANSWERS */}
      <div className="answers-btns-div">
      {allAnswerOptionsArr.map((oneAnswer, answerIndex) => (
        <div key={oneAnswer} className="answer-wrapper">
        <input 
        type="radio" 
        id={`${questionIndex}-${answerIndex}`}
        value={oneAnswer}
        name={`answer-${questionIndex}`}
        checked={userAnswers[questionIndex] === oneAnswer}
        className="hidden"
        readOnly //to avoid react warning
        />
        <button
        type="button"
        onClick={()=> saveAnswer(questionIndex, oneAnswer)} //doing the { 0 : firstAnswer, 1 : secondAnswer} in the state
        className={clsx("answer-btn", 
          oneAnswer === userAnswers[questionIndex] && !allAnswersSubmitted && "selected", //this one answer we are looping over is the answer selected by the user by saveAnswer onClick AND checkAnswers button has not been pressed yet
          allAnswersSubmitted && oneAnswer === userAnswers[questionIndex] && oneAnswer === oneQuestion.correct_answer && "green", 
          allAnswersSubmitted && oneAnswer === userAnswers[questionIndex] && oneAnswer !== oneQuestion.correct_answer && "red",
          allAnswersSubmitted && oneAnswer !== userAnswers[questionIndex] && oneAnswer === oneQuestion.correct_answer && "correct-not-selected"
        //all answers are submitted && the answer we are looping over is the same as the answer the user selected for this question && this one looped answer is correct
        )}
        aria-pressed={userAnswers[questionIndex] === oneAnswer}
        >
        {decode(oneAnswer)}
        </button>
      </div>))}
      </div>
        <hr className="divider" />
    </div>
)})
: null

console.log(userAnswers)

const saveAnswer = (questionIndex, oneAnswer) => {
  setUserAnswers(prev => ({...prev, [questionIndex]: oneAnswer}))
  console.log(questions, "questions")
  console.log(userAnswers, "userAnswers")
}

const checkAnswers = () => {
  questions.forEach((question, index) => {
  const correctAnswer = decode(question.correct_answer)
  const userAnswer = decode(userAnswers[index])

  if(userAnswer === correctAnswer) {
    setTotalScore(prev => prev + 1)
  }
})
  console.log(userAnswers)
  setAllAnswersSubmitted(prev => !prev)
}

  return (
    <main>
      <BackgroundWrapper/>
      {startScreen && (<Intro startQuiz={startQuiz}/>)}
      {!startScreen && questions && (
        <>
        <div className="questions-div">
          {questionSection}
        </div>
        { !allAnswersSubmitted && <button className="purple-btn" onClick={checkAnswers} disabled={(questions?.length) !== Object.keys(userAnswers).length}>Check answers</button>}
        { allAnswersSubmitted && totalScore === questions.length && <Confetti/>}
        {allAnswersSubmitted && <section className="gameover"><h3>You scored {totalScore} / {questions.length} correct answers</h3> <button className="purple-btn" onClick={newGame}>Play again</button></section>}
        </>
      )}
    </main>
  )
}

export default App

// I need to disable btn to check answers if not all answered
// once correct answers are revealed, let the blind user know