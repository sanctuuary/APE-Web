import React, { CSSProperties, ReactNode, Ref } from 'react';
import { Input, message } from 'antd';
import UserInfo from '@models/User';

const { Search } = Input;

/**
 * The props for the {@link UserSearch} component.
 */
interface UserSearchProps {
  /** Placeholder text for the search field. */
  placeholder?: string,
  /**
   * Whether to show an enter button after input, or use another React node.
   * See Ant Design's documentation on Input.Search: https://ant.design/components/input/#Input.Search.
   */
  enterButton?: boolean | ReactNode,
  /** Callback function when a user is found. */
  onUserFound?: (user: UserInfo) => void,
  /**
   * Validate if a user may be selected.
   * Return false if a user may not be selected, or true if a user may be selected.
   */
  userValidation?: (email: string) => boolean,
  /** CSS styling for the internal Search component. */
  style?: CSSProperties,
}

/**
 * Component to search users by their e-mail address.
 */
const UserSearch = React.forwardRef((props: UserSearchProps, ref: Ref<Input>) => {
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

  const { placeholder, enterButton, style } = props;

  return (
    <Search
      type="email"
      placeholder={placeholder}
      enterButton={enterButton}
      onSearch={searchUser}
      ref={ref}
      style={style}
    />
  );
});

// Default values for UserSearchProps.
UserSearch.defaultProps = {
  placeholder: 'Search user by their email address',
  enterButton: false,
  onUserFound: () => {},
  userValidation: () => true,
  style: null,
};

export default UserSearch;
