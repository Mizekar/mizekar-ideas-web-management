import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  Badge,
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import miniLogo from '../../assets/img/brand/miniLogo.png'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {setUser} from "../../actions/action.user";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props)
  {
    super(props);

    //console.log(this.props.user)

  }
  render() {

    // eslint-disable-next-line
    const {children, ...attributes} = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile/>
        <AppNavbarBrand
          full={{src: logo, width: 100, height: 44, alt: 'سوژه'}}
          minimized={{src: miniLogo, width: 30, height: 30, alt: 'سوژه'}}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg"/>

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
        <Nav  style={{marginLeft:0,marginRight:'auto'}} navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="fa fa-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          {/*<NavItem className="d-md-down-none">
                        <Button className="btn btn-warning ml-4">5 پیام جدید</Button>
                        <Button className="btn-header">تماس با مدیر</Button>
                        <Button onClick={e => this.props.onLogout(e)} className="btn-header">خروج</Button>
                    </NavItem>*/}
          <NavItem className="d-md-down-none">
            <div className="user-name">{this.props.user.firstName+" "+this.props.user.lastName}</div>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <UncontrolledDropdown>
              <DropdownToggle nav>
                <img src={this.props.user.profileImage?this.props.user.profileImage:'../../assets/img/avatars/default.png'} className="img-avatar" alt=""/>
              </DropdownToggle>
              <DropdownMenu left style={{left: 0}}>
                {/*<DropdownItem header tag="div" className="text-center">حساب کاربری</DropdownItem>
                            <DropdownItem><i className="fa fa-user-circle"></i>ویرایش پروفایل</DropdownItem>
                            <DropdownItem><i className="fa fa-key"></i> تغییر کلمه عبور</DropdownItem>
                            <DropdownItem><i className="fa fa-comments"></i> پیام ها<Badge
                                color="warning">10</Badge></DropdownItem>*/}
                <DropdownItem onClick={()=>this.props.history.push("/profile")}>
                <i className="fa fa-user-circle"></i> حساب کاربری

                </DropdownItem>
                <DropdownItem onClick={e => this.props.onLogout(e)}>
                  <i className="fa fa-sign-out"></i>
                  خروج
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
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

//export default DefaultHeader;

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setUser: (info) => {
      dispatch(setUser(info));
    }
  };
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader));
