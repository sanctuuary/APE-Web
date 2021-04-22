/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import fetchMock from 'jest-fetch-mock';
import userEvent from '@testing-library/user-event';
import Login from '@components/Login/Login';
import client from 'next-auth/client';

// Mocks useRouter
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

/**
 * MockNextUseRouter
 * Mocks the useRouter React hook from Next.js on a test-case by test-case basis
 */
function mockNextUseRouter(props: {
  route: string;
  pathname: string;
  query;
}) {
  useRouter.mockImplementation(() => ({
    route: props.route,
    pathname: props.pathname,
    query: props.query,
    basePath: '/',
  }));
}

// Bundle tests
describe.skip('Login page', () => {
  let form;
  let screen;
  let query;
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {}).mockReset();
  });

  beforeEach(() => {
    jest.doMock('next-auth/client', () => {
      const auth = jest.requireActual('next-auth/client');
      auth.useSession = () => [null, false];
      return auth;
    });
    /*
     * Get the login form and cast its elements to their corresponding HTMLElement
     * instead of the default HTMLElement class
     */
    mockNextUseRouter({
      route: '/login',
      pathname: '/login',
      query,
    });

    screen = render(<Login />);
    const { getByRole, getByText, getByPlaceholderText } = screen;
    const email = getByPlaceholderText(/Email/i) as HTMLInputElement;
    const password = getByPlaceholderText(/Password/i) as HTMLInputElement;
    const submit = getByRole('button') as HTMLButtonElement;
    const forgot = getByText(/Forgot password?/i) as HTMLAnchorElement;
    const register = getByText(/request account/i) as HTMLAnchorElement;
    form = { email, password, submit, forgot, register };
  });

  it('Should update input fields correctly', () => {
    expect(form.email).toBeEmptyDOMElement();
    expect(form.password).toBeEmptyDOMElement();
    userEvent.type(form.email, 'test@example.com');
    userEvent.type(form.password, 'testing-is_important!101');
    expect(form.email).toHaveValue('test@example.com');
    expect(form.password).toHaveValue('testing-is_important!101');
  });

  it('Should validate input correctly', () => {
    const clearType = (input: HTMLInputElement, value: string) => {
      userEvent.clear(input);
      userEvent.type(input, value);
    };

    clearType(form.email, 'test'); // No valid email
    clearType(form.password, 'test'); // Password is always valid
    expect(form.email.validity.valid).toBe(false);
    expect(form.password.validity.valid).toBe(true);
    clearType(form.email, 'test@example.com'); // Email is now: user@example.com
    expect(form.email.validity.valid).toBe(true);
    expect(form.password.validity.valid).toBe(true);
    clearType(form.email, 'testing.important_1@example.com'); // More complex email
    clearType(form.password, 'TestinG!101');
    expect(form.email.validity.valid).toBe(true);
    expect(form.password.validity.valid).toBe(true);
  });

  /*
   * Because ant-design form works very different as oppossed to the normal html form
   * with handling the submit function. This is the only way to get 100 % coverage.
   * We get the ant design Form element, which gets turned into a ForwardRef(InternalForm)
   * internally. And then we call the prop function onFinish, which ESLint does not recognize.
   * But this is the actual onSubmit function for the form.
   * To prevent fetch from actually making a request to the website, we mock it here.
   */
  it('Should submit the form', () => {
    userEvent.type(form.email, 'testing.important_1@example.com');
    userEvent.type(form.password, 'TestinG!101');
    const wrapper = shallow(<Login />);
    const antform: any = wrapper.find('ForwardRef(InternalForm)').props();
    const signIn = jest.spyOn(client, 'signIn');
    const user = {
      displayName: 'Test',
      userId: '5fa93b04b4a9d25d78e0a312',
      email: 'test@test.com',
      status: 'Approved',
    };
    // Mock a successful login response
    fetchMock.mockResponseOnce(JSON.stringify(user));
    // Trigger the onFinish event
    const values = { username: form.email.value, password: form.password.value };
    antform.onFinish(values);
    expect(signIn).toBeCalled();
    expect(signIn).toBeCalledWith(expect.anything(), { ...values, callbackUrl: '/' });
  });

  query = { error: 'CredentialsSignin' };
  it('Should catch failed login attempts', () => {
    userEvent.type(form.email, 'testing.important_1@example.com');
    userEvent.type(form.password, 'TestinG!101');
    const wrapper = shallow(<Login />);
    const antform: any = wrapper.find('ForwardRef(InternalForm)').props();
    const signIn = jest.spyOn(client, 'signIn');

    // Mock wrong credentials response
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 401 });
    // Trigger the onFinish event
    const values = { username: form.email.value, password: form.password.value };
    antform.onFinish(values);
    expect(signIn).toBeCalled();
    expect(signIn).toBeCalledWith(expect.anything(), { ...values, callbackUrl: '/' });
    expect(screen.getByText('Incorrect username and/or password.')).toBeInTheDocument();
  });
});
