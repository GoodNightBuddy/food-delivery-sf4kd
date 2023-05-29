import { Box, Flex, Heading, Link } from '@chakra-ui/react';
import { Link as RouterLink, Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <Box minHeight="100vh">
      <Flex direction="column" minHeight="100vh">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          padding="1rem"
          backgroundColor="gray.200"
        >
          <Flex>
            <Link as={RouterLink} to="/shop" marginRight="1rem">
              Shop
            </Link>
            <Link as={RouterLink} to="/cart" marginRight="1rem">
              Cart
            </Link>
            <Link as={RouterLink} to="/orders">
              Orders
            </Link>
          </Flex>
          <Heading as="h1" fontSize="xl">
            My Food Delivery App
          </Heading>
        </Flex>
        <Box as="main" flexGrow={1} padding="1rem">
          <Outlet />
        </Box>
        <Flex
          as="footer"
          align="center"
          justify="center"
          padding="1rem"
          backgroundColor="gray.200"
        >
          <span>
            © {new Date().getFullYear()} My Food Delivery App. All rights
            reserved.
          </span>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Layout;
