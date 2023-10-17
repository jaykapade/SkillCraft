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
    // Exclude Publish changes in this api, it is done in a seperate api
    const { isPublished, ...values } = await req.json();

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

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    // TODO: Handle Video Upload

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
