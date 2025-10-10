import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
    try {
        // Use env vars; never hardcode secrets
        const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY as string)?.trim();
        const publicKey = (process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string)?.trim();
        const urlEndpoint = (process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string)?.trim();


        if (!privateKey || !publicKey || !urlEndpoint) {
            console.error("Missing ImageKit configuration:", {
                privateKey: !!privateKey,
                publicKey: !!publicKey,
                urlEndpoint: !!urlEndpoint
            });
            return new Response(
                JSON.stringify({ error: "ImageKit keys are not configured properly" }),
                { status: 500, headers: { 'Content-Type': 'application/json' } },
            );
        }

        const { token, expire, signature } = getUploadAuthParams({
            privateKey,
            publicKey,
            // Optional: Add expiry time (Unix timestamp, max 1 hour from now)
            expire: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
        });

        // Return all required parameters for the upload function
        return Response.json({ 
            token, 
            expire, 
            signature, 
            publicKey,
            urlEndpoint
        });
    } catch (error) {
        console.error("Error in ImageKit auth:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
