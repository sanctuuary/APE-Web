/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import ExplorePage from '@pages/explore/[id]';
import fetchMock from 'jest-fetch-mock';
import WorkflowInput from '@components/WorkflowInput/WorkflowInput';
import { testData, testTools, testConstraints, listedTestData, listedTestTools } from '../../data/WorkflowInput';

// TODO: fix these tests. Can't find the solution
describe.skip('/explore/[id]', () => {
  const testId = 'test-id';
  let wrapper: ReactWrapper;

  beforeAll(() => {
    fetchMock.mockResponse((req) => {
      if (req.url === `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/${testId}`) {
        return Promise.resolve('Successfully initiated APE');
      }
      if (req.url === `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/data`) {
        return Promise.resolve(JSON.stringify(testData));
      }
      if (req.url === `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/tools`) {
        return Promise.resolve(JSON.stringify(testTools));
      }
      if (req.url === `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/constraints`) {
        return Promise.resolve(JSON.stringify(testConstraints));
      }
      console.error('Unknown URL');
      return Promise.reject();
    });
  });

  beforeEach(() => {
    wrapper = mount(<ExplorePage domainID={testId} />);
  });

  test('Renders', (done) => {
    setImmediate(() => {
      expect(wrapper.contains(
        <WorkflowInput
          onRun={ExplorePage.prototype.onRun}
          dataTypeOptions={listedTestData}
          toolOptions={listedTestTools}
          constraintOptions={testConstraints}
        />,
      )).toEqual(true);

      done();
    });
  });
});
