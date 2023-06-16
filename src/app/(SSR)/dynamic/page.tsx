import Image from "next/image";
import Link from "next/link";

import { Alert } from '@/components/bootstrap';
import { UnsplashImage } from "@/models/unsplash-image";

export const metadata = {
    title: 'Dynamic fetch - NextJS Image Gallery',
}

// turning into dynamic page 
// with revalidate set to 0, its not gonna be cached at all
// if you refresh u get a new image 
// export const revalidate = 0; 

export default async function Page() {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
    {
        // same effect as setting revalidate to 0
        // but only effecting this specific fetch call
        // cache: 'no-store' (or:)
        // cache: 'no-cache'
        
        // 3rd option to prevent caching:
        next: { revalidate: 0}
    });
    const image: UnsplashImage = await response.json(); 

    // resize the image
    const width = Math.min(500, image.width);
    // calculate the height to keep the original aspect ratio
    const height = (width / image.width) * image.height

    return (
        <div className="d-flex flex-column align-items-center">
            <Alert>
                This page <strong>fetches data dynamically</strong>.
                Every time you refresh the page, you get a new image from the Unsplash API.
            </Alert>
            <Image 
                src={image.urls.raw}
                alt={image.description}
                width={width}
                height={height}
                className="rounded shadow mw-100 h-100 "
            />
            by <Link href={`/users/${image.user.username}`}>{image.user.username}</Link>
        </div>
    );
} 