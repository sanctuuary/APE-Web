/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { NextRouter } from 'next/router';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import DomainEdit from '@components/Domain/DomainEdit/DomainEdit';
import { shallow } from 'enzyme';
import { mockDomain, mockTopics } from '@tests/data/Domain';

const routerMock = {
  push: jest.fn(),
};

describe.skip('DomainEdit', () => {
  let container;
  let form;

  beforeEach(() => {
    container = render(
      <DomainEdit
        domain={mockDomain}
        topics={mockTopics}
        router={routerMock as unknown as NextRouter}
      />,
    );
    const { getByLabelText, getByTestId } = container;

    const title = getByLabelText('Title') as HTMLInputElement;
    const description = getByLabelText('Description') as HTMLInputElement;
    const visibility = getByTestId('visibility-select') as HTMLSelectElement;
    const ontologyPrefixIRI = getByLabelText('Ontology prefix') as HTMLInputElement;
    const toolsTaxonomyRoot = getByLabelText('Tools taxonomy root') as HTMLInputElement;
    const dataDimensionsTaxonomyRoots = getByLabelText('Data dimensions taxonomy roots') as HTMLInputElement;
    const owlFile = getByLabelText('OWL file') as HTMLInputElement;
    const toolsAnnotationsFile = getByLabelText('Tools annotations file') as HTMLInputElement;
    const saveButton = getByTestId('saveButton') as HTMLButtonElement;
    const cancelButton = getByTestId('cancelButton') as HTMLButtonElement;
    form = {
      title,
      description,
      visibility,
      ontologyPrefixIRI,
      toolsTaxonomyRoot,
      dataDimensionsTaxonomyRoots,
      owlFile,
      toolsAnnotationsFile,
      saveButton,
      cancelButton,
    };
  });

  it('Renders all form elements', () => {
    expect(form.title).toBeInTheDocument();
    expect(form.description).toBeInTheDocument();
    expect(form.visibility).toBeInTheDocument();
    expect(form.ontologyPrefixIRI).toBeInTheDocument();
    expect(form.toolsTaxonomyRoot).toBeInTheDocument();
    expect(form.dataDimensionsTaxonomyRoots).toBeInTheDocument();

    expect(form.saveButton).toBeInTheDocument();
    expect(form.cancelButton).toBeInTheDocument();
  });

  it('Can upload owl file', async () => {
    // Upload wrong file
    await act(async () => {
      userEvent.upload(form.owlFile, new File(['test'], 'tools_annotations.json'));
    });

    // Upload correct file
    await act(async () => {
      userEvent.upload(form.owlFile, new File(['test'], 'ontology.owl'));
    });
    expect(form.owlFile.files).toHaveLength(1);

    // Upload again to confirm that only one file will be used
    await act(async () => {
      userEvent.upload(form.owlFile, new File(['test'], 'ontology2.owl'));
    });
    expect(form.owlFile.files).toHaveLength(1);
    expect(form.owlFile.files[0].name).toEqual('ontology2.owl');
  });

  it('Can upload tools annotations file', async () => {
    // Upload wrong file
    await act(async () => {
      userEvent.upload(
        form.toolsAnnotationsFile,
        new File(['test'], 'ontology.owl', { type: 'owl' }),
      );
    });

    // Upload correct file
    await act(async () => {
      userEvent.upload(
        form.toolsAnnotationsFile,
        new File(['test'], 'tools_annotations.json', { type: 'application/json' }),
      );
    });
    expect(form.toolsAnnotationsFile.files).toHaveLength(1);
    expect(form.toolsAnnotationsFile.files[0].name).toEqual('tools_annotations.json');

    // Upload again to confirm that only one file will be used
    await act(async () => {
      userEvent.upload(
        form.toolsAnnotationsFile,
        new File(['test'], 'tools_annotations2.json', { type: 'application/json' }),
      );
    });
    expect(form.toolsAnnotationsFile.files).toHaveLength(1);
  });

  it('Can submit changes', async () => {
    const wrapper = shallow(
      <DomainEdit
        domain={mockDomain}
        topics={mockTopics}
        router={routerMock as unknown as NextRouter}
      />,
    );

    const antForm: any = wrapper.find('ForwardRef(InternalForm)').props();

    const owlFile = new File(['test'], 'ontology.owl');
    const toolsAnnotationsFile = new File(['test'], 'tools_annotations.json');
    wrapper.setState({
      owlFiles: [{ originFileObj: owlFile }],
      toolsAnnotationsFiles: [{ originFileObj: toolsAnnotationsFile }],
      appliedTopics: ['1', '2'],
      topicsChanged: true,
    });

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    antForm.onFinish({
      description: 'New description',
      dataDimensionsTaxonomyRoots: 'Type,Format',
    });
    expect(fetch).toBeCalled();

    // Check payload
    const formData: FormData = fetchMock.mock.calls[0][1].body as FormData;
    expect(formData.get('description')).toEqual('New description');
    expect(formData.getAll('dataDimensionsTaxonomyRoots')).toEqual(['Type', 'Format']);
    expect(formData.get('ontology')).toEqual(owlFile);
    expect(formData.get('toolsAnnotations')).toEqual(toolsAnnotationsFile);
    expect(formData.getAll('topics')).toEqual(['1', '2']);
  });

  it('Notifies users when patch fails', () => {
    const wrapper = shallow(
      <DomainEdit
        domain={mockDomain}
        topics={mockTopics}
        router={routerMock as unknown as NextRouter}
      />,
    );

    const antForm: any = wrapper.find('ForwardRef(InternalForm)').props();

    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });
    const patchData = {
      description: 'New description',
      dataDimensionsTaxonomyRoots: 'Type,Format',
    };
    antForm.onFinish(patchData);
  });

  it('Asks for confirmation before canceling edit', () => {
    const { queryByText } = container;
    // Expect popconfirm to be closed
    let popConfirmYes = queryByText('Yes');
    let popConfirmNo = queryByText('No');
    expect(popConfirmYes).toBeNull();
    expect(popConfirmNo).toBeNull();

    // Click cancel to open popconfirm
    userEvent.click(form.cancelButton);

    // Expect popconfirm to be opened
    popConfirmYes = queryByText('Yes');
    popConfirmNo = queryByText('No');
    expect(popConfirmYes).toBeInTheDocument();
    expect(popConfirmNo).toBeInTheDocument();
  });

  it('Can cancel edit', () => {
    const { queryByText } = container;
    // Expect router to not be used yet
    expect(routerMock.push).not.toBeCalled();
    // Expect popconfirm to be closed
    let popConfirmYes = queryByText('Yes');
    expect(popConfirmYes).toBeNull();

    // Click cancel to open popconfirm
    userEvent.click(form.cancelButton);

    // Expect popconfirm to be opened
    popConfirmYes = queryByText('Yes');
    expect(popConfirmYes).toBeInTheDocument();

    // Click confirm cancel
    userEvent.click(popConfirmYes);
    expect(routerMock.push).toBeCalled();
  });

  it('Can decide against cancel edit', () => {
    const { queryByText } = container;
    // Expect popconfirm to be closed
    let popConfirmNo = queryByText('No');
    expect(popConfirmNo).toBeNull();

    // Click cancel to open popconfirm
    userEvent.click(form.cancelButton);

    // Expect popconfirm to be opened
    popConfirmNo = queryByText('No');
    expect(popConfirmNo).toBeInTheDocument();

    // Click confirm cancel
    userEvent.click(popConfirmNo);
  });
});
