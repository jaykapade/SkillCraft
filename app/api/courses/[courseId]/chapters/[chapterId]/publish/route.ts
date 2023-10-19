import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type ParamsProps = {
  params: {
    courseId: string;
    chapterId: string;
  };
};

export async function PATCH(req: Request, { params }: ParamsProps) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const isOwnCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!isOwnCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.error("[CHAPTER_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}