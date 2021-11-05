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
import React, { ReactNode } from 'react';
import { Modal } from 'antd';
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

/**
 * Create modal for advanced tooltip information.
 * @param title The title of the modal.
 * @param visible Whether the modal is visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @param content The content of the modal.
 * @returns A modal that acts as an advanced tooltip.
 */
export function tooltipModal(
  title: string,
  visible: boolean,
  cancel: () => void,
  content: ReactNode,
) {
  return (
    <Modal
      title={title}
      visible={visible}
      footer={false}
      onCancel={cancel}
      width={1000}
    >
      {content}
    </Modal>
  );
}

/**
 * The tooltip modal for ontology files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for ontology files.
 */
export function ontologyModal(visible: boolean, cancel: () => void) {
  return tooltipModal('Ontology file', visible, cancel, (
    <p>Information about ontology files.</p>
  ));
}

/**
 * The tooltip modal for tool annotations files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for tool annotations files.
 */
export function toolAnnotationsModal(visible: boolean, cancel: () => void) {
  return tooltipModal('Tool annotations file', visible, cancel, (
    <p>Information about tool annotations.</p>
  ));
}

/**
 * The tooltip modal for run config files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for run config files.
 */
export function runConfigModal(visible: boolean, cancel: () => void) {
  return tooltipModal('Run configuration file', visible, cancel, (
    <p>Information about the run configuration.</p>
  ));
}

/**
 * The tooltip modal for constraints files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for constraints files.
 */
export function constraintsModal(visible: boolean, cancel: () => void) {
  return tooltipModal('Constraints file', visible, cancel, (
    <p>Information about the constraints file.</p>
  ));
}
