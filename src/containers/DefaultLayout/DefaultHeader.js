import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 60, alt: 'سوژه' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'سوژه' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
        {/*  <NavItem className="px-3">
            <NavLink href="/">داشبورد</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/users">کاربران</Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#">تنظیمات</NavLink>
          </NavItem>*/}
        </Nav>
        <Nav className="mr-auto" navbar>
          <NavItem className="d-md-down-none">
            {/*<NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>*/}
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/default.png'} className="img-avatar" alt="" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center">حساب کاربری</DropdownItem>
              <DropdownItem><i className="fa fa-user-circle"></i>ویرایش پروفایل</DropdownItem>
              <DropdownItem><i className="fa fa-key"></i> تغییر کلمه عبور</DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> پیام ها<Badge color="warning">10</Badge></DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> خروج از سامانه</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
