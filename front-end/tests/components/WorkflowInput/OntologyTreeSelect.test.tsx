/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { getByText, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataType, OntologyNode } from '@models/workflow/Workflow';
import OntologyTreeSelect from '@components/WorkflowInput/OntologyTreeSelect';
import { listedTestData, testData } from '../../data/WorkflowInput';

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  const TreeSelect = (props: {
    children: any,
    value: string,
    onChange: (key: string) => void;
    placeholder: string,
  }) => {
    const { children, value, onChange, placeholder } = props;

    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      >
        { children }
      </select>
    );
  };

  type MockNode = {
    key: string;
    props: {
      value: string;
      title: string;
      children: MockNode[];
    };
  };

  TreeSelect.TreeNode = (props: { value: string, title: string, children: MockNode[] }) => {
    const { value, title, children } = props;

    const fold = (child: MockNode) => {
      if (child.props.children === undefined) {
        return <option key={child.key} value={child.props.value}>{child.props.title}</option>;
      }
      return [
        <option key={child.key} value={child.props.value}>{child.props.title}</option>,
        ...child.props.children.map(fold),
      ];
    };

    return [<option key={title} value={value}>{title}</option>, ...children.flatMap(fold)];
  };

  return { ...antd, TreeSelect };
});

const root: OntologyNode = testData.roots[0];
const options: DataType[] = listedTestData[0];

describe.skip('OntologyTreeSelect', () => {
  let value: DataType;
  let select: HTMLSelectElement;

  beforeEach(() => {
    value = { label: undefined, type: undefined, id: undefined };

    // TODO: something goes wrong in the setValue function
    const { getByRole } = render(
      <OntologyTreeSelect
        ontology={root}
        value={value}
        setValue={(val) => { value = val; }}
        placeholder={`Select ${root.label}`}
      />,
    );

    select = getByRole('combobox') as HTMLSelectElement;
  });

  test('Select value', async () => {
    const selectedValue = options[6]; // Color
    userEvent.selectOptions(select, getByText(select, selectedValue.label));

    expect(select.value).toEqual(selectedValue.label);
  });
});
