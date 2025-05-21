import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { fetchData } from "../../config/methods";
import { MethodHeaders } from "../../config/api";

import { GoGraph } from "react-icons/go";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { useSelector } from 'react-redux';

export default function AdminDashboard() {

    const userState = useSelector(state => state?.user);

    const [dailyStats, setDailyStats] = useState({
        dailyRegisteredForEvents: 0,
        eventRegistered: 0,
        userRegistered: 0,
    });

    const [eventData, seteventData] = useState({})

    const [loading, setLoading] = useState(false);
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
        const PopularEventFetch = MethodHeaders.DAILY_STATS;

        try {

            const response = await fetchData(
                PopularEventFetch.URL,
                { method: PopularEventFetch.method },
                PopularEventFetch.options
            );

            console.log("response", response);
            setDailyStats(response);

        } catch (err) {
            console.log(err)
        } finally {
        }
    }

    useEffect(() => {
        getEvents();
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


            </div>
        </div>
    );
}
