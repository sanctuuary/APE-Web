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
import { message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
/**
 * Validate a file to be an .owl file.
 * @param file The file to validate
 */
const validateOWL = (file: File): boolean => {
  if (!(file.name.endsWith('.owl') || file.name.endsWith('.xml'))) {
    message.error(`${file.name} is not an ontology file`);
    return false;
  }
  return true;
};

/**
 * Handle changes when uploading a file.
 *
 * This function is mostly used to limit the number of files
 * in an Ant Design Upload component to one.
 * @param info Upload changes information
 * @param callback The function to call with the changed file. For example, to update a state.
 */
const onFileChange = (
  info: UploadChangeParam<UploadFile<any>>,
  callback: (updatedList: any[]) => void,
) => {
  // Remove wrong uploads: file.status is empty when beforeUpload returns false
  let updatedList = info.fileList.filter((file) => !!file.status);
  // Make sure only one file is uploaded
  if (updatedList.length > 1) {
    updatedList = [updatedList.pop()];
  }
  callback(updatedList);
};

/**
 * Validate a file to be a .json file.
 * @param file The file to validate
 */
const validateJSON = (file: File): boolean => {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    message.error(`${file.name} is not a JSON file`);
    return false;
  }
  return true;
};

export { validateJSON, validateOWL, onFileChange };

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
