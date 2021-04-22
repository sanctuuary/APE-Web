/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * An APE domain
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
  /** Optional access level for current user */
  access?: string
}

/**
 * The possible options for a {@link Domain}'s visibility level.
 */
export enum Visibility {
  /** Everyone can use this domain */
  Public = 'Public',
  /** Domain access is restricted to certain users */
  Private = 'Private'
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
 * Possible access levels for a {@link Domain}
 */
export enum Access {
  Owner = 'Owner',
  Read = 'Read',
  ReadWrite = 'ReadWrite',
  Revoked = 'Revoked'
}
