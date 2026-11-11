import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SideDrawer from '../SideDrawer';

type Props = {
  style?: object;
};

/** Menu control that opens the shared admin/staff SideDrawer. */
const AdminMenuButton = ({style}: Props) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityLabel="Open menu"
        accessibilityRole="button"
        style={[styles.button, style]}
        onPress={() => setDrawerVisible(true)}>
        <Icon name="menu" size={22} color="#1A1A1A" />
      </Pressable>
      <SideDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AdminMenuButton;
