import { Rating, Resource } from "@/types";

export const navigationLinks = [
  {
    href: "/library",
    label: "Library",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
};
export const sampleResources: Resource[] = [
  {
    id: 1,
    title: "Figma",
    description: "A Collaborative Interface Design Tool for Teams",
    websiteUrl: "https://figma.com",
    category: "Design", // Use the string directly
    tags: ["Design", "Collaboration", "UI/UX"],
    pricing: "Freemium",
    rating: 4 as Rating,
    logoUrl: "/images/bookImg1.png",
    author: "Figma Inc.",
    createdAt: new Date(),          // Add this
    updatedAt: new Date(), 
    isMobileFriendly: true,
    projectType: "Official", 
    comments: [
      {
        user: "user938",
        comment: "Great tool for our design team!",
        date: new Date("2025-06-12"),
      },
      {
        user: "user922",
        comment: "Could use more integrations.",
        date: new Date("2025-06-12"),
      },
      {
        user: "user979",
        comment: "The free plan is very generous.",
        date: new Date("2025-06-08"),
      },
      {
        user: "user106",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-07"),
      },
      {
        user: "user297",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-05"),
      },
    ],
  
    isFeatured: true,
},
  {
    id: 2,
    title: "Figma",
    description: "A Collaborative Interface Design Tool for Teams",
    websiteUrl: "https://figma.com",
    category: "UI/UX", // Use the string directly
    tags: ["Design", "Collaboration", "UI/UX"],
    pricing: "Freemium",
    rating: 4 as Rating,
    logoUrl: "/images/bookImg1.png",
    author: "Figma Inc.",
    createdAt: new Date(),          // Add this
    updatedAt: new Date(), 
    isMobileFriendly: true,
    projectType: "Official", 
    comments: [
      {
        user: "user938",
        comment: "Great tool for our design team!",
        date: new Date("2025-06-12"),
      },
      {
        user: "user922",
        comment: "Could use more integrations.",
        date: new Date("2025-06-12"),
      },
      {
        user: "user979",
        comment: "The free plan is very generous.",
        date: new Date("2025-06-08"),
      },
      {
        user: "user106",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-07"),
      },
      {
        user: "user297",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-05"),
      },
    ],
  
    isFeatured: false,
},
  {
    id: 3,
    title: "Figma",
    description: "A Collaborative Interface Design Tool for Teams",
    websiteUrl: "https://figma.com",
    category: "Frontend", // Use the string directly
    tags: ["Design", "Collaboration", "UI/UX"],
    pricing: "Freemium",
    rating: 4 as Rating,
    logoUrl: "/images/bookImg1.png",
    author: "Figma Inc.",
    createdAt: new Date(),          // Add this
    updatedAt: new Date(), 
    isMobileFriendly: true,
    projectType: "Official", 
    comments: [
      {
        user: "user938",
        comment: "Great tool for our design team!",
        date: new Date("2025-06-12"),
      },
      {
        user: "user922",
        comment: "Could use more integrations.",
        date: new Date("2025-06-12"),
      },
      {
        user: "user979",
        comment: "The free plan is very generous.",
        date: new Date("2025-06-08"),
      },
      {
        user: "user106",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-07"),
      },
      {
        user: "user297",
        comment: "The UI is clean and fast.",
        date: new Date("2025-06-05"),
      },
    ],
  
    isFeatured: true,
},
 
]