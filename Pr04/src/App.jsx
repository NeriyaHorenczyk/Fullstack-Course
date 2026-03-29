import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
      <p>{count}</p>
      <button onClick={()=> setCount(count - 1)}>Decrement</button>
      <button onClick={()=> setCount(0)}>Reset</button>
      <button onClick={()=> setCount(count + 1)}>Increment</button>
    </div>
  )
}

export default App
