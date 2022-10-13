import {Alert, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography,} from '@mui/material';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import dynamic from 'next/dynamic';
import { Store } from '../context/Store';
import ReactPaginate from 'react-paginate';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store);
  const { userInfo} = state;
  

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  const router = useRouter();

  
  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/history`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err)});
      }
    };
    fetchOrders();
  }, [router, userInfo]);

//   const [items, setItems] = useState(orders)

//  const handleDelete = (id)  =>{
//   const newItem = items.filter((item) =>{ 
//     return item.id !== id
//   })
//   setItems(newItem)
  
//  }

const [currentItems, setCurrentItems] = useState(null);
const [pageCount, setPageCount] = useState(0);
const [itemOffset, setItemOffset] = useState(0);
const itemsPerPage = 5

useEffect(() => {
  
  const endOffset = itemOffset + itemsPerPage;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  setCurrentItems(orders.slice(itemOffset, endOffset));
  setPageCount(Math.ceil(orders.length / itemsPerPage));

}, [itemOffset, itemsPerPage, orders]);


const handlePageClick = (event) => {
  const newOffset = (event.selected * itemsPerPage) % orders.length;
  console.log(
    `User requested page number ${event.selected}, which is offset ${newOffset}`
  );
  setItemOffset(newOffset);
};
 
  return (
    <Layout title="Order History">
      <Typography component="h1" variant="h1">
        Order History
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>Product Name</TableCell> */}
                <TableCell>ID</TableCell>
                {/* <TableCell>NAME</TableCell> */}
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  {/* <TableCell>{historyName}</TableCell> */}
                  <TableCell>{order._id}</TableCell>
                  {/* <TableCell>{order.userName}</TableCell> */}
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>${order.totalPrice}</TableCell>
                  <TableCell>
                    {order.isPaid ? `paid at ${order.paidAt}` : 'not paid'}
                  </TableCell>
                  <TableCell>
                    <NextLink href={`/order/${order._id}`} passHref>
                      <Button variant="contained">Details</Button>
                    </NextLink>
                    {/* <Button variant="contained" onClick={handleDelete()}>Delete</Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
      )}
    </Layout>
  );
}
export default dynamic(() => Promise.resolve(OrderHistory), {
  ssr: false,
});