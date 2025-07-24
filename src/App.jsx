import React from 'react'
import Intro from './components/Intro'

function App() {
  const [startScreen, setStartScreen] = React.useState(true)
  const [questions, setQuestions] = React.useState(null)
  const [answer, setAnswer] = React.useState(null)

  
  React.useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => {
      setQuestions(data.results)
      console.log("questions",questions)
    })
  },[])

  const startQuiz = () => {
    setStartScreen(prevStatus => !prevStatus)
  }
  console.log(startScreen)

  return (
    <main>
      {startScreen && (<Intro startQuiz={startQuiz}/>)}
      {!startScreen && (
        <>
        <p>questions section</p>
        </>
      )}
    </main>
  )
}

export default App
