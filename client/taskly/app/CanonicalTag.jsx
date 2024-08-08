"use client";

import { usePathname } from "next/navigation";

export default function CanonicalTag() {
  const pathname = usePathname();
  const canonicalUrl = `https://todoly.app${pathname}`;

  return <link rel="canonical" href={canonicalUrl} />;
}
