import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Skeleton,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Alert,
  AlertDescription,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';
import { useAppDispatch, useAppSelector } from '../../store/types/types';
import { shopActionCreator } from '../../store/action';

interface IProduct {
  id: number;
  shop_id: number;
  product_name: string;
  price: string;
  product_image_url: string;
  quantity: number;
}

interface ShopProductListProps {
  shopId: number;
}

const ShopProductList: React.FC<ShopProductListProps> = ({ shopId }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useAppSelector(state => state.auth.userId);
  const stateShopId = useAppSelector(state => state.shop.shopId);
  const disabledBuying = !!stateShopId && shopId !== stateShopId;
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          getAPIEndpoint(API.shopProducts) + API.slash + shopId
        );
        setProducts(
          response.data.map((product: IProduct) => ({
            ...product,
            quantity: 1,
          }))
        ); // Initialize quantity to 1
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [shopId]);

  const handleAddToCart = async (productId: number, quantity: number) => {
    const selectedProduct = products.find(product => product.id === productId);

    if (selectedProduct) {
      const data = {
        productId,
        quantity,
        userId,
      };
      const response = await axios.put(getAPIEndpoint(API.cart), data);
      if (response.data.cart) {
        toast({
          title: 'Product added to cart',
          status: 'success',
          duration: 1500,
          isClosable: true,
          position: 'top',
        });
        setProducts(prevProducts =>
          prevProducts.map(product =>
            product.id === productId ? { ...product, quantity: 1 } : product
          )
        );

        if (!stateShopId) {
          dispatch(shopActionCreator.setShop(selectedProduct.shop_id));
        }
      }
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, quantity: Math.max(quantity, 1) }
          : product
      )
    );
  };

  if (loading) {
    return (
      <Flex flex={3} flexDirection="column">
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
        <Skeleton height="40px" mb={4} />
      </Flex>
    );
  }

  if (products.length === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Text fontSize="xl">No products available</Text>
      </Flex>
    );
  }

  return (
    <Box flex={3}>
      {disabledBuying && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          <AlertDescription>
            You can buy products only from one shop. To buy these products, you
            should remove products from another shop from your cart.
          </AlertDescription>
        </Alert>
      )}
      {products.map(product => (
        <Flex
          key={product.id}
          alignItems="center"
          p={4}
          borderBottom="1px solid gray"
        >
          <Image
            src={product.product_image_url}
            alt={product.product_name}
            boxSize="50px"
            mr={4}
          />
          <Box flex={1}>
            <Text>{product.product_name}</Text>
            <Text>${product.price}</Text>
          </Box>
          <Box flex={1}>
            <NumberInput
              value={product.quantity}
              min={1}
              onChange={(_, value) =>
                handleQuantityChange(product.id, Number(value))
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Button
            colorScheme="teal"
            size="sm"
            ml={4}
            onClick={() => handleAddToCart(product.id, product.quantity)}
            isDisabled={disabledBuying}
          >
            Add to Cart
          </Button>
        </Flex>
      ))}
    </Box>
  );
};

export default ShopProductList;
