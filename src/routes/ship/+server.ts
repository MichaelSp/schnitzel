import { getShipLocations, setShipInfo } from "$lib/server/database";
import { json, type RequestHandler } from "@sveltejs/kit";
import { onDatabaseChange } from "$lib/server/database";
import type { ShipInfos } from "$lib";

export const POST: RequestHandler = async ({ request }) => {
    const shipInfo = await request.json();
    setShipInfo(shipInfo.id, shipInfo);
    return json({ shipLocations: getShipLocations() });
}


export const GET: RequestHandler = async () => {
    const stream = new ReadableStream({
        start(controller) {
            
            controller.enqueue("event: open\n\n");

            controller.close = () => {
                unsubscribe();
            };
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
};