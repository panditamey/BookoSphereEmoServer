"use client"
import Image from "next/image";
import { db } from "@/app/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";

function Hero(props: any) {
  const [allgenerated, setAllgenerated] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchGeneratedBooks();
  }, [])
  async function fetchGeneratedBooks() {
    const booksRef = collection(db, props.type);
    const querySnapshot = await getDocs(booksRef);
    const newAlldocs: any = [];
    querySnapshot.forEach((doc) => {
      var newDoc = doc.data();
      newDoc.id = doc.id;
      newAlldocs.push(newDoc);
      console.log(`${doc.id} => ${doc.data()}`);
    });
    setAllgenerated(newAlldocs);
    setLoading(false);
  }
  return (

    <>
    {loading?
    <div className=' w-screen h-fit pb-20 text-center justify-self-center		'>
      Loading.....
      </div>
  :
      <div className=' w-screen h-fit pb-20 text-center justify-self-center		'>
        <h1 className="font-bold text-2xl	">{props.type=="generated"?"Generated Books":"Uploaded Books"}</h1>
        <div className='flex flex-row flex-wrap justify-center'>
          {allgenerated.map((doc: any) => {
            return (
              <>
                <div onClick={
                  () => {
                    window.location.href = `/${props.type == "books" ? "reader" : "generated"}/${doc.id}`
                  }
                } className='m-10 w-2/3 md:w-1/4	 bg-white  max-w-sm rounded-xl  shadow-xl text-center items-center cursor-pointer justify-center' key={doc.id}>
                  <div className="my-5">
                    <h1 className=' text-lg max-h-6 font-bold'>{doc.name}</h1>
                    <h1 className='text-sm'>Author: {doc.author}</h1>
                    <h1 className='text-sm line-clamp-2 text-justify	px-5 max-h-10'>{doc.description}</h1>
                  </div>
                  <div className="max-h-96  ">
                    <img className='pointer-events-none rounded-xl w-auto object-cover self-center overflow-hidden h-auto' draggable="false" src={doc.poster} alt="Picture of the author" />

                  </div>

                </div>
              </>
            )
          })}
        </div>
      </div>
      }
    </>
  )
}

export default Hero