/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import Domain, { Topic, Visibility } from '@models/Domain';

export const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Topic 1',
  },
  {
    id: '2',
    name: 'Topic 2',
  },
];

export const mockDomain: Domain = {
  id: '1',
  title: 'Domain 1',
  description: 'A domain used for testing.',
  visibility: Visibility.Public,
  topics: ['Topic 1'],
  ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
  toolsTaxonomyRoot: 'Tool',
  dataDimensionsTaxonomyRoots: ['Type', 'Format'],
};

export const twoMockDomains: Domain[] = [
  {
    id: '1',
    title: 'Domain A',
    description: 'A domain used for testing.',
    visibility: Visibility.Public,
    topics: ['Topic 1', 'Topic 2'],
    ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
    toolsTaxonomyRoot: 'Tool',
    dataDimensionsTaxonomyRoots: ['Type', 'Format'],
  },
  {
    id: '2',
    title: 'Domain B',
    description: 'Another domain used for testing.',
    visibility: Visibility.Public,
    topics: ['Topic 3'],
    ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
    toolsTaxonomyRoot: 'Tool',
    dataDimensionsTaxonomyRoots: ['Type', 'Format'],
  },
];
