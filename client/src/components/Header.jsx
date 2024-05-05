import { FaThreads } from "react-icons/fa6";
import {useSelector} from 'react-redux';
import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { GoHomeFill } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { useState } from "react";
import Logout from "./Logout";
import CreatePost from "./CreatePost";

const Header = () => {
  const {token} = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');

  function clickHandler() {
    setIsOpen(!isOpen);
  }

  return (
    <div >
      {token && (
               <div className="flex items-center justify-between py-5">
                    <div>
                      <Link to='/'>
                        <FaThreads className="text-[33px] cursor-pointer hover:scale-110"/>
                      </Link>
                    </div>
     
              <div className="flex  items-center gap-[75px]">
                    <div>
                      <Link to={'/'}>
                          <GoHomeFill className={`text-[30px] ${active === 'home' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('home')}/>
                      </Link>
                    </div>

                    <div>
                      <Link to={'#'}>
                          <IoSearch className={`text-[30px] ${active === 'search' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('search')}/>
                      </Link>
                    </div>

                    <div className={`${active === 'create' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('create')}>
                          <CreatePost />
                    </div>

                    <div>
                      <Link to={'#'}>
                          <FaRegHeart  className={`text-[28px] ${active === 'notification' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('notification')}/>
                      </Link>
                    </div>

                    <div>
                      <Link to={`/${token?.user?.username}`}>
                          <BsPerson className={`text-[30px] ${active === 'profile' ? 'text-black' : 'text-gray-400'}`} onClick={() => setActive('profile')}/>
                      </Link>
                    </div>
              </div>

             <div>
                 <CiMenuFries className="text-[28px] cursor-pointer font-black text-gray-400 hover:text-black" onClick={clickHandler}/>
                 <div className="relative">
                    {isOpen && (
                      <div className="absolute right-5 mt-2 w-40 bg-white border rounded-lg shadow-xl">
                        <div className="py-1">
                          <div
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 m-auto"
                          >
                            <Logout setIsOpen={setIsOpen}/>
                          </div>
                          <a
                            href="#"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          >
                            Option 2
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          >
                            Option 3
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
             </div>

            </div>
      )}
    </div>
  )
}

export default Header
