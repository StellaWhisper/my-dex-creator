import { Link } from "@heroui/react";
import { ROUTES } from "@liberfi/core";
import { BrandIcon, MiniBrandIcon, useTranslation } from "@liberfi/ui-base";

export function HeaderBrand() {
  const { t } = useTranslation();

  return (
    <Link href={ROUTES.tokenList.home()} aria-label={t("extend.header.home")}>
      <BrandIcon className="max-lg:hidden" />
      <MiniBrandIcon className="lg:hidden" />
    </Link>
  );
}
