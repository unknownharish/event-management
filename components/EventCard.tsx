import React from 'react'
import { useRouter } from "next/router";


type FormValues = {
    title: string;
    description: string;
    eventImage: string;
    location: string;
    date: string;
    category: string;
    isEdit?: Bool;
    id?: Bool;
};




export default function EventCard({ cardInfo }: { cardInfo: FormValues }) {

        const router = useRouter();
    

    return (
        <div className="w-5/12 max-w-[350px] shadow-lg rounded-lg overflow-hidden border">
            <img
                src={cardInfo.eventImage}
                className="w-full h-48 object-cover"
            />

            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{cardInfo.title}</h2>

                <p className="text-sm text-gray-500">{cardInfo.category}</p>

                <p className="text-gray-700 mt-2">{cardInfo.description?.slice(0, 150)}</p>

                <div className="mt-4">
                    <p className="text-sm text-gray-500">Location: {cardInfo.location}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(cardInfo.date).toLocaleString()}</p>
                </div>

                <div className="mt-4">
                    <button 
                    className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-25"
                    onClick={()=>router.push(`/event/${cardInfo?.id}`)}
                    disabled={cardInfo?.isEdit}
                    >
                        View Event
                    </button>
                </div>
            </div>
        </div>)
}
