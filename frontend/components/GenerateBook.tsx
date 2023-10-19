"use client";
import { Box, Button, Input, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useState } from 'react';
import { db, storage } from "@/app/firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import Lottie from "lottie-react";
import groovyWalkAnimation from "../animations/animation_lnr3lhtd.json";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GenerateBook() {
    const [prompt, setPrompt] = useState(null||'');
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Generating...');
    const [generatedBookId, setGeneratedBookId] = useState('');

    function uploadGeneratedBookData(data: any) {
        const bookid = uuidv4();
        setGeneratedBookId(bookid);
        try {
            try {
                setDoc(doc(db, "generated", bookid), {
                    name: data.name,
                    poster: data.poster,
                    audioBook: data.audio,
                    epubURL: data.pdf,
                    description: data.description,
                    author: "USER"
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        catch (e) {
            console.log(e);
        }
        return bookid;
    }
    async function generateBook(p: string) {
        setLoading(true);
        // res {
        //     "status": "success",
        //     "emotion": "fear",
        //     "prompt": "I can't do it, I'm not ready to lose anything, just leave me alone"
        // }
        fetch("https://panditamey-generatetextapi.hf.space/generatebook", {
            method: 'POST',
            body: JSON.stringify({
                "prompt": p
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(async res => {
            console.log(res.status);
            await new Promise(r=>setTimeout(r,5000));
            setLoadingText("Gathering Data...");
            await new Promise(r=>setTimeout(r,5000));
            setLoadingText("Uploading to Database...");
            await new Promise(r=>setTimeout(r,5000));
            const id = uploadGeneratedBookData(res);
            setLoadingText("Enjoy your book...");
            await new Promise(r=>setTimeout(r,2000));
            window.location.href = `/generated/${id}`
            // setLoading(false);
        })

    }
    return (
        <>
            {loading &&

                <div className='sticky top-0 h-screen w-screen flex items-center justify-center bg-white  z-30' role="status">
                    <div className='flex flex-col items-center'>

                        <h1 className="text-sm font-semibold mb-5">{loadingText}</h1>
                        <svg aria-hidden="true" className="w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>

                    </div>
                </div>

            }
            
            <div className='text-center  w-screen h-5/6 p-10 md:flex-row flex-col'>
            <Lottie  style={{height:400}} animationData={groovyWalkAnimation} />
                <h1 className='text-2xl font-bold m-5'>Generate Book of Your Choice</h1>
                <Input className='lg:w-2/4 w-4/5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500  p-5 text-sm lg:text-md'
                    // width={500}
                    onChange={
                        (e) => {
                            setPrompt(e.target.value)
                        }
                    }
                    placeholder='Write a book on india in 5 chapters and 10 words.' />
                {/* <h6>{prompt}</h6> */}
                <br />
                <Button className='mt-5 h-10 w-52 text-lg p-6 text-white rounded-full border-blue-100 border-solid border-2 bg-blue-500'
                    onClick={() => {

                        if(prompt==null || prompt==''){
                            toast("Please enter prompt to generate book.");
                            return;
                        }
                        generateBook(prompt);
                    }}>Generate
                </Button>
            </div>
            <ToastContainer />
        </>
    )
}

export default GenerateBook