"use client";
import { MacbookScroll } from "@/components/macbook";
import Image from "next/image";
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from "react";
import LandingHeading from "@/components/landing-heading";
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Leads', href: '/dashboard/leads' },
]
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const Badge = ({ className }: { className?: string }) => {
    return (
      <Image 
              src="https://pub-89c71be2d1fb4e5988b265a5dcd75b02.r2.dev/roshai-logo.webp" 
              width={3508} 
              height={1080} 
              className={className}
              alt="RoshAi Company Logo"
              priority
            />
    );
  };
  return (
    <main>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5 flex justify-center items-center flex-row-reverse gap-3">
            <h1 className="text-3xl font-bold flex items-center gap-0">
                  <span className="text-slate-800">Lead</span>
                  <span className="text-[#1D91D8]">Rise</span>
                  <sup className="text-xs ml-1 text-slate-600 font-medium">
                    Pro
                  </sup>
                </h1>
              <Image
                alt="LeadRise Logo"
                src="/logo-lead.svg"
                width={560}
                height={560}
                className="h-10 w-auto"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden justify-center items-center lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900 hover:text-[#1d91d8]">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
            <a href="/dashboard" className="text-sm/6 font-semibold border-2 text-[#1d91d8] border-[#1d91d8] px-4 py-1 rounded-md hover:bg-[#1d91d8]/10">
              Sign In
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <img
                  alt="LeadRise Logo"
                  src="/logo.svg"
                  className="h-8 w-auto"
                />
                <span className="font-medium">Lead<span className='text-[#1d91d8]'>Rise</span></span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/dashboard"
                    className="-mx-3 block rounded-lg bg-[#1d91d8] px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-[#1d91d8]/80"
                  >
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
      <LandingHeading />
      {/* <MacbookScroll
        title={
          <span>
          </span>
        }
        badge={
          <a href="https://rosh.ai">
            <Badge className="w-20 transform -rotate-12" />
          </a>
        }
        src={`/macbook.png`}
        showGradient={false}
      /> */}
    </main>
  )
}