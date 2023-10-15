import GenerateBook from '@/components/GenerateBook'
import Hero from '@/components/Hero'
import React from 'react'

function HomePage() {
  return (
    <>
      <GenerateBook />
      <Hero type="generated"/>
      <Hero type="books"/>
    </>
  )
}

export default HomePage