import React from 'react';
import { Menu } from 'antd';

import LogoutItem from './LogoutItem';
import { QrcodeOutlined } from '@ant-design/icons';

import UserSettings from '../../components/modals/UserSettings';
import AddCameraGroupModal from  '../../components/modals/AddCameraGroupModal';
import GenerateOTP from  '../../components/modals/GenerateOTP';
import CameraGroupInvitesModal from '../../components/modals/CameraGroupInvitesModal';
import CameraLicensesModal from '../../components/modals/CameraLicensesModal';

const SideMenu = (props) => (
  <Menu>
    {props.user.user_privileges_id == 0 || props.user.user_privileges_id == 3 ?
      <Menu.Item key='0'>
        <GenerateOTP linkText='Generate OTP' />
      </Menu.Item>
    :
      ''
    }
    <Menu.Item key='1'>
      <UserSettings />
    </Menu.Item>
    <Menu.Item key='2'>
      <AddCameraGroupModal linkText='Add Camera Group' />
    </Menu.Item>
    <Menu.Item key='3'>
      <CameraLicensesModal />
    </Menu.Item>
    <Menu.Item key='4'>
      <CameraGroupInvitesModal />
    </Menu.Item>
    <Menu.Item key='5'>
      <LogoutItem/>
    </Menu.Item>
  </Menu>
);

export default SideMenu;

// this.props.user.user_privileges_id == 0
