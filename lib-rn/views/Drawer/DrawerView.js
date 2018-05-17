import * as React from 'react';
import { Dimensions } from 'react-native';
import DrawerLayout from 'react-native-drawer-layout-polyfill';

import addNavigationHelpers from '../../addNavigationHelpers';
import DrawerSidebar from './DrawerSidebar';

/**
 * Component that renders the drawer.
 */
export default class DrawerView extends React.PureComponent {
  state = {
    drawerWidth: typeof this.props.drawerWidth === 'function' ? this.props.drawerWidth() : this.props.drawerWidth
  };

  componentWillMount() {
    this._updateScreenNavigation(this.props.navigation);

    Dimensions.addEventListener('change', this._updateWidth);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this._updateWidth);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.navigation.state.index !== nextProps.navigation.state.index) {
      const { routes, index } = nextProps.navigation.state;
      if (routes[index].routeName === 'DrawerOpen') {
        this._drawer.openDrawer();
      } else if (routes[index].routeName === 'DrawerToggle') {
        if (this._drawer.state.drawerShown) {
          this.props.navigation.navigate('DrawerClose');
        } else {
          this.props.navigation.navigate('DrawerOpen');
        }
      } else {
        this._drawer.closeDrawer();
      }
    }
    this._updateScreenNavigation(nextProps.navigation);
  }

  _handleDrawerOpen = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerOpen') {
      this.props.navigation.navigate('DrawerOpen');
    }
  };

  _handleDrawerClose = () => {
    const { navigation } = this.props;
    const { routes, index } = navigation.state;
    if (routes[index].routeName !== 'DrawerClose') {
      this.props.navigation.navigate('DrawerClose');
    }
  };

  _updateScreenNavigation = navigation => {
    // $FlowFixMe there's no way type the specific shape of the nav state
    const navigationState = navigation.state.routes.find(route => route.routeName === 'DrawerClose');
    if (this._screenNavigationProp && this._screenNavigationProp.state === navigationState) {
      return;
    }
    this._screenNavigationProp = addNavigationHelpers({
      dispatch: navigation.dispatch,
      state: navigationState
    });
  };

  _updateWidth = () => {
    const drawerWidth = typeof this.props.drawerWidth === 'function' ? this.props.drawerWidth() : this.props.drawerWidth;

    if (this.state.drawerWidth !== drawerWidth) {
      this.setState({ drawerWidth });
    }
  };

  _getNavigationState = navigation => {
    const navigationState = navigation.state.routes.find(route => route.routeName === 'DrawerClose');
    return navigationState;
  };

  _renderNavigationView = () => <DrawerSidebar screenProps={this.props.screenProps} navigation={this._screenNavigationProp} router={this.props.router} contentComponent={this.props.contentComponent} contentOptions={this.props.contentOptions} drawerPosition={this.props.drawerPosition} style={this.props.style} />;

  render() {
    const DrawerScreen = this.props.router.getComponentForRouteName('DrawerClose');

    const screenNavigation = addNavigationHelpers({
      state: this._screenNavigationProp.state,
      dispatch: this._screenNavigationProp.dispatch
    });

    const config = this.props.router.getScreenOptions(screenNavigation, this.props.screenProps);

    return <DrawerLayout ref={c => {
      this._drawer = c;
    }} drawerLockMode={this.props.screenProps && this.props.screenProps.drawerLockMode || config && config.drawerLockMode} drawerBackgroundColor={this.props.drawerBackgroundColor} drawerWidth={this.state.drawerWidth} onDrawerOpen={this._handleDrawerOpen} onDrawerClose={this._handleDrawerClose} useNativeAnimations={this.props.useNativeAnimations} renderNavigationView={this._renderNavigationView} drawerPosition={this.props.drawerPosition === 'right' ? DrawerLayout.positions.Right : DrawerLayout.positions.Left}>
        <DrawerScreen screenProps={this.props.screenProps} navigation={this._screenNavigationProp} />
      </DrawerLayout>;
  }
}