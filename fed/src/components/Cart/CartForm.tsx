import React from 'react';
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';

const CartForm: React.FC = () => {
  return (
    <Box>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Phone</FormLabel>
        <Input type="tel" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Address</FormLabel>
        <Input type="text" />
      </FormControl>
    </Box>
  );
};

export default CartForm;
