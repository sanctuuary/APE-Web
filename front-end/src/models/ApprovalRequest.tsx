/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Interface for approval request
 */
export default interface ApprovalRequest {
  /** Unique id of the request. Necessary for the column expansion in the Table. */
  id: string;
  /** Date of registration */
  creationDate: Date;
  /** Email */
  email: string;
  /** Display name */
  displayName: string;
  /** Motivation of the user */
  motivation: string;
}
