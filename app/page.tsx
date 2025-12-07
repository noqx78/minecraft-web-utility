"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/skin-totem");
  }, [router]);

  return (
    <div>
      <p>work in progress</p>
    </div>
  );
}
