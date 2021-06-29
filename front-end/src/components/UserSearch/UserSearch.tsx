import React, { Ref } from 'react';
import { Input, message } from 'antd';
import UserInfo from '@models/User';
import { SearchProps } from 'antd/lib/input';

const { Search } = Input;

/**
 * The props for the {@link UserSearch} component.
 */
interface UserSearchProps extends SearchProps {
  /** Callback function when a user is found. */
  onUserFound?: (user: UserInfo) => void,
  /**
   * Validate if a user may be selected.
   * Return false if a user may not be selected, or true if a user may be selected.
   */
  userValidation?: (email: string) => boolean,
}

/**
 * Component to search users by their e-mail address.
 */
const UserSearch = React.forwardRef((props: Readonly<UserSearchProps>, ref: Ref<Input>) => {
  /**
   * Search the user with the given e-mail address.
   * @param mail The e-mail address to search by.
   */
  const searchUser = (mail: string) => {
    const { userValidation } = props;
    // If the user validation fails, don't continue.
    if (userValidation(mail) === false) {
      return;
    }

    const { onUserFound } = props;

    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/user/email/${mail}`;
    fetch(endpoint, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.found === false) {
          message.error('Could not find a user with the given e-mail address');
          return;
        }
        onUserFound(data);
      });
  };

  const { placeholder, enterButton } = props;

  return (
    <Search
      type="email"
      placeholder={placeholder}
      enterButton={enterButton}
      onSearch={searchUser}
      ref={ref}
    />
  );
});

// Default values for UserSearchProps.
UserSearch.defaultProps = {
  placeholder: 'Search user by their email address',
  enterButton: false,
  onUserFound: () => {},
  userValidation: () => true,
};

export default UserSearch;
