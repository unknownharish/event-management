// Event detail page (React + Next.js)


import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';


import { fetchData } from "../../config/methods"



import { MethodHeaders } from "../../config/api"
import Header from '../../components/Header';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';




export default function EventDetail({ event }) {
    const router = useRouter();
    const userState = useSelector(state => state?.user);

    console.log("event particular detail", userState)

    async function handleRegisterUser() {


        const UserRegistration = MethodHeaders.REGISTER_FOR_EVENT;
        const payload = {
            "event_id": event.id
        }

        const response = await fetchData(
            UserRegistration.URL,
            { method: UserRegistration.method, data: payload },
            { ...UserRegistration.options, headers: { Authorization: `Bearer ${userState?.token}` } }
        )

        console.log("response", response)
        if (response.registration) {
            toast.success("Registered Successfully")
            router.push("/events")
        } else {
            toast.info(response?.message)
        }
    }




    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div className='w-10/12 m-auto'>
            <Header />
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.title}</h1>

                <div className="mb-6">
                    <img
                        src={event?.event_image}
                        alt={event.title}
                        className="rounded"
                    />
                </div>

                <div className="mb-4 text-gray-600">
                    <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                </div>

                <div className="mb-4 text-gray-600">
                    <p><strong>Category:</strong> {event.category}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className={event.status ? "text-green-600" : "text-red-600"}>
                            {event.status ? "Active" : "Inactive"}
                        </span>
                    </p>
                </div>

                <div className="text-gray-700">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p>{event.description}</p>
                </div>
            </div>
            <div className="mt-4 max-w-4xl mx-auto">
                <button
                    className="w-full py-2 bg-green-500 text-white uppercase rounded-md hover:bg-green-600 disabled:opacity-25 cursor-pointer"
                    onClick={handleRegisterUser}
                >
                    Register
                </button>
            </div>
        </div>
    );
}


export async function getStaticPaths() {

    const EventFetch = MethodHeaders.GET_EVENTS;

    const response = await fetchData(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${EventFetch.URL
            ?.replace("{{NAME}}", "")
            ?.replace("{{PAGE}}", "1")}`,
        { method: EventFetch.method },
        EventFetch.options
    )

    console.log("Fetched events", response)

    const paths = response?.data?.map((event: any) => ({
        params: { id: event.id.toString() },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {

    console.log("params", params)
    const EventFetchById = MethodHeaders.GET_EVENT_BY_ID;

    const response = await fetchData(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${EventFetchById.URL?.replace("{{ID}}", params.id)}`,
        { method: EventFetchById.method },
        EventFetchById.options
    )
    return {
        props: {
            event: response[0],
        },
    };
}

