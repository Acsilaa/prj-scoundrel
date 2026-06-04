import { create } from 'zustand'
import './App.css'
import MainMenu from './pages/MainMenu'
import type { JSX } from 'react/jsx-runtime'
import type { GameState } from './lib/localstorage'

type PageState = {
  current: JSX.Element
  set: (value: JSX.Element) => void
}
type GameStateHook = {
  gamestate: GameState | null,
  set: (state: GameState) => void,
}
export const usePage = create<PageState>((set) => ({
  current: <MainMenu />,
  set: (value: JSX.Element) => set({ current: value }),
}))
export const useGameState = create<GameStateHook>((set)=>({
  gamestate: null,
  set: (state: GameState) => set({gamestate: state}),
}))

function App() {

  const currentPage = usePage((state) => state.current);
  return (
    <>
      {currentPage}
    </>
  )
}

export default App
