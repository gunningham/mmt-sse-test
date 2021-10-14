import sql from 'mssql';
import HttpStatus from 'http-status';
import { check, validationResult } from 'express-validator';
import { Request } from 'express';

import { Order, OrderItem, SqlOrderItem, Error } from '@/types';
import { getMostRecentOrdersQuery, buildError } from '@/helpers';
import { SQL_CONFIG } from '@/constants';

/**
 * Get lastest order via customerId
 *
 * @returns {Order}
 */

type ReturnResult = {
  order?: Order;
  error?: Error;
};

export const getMostRecentOrder = async (
  req: Request,
): Promise<ReturnResult> => {
  // Validate customerId
  await check('customerId', 'customerId is not valid')
    .exists()
    .isString()
    .run(req);

  const validationErrors = validationResult(req).array();

  if (validationErrors.length) {
    return {
      error: buildError(validationErrors[0].msg, HttpStatus.BAD_REQUEST),
    };
  }

  // Query database to get customers orders
  try {
    await sql.connect(SQL_CONFIG);
    const customerOrders = await sql.query(
      // has built in SQL injection prevention
      getMostRecentOrdersQuery(req.body.customerId),
    );

    // Return error if no orders found
    if (!customerOrders.recordset?.length) {
      return {
        error: buildError(
          'No orders found for this customer',
          HttpStatus.NOT_FOUND,
        ),
      };
    }

    // Find most recent order
    const mostRecentOrder: SqlOrderItem = customerOrders.recordset.reduce(
      (a, b) => (a.ORDERDATE > b.ORDERDATE ? a : b),
    );

    // Get all order items by most recent order ID
    const orderItems: SqlOrderItem[] = customerOrders.recordset.filter(
      (order: SqlOrderItem) => order.ORDERID === mostRecentOrder.ORDERID,
    );

    // Format order items
    const formattedOrderItems: OrderItem[] = orderItems.map(
      (orderItem: SqlOrderItem) => {
        return {
          product: orderItem.CONTAINSGIFT ? 'Gift' : orderItem.PRODUCTNAME,
          quantity: orderItem.QUANTITY,
          priceEach: orderItem.PRICE,
        };
      },
    );

    // Return formatted object
    return {
      order: {
        orderNumber: mostRecentOrder.ORDERID,
        orderDate: mostRecentOrder.ORDERDATE,
        deliveryExpected: mostRecentOrder.DELIVERYEXPECTED,
        orderItems: formattedOrderItems,
      },
    };
  } catch (error) {
    return {
      error: buildError(error.message, HttpStatus.INTERNAL_SERVER_ERROR),
    };
  }
};
