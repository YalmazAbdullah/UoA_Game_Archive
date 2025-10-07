import bannerLogo from "@/assets/bannerLogo.svg";
import logo from "@/assets/logo.svg";

export function Banner(){
    return(
        <div className="bg-black w-full border-5 sm:border-10 border-white">
        <div className="bg-[url(./banner.svg)] bg-cover bg-no-repeat bg-center min-h-[345px] w-full p-4">
            <img src={logo}className="w-[98px] h-auto"/>
            <div className="flex flex-col justify-stretch items-center">
                <img
                    src={bannerLogo}
                    className={`
                        z-20 -translate-y-50
                        pt-60  
                        md:-translate-y-45 
                        transition-transform duration-300 hover:scale-105 hover:rotate-3`}
                />
            </div>
        </div>
        </div>
    )
}
export default Banner