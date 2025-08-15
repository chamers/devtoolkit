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
  userName: "Username",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  userName: "text",
  email: "email",
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

export const images = [
  "/images/image-1.jpg",
  "/images/image-2.jpg",
  "/images/image-3.jpg",
  "/images/image-4.jpg",
  "/images/image-5.jpg",
];

export const descriptions = [
  "Small🐶 breeds like Chihuahuas, Pomeranians, or Dachshunds are known for their playful, energetic, and loyal nature. Despite their size, many small dogs have big personalities and love attention. They make great companions and are often affectionate with their owners.",
  "🐻s are large, powerful mammals found in forests, mountains, and even Arctic regions. There are different species like the grizzly bear, polar bear, and black bear. They are omnivores, eating fish, berries, honey, and even small animals. Some bears hibernate in winter to conserve energy.",
  "The giant 🐼 is a black-and-white bear native to China. They mainly eat bamboo and are known for their cute, round faces and slow, peaceful nature. Despite their bear-like appearance, they are not aggressive and love climbing trees!",
  "🦁Known as the 'King of the Jungle,' lions are powerful big cats that live in groups called prides. Found mainly in Africa, male lions are known for their majestic manes, while lionesses do most of the hunting. They are skilled hunters, preying on zebras, antelopes, and other animals.",
  "The tallest land animal, 🦒 have long necks that help them reach tree leaves for food. Native to Africa, they have unique spotted coats and can run surprisingly fast despite their size. Their long legs also make them excellent kickers against predators like lions.",
];
