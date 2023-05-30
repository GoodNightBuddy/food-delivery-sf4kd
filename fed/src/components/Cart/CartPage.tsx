import React, { useState } from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';
import CartForm from './CartForm';
import CartProductList from './CartProductList';
import { useAppDispatch, useAppSelector } from '../../store/types/types';
import { shopActionCreator } from '../../store/action';

const CartPage: React.FC = () => {
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const userId = useAppSelector(state => state.auth.userId);
  const dispatch = useAppDispatch();

  const handleFormSubmit = async () => {
    if (userId)
      try {
        setLoading(true);
        await axios.post(getAPIEndpoint(API.orders), { userId });
        dispatch(shopActionCreator.setShop(null));
        setLoading(false);
        // Handle successful order submission
      } catch (error) {
        setLoading(false);
        console.log('Error submitting order:', error);
      }
  };

  if (loading) {
    return (
      <Flex flex={3} flexDirection="column">
        {/* Skeleton loading state */}
      </Flex>
    );
  }

  return (
    <Box>
      <Flex>
        <Box flex={1}>
          <CartForm />
        </Box>
        <CartProductList setTotalPrice={setTotalPrice} />
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Text>Total Price: ${totalPrice.toFixed(2)}</Text>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={handleFormSubmit}
          isDisabled={totalPrice === 0}
        >
          Submit Order
        </Button>
      </Flex>
    </Box>
  );
};

export default CartPage;
