import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import Link from "next/link";

import { Alert } from '@/components/bootstrap';

export const metadata = {
    title: 'Static fetch - NextJS Image Gallery',
}
  
export default async function StaticPage() {
    const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    const image: UnsplashImage = await response.json(); 

    // resize the image
    const width = Math.min(500, image.width);
    // calculate the height to keep the original aspect ratio
    const height = (width / image.width) * image.height

    return (
        <div className="d-flex flex-column align-items-center">
            <Alert>
                This page <strong>fetches and caches data at build time</strong>.
                Even though the Unsplash API always returns a new image, we see the 
                same image after refreshing the page until we compile the project again.
                (in development mode you would see a new image after every hard refresh 
                with CTRL + F5)
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