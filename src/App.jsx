import React from 'react'

function App() {
  const [questions, setQuestions] = React.useState({
    id: 0,
    question: "",
    correctAnswer: "",
    answers: [],
  })

  React.useEffect(()=>{
    fetch("https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple")
    .then(res => res.json())
    .then(data => console.log(data))
  },[])

  return (
    <>
      <p>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
