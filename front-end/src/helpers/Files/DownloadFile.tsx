/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences
 */

/**
 * Download a file to the client browser.
 * @param file Blob of the file to be downloaded
 * @param fileName Name of the file to be downloaded
 */
export default function downloadFile(file: Blob, fileName: string) {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}`.replace(' ', '_');
  document.body.appendChild(a);
  a.click();
  a.remove();
}
