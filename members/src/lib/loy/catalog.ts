export const PUBLIC_SITE = "https://www.lambofyeshu.life";
export const MEMBERS_HOST = "members.lambofyeshu.life";

export const MEMBERSHIP = {
  name: "LOY Membership",
  price: 79,
  currency: "USD",
  refundDays: 14,
  includedExtraSeats: 10,
  extraSeatPrice: 25,
};

export type ProductStatus = "included" | "planned";

export type Product = {
  id: string;
  name: string;
  status: ProductStatus;
  summary: string;
  openTo?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "yashafiness",
    name: "YashaFiness",
    status: "included",
    summary: "File organizer and image viewer. Rules and optional AI stay on your machine. Share a gallery as one page you can host.",
    openTo: "/studio",
  },
  {
    id: "library",
    name: "The rest of the library",
    status: "planned",
    summary: "Later LOY apps are added here. The same membership covers them. No second charge.",
  },
];
