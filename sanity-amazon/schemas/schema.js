
import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'
import product from './product'
import banner from './banner'
import user from './user'
import footer from './footer'
import paymentResult from './paymentResult'
import shippingAddress from './shippingAddress'
import orderItem from './orderItem'
import order from './order'
import comment from './comment'


export default createSchema({
  name: 'default',  
  types: schemaTypes.concat([banner,product, footer, user, order,
  orderItem, shippingAddress, paymentResult, comment]),
})
