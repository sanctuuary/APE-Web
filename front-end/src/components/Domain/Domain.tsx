/* eslint-disable import/prefer-default-export */
/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Shared behaviour for the Domain components.
 *
 * @packageDocumentation
 */
import { Topic } from '@models/Domain';

/**
 * Fetch all topics from the back-end.
 * @param user User from the session
 * @param serverside Whether the call should be made serverside
 */
export async function fetchTopics(user: any, serverside: boolean = false): Promise<Topic[]> {
  let endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/topic/`;
  // Use Node.Js base url when the fetch should be made serverside
  if (serverside) {
    endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/topic/`;
  }

  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { cookie: user.sessionid },
  });
  return response.json();
}
