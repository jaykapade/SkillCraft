import { redirect } from "next/navigation";

import { db } from "@/lib/db";

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

const CoursePage = async ({ params }: CoursePageProps) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) return redirect("/");

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CoursePage;
