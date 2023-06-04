import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Skeleton,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../store/types/types';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';
import { FaTrash } from 'react-icons/fa';
import { shopActionCreator } from '../../store/action';

interface ICartItem {
  quantity: number;
  product_id: number;
  product_name: string;
  price: string;
  product_image_url: string;
  shop_id: number;
}

interface IUpdateCartData {
  quantity: number;
  productId: number;
  userId: number;
}

const CartProductList: React.FC = () => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const currentShopId = useAppSelector(state => state.shop.currentShopId);
  const userId = useAppSelector(state => state.auth.userId);
  const [showSkeletons, setShowSkeletons] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          getAPIEndpoint(API.cart) + API.slash + userId
        );
        setCartItems(response.data.cart);
        setTotalPrice(response.data.total_price);
      } catch (error) {
        console.log('Error fetching cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [setTotalPrice, userId]);

  const updateCart = useCallback(
    async (data: IUpdateCartData) => {
      setLoading(true);
      try {
        const response = await axios.patch(getAPIEndpoint(API.cart), data);
        setCartItems(response.data.cart);
        setTotalPrice(response.data.total_price);
      } catch (error) {
        console.log('Error updating cart:', error);
      } finally {
        setLoading(false);
      }
    },
    [setTotalPrice]
  );

  const handleIncrement = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const productId = Number(
        (event.currentTarget as HTMLDivElement).dataset.productId
      );
      const quantity = cartItems.find(
        item => item.product_id === productId
      )?.quantity;

      if (userId && quantity) {
        updateCart({ productId, userId, quantity: quantity + 1 });
      }
    },
    [cartItems, userId, updateCart]
  );

  const handleDecrement = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      const productId = Number(
        (event.currentTarget as HTMLDivElement).dataset.productId
      );
      const quantity = cartItems.find(
        item => item.product_id === productId
      )?.quantity;
      if (userId && quantity && quantity !== 1) {
        updateCart({ productId, quantity: quantity - 1, userId });
      }
    },
    [cartItems, userId, updateCart]
  );

  const handleRemoveFromCart = async (productId: number) => {
    try {
      const response = await axios.delete(getAPIEndpoint(API.cart), {
        params: {
          userId,
          productId,
        },
      });
      setCartItems(response.data.cart);
      setTotalPrice(response.data.total_price);
      // Set to null if there is no products in cart
      if (currentShopId !== null && response.data.cart.length === 0) {
        dispatch(shopActionCreator.setCurrentShop(null));
      }
    } catch (error) {
      console.log('Error updating cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowSkeletons(true);
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setShowSkeletons(false);
    }
  }, [loading]);

  return (
    <Box flex={3}>
      {showSkeletons && (
        <>
          <Skeleton height="50px" my={2} />
          <Skeleton height="50px" my={2} />
          <Skeleton height="50px" my={2} />
        </>
      )}

      {!showSkeletons && cartItems.length === 0 && (
        <Alert status="info" borderRadius={'md'}>
          <AlertIcon />
          Your shopping cart is empty
        </Alert>
      )}

      {!showSkeletons &&
        cartItems.map((item: ICartItem) => (
          <Flex
            key={item.product_id}
            alignItems="center"
            p={4}
            borderBottom="1px solid gray"
          >
            <Image
              src={item.product_image_url}
              alt={item.product_name}
              boxSize="50px"
              mr={4}
            />
            <Box flex={1}>
              <Text>{item.product_name}</Text>
              <Text>${item.price}</Text>
            </Box>
            <Box flex={1}>
              <NumberInput value={item.quantity} min={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper
                    onClick={handleIncrement}
                    data-product-id={item.product_id}
                  />
                  <NumberDecrementStepper
                    onClick={handleDecrement}
                    data-product-id={item.product_id}
                  />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <IconButton
              icon={<FaTrash />}
              aria-label="Remove from cart"
              onClick={() => handleRemoveFromCart(item.product_id)}
              ml={2}
            />
          </Flex>
        ))}
      {/* Total price exists only if cart exists. If cart exists then currentShopId is set */}
      {!showSkeletons && currentShopId && (
        <Flex justifyContent="space-between" alignItems="end" mt={4}>
          <Text>Total Price: ${totalPrice.toFixed(2)}</Text>
        </Flex>
      )}
    </Box>
  );
};

export default CartProductList;
