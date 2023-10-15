import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

type ParamsProps = {
  params: { courseId: string; attachmentId: string };
};

export async function DELETE(req: Request, { params }: ParamsProps) {
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

    const attachment = await db.attachment.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[ATTACHMENT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
