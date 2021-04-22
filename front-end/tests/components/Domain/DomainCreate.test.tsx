/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';
import { Visibility } from '@models/Domain';

describe.skip('DomainCreate', () => {
  let form;

  /*
   * Setup form before each test
   * Use beforeEach to speed up the tests
   */
  beforeEach(() => {
    const { getByText, getByLabelText, getByTestId } = render(<DomainCreate />);
    const title = getByLabelText(/Domain name/i, { selector: 'input' }) as HTMLInputElement;
    const description = getByLabelText(/Description/i, { selector: 'textarea' }) as HTMLTextAreaElement;
    const topic = getByLabelText(/Topic/i, { selector: 'select' }) as HTMLSelectElement;
    const visibility = getByTestId('visibility-select') as HTMLSelectElement;
    const owlFile = getByLabelText(/OWL File:/i, { selector: 'input' }) as HTMLInputElement;
    const toolAnnotations = getByLabelText(/Tool annotations/i, { selector: 'input' }) as HTMLInputElement;
    const submit = getByText(/Create domain/i) as HTMLInputElement;
    form = { title, description, topic, visibility, owlFile, toolAnnotations, submit };
  });

  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const SetFile = (fileSelector: HTMLInputElement, fileName: string) => {
    const file = new File(['contents of my domain'], fileName, {});
    Object.defineProperty(fileSelector, 'files', {
      value: [file],
    });
    fireEvent.change(fileSelector);
    return fileSelector;
  };

  test('All form elements are rendered', () => {
    expect(form.title).toBeInTheDocument();
    expect(form.description).toBeInTheDocument();
    expect(form.topic).toBeInTheDocument();
    expect(form.visibility).toBeInTheDocument();
    expect(form.owlFile).toBeInTheDocument();
    expect(form.toolAnnotations).toBeInTheDocument();
    expect(form.submit).toBeInTheDocument();
  });

  test('Input fields update correctly', () => {
    // Fill fields
    userEvent.type(form.title, 'TestName');
    userEvent.type(form.description, 'Test description');
    userEvent.selectOptions(form.topic, 'Test2');
    form.owlFile = SetFile(form.owlFile, 'mydomain.owl');
    form.toolAnnotations = SetFile(form.toolAnnotations, 'my_annotations.json');

    // Test field values
    expect(form.title.value).toBe('TestName');
    expect(form.description.value).toBe('Test description');
    expect(form.owlFile.files).toBeDefined();
    expect(form.toolAnnotations.files).toBeDefined();
    expect(form.topic.value).toBe('Test2');
  });

  test('Input validity and submission', () => {
    expect(!form.title.validity.valid);
    expect(!form.owlFile.validity.valid);

    userEvent.type(form.title, 'test');
    form.owlFile = SetFile(form.owlFile, 'mydomain.owl');

    expect(form.title.validity.valid);
    expect(form.owlFile.validity.valid);
    expect(form.topic).toHaveValue('Test1');
    expect(form.topic.validity.valid);

    // Test the submit
    const response = { id: '1' };
    // Mock the fetch response
    fetchMock.mockResponseOnce(JSON.stringify(response), { status: 201 });
    // Assert the response is received and logged
    jest.spyOn(console, 'log')
      .mockImplementation((message) => expect(JSON.parse(message)).toEqual(response));
    fireEvent.click(form.submit);
  });

  test('Submit error catch', () => {
    fetchMock.mockRejectOnce(() => Promise.reject());
    // Assert we get the error message we expect
    jest.spyOn(console, 'error')
      .mockImplementation((message) => expect(message).toBe('Error while trying to create domain'));
    fireEvent.click(form.submit);
  });

  test('Invalid name', () => {
    expect(!form.title.validity.valid);
    userEvent.type(form.title, 'test'); // Valid input
    expect(form.title.validity.valid);
    userEvent.type(form.title, '       '); // Only spaces on name
    expect(!form.title.validity.valid);
  });

  test('Select visibility', () => {
    const wrapper = shallow(<DomainCreate />);
    const select = wrapper.find('Select');

    // Select the Private option
    select.simulate('change', Visibility.Private);
    expect(wrapper.state('visibility')).toEqual(Visibility.Private);

    // Select the Public option
    select.simulate('change', Visibility.Public);
    expect(wrapper.state('visibility')).toEqual(Visibility.Public);
  });

  test('No valid file uploaded', () => {
    expect(!form.owlFile.validity.valid);
    form.owlFile = SetFile(form.owlFile, 'no file here'); // Invalid filepath
    expect(!form.owlFile.validity.valid);
  });

  test('Invalid file uploaded', () => {
    expect(!form.owlFile.validity.valid);
    form.owlFile = SetFile(form.owlFile, 'myinvaliddomain.json'); // Invalid file format
    expect(!form.owlFile.validity.valid);
  });
});
