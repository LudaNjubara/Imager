import React from "react";

import Image from "next/image";
import Link from "next/link";

function Logo({ isSmall }: { isSmall?: boolean }) {
  return (
    <Link href="/">
      <Image
        className="logo"
        src={isSmall ? "/images/imagerLogo_small.png" : "/images/imagerLogo2.png"}
        alt="Logo"
        width={isSmall ? 35 : 155}
        height={isSmall ? 40 : 95}
        priority
      />
    </Link>
  );
}

export default Logo;
