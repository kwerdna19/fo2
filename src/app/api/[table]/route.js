/* eslint-disable */
// @ts-nocheck

import { NextResponse } from "next/server";
import { api } from "~/utils/api";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// quick and very dirty way for me to access trpc api's from my own app
const handler = async (request, { params }) => {
  try {
    const { searchParams } = new URL(request.url)
    const fn = searchParams.get('fn')
    const secret = searchParams.get('secret')
    const { table } = params
    const input = request.method.toLowerCase() === 'get' ? undefined : await request.json()

    if(secret !== process.env.API_SECRET) {
      return new NextResponse(null, {
        status: 403,
        headers: corsHeaders
      })
    }

    if(!fn) {
      return new NextResponse(null, {
        status: 401,
        headers: corsHeaders
      })
    }

    const data = await api[table][fn](input)
    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders
    })

  } catch(e) {
    console.error(e?.message ?? e)
    return new NextResponse(null, {
      status: 500,
      statusText: e?.message ?? 'Unknown error occurred',
      headers: corsHeaders
    })
  }
}

export { handler as GET, handler as POST }
