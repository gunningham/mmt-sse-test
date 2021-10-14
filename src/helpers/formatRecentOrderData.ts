import { Order, OrderItem, User } from '@/types';

type ReturnResult = {
  customer: {
    firstName: string;
    lastName: string;
  };
  order: {
    orderNumber: number;
    orderDate: Date;
    deliveryAddress: string;
    orderItems: OrderItem[];
  };
  deliveryExpected: Date;
};

export const formatRecentOrderData = (
  mostRecentOrder: Order,
  userDetails: User,
): ReturnResult => {
  const deliveryAddress = `${userDetails.houseNumber} ${userDetails.street}, ${userDetails.town}, ${userDetails.postcode}`;

  return {
    customer: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    },
    order: {
      orderNumber: mostRecentOrder.orderNumber,
      orderDate: mostRecentOrder.orderDate,
      deliveryAddress,
      orderItems: mostRecentOrder.orderItems,
    },
    deliveryExpected: mostRecentOrder.deliveryExpected,
  };
};
