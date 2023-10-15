"use client"
import { db, storage } from "@/app/firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ReactReader } from "react-reader";
import type { Rendition } from 'epubjs'
import { Spinner } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function Reader() {
  const [location, setLocation] = useState<string | number>(2)
  const rendition = useRef<Rendition | undefined>(undefined)
  const [fetching, setFetching] = useState<boolean>(true);
  const [book, setBook] = useState<any>({})
  const [audioBook, setAudioBook] = useState<any>({})
  var params = useParams();
  useEffect(() => {
    getBook();
  }, []);


  async function getBook() {
    const docRef = doc(db, "generated", params.books.toString());
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().epubURL);
      setBook(docSnap.data().epubURL);
      setAudioBook(docSnap.data().audioBook);
      setFetching(false);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return<>
      <h1>No Document</h1>
      </>
    }
  }

  return <>
    {!fetching ?
      <div className="flex flex-col h-screen">
        
        
        <AudioPlayer
          autoPlay
          src={audioBook}
          onPlay={e => console.log("onPlay")}
        // other props here
        />
        <div>
        <Link className="self-end rounded text-white mx-5 px-2 py-2 my-1 bg-blue-300" href="/">
          Go Home
        </Link>
        <Link className="self-end rounded text-white mx-5 px-2 py-2 my-1 bg-blue-300" target="_blank" href={audioBook}>
          Play Audio on Next Tab
        </Link>
        </div>
        
        <div className='flex-grow'>

          {/* <ReactReader
            url={book}
            location={location}
            locationChanged={(loc: string) => setLocation(loc)}
            getRendition={(_rendition: Rendition) => {
              rendition.current = _rendition
              // rendition.current.themes.fontSize(largeText ? '140%' : '100%')
            }}
          /> */}
          <iframe
        // src={`${book}?page=hsn#toolbar=0`}
        src={`${book}`}
        className="w-full h-full"
        style={{ border: 'none' }}
      ></iframe>

        </div>
      </div>
      :
      <div>
        <Spinner size='xl' />
      </div>
    }
  </>
}

export default Reader