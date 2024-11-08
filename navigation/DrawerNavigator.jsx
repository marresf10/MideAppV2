import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return <Drawer.Navigator initialRouteName='Submenu1'></Drawer.Navigator>;
};

export default DrawerNavigator;
