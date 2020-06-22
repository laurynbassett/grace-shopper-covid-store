import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

import {CloseIcon, MenuIcon} from '@material-ui/icons'
import {Divider, Drawer, List, ListItem, ListItemText} from '@material-ui/core'

const Navbar = ({isAdmin}) => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer)
  }

  const drawer = (
    <List>
      {isAdmin && (
        <Fragment>
          <ListItem>
            <a href="/addproduct">
              <ListItemText primary="ADD PRODUCT" />
            </a>
          </ListItem>
          <Divider />
          <ListItem>
            <a href="/orders">
              <ListItemText primary="ORDERS" />
            </a>
          </ListItem>
          <Divider />

          <ListItem>
            <a href="/users">
              <ListItemText primary="USERS" />
            </a>
          </ListItem>
          <Divider />
        </Fragment>
      )}
      <ListItem>
        <a href="/products">
          <ListItemText primary="PRODUCTS" />
        </a>
      </ListItem>
      <Divider />
      <ListItem>
        <a href="/categories/masks">
          <ListItemText primary="MASKS" />
        </a>
      </ListItem>
      <Divider />
      <ListItem>
        <a href="/categories/gloves">
          <ListItemText primary="GLOVES" />
        </a>
      </ListItem>
      <Divider />
      <ListItem>
        <a href="/categories/sanitizers">
          <ListItemText primary="SANITIZERS" />
        </a>
      </ListItem>
      <Divider />
      <ListItem>
        <a href="/categories/toilet-paper">
          <ListItemText primary="TOILET PAPER" />
        </a>
      </ListItem>
    </List>
  )

  return (
    <div className="nav">
      <div className="nav-row-1">
        <div className="nav-left">
          {openDrawer ? (
            <CloseIcon
              className="nav-left-icon nav-left-close-icon"
              onClick={handleDrawerToggle}
            />
          ) : (
            <MenuIcon
              className="nav-left-icon nav-left-open-icon"
              onClick={handleDrawerToggle}
            />
          )}
          <Link to="/">
            <h1>COVID STORE</h1>
          </Link>
        </div>
        <nav className="nav-right">
          <div className="nav-links">
            <Link to="/products">PRODUCTS</Link>
            <Link to="/categories/masks">MASKS</Link>
            <Link to="/categories/gloves">GLOVES</Link>
            <Link to="/categories/sanitizers">SANITIZERS</Link>
            <Link to="/categories/toilet-paper">TOILET PAPER</Link>
            {/* The navbar will show these links to admins */}
            {isAdmin && <hr />}
            {isAdmin && <Link to="/addproduct">ADD PRODUCT</Link>}
            {isAdmin && <Link to="/orders">ORDERS</Link>}
            {isAdmin && <Link to="/users">USERS</Link>}
          </div>
        </nav>
      </div>
      {openDrawer && <div className="nav-row-2">{drawer}</div>}
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: !!state.user.isAdmin
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
