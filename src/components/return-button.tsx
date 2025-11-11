import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ReturnButtonProps {
  href: string;
  label: string;
}

const ReturnButton = ({ href, label }: ReturnButtonProps) => {
  return (
    <Button size="sm" asChild>
      <Link href={href}>
        <ArrowLeftIcon /> {label}
      </Link>
    </Button>
  );
};

export default ReturnButton;
