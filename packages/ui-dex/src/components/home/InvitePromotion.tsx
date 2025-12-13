"use client";

import { Image } from "@heroui/react";
import { useTranslation } from "@liberfi/ui-base";
import clsx from "clsx";

export function InvitePromotion() {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        "w-full h-full pb-4 flex flex-col justify-end items-center cursor-pointer",
        "bg-contain bg-top bg-no-repeat bg-[url('/images/invite-banner-bg.png')]",
      )}
    >
      <Image
        removeWrapper
        width={140}
        height={140}
        className="object-cover relative top-6"
        src="/images/invite-banner.png"
        alt="invite-banner"
      />
      <div className="px-3 text-center text-xl font-semibold text-foreground">
        {t("extend.header.invite_promotion")}
      </div>
    </div>
  );
}
