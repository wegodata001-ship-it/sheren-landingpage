import Link from "next/link";

import styles from "./PrimaryButton.module.css";

type PrimaryButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  target?: string;
  rel?: string;
  className?: string;
};

export default function PrimaryButton({
  href,
  children,
  variant = "solid",
  target,
  rel,
  className,
}: PrimaryButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(" ");
  const isAnchorLink = href.startsWith("#");
  const isExternal = href.startsWith("http") || target === "_blank";

  if (isExternal) {
    return (
      <a className={classes} href={href} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  if (isAnchorLink) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {children}
    </Link>
  );
}
