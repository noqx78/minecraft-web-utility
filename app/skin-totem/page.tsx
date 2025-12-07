"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as skinview3d from "skinview3d";
import { ModeToggle } from "@/components/ThemeSwitcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { downloadTotemPack } from '@/lib/download-3d-totem';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const viewerRef = useRef<skinview3d.SkinViewer | null>(null);
    const [username, setUsername] = useState("noqx78");
    const d = new Date();
    let year = d.getFullYear();


    useEffect(() => {
        if (!canvasRef.current) return;

        const viewer = new skinview3d.SkinViewer({
            canvas: canvasRef.current,
            width: 400,
            height: 500,
            skin: `https://mineskin.eu/skin/${username}`,
        });

        viewer.fov = 70;
        viewer.zoom = 0.5;
        viewer.autoRotate = true;
        viewer.animation = new skinview3d.WalkingAnimation();
        viewer.animation.speed = 1;

        viewerRef.current = viewer;

        return () => {
            viewer.dispose?.();
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (viewerRef.current) {
                viewerRef.current.loadSkin(`https://mineskin.eu/skin/${username}`);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [username]);

    const thirdParty = [
        {
            package: "skinview3d",
            url: "https://github.com/bs-community/skinview3d",
            license: "MIT",
        },
        {
            package: "API",
            url: "https://mineskin.eu",
            license: "?",
        },
        {
            package: "Archiver",
            url: "https://www.npmjs.com/package/archiver",
            license: "MIT",
        }
    ]

    return (
        <div className="min-h-screen p-4 bg-gray-50 dark:bg-black">
            <nav className="mb-4">
                <ModeToggle />
            </nav>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                <div className="flex flex-col gap-4 md:w-1/3">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                        Skin to Totem
                    </h1>

                    <Input
                        type="text"
                        placeholder="Minecraft Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <Button onClick={() => downloadTotemPack(username)}>
                            Download Totem Pack
                        </Button>

                        <p className="mt-4">Totem Preview</p>
                        <Image alt="totem pewview" width={256} height={256} src="/3dTotemPreview.png" />
                        {/* 
                        <Button
              onClick={() => {
                if (!viewerRef.current) return;
                const url = viewerRef.current.canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = url;
                a.download = `${username}-totem.png`;
                a.click();
              }}
            >
              Download 2D Totem
            </Button>  */}
                    </div>
                </div>

                <div className="md:w-2/3 w-full flex justify-center">
                    <canvas
                        ref={canvasRef}
                        className="border border-gray-300 dark:border-gray-700 rounded-lg"
                    />
                </div>
            </div>





            <footer className="footer-fixed-bottom-lifted bg-neutral-primary-soft rounded-2xl shadow-xs border border-default m-4">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-body sm:text-center">© {year} <a href="https://x.com/noqx78" className="hover:underline">noqx</a>. All Rights Reserved.
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-body sm:mt-0">
                        <li>
                            <a href="https://github.com/noqx78/minecraft-web-utility" className="hover:underline me-4 md:me-6">Source Code</a>
                        </li>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <li>
                                    <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                                </li>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Privacy Policy</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        We respect your privacy. no data is saved or collected. Any information you enter (e.g., username, settings) is strictly client-side and will never be stored in a database or shared with third parties.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <li>
                                    <a href="#" className="hover:underline me-4 md:me-6">Third-Party License</a>
                                </li>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Third-Party License</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <Table>
                                            <TableCaption></TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">Package</TableHead>
                                                    <TableHead>URL</TableHead>
                                                    <TableHead>License</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {thirdParty.map((thirdParty) => (
                                                    <TableRow key={thirdParty.package}>
                                                        <TableCell className="font-medium">{thirdParty.package}</TableCell>
                                                        <TableCell>{thirdParty.url}</TableCell>
                                                        <TableCell>{thirdParty.license}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            <TableFooter>

                                            </TableFooter>
                                        </Table>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <li>
                                    <a href="#" className="hover:underline me-4 md:me-6">Contact</a>
                                </li>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Contact</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <p>Twitter/X: noqx78</p>
                                        <p>Discord: noqx</p>

                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </ul>
                </div>
            </footer>



        </div>
    );
}
