import React from 'react'
import OrdersTable from './OrdersTable'

function StaffOnDeliveryOrders({orders, handleRowClick, orderDate}) {
  return (
    <OrdersTable
        orders={orders} 
        handleRowClick={handleRowClick} 
        orderDate={orderDate} 
        noOrdersMessage='No out for delivery orders yet' 
    />
  )
}

export default StaffOnDeliveryOrders