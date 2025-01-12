'use client';

import React, { useState, useEffect } from 'react';

export default function BookPage({ params, searchParams }: { params: { id: string }; searchParams: { books: string } }) {
  const { id } = params; // Dynamic route parameter
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  // This effect runs when searchParams.books is updated
  useEffect(() => {
    if (searchParams.books) {
      const booksFromSearchParams = JSON.parse(searchParams.books);
      setBooks(booksFromSearchParams);
    }
  }, [searchParams.books]);

  // Find the selected book based on the `id`
  useEffect(() => {
    const selected = books.find((book: any) => book['Title of the book'] === id);
    setSelectedBook(selected);
  }, [books, id]);

  return (
    <div className="container mx-auto p-4">
      {/* Selected Book Card - Displayed alone in the top row */}
      {selectedBook && (
        <div className="bg-white p-6 rounded-md shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">{selectedBook['Title of the book']}</h2>
          <p className="text-lg text-gray-700">{selectedBook['Author Name']}</p>
          <p className="text-sm text-gray-500">{selectedBook['Location of the Collection/Library/Institution']}</p>
        </div>
      )}

      {/* Other Book Cards - Displayed in 3 columns per row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {books
          .filter((book: any) => book['Title of the book'] !== id) // Exclude the selected book
          .map((book: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-md shadow-lg">
              <h3 className="text-xl font-semibold">{book['Title of the book']}</h3>
              <p className="text-lg text-gray-700">{book['Author Name']}</p>
              <p className="text-sm text-gray-500">{book['Location of the Collection/Library/Institution']}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
