import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

type ParamsProps = {
  params: { courseId: string };
};

export async function PATCH(req: Request, { params }: ParamsProps) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { courseId } = params;
    if (!courseId)
      return new NextResponse("Course id Not found", { status: 400 });
    const values = await req.json();

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
