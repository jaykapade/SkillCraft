import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type TeacherLayoutProps = {
  children: React.ReactNode;
};

const TeacherLayout = ({ children }: TeacherLayoutProps) => {
  const { userId } = auth();

  if (!isTeacher(userId)) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
