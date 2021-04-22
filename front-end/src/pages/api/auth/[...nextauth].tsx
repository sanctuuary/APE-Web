/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * The configuration for the Next-Auth library.
 *
 * For more information, see the [NextAuth.js documentation](https://next-auth.js.org/configuration/pages).
 *
 * @packageDocumentation
 */
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

/**
 * Options to pass to NextAuth.
 * Providers array can easily be extended
 * with providers that nextauth supports (like GitLab/GitHub).
 */
const options = {
  providers: [
    Providers.Credentials({
      credentials: {
        username: { label: 'Username', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Function called when signIn is called.
       * We do a fetch here to the back-end.
       * @param credentials the values filled in, in the form.
       */
      authorize: async (credentials) => {
        const loginEndpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/user/login`;
        // Send post request to back-end
        const loginReq = await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(credentials),
        });
        const jses = loginReq.headers.get('set-cookie').split(';')[0];
        try {
          // Check if user credentials were valid
          if (loginReq.status === 401 || loginReq.status === 403) {
            return Promise.resolve(false);
          }
          const data = await loginReq.json();
          data.sessionid = jses;
          return Promise.resolve(data);
        } catch (err) {
          // Server error?
          return Promise.reject(err);
        }
      },
    }),
  ],
  // Session maxAge of half an hour, same as back-end
  session: {
    maxAge: 0.5 * 60 * 60,
  },
  secret: process.env.APPLICATION_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/signout',
  },
};

/**
 * Callback functions for nextauth
 */
const callbacks = {
  signIn: undefined,
  jwt: undefined,
  session: undefined,
};

/**
 * Callback to control if a user signin was valid.
 * @param user user object
 * @param account provider
 */
callbacks.signIn = async (user, account) => {
  if (account.type === 'credentials') {
    if (user) {
      return user;
    }
  }
  return null;
};

/**
 * JWT callback called when JSON Web Token is created
 * or updated (i.e whenever a session is accesed in the client with useSession).
 * @param token JWT token
 * @param user user object
 */
callbacks.jwt = async (token, user) => {
  let jwtoken = token;
  if (user) {
    jwtoken = { ...jwtoken, user };
  }
  return jwtoken;
};

/**
 * Session callback, called whenever a session is checked.
 * @param session session
 * @param token JWT token
 */
callbacks.session = async (session, token) => {
  const ses = session;
  ses.user = token.user;
  return ses;
};

export default (req, res) => NextAuth(req, res, { callbacks, ...options });
