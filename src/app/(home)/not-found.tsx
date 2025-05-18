import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col pt-20 mt-20 pb-20 gap-8 items-center text-center">
      <Image src={"/404.png"} height={128} width={290} alt="404" />
      <div className="flex flex-col gap-2 p-4">
        <h2 className="font-bold text-3xl ">Page Not Found</h2>
        <p className=" w-fit ">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
        </p>
        <Link
          href="/"
          className="  bg-primary text-white rounded-full px-4 py-2  "
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
