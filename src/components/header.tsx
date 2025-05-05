export default function HeaderBar() {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <img
                src="/LogoCompressed.svg"
                alt="Overlay SVG"
                className="max-h-20"
            />
            <nav className="space-x-4">
            <a href="https://www.ualberta.ca/en/media-technology-studies/programs/computer-game-development/index.html" className="text-gray-700 hover:text-black">Program Info</a>
            <a href="https://www.ualberta.ca/en/media-technology-studies/programs/computer-game-development/cgd-courses.html" className="text-gray-700 hover:text-black">Courses</a>
            </nav>
        </div>
        </header>
    );
}