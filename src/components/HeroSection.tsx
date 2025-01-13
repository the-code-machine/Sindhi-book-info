'use client'

import React, { useState, useCallback } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
    const [input, setInput] = useState('');
    const [books, setBooks] = useState([]);
    const router = useRouter();

    const fetchData = async (value: string) => {
        try {
            if (value.trim() === '') {
                setBooks([]); // Clear suggestions when input is empty
                return;
            }

            const response = await fetch(`/api/searchBooks?query=${value}`);
            const data = await response.json();
            console.log(data); // console log the data
            setBooks(data.books);
        } catch (e) {
            console.error(e);
        }
    };

    // Debounced fetch function
    const debounceFetch = useCallback(_.debounce(fetchData, 300), []);

    const handleChange = (value: string) => {
        setInput(value);
        debounceFetch(value); // Use the debounced function
    };

    const handleBookClick = (book: any) => {
        const encodedBooks = encodeURIComponent(JSON.stringify(books)); // Encode books data
        router.push(`/book/${book["_id"]}?books=${encodedBooks}`); // Construct URL with query params
    };

    return (
        <div className="w-full py-32 flex justify-center items-center bg-primary border-t-2 border-white">
            <div className="flex flex-col md:w-6/12 w-full justify-center items-center">
                <h1 className="text-overLayHeading text-6xl font-extrabold">Sindhi Books Info.</h1>
                <p className="text-white font-medium text-[22px] text-center">
                    Preserving the Essence of Sindhi Literature
                </p>

                <div className="relative w-full">
                    {/* Search Bar */}
                    <div className="bg-white rounded-md w-full flex p-2 mt-3 justify-center items-center">
                        <input
                            type="text"
                            className="w-full h-full mr-2 px-3 outline-none text-black placeholder:text-black"
                            placeholder="Search by Book name, Author, library etc."
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    </div>

                    {/* Dropdown Suggestions */}
                    {books.length > 0 && (
                        <div className="absolute w-full bg-white shadow-lg rounded-md mt-2 max-h-60 overflow-y-auto z-10">
                            {books.map((book: any, index: number) => (
                                <div
                                    key={index}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleBookClick(book)} // Navigate on selection
                                >
                                    <p className="font-bold">{book["Title of the book"]}</p>
                                    <p className="text-sm text-gray-600">{book["Author Name"]}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
