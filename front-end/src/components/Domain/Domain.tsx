/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Shared behavior for the Domain components.
 *
 * @packageDocumentation
 */
import React, { ReactNode } from 'react';
import { Modal, Typography } from 'antd';
import { Topic } from '@models/Domain';

const { Paragraph } = Typography;

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
  return tooltipModal('How to create an ontology file', visible, cancel, (
    <div>
      <Paragraph>Ontology file should specify the<strong>&nbsp;ontology (taxonomy)&nbsp;</strong>that&nbsp;specifies the domain vocabulary. It should be provided in the<strong> OWL </strong>or<strong> RDF format.</strong>&nbsp;</Paragraph>
      <Paragraph><em><a href="https://protege.stanford.edu/" target="_blank" rel="noreferrer noopener">Prot&eacute;g&eacute;</a>&nbsp;is the suggested ontology editor.</em></Paragraph>
      <Paragraph>An exemplary ontology file can be downloaded&nbsp;<a href="https://raw.githubusercontent.com/sanctuuary/APE_UseCases/master/ImageMagick/imagemagick_taxonomy.owl" target="_blank" rel="noreferrer noopener">here</a>&nbsp;(the exemplary domain is defined over the&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/demo/imagemagick/imagemagick.html" target="_blank" rel="noreferrer noopener">Image Magick</a> toolset).&nbsp;</Paragraph>
      <Paragraph>&nbsp;&nbsp;</Paragraph>
      <Paragraph><strong>For a detailed description of the ontology file we refer to the corresponding&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/specifications/setup.html#id1" target="_blank" rel="noreferrer noopener">readthedocs</a> documentation.&nbsp;</strong></Paragraph>
    </div>
  ));
}

/**
 * The tooltip modal for tool annotations files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for tool annotations files.
 */
export function toolAnnotationsModal(visible: boolean, cancel: () => void) {
  return tooltipModal('How to create a tool annotations file', visible, cancel, (
    <div>
      <Paragraph>Tool annotation file should specify the<strong>&nbsp;tool annotations </strong>with respect to their&nbsp;<strong>inputs&nbsp;</strong>and&nbsp;<strong>outputs</strong>.&nbsp;It should be provided in the<strong> JSON</strong><strong>&nbsp;format.</strong>&nbsp;</Paragraph>
      <Paragraph>An exemplary tool annotation file can be downloaded&nbsp;<a href="https://raw.githubusercontent.com/sanctuuary/APE_UseCases/master/ImageMagick/tool_annotations.json" target="_blank" rel="noreferrer noopener">here</a>&nbsp;(the exemplary domain is defined over the&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/demo/imagemagick/imagemagick.html" target="_blank" rel="noreferrer noopener">Image Magick</a> toolset).&nbsp;</Paragraph>
      <Paragraph>&nbsp;&nbsp;</Paragraph>
      <Paragraph><strong>For a detailed description of the tool annotation file we refer to the corresponding&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/specifications/setup.html#tool-annotations" target="_blank" rel="noreferrer noopener">readthedocs</a> documentation.&nbsp;</strong></Paragraph>
    </div>
  ));
}

/**
 * The tooltip modal for run config files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for run config files.
 */
export function runConfigModal(visible: boolean, cancel: () => void) {
  return tooltipModal('How to create a run configuration file', visible, cancel, (
    <div>
      <Paragraph>Run configuration file should specify the<strong> basic run configuration</strong> (timeout, expected number of solution, etc.) as well as the <strong>inputs </strong>and<strong> outputs</strong> for the demonstration synthesis run.&nbsp;</Paragraph>
      <Paragraph>An exemplary configuration file can be downloaded&nbsp;<a href="https://raw.githubusercontent.com/sanctuuary/APE_UseCases/master/ImageMagick/Example1/config.json" target="_blank" rel="noreferrer noopener">here</a>&nbsp;(the exemplary domain is defined over the&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/demo/imagemagick/imagemagick.html" target="_blank" rel="noreferrer noopener">Image Magick</a> toolset).</Paragraph>
      <Paragraph>&nbsp;</Paragraph>
      <Paragraph><strong>For a detailed description of the configuration file we refer to&nbsp;the corresponding <a href="https://ape-framework.readthedocs.io/en/latest/docs/specifications/setup.html#configuration-file" target="_blank" rel="noreferrer noopener">readthedocs</a> documentation.&nbsp;</strong></Paragraph>
    </div>
  ));
}

/**
 * The tooltip modal for constraints files.
 * @param visible Whether this modal is currently visible / open.
 * @param cancel The function to call when the "onCancel" event is called.
 * @returns The tooltip modal for constraints files.
 */
export function constraintsModal(visible: boolean, cancel: () => void) {
  return tooltipModal('How to create a constraints file', visible, cancel, (
    <div>
      <Paragraph>Constraints file should specify the<strong>&nbsp;constraints </strong>used<strong>&nbsp;</strong>for the demonstration synthesis run.&nbsp;</Paragraph>
      <Paragraph>An exemplary configuration file can be downloaded&nbsp;<a href="https://raw.githubusercontent.com/sanctuuary/APE_UseCases/master/ImageMagick/Example1/constraints.json" target="_blank" rel="noreferrer noopener">here</a>&nbsp;(the exemplary domain is defined over the&nbsp;<a href="https://ape-framework.readthedocs.io/en/latest/docs/demo/imagemagick/imagemagick.html" target="_blank" rel="noreferrer noopener">Image Magick</a> toolset).</Paragraph>
      <Paragraph>&nbsp;</Paragraph>
      <Paragraph><strong>For a detailed description of the constraints file we refer to&nbsp;the corresponding <a href="https://ape-framework.readthedocs.io/en/latest/docs/specifications/setup.html#constraints-file" target="_blank" rel="noreferrer noopener">readthedocs</a> documentation.&nbsp;</strong></Paragraph>
    </div>
  ));
}
