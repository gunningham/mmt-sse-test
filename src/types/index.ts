export type User = {
  email: string;
  customerId: string;
  website: boolean;
  firstName: string;
  lastName: string;
  lastLoggedIn: string;
  houseNumber: string;
  street: string;
  town: string;
  postcode: string;
  preferredLanguage: string;
};

export type SqlOrderItem = {
  ORDERID: number;
  ORDERDATE: Date;
  DELIVERYEXPECTED: Date;
  CONTAINSGIFT: boolean;
  QUANTITY: number;
  PRICE: number;
  PRODUCTNAME: string;
};

export type OrderItem = {
  product: string;
  quantity: number;
  priceEach: number;
};

export type Order = {
  orderNumber: number;
  orderDate: Date;
  deliveryExpected: Date;
  orderItems: OrderItem[];
};

export type Error = {
  message: string;
  status: number;
};
