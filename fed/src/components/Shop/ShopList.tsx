import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAppSelector } from '../../store/types/types';

interface ShopListProps {
  onItemClick: (shopId: number) => void;
}

const ShopList: React.FC<ShopListProps> = ({ onItemClick }) => {
  const shops = useAppSelector(state => state.shop.shops);

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
