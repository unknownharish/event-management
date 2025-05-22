import React, { useState } from 'react';
import { FaCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slice';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Header() {

  const router = useRouter();
  const userStore = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch()
  const [showMenu, setshowMenu] = useState(false);


  function handleChange() {
    userStore?.name && setshowMenu(p => !p)
  }
  function handleLogout() {

    dispatch(clearUser())
    router.push("/")

  }

  return (
    <div className="flex justify-between items-center p-4 bg-gray-600 text-white">
      <div>
        <Link href={"/events"}>
          <p className="font-bold text-xl">Event Hub</p>
        </Link>
      </div>

      <div className="flex items-center relative">
        <FaCircleUser size={24} className="mr-2 cursor-pointer" onClick={handleChange} />
        {showMenu && <div
          className="absolute -right-5 top-5 bg-white text-black rounded-md shadow-md mt-2 py-2 px-4 w-48"
        >

          <p className="cursor-pointer" onClick={handleLogout}>logout</p>
        </div>}

        <p>{userStore?.name || 'Guest'}</p>
      </div>
    </div>
  );
}
