'use client'

import React from "react";

export default function LandingPage() {
    return (
        <div>
            <GridBackgroundDemo/>
        </div>
    )
}



export function GridBackgroundDemo() {
    return (
        <div className="h-[50rem] w-full dark:bg-black bg-[#f6f2ff] dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="flex flex-col items-center justify-center z-30 font-extrabold">
                <span className="font-sora text-4xl sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-[#ab9ff2] to-[#3c315b] py-8">
                    CRYPTO VAULT
                </span>
                <span className=" text-center text-2xl text-neutral-600 dark:text-neutral-300">
                    The crypto wallet that'll take you places
                    <div>
                        Choose a blockchain to get started
                    </div>
                </span>
                
            </div>

            <div className="mt-auto w-full">
                <FloatingDockDemo />
            </div>
        </div>
    );
}



import { FloatingDock } from "./ui/floating-dock";
import {
    IconBrandGithub,
    IconHome,
} from "@tabler/icons-react";
import { SiSolana, SiEthereum } from "react-icons/si";

// import Image from "next/image";

export function FloatingDockDemo() {
    const links = [
        {
            title: "Home",
            icon: (
                <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "#",
        },
        {
            title: "Solana",
            icon: (
                <SiSolana className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/wallets?solana=501",
        },
        {
            title: "Ethereum",
            icon: (
                <SiEthereum className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "/wallets?ethereum=60",
        },
        {
            title: "GitHub",
            icon: (
                <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "https://github.com/rajukumar2003",
        },
    ];
    return (
        <div className="flex items-center justify-center h-[35rem] w-full">
            <FloatingDock
                mobileClassName="translate-y-20" // only for demo, remove for production
                items={links}
            />
        </div>
    );
}


