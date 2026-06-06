import { usePage } from "../App"
import MainMenu from "./MainMenu";

export default function UIExplainer () {
    const pagehook = usePage();
    return <div className="mx-auto w-8/12 flex items-center h-screen flex-col justify-center">
        <img src="/scoundrel_tutorial.png" className="w-full mb-8" />
        <div className="flex items-center justify-center w-full">
        <a href="#" className="mx-auto text-gray-400 underline text-center" onClick={()=>{pagehook.set(<MainMenu />)}}>Back</a>
        </div>
    </div>
}