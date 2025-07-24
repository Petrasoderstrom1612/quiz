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
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
      setQuestions(data.results)
    })
  },[])
  console.log("questions",questions)
  
  const questionSection = questions
  ? questions.map(oneQuestion => (
      <h2 key={oneQuestion.question}>{decode(oneQuestion.question)}</h2>
    ))
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
