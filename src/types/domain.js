/**
 * Domain model typedefs and enums for the admin dashboard.
 * This project is JavaScript-first; these JSDoc typedefs provide type hints.
 */

/** @typedef {'Pending' | 'Packing' | 'Delivering' | 'Delivered' | 'Cancelled'} OrderStatus */
/** @typedef {'Mobile Money' | 'Card' | 'Cash'} PaymentMethod */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} imageUrl
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} categoryId
 * @property {number} price
 * @property {string} unit
 * @property {number} stock
 * @property {string} image
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} customerId
 * @property {OrderStatus} status
 * @property {boolean} paid
 * @property {PaymentMethod} paymentMethod
 * @property {number} subtotal
 * @property {number} fee
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 * @property {string} phone
 * @property {string} email
 * @property {'Active' | 'Inactive'} status
 * @property {number} totalSpent
 */

export const ORDER_STATUSES = ['Pending', 'Packing', 'Delivering', 'Delivered', 'Cancelled'];
export const PAYMENT_METHODS = ['Mobile Money', 'Card', 'Cash'];
