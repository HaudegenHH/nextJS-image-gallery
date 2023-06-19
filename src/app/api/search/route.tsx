// http://localhost:3000/search?query=...

import { UnsplashSearchResponse } from "@/models/unsplash-image";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    if (!query) {
        // NextRequest and NextResponse are the same as Request and Response
        // but with some utility functions
        return NextResponse.json({ error: "No query provided"}, { status: 400 });
    }

    // another endpoint: GET /search/photos?query...
    // that takes the search query from the client
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    const { results }: UnsplashSearchResponse = await response.json();

    return NextResponse.json(results);
}