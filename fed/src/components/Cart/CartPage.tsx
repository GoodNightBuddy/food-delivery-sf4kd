import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Skeleton,
} from '@chakra-ui/react';
import axios from 'axios';
import { API, getAPIEndpoint } from '../../enums/API';
import CartProductList from './CartProductList';
import { useAppDispatch, useAppSelector } from '../../store/types/types';
import { shopActionCreator } from '../../store/action';
import {
  validateAddress,
  validateName,
  validatePhone,
  validateEmail,
} from '../../utils/validation';

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    address: '',
  });
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPhoneValid, setPhoneValid] = useState(true);
  const [isAddressValid, setAddressValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);

  const userId = useAppSelector(state => state.auth.userId);
  const shopId = useAppSelector(state => state.shop.shopId);
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const { name, email, number, address } = formData;

    setAddressValid(validateAddress(address));
    setNameValid(validateName(name));
    setPhoneValid(validatePhone(number));
    setEmailValid(validateEmail(email));

    return (
      validateAddress(address) &&
      validateName(name) &&
      validatePhone(number) &&
      validateEmail(email)
    );
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await axios.post(getAPIEndpoint(API.orders), { userId });
      dispatch(shopActionCreator.setShop(null));
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        number: '',
        address: '',
      })
    } catch (error) {
      setLoading(false);
      console.log('Error submitting order:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  if (loading) {
    return (
      <Flex flex={3} flexDirection="column">
        <Skeleton height="20px" my={2} />
        <Skeleton height="20px" my={2} />
        <Skeleton height="20px" my={2} />
        <Skeleton height="20px" my={2} />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex>
        <Box flex={1} mr={4}>
          <form>
            <FormControl isRequired isInvalid={!isNameValid}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  This field cannot be empty.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isEmailValid}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  Please enter a valid email address.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isPhoneValid}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  Please enter a valid phone number.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isAddressValid}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  This field cannot be empty.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <Button
              colorScheme="teal"
              size="sm"
              onClick={handleFormSubmit}
              isDisabled={shopId === null} // ShopId is set only if there is product in the cart
              mt={2}
              alignSelf="flex-end"
            >
              Submit Order
            </Button>
          </form>
        </Box>
        <CartProductList />
      </Flex>
    </Box>
  );
};

export default CartPage;
