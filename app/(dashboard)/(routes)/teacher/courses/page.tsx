import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const CoursesPage = (props: Props) => {
  return (
    <div className="p-6">
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
