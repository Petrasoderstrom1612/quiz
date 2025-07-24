import { useState } from 'react'

function App() {
  const [questions, setQuestions] = React.useState({
    id: 0,
    question: "",
    correctAnswer: "",
    answers: [],
  })

  return (
    <>
      <p>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
