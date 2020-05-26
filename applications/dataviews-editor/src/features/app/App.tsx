import React from 'react'
import { useSelector } from "react-redux"
import { selectDataviews } from "features/dataviews/dataviews.slice"

const App = () => {
  const dataviews = useSelector(selectDataviews)
  console.log(dataviews)
  return <div>
    lalalss
  </div>
}

export default App