import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item key="1">Option 1</Menu.Item>
    <Menu.Item key="2">Option 2</Menu.Item>
  </Menu>
);

export default function TestDropdown() {
  return (
    <Dropdown overlay={menu}>
      <Button>
        Actions <DownOutlined />
      </Button>
    </Dropdown>
  );
}
