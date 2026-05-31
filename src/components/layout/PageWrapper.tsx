import React from 'react'
import PublicNav from './PublicNav'
import Footer from './Footer'

interface PageWrapperProps {
  children: React.ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full">
      <PublicNav />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  )
}
