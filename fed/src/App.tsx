import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/hoc/Layout';
import Shop from './components/Shop/ShopPage';
import { useAppDispatch, useAppSelector } from './store/types/types';
import { authActionCreator } from './store/action';
import CartPage from './components/Cart/CartPage';
import Orders from './components/Orders/Orders';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Spinner,
  Text,
} from '@chakra-ui/react';
export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authActionCreator.initUser());
  }, [dispatch]);

  const isLoading = useAppSelector(state => state.auth.loading);
  const userId = useAppSelector(state => state.auth.userId);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDir={"column"}
      >
        <Spinner
          thickness="4px"
          speed="1s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text maxW={"75%"} align={'center'}>Services, that host this app is free, so it may need time for launching. Please, try to reload the page and wait a few seconds. Thanks:)</Text>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Oops, something went wrong...</AlertTitle>
        <AlertDescription>
          Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Routes>
      <Route path={'/*'} element={<Layout />}>
        <Route index path={'shop'} element={<Shop />} />
        <Route path={'cart'} element={<CartPage />} />
        <Route path={'orders'} element={<Orders />} />
      </Route>
      <Route index path="*" element={<Navigate to="/shop" replace />} />
    </Routes>
  );
};
