// Event listing page (React + Next.js)

import React, { useEffect, useState } from 'react'



import { fetchData } from "../../config/methods"
import ReactPaginate from 'react-paginate';



import { MethodHeaders } from "../../config/api"
import Header from '../../components/Header'
import { CiSquarePlus } from "react-icons/ci";
import EventModal from '../../components/EventModal';
import EventCard from '../../components/eventCard';
import { PiCaretDoubleLeftThin, PiCaretDoubleRightThin } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../../redux/slice';





export default function EventList() {

  const dispatch = useDispatch();
  const userState = useSelector(state => state?.user);

  const eventList = userState?.events || [];
  const [eventModalOpen, seteventModalOpen] = useState(false)
  const [inputSearch, setinputSearch] = useState("")
  const [paginationData, setpaginationData] = useState({
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  })



  async function getEvents() {

    const EventFetch = MethodHeaders.GET_EVENTS
    const pageNumber = inputSearch.length ? "1" : (paginationData?.page).toString() || "1"
    const response = await fetchData(
      EventFetch.URL
        ?.replace("{{NAME}}", inputSearch)
        ?.replace("{{PAGE}}", pageNumber),
      { method: EventFetch.method },
      EventFetch.options
    )
    console.log("response", response)
    response?.data?.length && dispatch(setEvents(response.data));
    response?.pagination && setpaginationData(response.pagination)
  }


  function closeModal() {
    seteventModalOpen(false)
  }
  function openModal() {
    seteventModalOpen(true)
  }


  useEffect(() => {
    getEvents()
  }, [paginationData.page])

  useEffect(() => {
    !inputSearch.length && getEvents()
  }, [inputSearch])


  const updateSearchInput = (e) => {
    setinputSearch(e.target.value)
  }


  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setpaginationData(p => ({
      ...p, page: selectedPage + 1
    }))
  };





  return (
    <div className="w-10/12 m-auto py-4">
      <Header />

      <div className="mt-8 flex justify-between items-center">
        <p className="text-2xl font-semibold">Event List</p>

        <div className="flex items-center justify-center mt-4 cursor-pointer p-2 hover:bg-gray-200 rounded-md px-10" onClick={openModal}>
          <CiSquarePlus size={24} className="mr-2" />
          <p className="text-lg font-medium">Create Event</p>
        </div>
      </div>

      <div className='md:w-8/12 xl:w-6/12 flex justify-between items-center'>

        <input
          id="title"
          type="text"
          className="w-9/12 p-2 border border-gray-300 outline-none rounded-md"
          value={inputSearch}
          onChange={updateSearchInput}
        />
        <button
          className="px-10 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-25 cursor-pointer"
          onClick={getEvents}
        >
          Search
        </button>
      </div>

      {eventModalOpen && <EventModal isOpen={eventModalOpen} closeModal={closeModal} />}

      <div className="flex flex-wrap gap-6 justify-start mt-10">
        {eventList?.map((event, idx) => (
          <EventCard cardInfo={event} key={idx} />
        ))}
      </div>


      <ReactPaginate
        previousLabel={<PiCaretDoubleLeftThin size={24} className='cursor-pointer' />}
        nextLabel={<PiCaretDoubleRightThin size={24} className='cursor-pointer' />}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={paginationData.totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={'flex justify-center gap-2 mt-6 cursor-pointer'}
        pageClassName={'px-3 py-2 border rounded'}
        activeClassName={'bg-blue-500 text-white'}
        previousClassName={'px-3 py-2 border rounded'}
        nextClassName={'px-3 py-2 border rounded'}
      />
    </div>
  )
}
