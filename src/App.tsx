import { create } from 'zustand'
import './App.css'
import MainMenu from './pages/MainMenu'
import type { JSX } from 'react/jsx-runtime'

type PageState = {
  current: JSX.Element
  set: (value: JSX.Element) => void
}

function App() {
  const usePage = create<PageState>((set)=>({
    current: <MainMenu />,
    set: (value: JSX.Element) => set({current: value}),
  }))

  const currentPage = usePage((state)=>state.current);
  return (
    <>
      {currentPage}
    </>
  )
}

export default App
