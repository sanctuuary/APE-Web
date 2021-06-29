import React from 'react';
import { Button, Form, Input, message, Select, Table, Tooltip } from 'antd';
import { Access, UserWithAccess } from '@models/Domain';
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
  /** The id of the domain who's access to manage. */
  domainId: string,
}

/**
 * The state of the {@link AccessManager} component.
 */
interface AccessManagerState {
  /** The user of the current session. */
  currentUser: UserInfo,
  currentUserIsOwner: boolean,
  /** The users which have access to the domain (except: Owner, Revoked). */
  usersWithAccess: UserWithAccess[],
  /** The currently selected access level for adding new users. */
  addUserSelectedRole: Access,
}

/**
 * Component for managing access to a domain.
 */
class AccessManager extends React.Component<AccessManagerProps, AccessManagerState> {
  /** React RefObject to refer to the UserSearch element. */
  userSearchRef: React.RefObject<Input>;

  constructor(props: Readonly<AccessManagerProps>) {
    super(props);

    this.userSearchRef = React.createRef();
    this.state = {
      currentUser: null,
      currentUserIsOwner: false,
      usersWithAccess: [],
      addUserSelectedRole: Access.Read,
    };
  }

  async componentDidMount() {
    // Get the current user from the session
    await getSession({}).then((user: any) => this.setState({ currentUser: user.user }));

    // Check if the current user is the owner of this domain
    const { domainId } = this.props;
    const { currentUser } = this.state;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domainId}/Owner`;
    fetch(endpoint, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data: UserWithAccess[]) => {
        data.forEach((u: UserWithAccess) => {
          if (u.userId === currentUser.userId) {
            this.setState({ currentUserIsOwner: true });
          }
        });
      });

    this.getUsersWithAccess();
  }

  /**
   * Get all users with access to the domain.
   */
  getUsersWithAccess = async () => {
    const { domainId } = this.props;
    const accessLevels = ['Read', 'ReadWrite'].join('/');

    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domainId}/${accessLevels}`;
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
    const { domainId } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domainId}`;
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
    const { domainId } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domainId}`;
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
    this.userSearchRef.current.setValue(null);
  };

  /**
   * Validate that the user that is added to the permissions table is not the owner of the domain.
   * @param email The email address that is filled in.
   * @returns True if the user may be added, false if the user may not be added.
   */
  validateAddUser = (email: string): boolean => {
    const { currentUser, currentUserIsOwner } = this.state;
    // If the user is not the owner, the user may be added.
    if (!currentUserIsOwner) { return true; }

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
    const { usersWithAccess } = this.state;

    return (
      <div>
        {/* The form is only being used for styling */}
        <Form>
          <Form.Item
            label="Add a user"
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              style={{ display: 'inline-block', width: 'calc(25%)' }}
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
              style={{ display: 'inline-block', width: 'calc(75%)' }}
            >
              <UserSearch
                placeholder="Add user by e-mail"
                enterButton={<UserAddOutlined />}
                onUserFound={this.onAddUser}
                userValidation={this.validateAddUser}
                ref={this.userSearchRef}
              />
            </Form.Item>
          </Form.Item>
        </Form>
        <Table
          dataSource={this.addKeys(usersWithAccess)}
          columns={this.columns()}
        />
      </div>
    );
  }
}

export default AccessManager;
