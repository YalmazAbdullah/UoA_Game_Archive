import * as React from "react"
import banner from "@/assets/banner.svg";
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
                    className={`z-20 pt-60 -translate-y-50 md:-translate-y-45`}
                />
            </div>
        </div>
        </div>
    )
}
export default Banner