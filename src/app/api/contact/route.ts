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
      return NextResponse.json(
        { ok: false, message: "יש למלא שם, מייל ותיאור פרויקט." },
        { status: 400 },
      );
    }

    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "הפנייה נשלחה בהצלחה. נחזור אליכם בהקדם.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "משהו השתבש בשליחת הפנייה. נסו שוב בעוד רגע." },
      { status: 500 },
    );
  }
}
