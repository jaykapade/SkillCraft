import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type ParamsProps = {
  params: {
    courseId: string;
  };
};

export async function PUT(req: Request, { params }: ParamsProps) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const isCourseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!isCourseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Successfully Reordered", { status: 200 });
  } catch (error) {
    console.error("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
