import axios from 'axios'

/**
 * INITIAL STATE
 */
const initialState = {
  productList: [],
  isFetching: false
}

/**
 * ACTION TYPES
 */
const GET_PRODUCTS = 'GET_PRODUCTS'
const CREATE_PRODUCT = 'CREATE_PRODUCT'
const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
const CREATE_REVIEW = 'CREATE_REVIEW'
const DELETE_PRODUCT = 'DELETE_PRODUCT'

/**
 * ACTION CREATORS
 */

export const getProducts = products => ({type: GET_PRODUCTS, products})
export const createProduct = product => ({type: CREATE_PRODUCT, product})
export const updateProduct = product => ({type: UPDATE_PRODUCT, product})
export const createReview = (id, review) => ({type: CREATE_REVIEW, id, review})
export const deleteProduct = id => ({type: DELETE_PRODUCT, id})

/**
 * THUNK CREATORS
 */
export function fetchProducts() {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/products`)
      dispatch(getProducts(data))
    } catch (err) {
      console.error('Error fetching products: ', err)
    }
  }
}

export function addProduct(product, ownProps) {
  return async dispatch => {
    try {
      const {data} = await axios.post('/api/products', product)
      dispatch(createProduct(data))
      ownProps.history.push(`/products/${data.id}`)
    } catch (err) {
      console.error('Error adding product: ', err)
    }
  }
}

export const editProduct = (id, product, ownProps) => async dispatch => {
  try {
    const {data} = await axios.put(`/api/products/${id}`, product)
    dispatch(updateProduct(data))
    ownProps.history.push(`/products/${data.id}`)
  } catch (err) {
    console.error('Error editing product: ', err)
  }
}

export const addReview = (id, review) => async dispatch => {
  try {
    const {data} = await axios.post(`/api/products/${id}/review`, review)
    dispatch(createReview(id, data))
    dispatch(fetchProducts())
  } catch (err) {
    console.error('Error adding review: ', err)
  }
}

export const removeProduct = (id, ownProps) => async dispatch => {
  try {
    await axios.delete(`/api/products/${id}`)
    dispatch(deleteProduct(id))
    ownProps.history.push('/products')
  } catch (err) {
    console.error('Error deleting product: ', err)
  }
}

/**
 * REDUCER
 */
export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCTS:
      return {...state, productList: action.products, isFetching: true}
    case CREATE_PRODUCT:
      return {...state, productList: action.product, isFetching: true}
    case UPDATE_PRODUCT:
      return {
        ...state,
        productList: state.productList.map(item =>
          item.id === action.product.id ? action.product : item
        ),
        isFetching: true
      }
    case CREATE_REVIEW:
      return {
        ...state,
        productList: state.productList.map(item => {
          if (item.id === action.id) {
            return {...item, reviews: [...item.reviews, action.review]}
          } else return item
        }),
        isFetching: true
      }
    case DELETE_PRODUCT:
      return {
        ...state,
        productList: state.productList.filter(item => item.id !== action.id)
      }
    default:
      return state
  }
}
