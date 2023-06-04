import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Skeleton, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';
import { useAppSelector } from '../../store/types/types';

interface IOrderItem {
  orderNumber: number;
  orderDate: string;
  items: {
    order_id: number;
    quantity: number;
    product_id: number;
    product_name: string;
    price: string;
    product_image_url: string;
  }[];
  total_price: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector(state => state.auth.userId);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          getAPIEndpoint(API.orders) + API.slash + userId
        );
        setOrders(response.data);
      } catch (error) {
        console.log('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <Box>
        <Skeleton height="50px" my={2} />
        <Skeleton height="50px" my={2} />
        <Skeleton height="50px" my={2} />
      </Box>
    );
  }

  return (
    <Box>
      {!orders.length && <Alert status="info" borderRadius={'md'}>
          <AlertIcon />
          You do not have  orders yet
        </Alert>}
      {orders.map((order: IOrderItem) => (
        <Box key={order.orderNumber} p={4} borderBottom="1px solid gray">
          <Text fontWeight="bold" mb={2}>
            Order Number: {order.orderNumber}
          </Text>
          <Text mb={2}>
            Order Date: {new Date(order.orderDate).toLocaleString()}
          </Text>
          {order.items.map(item => (
            <Flex key={item.product_id} alignItems="center" my={2}>
              <Image
                src={item.product_image_url}
                alt={item.product_name}
                boxSize="50px"
                mr={4}
              />
              <Box>
                <Text>{item.product_name}</Text>
                <Text>Price: ${item.price}</Text>
                <Text>Quantity: {item.quantity}</Text>
              </Box>
            </Flex>
          ))}
          <Text fontWeight="bold" mt={2}>
            Total Price: ${order.total_price.toFixed(2)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default Orders;
