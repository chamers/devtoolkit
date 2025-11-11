"use client";

import * as React from "react";
import { Button } from "../ui/button";
import type { IconType } from "react-icons";

type SocialButtonProps = {
  Icon: IconType; // e.g. FcGoogle, FaGithub
  label: string; // e.g. "Continue with Google"
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

const SocialButton: React.FC<SocialButtonProps> = ({
  Icon,
  label,
  onClick,
  disabled = false,
  className,
  ...rest
}) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-2 ${
        className ?? ""
      }`}
      {...rest}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </Button>
  );
};

export default SocialButton;
