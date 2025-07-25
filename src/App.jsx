import React from 'react'
import Intro from './components/Intro'
import BackgroundWrapper from './components/BackgroundWrapper'
import {decode} from 'html-entities';

function App() {
  const [startScreen, setStartScreen] = React.useState(false)
  const [questions, setQuestions] = React.useState(null)
  const [answer, setAnswer] = React.useState(null)

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
    const allQuestionsArr = wrongAnswers.splice(randomIndex,0,correctAnswer) // Insert without removing any elements (deleteCount = 0)
    console.log(randomIndex)
    console.log(wrongAnswers)
    console.log(allQuestionsArr)
    return (
    <>
      <h2 key={oneQuestion.question}>{decode(oneQuestion.question)}</h2>
      {/* <input type="radio" defaultChecked={false} name="answer" value={answer} />
      <label>{answer}</label> */}
    </>
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
