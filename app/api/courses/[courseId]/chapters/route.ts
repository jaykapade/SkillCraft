import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type ParamsProps = {
  params: {
    courseId: string;
  };
};

export async function POST(req: Request, { params }: ParamsProps) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const isCourseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!isCourseOwner)
      return new NextResponse("Unauthorized", { status: 401 });

    const { title } = await req.json();

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = (lastChapter?.position || 0) + 1;
    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
