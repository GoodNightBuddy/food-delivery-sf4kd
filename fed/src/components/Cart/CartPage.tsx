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
  useToast,
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
import MapSearch from '../Map/MapSearch';

const CartPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    shipping_address: '',
  });
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPhoneValid, setPhoneValid] = useState(true);
  const [isAddressValid, setAddressValid] = useState(true);
  const [isNameValid, setNameValid] = useState(true);

  const userId = useAppSelector(state => state.auth.userId);
  const shopId = useAppSelector(state => state.shop.shopId);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const showToast = () => {
    toast({
      title: 'Order successfully submited!',
      status: 'success',
      duration: 1500,
      isClosable: true,
      position: 'top',
    });
  };

  const validateForm = () => {
    const { contact_name, contact_email, contact_phone, shipping_address } =
      formData;

    setAddressValid(validateAddress(shipping_address));
    setNameValid(validateName(contact_name));
    setPhoneValid(validatePhone(contact_phone));
    setEmailValid(validateEmail(contact_email));

    return (
      validateAddress(shipping_address) &&
      validateName(contact_name) &&
      validatePhone(contact_phone) &&
      validateEmail(contact_email)
    );
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { contact_name, contact_email, contact_phone, shipping_address } =
        formData;
      setLoading(true);
      await axios.post(getAPIEndpoint(API.orders), {
        contact_name,
        contact_email,
        contact_phone,
        shipping_address,
        userId,
      });
      dispatch(shopActionCreator.setShop(null));
      setFormData({
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        shipping_address: '',
      });
      showToast();
    } catch (error) {
      console.log('Error submitting order:', error);
    } finally {
      setLoading(false);
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
        <Box flex={4} mr={4}>
          <form>
            <FormControl isRequired isInvalid={!isNameValid}>
              <FormLabel>Contact name</FormLabel>
              <Input
                type="text"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  This field cannot be empty.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isEmailValid}>
              <FormLabel>Contact email</FormLabel>
              <Input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  Please enter a valid email address.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isPhoneValid}>
              <FormLabel>Contact phone number</FormLabel>
              <Input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
              />
              <Box h={4} pt={1} mb={2}>
                <FormErrorMessage m={0}>
                  Please enter a valid phone number.
                </FormErrorMessage>
              </Box>
            </FormControl>
            <FormControl isRequired isInvalid={!isAddressValid}>
              <FormLabel>Shipping address</FormLabel>
              <Input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
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
          <Box mt={4}>
            <MapSearch />
            {/* <Map center={{lat: 44, lng:-80}} zoom={10}/> */}
          </Box>
        </Box>
        <Box flex={3}>
          <CartProductList />
        </Box>
      </Flex>
    </Box>
  );
};

export default CartPage;
