/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import WorkflowVisualizer from '@components/Explore/WorkflowVisualizer/WorkflowVisualizer';
import WorkflowEdge from '@components/Explore/WorkflowVisualizer/Edges/WorkflowEdge';
import WorkflowParser, { testables } from '@components/Explore/WorkflowVisualizer/WorkflowParser';
import WorkflowData, { WorkflowTool } from '@models/workflow/WorkflowVisualizerData';

// Tests for workflow visualization

/*
 * We skip these tests because this part is still in active development
 * And it's useless to keep the tests up to date as the structure is changing
 * Back-end currently sends workflow data as a linear tree, this is wrong.
 * But a temporary fix for now.
 */
describe.skip('Workflow', () => {
  const testData: WorkflowData = {
    currentOperation: {
      tool: {
        name: 'overlap',
        input: [
          { type: 'image', format: 'png' },
          { type: 'image', format: 'jpg' },
        ],
        output: { type: 'image', format: 'png' },
      },
    },
    parents: [
      {
        currentOperation: {
          tool: {
            name: 'cut',
            input: [
              { type: 'Filter', format: 'png' },
            ],
            output: { type: 'image', format: 'png' },
          },
        },
        parents: [
          {
            currentOperation: {
              tool: {
                name: 'input2',
                input: null,
                output: { type: 'image', format: 'jpg' },
              },
            },
            parents: [],
          },
        ],
      },
      {
        currentOperation: {
          tool: {
            name: 'input',
            input: null,
            output: { type: 'image', format: 'jpg' },
          },
        },
        parents: [],
      },
    ],
  };

  /**
   * Test if the workflow successfully renders
   *
   * NOTE: this makes the coverage test immediately give
   * 100% coverage for src/components/Sidebar/Workflow/.
   * To truly test the coverage, temporarily disable this test.
   */
  test('Renders workflow', () => {
    /**
     * There seems to be an issue in either Jest or the React Flow library
     *
     * A warning will occur during unit testing,
     * saying the width and height of the React Flow parent element need to be set.
     * Whatever we do, the warning persists (but only in this test, not on the actual page).
     * To get rid of this warning, the console.warn method is ignored once.
     */
    jest.spyOn(console, 'warn').mockImplementationOnce(() => {});

    const { getByTestId } = render(<WorkflowVisualizer name="Test workflow" data={testData} />);
    const workflowComponent = getByTestId('Test workflow');
    expect(workflowComponent).toBeInTheDocument();
  });

  // Test default workflow edge generation
  test('WorkflowEdge', () => {
    const id = 'testID';
    const source = 'testSource';
    const target = 'testTarget';

    const edge = WorkflowEdge(id, source, target);
    expect(edge.id).toEqual(id);
    expect(edge.type).toEqual('step');
    expect(edge.source).toEqual(source);
    expect(edge.target).toEqual(target);
    expect(edge.animated).toEqual(false);
  });

  // Test WorkflowParser's parseType function
  test('parseType', () => {
    const { parseType } = testables;

    // Check if a toolNode is correctly parsed
    const toolNode: WorkflowTool = {
      name: 'toolNode',
      input: [{ type: 'type', format: 'format' }],
      output: { type: 'type', format: 'format' },
    };

    const toolType = parseType(toolNode);
    expect(toolType).toEqual('toolNode');

    // Check if an inputNode is correctly parsed
    const inputNode: WorkflowTool = {
      name: 'toolNode',
      input: null,
      output: { type: 'type', format: 'format' },
    };

    const inputType = parseType(inputNode);
    expect(inputType).toEqual('inputNode');

    // Check if an outputNode is correctly parsed
    const outputNode: WorkflowTool = {
      name: 'toolNode',
      input: [{ type: 'type', format: 'format' }],
      output: null,
    };

    const outputType = parseType(outputNode);
    expect(outputType).toEqual('outputNode');
  });

  // Test workflow data parsing
  test('WorkflowParser', () => {
    const parsed = WorkflowParser(testData);

    // The expected React Flow elements
    const expected = [
      {
        id: 'output',
        type: 'outputNode',
        data: { label: 'Workflow output' },
        position: { x: 0, y: 0 },
      },
      {
        id: 'overlap',
        type: 'toolNode',
        data: { label: 'overlap' },
        position: { x: 0, y: -150 },
      },
      {
        id: 'overlap_type',
        type: 'dataTypeNode',
        data: { label: 'image, png' },
        position: { x: 0, y: -75 },
      },
      {
        id: 'e_overlap-overlap_type',
        type: 'step',
        source: 'overlap',
        target: 'overlap_type__in',
        animated: false,
      },
      {
        id: 'e_overlap_type-output',
        type: 'step',
        source: 'overlap_type',
        target: 'output__in',
        animated: false,
      },
      {
        id: 'cut_type',
        type: 'dataTypeNode',
        data: { label: 'image, png' },
        position: { x: 0, y: -225 },
      },
      {
        id: 'input_type',
        type: 'dataTypeNode',
        data: { label: 'image, jpg' },
        position: { x: 100, y: -225 },
      },
      {
        id: 'cut',
        type: 'toolNode',
        data: { label: 'cut' },
        position: { x: 0, y: -300 },
      },
      {
        id: 'e_cut-cut_type',
        type: 'step',
        source: 'cut__out',
        target: 'cut_type__in',
        animated: false,
      },
      {
        id: 'input2_type',
        type: 'dataTypeNode',
        data: { label: 'image, jpg' },
        position: { x: 0, y: -375 },
      },
      {
        id: 'input2',
        type: 'inputNode',
        data: { label: 'input2' },
        position: { x: 0, y: -450 },
      },
      {
        id: 'e_input2-input2_type',
        type: 'step',
        source: 'input2__out',
        target: 'input2_type__in',
        animated: false,
      },
      {
        id: 'e_input2_type-cut',
        type: 'step',
        source: 'input2_type__out',
        target: 'cut__in',
        animated: false,
      },
      {
        id: 'input',
        type: 'inputNode',
        data: { label: 'input' },
        position: { x: 100, y: -300 },
      },
      {
        id: 'e_input-input_type',
        type: 'step',
        source: 'input__out',
        target: 'input_type__in',
        animated: false,
      },
      {
        id: 'e_cut_type-overlap',
        type: 'step',
        source: 'cut_type__out',
        target: 'overlap__in',
        animated: false,
      },
      {
        id: 'e_input_type-overlap',
        type: 'step',
        source: 'input_type__out',
        target: 'overlap__in',
        animated: false,
      },
    ];
    expect(parsed).toEqual(expected);
  });
});
