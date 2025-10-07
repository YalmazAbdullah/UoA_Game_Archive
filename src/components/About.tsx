import about from "@/assets/about.svg";

export function About(){
    return(
        // <div className="flex flex-row w-full items-center -mt-55 z-10 relative">
        <div className="flex flex-row w-full items-center -mt-60 md:-mt-65 z-10 relative">
        <div className={`
            p-5
            xs:p-10
            border-5 border-l-0 border-r-0 
            md:w-[65%] md:p-16
            items-center
            md:border-r-5
            bg-white border-black
        `}>
            <h1 className="text-black font-accent text-6xl">
            About The <span className="text-black font-extrabold"><span className="underline">Archive</span><span className="pl-2">:</span></span>
            </h1>
            <p className="text-black mt-5">
                Welcome to the UA Games Archive—a showcase of the creative and 
                technical achievements of students from the University of 
                Alberta's Games programs. These programs, offered collaboratively 
                by the Faculty of Arts and the Faculty of Science, provide students 
                with opportunities to work in multidisciplinary teams, build 
                complete small and medium-scale games, and interactive experiences.
            </p>
        </div>
        <div className="hidden md:block w-[35%]">
            <img
            src={about}
            className="w-full h-auto object-contain"
            />
        </div>
        </div>
    )
}
export default About