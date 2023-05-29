import React from 'react';
import { Box, FormControl, FormLabel, Input } from '@chakra-ui/react';

const CartForm: React.FC = () => {
  return (
    <Box>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl>
        <FormLabel>Phone</FormLabel>
        <Input type="tel" />
      </FormControl>
      <FormControl>
        <FormLabel>Address</FormLabel>
        <Input type="text" />
      </FormControl>
    </Box>
  );
};

export default CartForm;
