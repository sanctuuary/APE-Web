import React from 'react';
import { Button, Input, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchOutlined } from '@ant-design/icons';
import UserInfo from '@models/User';
import { getSession } from 'next-auth/client';
import styles from './PrivilegeManager.module.less';

interface PrivilegeManagerState {
  currentUser: UserInfo,
  users: UserInfo[],
}

/**
 * Component for granting / revoking administrator privileges to / from users.
 */
class PrivilegeManager extends React.Component<{}, PrivilegeManagerState> {
  /** React RefObject to refer to the user displayName search input */
  nameSearchRef: React.RefObject<Input>;

  /**
   * Constructor
   * @param props The props for the PrivilegeManager component.
   */
  constructor(props: any) {
    super(props);

    this.nameSearchRef = React.createRef();
    this.state = {
      currentUser: null,
      users: [],
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  /**
   * Get all approved users from the back-end (via an api proxy).
   */
  getUsers = async () => {
    const user: any = await getSession({});
    this.setState({ currentUser: user.user });

    const usersEndpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/admin/user`;
    await fetch(usersEndpoint, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => { this.setState({ users: data }); });
  };

  /**
   * Add table keys to the user information objects.
   * @param users The information of the users.
   */
  addKeys = (info: UserInfo[]) => {
    const result = [];
    info.forEach((user, index) => {
      result.push({
        // Add key
        key: index.toString(),
        // Add the user information
        ...user,
      });
    });
    return result;
  };

  /**
   * Generate the properties to allow search on user names.
   */
  getNameSearchProps = () => ({
    // Define the search filter dropdown
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={this.nameSearchRef}
          placeholder="Search by name"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    // Highlight the filter icon when a search filter is applied
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        className={filtered ? styles.nameSearchIcon : null}
      />
    ),
    // Filter rule
    onFilter: (val: string, record: UserInfo) => (
      record.displayName.toString().toLowerCase().includes(val.toLowerCase())
    ),
    // Select the search input after the search dropdown has opened
    onFilterDropdownVisibleChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => this.nameSearchRef.current.select(), 100);
      }
    },
  });

  /**
   * Send the request to grant a user administrator privileges.
   * @param userId The id of the user to grant the privileges to.
   */
  grantUserAdmin = (userId: string) => {
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/admin/adminstatus`;
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ userId, adminStatus: 'Active' }),
    })
      .then(() => { this.getUsers(); });
  };

  /**
   * Send the request to revoke a user's administrator privileges.
   * @param userId The id of the user to revoke the privileges from.
   */
  revokeUserAdmin = (userId: string) => {
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/admin/adminstatus`;
    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ userId, adminStatus: 'Revoked' }),
    })
      .then(() => { this.getUsers(); });
  };

  /**
   * Demote the current user after confirmation.
   */
  revokeSelfConfirm = () => {
    const { currentUser } = this.state;
    this.revokeUserAdmin(currentUser.userId);
  };

  /**
   * Get the columns definition for the table.
   * @returns The columns definition.
   */
  columns = (): ColumnsType<UserInfo> => {
    const { currentUser } = this.state;

    /*
     * Normally, variables should be placed above the component's constructor
     * However, this is impossible as getNameSearchProps would be defined below
     * and we would get an "Property is used before its initialization" error.
     */
    // eslint-disable-next-line react/sort-comp
    return [
      {
        title: 'Name',
        dataIndex: 'displayName',
        ...this.getNameSearchProps(),
      },
      {
        title: 'Role',
        width: '25%',
        render: (user: UserInfo) => (
          <div>
            {user.isAdmin
              && <Tag color="red">Admin</Tag>}
            {!user.isAdmin
              && <Tag>User</Tag>}
            {currentUser.userId === user.userId
              && <Tag color="green">You</Tag>}
          </div>
        ),
      },
      {
        title: 'Grant / Revoke privileges',
        width: 250,
        render: (user: UserInfo) => (
          <Space>
            <Tooltip title={`Make ${user.displayName} an administrator`}>
              <Button
                disabled={user.isAdmin}
                onClick={() => this.grantUserAdmin(user.userId)}
              >
                Grant
              </Button>
            </Tooltip>
            <Tooltip title={`Make ${user.displayName} a regular user`}>
              <Popconfirm
                title="You are about to revoke your own admin privileges. Are you sure?"
                okText="Yes"
                cancelText="Cancel"
                placement="bottomLeft"
                onConfirm={this.revokeSelfConfirm}
                disabled={currentUser.userId !== user.userId}
              >
                <Button
                  disabled={!user.isAdmin}
                  onClick={() => {
                    /*
                     * If the Popconfirm is disabled, call the revoke function.
                     * If the Popconfirm is enabled, the popconfirm calls the function.
                     */
                    if (currentUser.userId !== user.userId) {
                      this.revokeUserAdmin(user.userId);
                    }
                  }}
                >
                  Revoke
                </Button>
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
      },
    ];
  };

  render() {
    const { users } = this.state;

    return (
      <Table
        columns={this.columns()}
        dataSource={this.addKeys(users)}
      />
    );
  }
}

export default PrivilegeManager;
