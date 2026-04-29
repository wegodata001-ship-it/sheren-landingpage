import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { PROJECTS, type ProjectKey } from "@/lib/projects";

type LeadPayload = {
  project_key?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const validProjects = Object.values(PROJECTS) as ProjectKey[];

function resolveProjectKey(value: string | undefined): ProjectKey | null {
  if (!value) return null;
  return validProjects.includes(value as ProjectKey) ? (value as ProjectKey) : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;
    const project_key = resolveProjectKey(body.project_key);
    const name = body.name?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const message = body.message?.trim();

    if (!project_key) {
      return NextResponse.json({ ok: false, error: "Invalid project_key" }, { status: 400 });
    }

    if (!name || !phone) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";

    console.log("[api/lead] creating lead", {
      project_key,
      name,
      phone,
      email: email || null,
      hasMessage: Boolean(message),
      ip,
    });

    const lead = await prisma.lead.create({
      data: {
        project_key,
        name,
        phone,
        email: email || null,
        message: message || null,
        source: `${project_key}_landing`,
        ip,
      },
    });

    console.log("[api/lead] lead created", {
      id: lead.id,
      project_key: lead.project_key,
    });

    return NextResponse.json({ ok: true, code: "SUCCESS" as const });
  } catch (error) {
    console.error("[api/lead] create failed", error);
    return NextResponse.json({ ok: false, code: "SERVER" as const }, { status: 500 });
  }
}
