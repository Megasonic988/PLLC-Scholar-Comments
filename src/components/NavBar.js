import React, { Component } from 'react';
import { Menu, Header, Icon, Image } from 'semantic-ui-react';
import UserLogin from './UserLogin';
import pllcLogoUrl from '../assets/pllc.png';
import { withRouter } from 'react-router-dom';

class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      visible: true
    };
  }
  
  redirectToHome() {
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Menu.Item name="PLLC Student Comments" active={true} onClick={() => this.redirectToHome()}>
            <Header as="h3">
              <Icon name="comments outline"/>
              PLLC Scholar Comments
            </Header>
          </Menu.Item>
          <Menu.Item>
            <Image src={pllcLogoUrl} size='small' />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item active={false} name="userlogin">
              <UserLogin user={this.props.user} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

NavBar = withRouter(NavBar);

export default NavBar;