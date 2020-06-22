import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'

import Badge from '@material-ui/core/Badge'
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket'
import {logout, fetchCart} from '../store'
import {CartPreview} from '.'
import history from '../history'

class TopBar extends Component {
  constructor() {
    super()
    this.state = {
      showCartPreview: false,
      query: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleOpenCartClick = this.handleOpenCartClick.bind(this)
    this.handleCloseCartClick = this.handleCloseCartClick.bind(this)
  }

  componentDidMount() {
    this.props.getCart()
  }

  handleChange(evt) {
    this.setState({query: evt.target.value})
  }

  handleSubmit(evt) {
    console.log('EVT TARGET VAL', evt.target.value)
    history.push(`/search/${this.state.query}`)
    this.setState({query: ''})
  }

  handleOpenCartClick() {
    this.setState({showCartPreview: true})
  }

  handleCloseCartClick() {
    this.setState({showCartPreview: false})
  }

  render() {
    const {cart, handleClick, isLoggedIn} = this.props

    if (cart) {
      const hasCart = cart.products.length
      const cartQty =
        hasCart &&
        cart.products.reduce((a, c) => {
          return a + c.line_item.quantity
        }, 0)

      return (
        <div className="top-bar">
          <div className="top-bar-left">
            <form>
              <input type="text" />
            </form>
          </div>
          {isLoggedIn ? (
            <div className="top-bar-right">
              {/* The navbar will show these links after you log in */}
              <Link to="/profile">Account</Link>
              <a href="#" onClick={handleClick}>
                Logout
              </a>
              <span className="MuiBadge-root">
                <Badge badgeContent={cartQty} color="secondary">
                  <ShoppingBasketIcon
                    className="cart-icon"
                    onClick={this.handleOpenCartClick}
                  />
                  <CartPreview
                    open={this.state.showCartPreview}
                    handleCloseCartClick={this.handleCloseCartClick}
                  />
                </Badge>
              </span>
            </div>
          ) : (
            <div className="top-bar-right">
              {/* The navbar will show these links before you log in */}
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>

              <span className="MuiBadge-root">
                <Badge badgeContent={cartQty} color="secondary">
                  <ShoppingBasketIcon
                    className="cart-icon"
                    onClick={this.handleOpenCartClick}
                  />
                  <CartPreview
                    open={this.state.showCartPreview}
                    handleCloseCartClick={this.handleCloseCartClick}
                  />
                </Badge>
              </span>
            </div>
          )}
        </div>
      )
    } else return null
  }
}

/**
 * CONTAINER
 */
const mapState = state => ({
  isLoggedIn: !!state.user.id,
  cart: state.cart.cart
})

const mapDispatch = dispatch => ({
  handleClick: () => dispatch(logout()),
  getCart: () => dispatch(fetchCart())
})

export default connect(mapState, mapDispatch)(TopBar)
