import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EventCard from './eventCard';
import { MethodHeaders } from '../config/api';
import { fetchData } from '../config/methods';
import { addEvent } from '../redux/slice';


type FormValues = {
    title: string;
    description: string;
    event_image: string;
    location: string;
    date: string;
    category: string;
};

export default function EventModal({ isOpen, closeModal }: { isOpen: boolean, closeModal: () => void }) {


    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();
    const dispatch = useDispatch();
    const userState = useSelector(state => state?.user);


    const onSubmit = async (data: FormValues) => {
        try {

            const CreateMethod = MethodHeaders.CREATE_EVENT
            const response = await fetchData(
                CreateMethod.URL,
                { method: CreateMethod.method, data },
                { ...CreateMethod.options, headers: { Authorization: `Bearer ${userState?.token}` } }
            )

            console.log("response of create", response)

            toast.success("Event created successfully!");
            dispatch(addEvent(response));
            closeModal();
        } catch (error) {
            toast.error("Failed to create event.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-8/12 relative">
                <button onClick={closeModal} className="absolute top-2 right-2 text-xl cursor-pointer">
                    <FaTimes />
                </button>

                <h3 className="text-2xl font-semibold mb-4">Create Event</h3>

                <div className='flex justify-between items-center'>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-6/12">
                        <div>
                            <label htmlFor="title" className="block font-medium">Title</label>
                            <input
                                {...register('title', { required: 'Title is required' })}
                                id="title"
                                type="text"
                                className="w-full p-2 border border-gray-300 outline-none rounded-md"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block font-medium">Description</label>
                            <textarea
                                {...register('description')}
                                id="description"
                                rows={4}
                                className="w-full p-2 border border-gray-300 outline-none rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="eventImage" className="block font-medium">Image Url</label>
                            <input
                                type="text"
                                {...register('event_image')}
                                id="eventImage"
                                className="w-full p-2 border border-gray-300 outline-none rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block font-medium">Location</label>
                            <input
                                {...register('location')}
                                id="location"
                                type="text"
                                className="w-full p-2 border border-gray-300 outline-none  rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="date" className="block font-medium">Date</label>
                            <input
                                {...register('date', { required: 'Date is required' })}
                                id="date"
                                type="datetime-local"
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full p-2 border border-gray-300 outline-none rounded-md"

                            />
                            {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block font-medium">Category</label>
                            <select
                                {...register('category', { required: 'Category is required' })}
                                id="category"
                                className="w-full p-2 border border-gray-300 outline-none  rounded-md"
                            >
                                <option value="workshops">Workshops</option>
                                <option value="webinars">Webinars</option>
                                <option value="tech">Tech</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                        >
                            Create Event
                        </button>
                    </form>


                    <EventCard cardInfo={{ ...watch(), isEdit: true }} />



                </div>
            </div>
        </div>
    );
};

