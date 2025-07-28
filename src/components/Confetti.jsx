import React from 'react'
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

export default () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
      recycle={false} //no restart after the loop is over - confetti are dropped
      numberOfPieces={2500} //default is 1000, up to 10000 server manages it
    />
  )
}