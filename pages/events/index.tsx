// Event listing page (React + Next.js)

import React, { useEffect, useState } from 'react'



import { fetchData } from "../../config/methods"



import { MethodHeaders } from "../../config/api"
import Header from '../../components/Header'
import { CiSquarePlus } from "react-icons/ci";
import EventModal from '../../components/EventModal';
import EventCard from '../../components/eventCard';





export default function EventList() {

  const [eventList, setEventList] = useState([])
  const [eventModalOpen, seteventModalOpen] = useState(false)


  async function getEvents() {

    const EventFetch = MethodHeaders.GET_EVENTS

    const response = await fetchData(
      EventFetch.URL?.replace("{{NAME}}", ""),
      { method: EventFetch.method },
      EventFetch.options
    )
    console.log("response", response)
    response?.length && setEventList(response)
  }




  function closeModal() {
    seteventModalOpen(false)
  }
  function openModal() {
    seteventModalOpen(true)
  }


  useEffect(() => {
    getEvents()
  }, [])



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

      {eventModalOpen && <EventModal isOpen={eventModalOpen} closeModal={closeModal} />}

      <div className="flex flex-wrap gap-6 justify-start mt-10">
        {eventList?.map((event, idx) => (
          <EventCard cardInfo={event} key={idx} />
        ))}
      </div>

    </div>
  )
}
