/**
 * A user information received from the back-end.
 */
export default interface UserInfo {
  /** The id of the user. */
  userId: string,
  /**
   * The email address of the user.
   * It might be null when the back-end hides it for privacy reasons.
   */
  email: string | null,
  /** The display name of the user. */
  displayName: string,
  /** The status of the user account. */
  status: string,
  /** Whether the user is an administrator. */
  isAdmin: boolean,
}

/**
 * The account status of a user.
 */
export enum UserStatus {
  /** The user account is approved. */
  Approved = 'Approved',
  /** The user account is pending approval. */
  Pending = 'Pending',
  /** The user account has been denied. */
  Denied = 'Denied'
}
