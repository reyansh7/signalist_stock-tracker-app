import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { auth } from '@/lib/better-auth/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

const layout = async ({children}:{children:React.ReactNode}) => {
    const session=await auth.api.getSession({headers:await headers()});
    if(session?.user) redirect('/');
  return (
    <main className='min-h-screen flex'>
        <section className='flex-1 flex flex-col px-6 py-8 lg:px-12 lg:py-12 bg-[#0f0f0f] overflow-y-auto'>
            <Link href='/' className='mb-8'>
            <Image src="/assets/icons/logo.svg" alt="Signalist Logo" width={140} height={32} className="h-8 w-auto" />
            </Link>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-md">{children}</div>
            </div>
        </section>
        <section className="hidden lg:flex lg:w-[45%] bg-[#1a1a1a] flex-col p-8 relative overflow-hidden">
            <div className="absolute top-8 right-8 z-10">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white text-xl">ⓘ</span>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
                {/* Testimonial Section */}
                <div className="max-w-lg">
                    <blockquote className="text-white text-2xl font-light leading-relaxed mb-6">
                        Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                    </blockquote>
                    <div className="flex items-center gap-4 mb-12">
                        <div>
                            <cite className="text-white font-medium block">— Ethan R.</cite>
                            <p className="text-sm text-gray-400">Retail Investor</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image 
                                    src="/assets/icons/star.svg" 
                                    alt="Star" 
                                    key={star} 
                                    width={20} 
                                    height={20}
                                    className="h-5 w-5"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard Image */}
                <div className="flex-1 relative flex items-center justify-center">
                    <Image 
                        src="/assets/images/dashboard.png" 
                        alt="Dashboard Preview" 
                        width={600}
                        height={500}
                        className="w-full h-auto object-contain rounded-lg"
                    />
                </div>
            </div>
        </section>
        
    </main>
  )
}

export default layout