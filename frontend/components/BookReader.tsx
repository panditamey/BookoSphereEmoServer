"use client"
import React, { useState } from 'react'
import { ReactReader } from 'react-reader'

function BookReader(book:any) {
    const [location, setLocation] = useState<string | number>(0);
    return (

        // <div className='h-screen'>
        //     <ReactReader
        //         url={book.epubURL}
        //         location={location}
        //         locationChanged={(epubcifi: string) => setLocation(epubcifi)}
        //     />
        // </div>
        <div>A</div>
    )
}

export default BookReader