import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, code: "VALIDATION" as const }, { status: 400 });
    }

    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json({ ok: true, code: "SUCCESS" as const });
  } catch {
    return NextResponse.json({ ok: false, code: "SERVER" as const }, { status: 500 });
  }
}
