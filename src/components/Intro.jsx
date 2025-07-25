import React from 'react'

const Intro = ({startQuiz}) => {
  return (
    <div>
      <h1>Quizzical</h1>
      <p>Answer 5 questions to check how much common knowledge you have.</p>
      <button className='purple-btn' onClick={startQuiz}>Start quiz</button>
    </div>
  )
}

export default Intro
