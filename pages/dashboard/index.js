import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { fetchData } from "../../config/methods";
import { MethodHeaders } from "../../config/api";

import { GoGraph } from "react-icons/go";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

export default function AdminDashboard() {

    const router = useRouter();
    const userState = useSelector(state => state?.user);

    const [dailyStats, setDailyStats] = useState({
        dailyRegisteredForEvents: 0,
        eventRegistered: 0,
        userRegistered: 0,
    });

    const [eventData, seteventData] = useState([])

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getEvents() {

        const EventFetch = MethodHeaders.DAILY_STATS;

        try {

            const response = await fetchData(
                EventFetch.URL,
                { method: EventFetch.method },
                { ...EventFetch.options, headers: { Authorization: `Bearer ${userState?.token}` } }
            );

            console.log("response", response);
            setDailyStats(response);

        } catch (err) {
            console.log(err)
        } finally {
        }
    }


    async function getPopularEvents() {
        const PopularEventFetch = MethodHeaders.POPULAR_EVENT;

        try {
            PopularEventFetch

            const response = await fetchData(
                PopularEventFetch.URL,
                { method: PopularEventFetch.method },
                { ...PopularEventFetch.options, headers: { Authorization: `Bearer ${userState?.token}` } }
            );

            console.log("response popular", response);
            seteventData(response);

        } catch (err) {
            console.log(err)
        } finally {
        }
    }



    useEffect(() => {
        if (userState?.user?.email != process.env.NEXT_PUBLIC_ADMIN?.toString()) {
            router.push("/events")
        }
        setLoading(false)
    }, [])



    useEffect(() => {
        getEvents();
        getPopularEvents();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="w-10/12 mx-auto p-6">
            <Header />

            <div className="mt-10">
                <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

                {/* daily  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg p-5 border flex items-center gap-4">
                        <GoGraph className="text-blue-600 text-4xl" />
                        <div>
                            <p className="text-lg font-semibold">Registrations For Event</p>
                            <p className="text-2xl text-blue-700 font-bold">
                                {dailyStats.dailyRegisteredForEvents}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 border flex items-center gap-4">
                        <MdOutlineEmojiEvents className="text-green-600 text-4xl" />
                        <div>
                            <p className="text-lg font-semibold">Total Events</p>
                            <p className="text-2xl text-green-700 font-bold">
                                {dailyStats.eventRegistered}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 border flex items-center gap-4">
                        <FaUsers className="text-purple-600 text-4xl" />
                        <div>
                            <p className="text-lg font-semibold">Registered Users</p>
                            <p className="text-2xl text-purple-700 font-bold">
                                {dailyStats.userRegistered}
                            </p>
                        </div>
                    </div>
                </div>

                {/* popular  */}
                <p className="text-3xl font-bold my-6">Popular</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventData.map(event => (
                        <div
                            key={event.id}
                            className="bg-white border shadow rounded-lg p-5 flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={
                                        event.event_image ||
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOHh-w2kJjp6R6WB1GpXMkREw6XaNU5JCP0w&s"
                                    }
                                    alt={event.title}
                                    className="w-full h-40 object-cover rounded mb-4"
                                />

                                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                                    {event.title}
                                </h2>

                                <p className="text-gray-600 text-sm mb-1">
                                    {new Date(event.date).toLocaleDateString()} • {event.location}
                                </p>

                                <p className="text-gray-700 mb-3 line-clamp-3">{event.description}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-sm text-gray-500">
                                    Category:{" "}
                                    <strong className="capitalize">{event.category}</strong>
                                </span>
                                <span className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded">
                                    {event.registrations} Registrations
                                </span>
                            </div>
                        </div>
                    ))}
                </div>




            </div>
        </div>
    );
}
