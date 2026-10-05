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
    summary: "Separate local photo viewer and file organizer. It is not opened from this site.",
  },
  {
    id: "library",
    name: "The rest of the library",
    status: "planned",
    summary: "Later LOY apps are added here. The same membership covers them. No second charge.",
  },
];
