"use client";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

type FileUploadProps = {
  onChange: (url?: string, fileName?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url, res?.[0]?.name);
      }}
      onUploadError={(err: Error) => {
        toast.error(`${err?.message}` ?? "Something went wrong");
      }}
    />
  );
};

export default FileUpload;
