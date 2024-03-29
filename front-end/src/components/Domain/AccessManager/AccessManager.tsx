import React from 'react';
import { Button, Form, Input, message, Modal, Progress, Select, Table, Tooltip } from 'antd';
import { DomainDetails, Access, UserWithAccess } from '@models/Domain';
import UserSearch from '@components/UserSearch/UserSearch';
import { UserAddOutlined } from '@ant-design/icons';
import UserInfo from '@models/User';
import { ColumnsType } from 'antd/lib/table';
import { getSession } from 'next-auth/client';

const { Option } = Select;

/**
 * The props for the {@link AccessManager} component.
 */
interface AccessManagerProps {
  /** The domain who's access to manage. */
  domain: DomainDetails,
  /** Callback function when the ownership is transferred to another user. */
  onOwnershipTransferred: (newOwner: UserInfo) => void,
}

/**
 * The state of the {@link AccessManager} component.
 */
interface AccessManagerState {
  /** The user of the current session. */
  currentUser: UserInfo,
  /** The users which have access to the domain (except: Owner, Revoked). */
  usersWithAccess: UserWithAccess[],
  /** The currently selected access level for adding new users. */
  addUserSelectedRole: Access,
  /** Whether the transfer ownership modal is opened. */
  transferOwnershipModalVisible: boolean,
}

/**
 * Component for managing access to a domain.
 */
class AccessManager extends React.Component<AccessManagerProps, AccessManagerState> {
  constructor(props: AccessManagerProps) {
    super(props);

    this.state = {
      currentUser: null,
      usersWithAccess: [],
      addUserSelectedRole: Access.Read,
      transferOwnershipModalVisible: false,
    };
  }

  async componentDidMount() {
    // Get the current user from the session
    await getSession({}).then((user: any) => this.setState({ currentUser: user.user }));
    this.getUsersWithAccess();
  }

  /**
   * Get all users with access to the domain.
   */
  getUsersWithAccess = async () => {
    const { domain } = this.props;
    const accessLevels = ['Read', 'ReadWrite'].join('/');

    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domain.id}/${accessLevels}`;
    await fetch(endpoint, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => this.setState({ usersWithAccess: data }));
  };

  /**
   * Add table keys to the UserDomainAccess objects.
   * @param userDomainAccessList The user domain access information array.
   */
  addKeys = (userDomainAccessList: UserWithAccess[]) => {
    const result = [];
    userDomainAccessList.forEach((access, index) => {
      result.push({
        // Add key
        key: index.toString(),
        // Add the access information
        ...access,
      });
    });
    return result;
  };

  /**
   * Send the updated access level to the back-end.
   * @param value The access level.
   */
  updateAccessLevel = async (userId: string, value: Access) => {
    const { domain } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domain.id}`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, access: value }),
    })
      .then((response) => {
        if (response.status !== 200) {
          message.error('Failed to update the permission');
        }
      });
  };

  /**
   * Revoke a user's access to the domain.
   * @param userId The id of the user who's access is being revoked.
   */
  onRevoke = (userId: string) => {
    const { domain } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domain.id}`;
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, access: Access.Revoked }),
    })
      .then((response) => {
        if (response.status !== 200) {
          message.error('Failed to revoke access');
        }
        this.getUsersWithAccess();
      });
  };

  /**
   * Callback function for when the access level select for adding users changes.
   * @param value The new access level.
   */
  onAddUserRoleChange = (value: Access) => {
    this.setState({ addUserSelectedRole: value });
  };

  /**
   * When a user is selected to be added, send a request to add the user.
   * @param user The user who is being added.
   */
  onAddUser = async (user: UserInfo) => {
    const { addUserSelectedRole } = this.state;
    await this.updateAccessLevel(user.userId, addUserSelectedRole);
    this.getUsersWithAccess();
  };

  /**
   * Validate that the user that is added to the permissions table is not the owner of the domain.
   * @param email The email address that is filled in.
   * @returns True if the user may be added, false if the user may not be added.
   */
  validateAddUser = (email: string): boolean => {
    const { currentUser } = this.state;

    /*
     * The current user is the owner, the owner may not downgrade his/her own permissions this way.
     * Check if the current user is about to downgrade his/her own permissions.
     * If so, validation fails.
     */
    if (email === currentUser.email) {
      message.warning('You cannot add yourself to the permissions list when you are the owner of the domain');
      return false;
    }
    return true;
  };

  /**
   * Callback for the transfer ownership modal, when the domain ownership should be transferred.
   * @param newOwner The new owner of the domain.
   */
  onTransfer = (newOwner: UserInfo) => {
    if (newOwner === null) {
      message.info('Please select a user');
      return;
    }

    const { domain, onOwnershipTransferred } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/transfer/${domain.id}`;
    fetch(endpoint, {
      method: 'POST',
      body: newOwner.userId,
    })
      .then((response) => response.json())
      .then((json: any) => {
        switch (json.outcome) {
          case 0:
            message.info('Domain ownership has been transferred');
            this.setState({ transferOwnershipModalVisible: false });
            onOwnershipTransferred(newOwner);
            break;
          case 1:
            message.error('You are not allowed to transfer the ownership of this domain');
            this.setState({ transferOwnershipModalVisible: false });
            break;
          case 2:
            message.error('Could not find the user to transfer ownership to');
            break;
          default:
            message.error('Failed to transfer ownership due to an unexpected error');
            throw Error('Failed to transfer ownership due to an unexpected error');
        }
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e));
  };

  /**
   * Generate a list of options for a Select for selecting access levels.
   * @returns Options for a Select to select the access level.
   */
  accessOptions = () => {
    const options = [];
    let ind = 0;
    Object.keys(Access).forEach((key) => {
      // Do not include the revoked and owner access level as a selectable option
      if (key !== 'Revoked' && key !== 'Owner') {
        ind += 1;
        options.push((
          <Option
            key={ind}
            value={key}
          >
            {key}
          </Option>
        ));
      }
    });
    return options;
  };

  /**
   * Define the columns of the table.
   */
  columns = (): ColumnsType<any> => [
    {
      title: 'Name',
      dataIndex: 'userDisplayName',
      // Allow sorting by username
      sorter: (a: UserWithAccess, b: UserWithAccess) => {
        if (a.userDisplayName < b.userDisplayName) { return -1; }
        if (a.userDisplayName > b.userDisplayName) { return 1; }
        return 0;
      },
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Role',
      width: 250,
      render: (userWithAccess: UserWithAccess) => {
        const options = this.accessOptions();

        return (
          <Select
            style={{ width: 200 }}
            showSearch={true}
            placeholder="Select a role"
            defaultValue={userWithAccess.accessRight}
            onChange={(value) => this.updateAccessLevel(userWithAccess.userId, value)}
          >
            {options}
          </Select>
        );
      },
    },
    {
      width: 100,
      render: (userWithAccess: UserWithAccess) => (
        <Tooltip
          title="Revoke access"
        >
          <Button
            type="primary"
            onClick={() => this.onRevoke(userWithAccess.userId)}
            danger
          >
            X
          </Button>
        </Tooltip>
      ),
    },
  ];

  render() {
    const { domain } = this.props;
    const { usersWithAccess, transferOwnershipModalVisible } = this.state;

    /**
     * Definition of the modal to transfer ownership.
     */
    const TransferOwnershipModal = () => {
      const [newOwner, setNewOwner] = React.useState<UserInfo>(null);

      return (
        <Modal
          visible={transferOwnershipModalVisible}
          title="Transferring ownership"
          width="50%"
          okText="Transfer"
          cancelText="Cancel"
          onCancel={() => this.setState({ transferOwnershipModalVisible: false })}
          onOk={() => this.onTransfer(newOwner)}
        >
          <p>
            You are about to transfer ownership of the domain to a different user.
            You will still be able to use and edit the domain after the transfer,
            but you will not be able to manage permissions anymore.
          </p>
          <p>Be sure this is what you want to do!</p>
          <Form>
            <Form.Item label="Domain name">
              <Input value={domain.title} contentEditable={false} />
            </Form.Item>
            <Form.Item label="Select new owner">
              <UserSearch
                onUserFound={(user) => setNewOwner(user)}
              />
            </Form.Item>
          </Form>
          <Progress percent={newOwner === null ? 50 : 100} />
        </Modal>
      );
    };

    return (
      <div>
        {/* The form is only being used for styling */}
        <Form>
          <Form.Item
            label="Add a user"
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              style={{ display: 'inline-block', width: '20%' }}
            >
              <Select
                showSearch={true}
                placeholder="Select a role"
                defaultValue={Access.Read}
                onChange={this.onAddUserRoleChange}
              >
                {this.accessOptions()}
              </Select>
            </Form.Item>
            <Form.Item
              style={{ display: 'inline-block', width: '68%' }}
            >
              <UserSearch
                placeholder="Add user by e-mail"
                enterButton={<UserAddOutlined />}
                onUserFound={this.onAddUser}
                userValidation={this.validateAddUser}
              />
            </Form.Item>
            <Form.Item
              style={{ display: 'inline-block', width: '12%' }}
            >
              <Button
                danger
                onClick={() => this.setState({ transferOwnershipModalVisible: true })}
                style={{ width: '90%', marginLeft: '10%' }}
              >
                Transfer ownership
              </Button>
            </Form.Item>
          </Form.Item>
        </Form>
        <Table
          dataSource={this.addKeys(usersWithAccess)}
          columns={this.columns()}
        />
        <TransferOwnershipModal />
      </div>
    );
  }
}

export default AccessManager;
