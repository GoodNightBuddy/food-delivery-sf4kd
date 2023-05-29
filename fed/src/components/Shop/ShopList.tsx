import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';

interface IShop {
  id: number;
  name: string;
  shop_image_url: string;
}

interface ShopListProps {
  onItemClick: (shopId: number) => void;
}

const ShopList: React.FC<ShopListProps> = ({ onItemClick }) => {
  const [shops, setShops] = useState<IShop[]>([]);

  useEffect(() => {
    axios.get(getAPIEndpoint(API.shops)).then((response) => {
      setShops(response.data);
    });
  }, []);

  return (
    <Box flex={1}>
      {shops.map((shop) => (
        <Box
          key={shop.id}
          bgImage={`url(${shop.shop_image_url})`}
          bgSize="cover"
          p={4}
          mb={4}
          onClick={() => onItemClick(shop.id)}
          cursor="pointer"
        >
          <Text fontSize="xl" fontWeight="bold" color="black">
            {shop.name}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default ShopList;
