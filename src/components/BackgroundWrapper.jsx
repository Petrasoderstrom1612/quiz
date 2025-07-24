import React from 'react'
import blueblob from "/src/assets/blueblob.png"
import yellowblob from "/src/assets/yellowblob.png"

const BackgroundWrapper = () => {
  return (
    <>
        <img src={blueblob} className="bg-img left" alt="React logo left" />
        <img src={yellowblob} className="bg-img right" alt="React logo right" />
    </>
  )
}

export default BackgroundWrapper
