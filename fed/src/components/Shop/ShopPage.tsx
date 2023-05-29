import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ShopList from './ShopList';
import ShopProductList from './ShopProductList';

const ShopPage: React.FC = () => {
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);

  const handleShopClick = (shopId: number) => {
    setSelectedShopId(shopId);
  };

  return (
    <Flex>
      <Box flex={1}>
        <ShopList onItemClick={handleShopClick} />
      </Box>
      <Box flex={3} borderLeft="1px solid gray" pl={4}>
        {selectedShopId ? (
          <ShopProductList shopId={selectedShopId} />
        ) : (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Box fontSize="xl">Choose your shop</Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default ShopPage;
