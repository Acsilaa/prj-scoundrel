import { useEffect, useState } from "react"
import GamePlayer from "../components/Game/GamePlayer";

export default function Game() {
    const [durationExpired, setDurationExpired] = useState(false);
    useEffect(()=>{setTimeout(()=>{setDurationExpired(true)}, 500)},[])

    return <>
        <div className={`mx-auto py-[5%] w-10/12 duration-500 -translate-x-1/2 ${durationExpired ? 'translate-x-full' : ''} absolute left-1/2 top-0`}>
            <h1 className="text-center text-4xl">Scoundrel</h1>

            <div className="w-[min(90vw,300px)] flex items-center justify-between mx-auto my-20 flex-wrap">
                <button disabled
                    className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black disabled:hover:bg-gray-700 disabled:hover:scale-100 disabled:cursor-default  disabled:opacity-60">
                    <span>New Game</span>
                    <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200 group-hover:group-disabled:bg-gray-700">+</span>
                </button>

                <button disabled className="group p-3 bg-gray-700 min-w-32 rounded-md cursor-pointer relative hover:scale-105 duration-200 hover:bg-gray-900 hover:shadow-xl shadow-black disabled:hover:bg-gray-700 disabled:hover:scale-100 disabled:cursor-default  disabled:opacity-60" >
                    <span>Continue</span>
                    <span className="absolute left-1/2 -top-3 bg-gray-700 -translate-x-1/2 px-2 rounded-full group-hover:bg-gray-900 duration-200 group-hover:group-disabled:bg-gray-700">&rarr;</span>
                </button>
            </div>
        </div>
        <div className={`mx-auto py-[5%] w-10/12 duration-500 -translate-x-full ${durationExpired ? 'translate-x-0' : ''}`}>
            <GamePlayer />
        </div>
    </>
}