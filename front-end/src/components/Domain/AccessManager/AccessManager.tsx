import React from 'react';
import { Button, message, Select, Table, Tooltip } from 'antd';
import { Access, UserWithAccess } from '@models/Domain';

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
  usersWithAccess: UserWithAccess[],
}

class AccessManager extends React.Component<AccessManagerProps, AccessManagerState> {
  constructor(props: Readonly<AccessManagerProps>) {
    super(props);

    this.state = {
      usersWithAccess: [],
    };
  }

  componentDidMount() {
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
  onAccessLevelChanged = (userId: string, value: Access) => {
    const { domainId } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/access/${domainId}`;
    fetch(endpoint, {
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
   * Define the columns of the table.
   */
  columns = () => [
    {
      title: 'Name',
      dataIndex: 'userDisplayName',
    },
    {
      title: 'Role',
      width: 250,
      render: (userWithAccess: UserWithAccess) => {
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

        return (
          <Select
            style={{ width: 200 }}
            showSearch={true}
            placeholder="Select a role"
            defaultValue={userWithAccess.accessRight}
            onChange={(value) => this.onAccessLevelChanged(userWithAccess.userId, value)}
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
      <Table
        dataSource={this.addKeys(usersWithAccess)}
        columns={this.columns()}
      />
    );
  }
}

export default AccessManager;
