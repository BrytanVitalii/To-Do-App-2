import logo from '@/assets/icon.png'
import githubMark from '@/assets/github-mark-white.svg'

const Header = () => {
  return (
    <div className='standartBlock font-poppins h-20 sm:24 mt-4 sm:mt-8 bg-gray-500 rounded-2xl shadow-2xl flex justify-between'>
        <div className='flex items-center gap-3 h-full p-3 sm:pl-6 shrink'>
            <img src={logo} className="h-full w-auto" alt="Logo"/>
            <h1 className='text-xl sm:text-3xl font-bold'>SimpleTodo</h1>
        </div>
        <div className='flex items-center gap-6 h-full p-3 sm:pr-6'>
            <a
              href="https://github.com/BrytanVitalii/To-Do-App-2"
              target="_blank"
              rel="noopener noreferrer"
              className="h-2/3 cursor-pointer drop-shadow-md inline-block"
            >
              <img src={githubMark} alt="GitHub Page" className="h-full w-auto" />
            </a>
        </div>
    </div>
  )
}

export default Header