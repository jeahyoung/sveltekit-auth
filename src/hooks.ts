import { db } from "$lib/database";
import type { GetSession, Handle } from "@sveltejs/kit";
import * as cookie from 'cookie';

export const handle: Handle =async ({ event, resolve }) => {
    const cookieHeader = event.request.headers.get('cookie');
    const cookies = cookie.parse(cookieHeader ?? '');

    //console.log(cookies);

    if (!cookies.session){
        return await resolve(event);
    }

    const session = await db.user.findUnique({
        where: { id: cookies.session },
    })

    if (session) {
        event.locals.user = { username: session.username }
    }

    return await resolve(event);
    // console.log('hooks', event);
    // if (event.url.pathname === '/'){
    //     return new Response('🍌')
    // }

    // return await resolve(event);
}

export const getSession: GetSession = ({ locals }) => {
    if (!locals.user) return {}

    return {
        user: {
            username: locals.user.username,
        }
    }
}