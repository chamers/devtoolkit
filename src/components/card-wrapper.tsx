// src/components/card-wrapper.tsx
import React from "react";
import ReturnButton from "@/components/return-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

interface CardWrapperType {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  cardFooterLinkTitle?: string;
  cardFooterDescription?: string;
  cardFooterLink?: string;
  className?: string;
}

const CardWrapper = ({
  children,
  cardTitle,
  cardDescription,
  cardFooterLinkTitle = "Learn More", // Default value
  cardFooterDescription = "",
  cardFooterLink,
  className = "",
}: CardWrapperType) => {
  return (
    <>
      {/* Return button – natural width, left aligned */}
      <div className="w-full flex justify-start mb-2">
        <ReturnButton href="/" label="Home" />
      </div>
      <Card
        className={`w-[400px] relative bg-transparent border-none  ${className}`}
      >
        <CardHeader>
          <CardTitle
            className="text-2xl 
            font-semibold 
            text-slate-900 
            text-center"
          >
            {cardTitle}
          </CardTitle>
          <CardDescription className="font-handwriting text-2xl text-blue-100 text-center">
            {cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {cardFooterLink && (
          <CardFooter className="flex items-center justify-center gap-x-1">
            {cardFooterDescription && (
              <span className="text-sm">{cardFooterDescription}</span>
            )}
            <Link
              href={cardFooterLink}
              className="text-sm text-blue-100 hover:text-blue-200 transition-colors"
            >
              {cardFooterLinkTitle}
            </Link>
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default CardWrapper;
