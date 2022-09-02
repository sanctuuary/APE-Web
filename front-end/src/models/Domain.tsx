/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * An APE domain
 *
 * @deprecated Has been replaced by the more specific
 * {@link DomainInfo}, {@link DomainDetails} and {@link DomainWithAccess} types.
 */
export default interface Domain {
  /** The ID of the domain */
  id: string,
  /** The title of the domain */
  title: string,
  /** The description of the domain */
  description: string,
  /** Visibility level of the domain */
  visibility: Visibility,
  /** The topics related to the domain */
  topics: string[],
  /** Prefix of ontology file */
  ontologyPrefixIRI: string,
  /** Root of the tools taxonomy */
  toolsTaxonomyRoot: string,
  /** All possible data types in the tools taxonomy */
  dataDimensionsTaxonomyRoots: string[],
  /** Whether the domain uses strict tool annotations. */
  strictToolsAnnotations: boolean,
  /** Optional access level for current user */
  access?: Access
}

/**
 * Basic information about a domain.
 */
export interface DomainInfo {
  /** The ID of the domain. */
  id: string,
  /** The name of the domain. */
  title: string,
  /** The description of the domain. */
  description: string,
  /** The topics related to the domain. */
  topics: string[],
  /** Whether this is an official domain. */
  official?: boolean,
  /** Optional display name of the owner of the domain. */
  ownerName?: string,
  /** Optional visibility level of the domain. */
  visibility?: Visibility,
  /** Optional access level for the current user. */
  access?: Access,
  /** Domain verification status. */
  verification?: DomainVerificationResult,
}

/**
 * Domain information with more details when requesting a specific domain from the back-end.
 *
 * Used when exploring or editing a domain.
 */
export interface DomainDetails {
  /** The ID of the domain. */
  id: string,
  /** The name of the domain. */
  title: string,
  /** The description of the domain. */
  description: string,
  /** The visibility level of the domain. */
  visibility: Visibility,
  /** The topics related to the domain. */
  topics: string[],
  /** The ontology prefix IRI. */
  ontologyPrefixIRI: string,
  /** The tools taxonomy root. */
  toolsTaxonomyRoot: string,
  /** The data dimensions taxonomy root. */
  dataDimensionsTaxonomyRoot: string[],
  /** Whether the domain uses strict tool annotations. */
  strictToolAnnotations: boolean,
}

/**
 * Domain with additional access information.
 *
 * Used when fetching all domains a certain user has access to.
 */
export interface DomainWithAccess {
  /** The ID of the domain. */
  id: string,
  /** The name of the domain. */
  title: string,
  /** The description of the domain. */
  description: string,
  /** The visibility level of the domain. */
  visibility: Visibility,
  /** The topics related to the domain. */
  topics: string[],
  /** The ID of the user who's access this is about. */
  userId: string,
  /** Access level for the current user. */
  access: Access,
  /** Domain verification status. */
  verification: DomainVerificationResult,
}

/**
 * The possible options for a domain's visibility level.
 */
export enum Visibility {
  /** Everyone can use this domain */
  Public = 'Public',
  /** Domain access is restricted to certain users */
  Private = 'Private',
}

/** The default value for the domain visibility select */
export const defaultVisibility: string = Visibility.Public;

/**
 * A topic for a domain
 */
export interface Topic {
  /** The identifier of the topic */
  id: string,
  /** The name of the topic */
  name: string,
}

/**
 * Possible access levels for a domain.
 */
export enum Access {
  Owner = 'Owner',
  Read = 'Read',
  ReadWrite = 'ReadWrite',
  Revoked = 'Revoked',
}

/**
 * An object received from the back-end when asked for all users with access to a domain.
 * The relevant endpoint: `/api/domain/users-with-access/{id}`.
 */
export interface UserWithAccess {
  /** The id of the UserDomainAccess object */
  id: string,
  /** The id of the user who has access. */
  userId: string,
  /** The display name of the user who has access. */
  userDisplayName: string,
  /** The id of the domain the user has access to. */
  domainId: string,
  /** The access level the user has to the domain. */
  accessRight: Access,
}

/**
 * Object to send user access to domain updates.
 */
export interface UserAccessUpload {
  /** The id of the user who gains access. */
  userId: string,
  /** The access level the user will get to the domain. */
  access: Access,
}

/**
 * Object received from the back-end, whether a domain verification was successful.
 */
export interface DomainVerificationResult {
  /** Whether the ontology was successfully verified. */
  ontologySuccess?: boolean,
  /** Whether the use case configuration was successfully verified. */
  useCaseSuccess?: boolean,
  /** A description why the verification failed, when applicable. */
  errorMessage?: string,
}
