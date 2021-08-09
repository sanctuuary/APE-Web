import { message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

/**
 * Validate a file to be a .json file.
 * @param file The file to validate.
 * @returns true when the file is accepted, or LIST_IGNORE to reject the file.
 */
export function validateJSON(file: File): boolean {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    message.error(`${file.name} is not a JSON file`);
    return false;
  }
  return true;
}

/**
 * Validate a file to be an .owl file.
 * @param file The file to validate.
 * @returns true when the file is accepted, or LIST_IGNORE to reject the file.
 */
export function validateOWL(file: File): boolean {
  if (!(file.name.endsWith('.owl') || file.name.endsWith('.xml'))) {
    message.error(`${file.name} is not an ontology file`);
    return false;
  }
  return true;
}

/**
 * Handle changes when uploading a file.
 *
 * This function is mostly used to limit the number of files
 * in an Ant Design Upload component to one.
 * @param info Upload changes information
 * @param callback The function to call with the changed file. For example, to update a state.
 */
export function onFileChange(
  info: UploadChangeParam<UploadFile<any>>,
  callback: (updatedList: any[]) => void,
) {
  // Remove wrong uploads: file.status is empty when beforeUpload returns false
  let updatedList = info.fileList.filter((file) => !!file.status);
  // Make sure only one file is uploaded
  if (updatedList.length > 1) {
    updatedList = [updatedList.pop()];
  }
  callback(updatedList);
}
