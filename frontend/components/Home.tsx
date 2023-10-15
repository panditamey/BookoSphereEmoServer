"use client"
import Image from 'next/image'
import { collection, addDoc, doc, setDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '@/app/firebase';
import Link from 'next/link';
import { Card, CardBody, Heading, Stack } from '@chakra-ui/react';


export default function Home() {
    const [alldocs, setAlldocs] = useState([]);
    const [allgenerated, setAllgenerated] = useState([]);


    useEffect(() => {
        fetchBooks();
        fetchGeneratedBooks();
    }, [])

    async function fetchBooks() {
        const booksRef = collection(db, "books");
        const querySnapshot = await getDocs(booksRef);
        const newAlldocs: any = [];
        querySnapshot.forEach((doc) => {
            var newDoc = doc.data();
            newDoc.id = doc.id;
            newAlldocs.push(newDoc);
            console.log(`${doc.id} => ${doc.data()}`);
        });
        setAlldocs(newAlldocs);
    }

    async function fetchGeneratedBooks() {
        const booksRef = collection(db, "generated");
        const querySnapshot = await getDocs(booksRef);
        const newAlldocs: any = [];
        querySnapshot.forEach((doc) => {
            var newDoc = doc.data();
            newDoc.id = doc.id;
            newAlldocs.push(newDoc);
            console.log(`${doc.id} => ${doc.data()}`);
        });
        setAllgenerated(newAlldocs);
    }

    return (
        <>
            <div className='flex md:flex-row flex-col'>
                <button onClick={() => {
                    window.location.href = '/generate'
                }} className='rounded border h-10 flex flex-col items-center'>Generate Book</button>
                <h1 >Books</h1>
                {alldocs.map((doc: any) => {
                    return (
                        <>
                            <div onClick={
                                () => {
                                    window.location.href = `/reader/${doc.id}`
                                }
                            } className='m-10 p-10 bg-slate-600 rounded-xl text-center items-center cursor-pointer justify-center' key={doc.id}>
                                <Image className='self-center mx-auto' src={doc.poster} alt="Picture of the author" width={100} height={100}
                                />

                                <p className='md:w-52 w-auto mt-10 mx-auto text-white self-center'>{doc.name}</p>
                                {/* <p className='w-52 mt-10 text-white text-xs'>{doc.description}</p> */}
                            </div>
                        </>
                    )
                })
                }
            </div>
            <h1 >Generated</h1>
            <div className='flex md:flex-row flex-col'>
                {allgenerated.map((doc: any) => {
                    return (
                        <>
                            <div onClick={
                                () => {
                                    window.location.href = `/generated/${doc.id}`
                                }
                            } className='m-10 p-10 bg-slate-600 rounded-xl text-center items-center cursor-pointer justify-center' key={doc.id}>
                                <Image className='self-center mx-auto' src={doc.poster} alt="Picture of the author" width={100} height={100}
                                />

                                <p className='md:w-52 w-auto mt-10 mx-auto text-white self-center'>{doc.name}</p>
                                {/* <p className='w-52 mt-10 text-white text-xs'>{doc.description}</p> */}
                            </div>
                        </>
                    )
                })
                }
            </div>

        </>
    )
}
