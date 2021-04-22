/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { act, render } from '@testing-library/react';
import { shallow } from 'enzyme';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import RegisterForm from '@components/Login/RegisterForm';

describe('RegisterForm', () => {
  let form;

  beforeAll(() => {
    // Window matchMedia workaround
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    // Suppress ant-design password does not match pattern warning.
    jest.spyOn(console, 'warn').mockImplementation(() => {}).mockReset();
  });

  beforeEach(() => {
    const { getByPlaceholderText, getByRole } = render(<RegisterForm />);

    const email = getByPlaceholderText('Email') as HTMLInputElement;
    const password = getByPlaceholderText('Password') as HTMLInputElement;
    const confirmPassword = getByPlaceholderText('Confirm password') as HTMLInputElement;
    const displayName = getByPlaceholderText('Display name') as HTMLInputElement;
    /*
     * Add regex pattern to password field for validation
     * Because ant design keeps the pattern regex hidden.
     * the input field's validity will otherwise be true while it shouldn't be.
     */
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$#%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,}$/.source;
    password.pattern = pattern;
    confirmPassword.pattern = pattern;
    const motivation = getByPlaceholderText('Motivation') as HTMLInputElement;

    const submit = getByRole('button') as HTMLButtonElement;
    form = { email, password, confirmPassword, displayName, motivation, submit };
  });

  afterEach(() => {
    fetchMock.resetMocks();
  });

  it('Should render correctly', () => {
    expect(form.email).toBeInTheDocument();
    expect(form.password).toBeInTheDocument();
    expect(form.confirmPassword).toBeInTheDocument();

    expect(form.displayName).toBeInTheDocument();
    expect(form.motivation).toBeInTheDocument();

    expect(form.submit).toBeInTheDocument();
  });

  it('Should update input fields correctly', () => {
    // Expect all inputs to be present and empty
    expect(form.email).toBeEmptyDOMElement();
    expect(form.password).toBeEmptyDOMElement();
    expect(form.confirmPassword).toBeEmptyDOMElement();
    expect(form.displayName).toBeEmptyDOMElement();
    expect(form.motivation).toBeEmptyDOMElement();

    // Type all inputs
    const email = 'test@example.com';
    const password = 'testing-is_important!101';
    const displayName = 'James Bond';
    const motivation = 'Tests help prevent publishing faulty code';
    userEvent.type(form.email, email);
    userEvent.type(form.password, password);
    userEvent.type(form.confirmPassword, password);
    userEvent.type(form.displayName, displayName);
    userEvent.type(form.motivation, motivation);

    // Expect all typed input to be received correctly
    expect(form.email).toHaveValue(email);
    expect(form.password).toHaveValue(password);
    expect(form.confirmPassword).toHaveValue(password);
    expect(form.displayName).toHaveValue(displayName);
    expect(form.motivation).toHaveValue(motivation);
  });

  it('Should validate input correctly', () => {
    const clearType = (input: HTMLInputElement, value: string) => {
      userEvent.clear(input);
      userEvent.type(input, value);
    };

    // Test wrong email and password
    clearType(form.email, 'test'); // No valid email
    clearType(form.password, 'test'); // Just lowercase password
    clearType(form.confirmPassword, 'test'); // Just lowercase password
    expect(form.email.validity.valid).toBe(false);
    expect(form.password.validity.valid).toBe(false);
    expect(form.confirmPassword.validity.valid).toBe(false);

    // Test right email and wrong password
    clearType(form.email, 'test@example.com'); // Email is now: user@example.com
    clearType(form.password, 'TestinG!'); // Lowercase, uppercase, special char
    clearType(form.confirmPassword, 'TestinG!'); // Lowercase, uppercase, special char
    expect(form.email.validity.valid).toBe(true);
    expect(form.password.validity.valid).toBe(false);
    expect(form.confirmPassword.validity.valid).toBe(false);

    // Test right email and password
    clearType(form.email, 'testing.important_1@example.com'); // More complex email
    clearType(form.password, 'TestinG!101'); // Lowercase, uppercase, special char and numbers -> should validate
    clearType(form.confirmPassword, 'TestinG!101'); // Lowercase, uppercase, special char and numbers -> should validate
    expect(form.email.validity.valid).toBe(true);
    expect(form.password.validity.valid).toBe(true);
    expect(form.confirmPassword.validity.valid).toBe(true);
  });

  /*
   * Because ant-design form works very different as oppossed to the normal html form
   * with handling the submit function. This is the only way to get 100 % coverage.
   * We get the ant design Form element, which gets turned into a ForwardRef(InternalForm)
   * internally. And then we call the prop function onFinish, which ESLint does not recognize.
   * But this is the actual onSubmit function for the form.
   */
  it('Should submit the form and log in', async () => {
    const email = 'test@example.com';
    const password = 'testing-is_important!101';
    const displayName = 'James Bond';
    const motivation = 'Tests help prevent publishing faulty code';

    // Fill form
    userEvent.type(form.email, email);
    userEvent.type(form.password, password);
    userEvent.type(form.confirmPassword, password);
    userEvent.type(form.displayName, displayName);
    userEvent.type(form.motivation, motivation);

    const wrapper = shallow(<RegisterForm />);
    // Expect not to start at the success result
    expect(wrapper.find('SuccessResult').exists()).toEqual(false);

    const formElements = wrapper.find('FormElements').dive();
    const antform: any = formElements.find('ForwardRef(InternalForm)').props();
    const values = {
      email,
      password,
      confirm: password,
      displayName,
      motivation,
    };
    fetchMock.mockResponseOnce(
      JSON.stringify({
        userId: '1',
        email,
        displayName,
        status: 'Pending',
      }),
      { status: 201 },
    ).mockResponseOnce(
      JSON.stringify({
        userId: '1',
        email,
        displayName,
        status: 'Pending',
      }),
      { status: 200 },
    );

    await act(async () => {
      await antform.onFinish(values);
    });

    // Expect to see the success result
    expect(wrapper.find('SuccessResult').dive().find('Result').exists()).toEqual(true);
  });

  it('Should handle duplicate email addresses', () => {
    const email = 'test@example.com';
    const password = 'testing-is_important!101';
    const displayName = 'James Bond';
    const motivation = 'Tests help prevent publishing faulty code';

    // Fill form
    userEvent.type(form.email, email);
    userEvent.type(form.password, password);
    userEvent.type(form.confirmPassword, password);
    userEvent.type(form.displayName, displayName);
    userEvent.type(form.motivation, motivation);

    const wrapper = shallow(<RegisterForm />);

    const formElements = wrapper.find('FormElements').dive();
    const antform: any = formElements.find('ForwardRef(InternalForm)').props();
    const values = {
      email,
      password,
      confirm: password,
      displayName,
      motivation,
    };
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 409 });
    antform.onFinish(values);

    // Expect to still see the form
    expect(wrapper.find('FormElements').exists()).toEqual(true);
  });

  it('Should handle failed logins', async () => {
    const email = 'test@example.com';
    const password = 'testing-is_important!101';
    const displayName = 'James Bond';
    const motivation = 'Tests help prevent publishing faulty code';

    // Fill form
    userEvent.type(form.email, email);
    userEvent.type(form.password, password);
    userEvent.type(form.confirmPassword, password);
    userEvent.type(form.displayName, displayName);
    userEvent.type(form.motivation, motivation);

    const wrapper = shallow(<RegisterForm />);

    const formElements = wrapper.find('FormElements').dive();
    const antform: any = formElements.find('ForwardRef(InternalForm)').props();
    const values = {
      email,
      password,
      confirm: password,
      displayName,
      motivation,
    };
    fetchMock.mockOnce(
      JSON.stringify({
        userId: '1',
        email,
        displayName,
        status: 'Pending',
      }),
      { status: 201 },
    ).mockRejectOnce(new Error('Failed to log in'));

    await act(async () => {
      await antform.onFinish(values);
    });

    // Expect to see the success result
    expect(wrapper.find('SuccessResult').dive().find('Result').exists()).toEqual(true);
  });
});
