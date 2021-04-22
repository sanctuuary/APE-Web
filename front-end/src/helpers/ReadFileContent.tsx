/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Type definition for the callback of ReadFileContent.
 */
type ReadFileContentCallback = (string: string) => void;

/**
 * Read the content of a file.
 * @param file The file to read.
 * @param callback The callback function which will use the file contents.
 */
export default function ReadFileContent(file, callback: ReadFileContentCallback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (typeof e.target.result === 'string') {
      callback(e.target.result);
    }
  };
  // Read the file when it's done uploading
  reader.readAsText(file);
}

/**
 * ReadMultipleFileConents input type declaration
 */
export interface RMFCInput {
  /**
   * Identifier for the file.
   *
   * Used to find it back in the returned array.
   */
  id: string,
  /** The name of the file. */
  fileName: string,
  /** The file object. */
  originFileObj: File | Blob,
}

/**
 * Returned object(s) from ReadMultipleFileContents.
 */
export interface FileContent {
  /** The identifier for the file. */
  id: string,
  /** The name of the file. */
  fileName: string,
  /** The file object. */
  content: string,
}

/**
 * ReadMultipleFileContents callback type declaration
 */
type RMFCCallback = (fileContents: FileContent[]) => void;

/**
 * Read multiple files' content.
 * @param files The files whose content to read (requires meta-data).
 * @param callback The callback in which to use the contents of the files (includes meta-data).
 *
 * This helper function is used to read the contents of a file uploaded using Ant Designs.
 * We need to do this, because we are using the front-end as a proxy to make authenticated requests
 * (see {@link Proxy}).
 * These proxies cannot receive the multipart/form-data Content-Type.
 * Therefore, we read the file's content, send the content,
 * and have the proxy recreate the FormData.
 */
export function ReadMultipleFileContents(files: RMFCInput[], callback: RMFCCallback) {
  const fileContents: FileContent[] = [];
  const readFiles = (index: number, topLevelCallback) => {
    if (index >= files.length) {
      topLevelCallback();
    } else {
      const file = files[index];
      ReadFileContent(file.originFileObj, (content) => {
        fileContents.push({
          id: file.id,
          fileName: file.fileName,
          content,
        });
        readFiles(index + 1, topLevelCallback);
      });
    }
  };
  readFiles(0, () => callback(fileContents));
}
