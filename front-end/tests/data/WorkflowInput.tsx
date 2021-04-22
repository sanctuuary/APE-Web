/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ontologyToList } from '@pages/explore/[id]';
import { ConstraintType, Ontology, ParameterType } from '@models/workflow/Workflow';

/** Static mock data so the WorkflowInput.test.tsx can use it too */
const testData: Ontology = {
  title: 'ImageMagick_data',
  id: 'test_ontology',
  roots: [
    {
      label: 'Type',
      id: 'Type',
      children: [
        {
          label: 'FontFamily',
          id: 'FontFamily',
          children: null,
        },
        {
          label: 'Content',
          id: 'Content',
          children: null,
        },
        {
          label: 'Canvas',
          id: 'Canvas',
          children: [
            {
              label: 'Filter',
              id: 'Filter',
              children: null,
            },
            {
              label: 'Image',
              id: 'Image',
              children: null,
            },
          ],
        },
        {
          label: 'Color',
          id: 'Color',
          children: null,
        },
      ],
    },
    {
      label: 'Format',
      id: 'Format',
      children: [
        {
          label: 'TextFormat',
          id: 'TextFormat',
          children: [
            {
              label: 'String',
              id: 'String',
              children: null,
            },
          ],
        },
        {
          label: 'ImageFormat',
          id: 'ImageFormat',
          children: [
            {
              label: 'Compressed',
              id: 'Compressed',
              children: [
                {
                  label: 'JPG',
                  id: 'JPG',
                  children: null,
                },
              ],
            },
            {
              label: 'Lossless',
              id: 'Lossless',
              children: [
                {
                  label: 'PNG',
                  id: 'PNG',
                  children: null,
                },
                {
                  label: 'BMP',
                  id: 'BMP',
                  children: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Static mock tools so the WorkflowInput.test.tsx can use it too */
const testTools: Ontology = {
  title: 'Mockup ImageMagick Tools',
  id: 'ImageMagick_tools',
  roots: [
    {
      label: 'Tool',
      id: 'tool',
      children: [
        {
          label: 'Filter creation',
          id: 'filter_creation',
          children: [
            {
              label: 'Alpha filter',
              id: 'alpha_filter',
              children: null,
            },
            {
              label: 'Color filter',
              id: 'color_filter',
              children: null,
            },
          ],
        },
        {
          label: 'Text to image',
          id: 'text_to_image',
          children: [
            {
              label: 'Add title',
              id: 'add_title',
              children: null,
            },
            {
              label: 'Add caption',
              id: 'add_caption',
              children: null,
            },
          ],
        },
        {
          label: 'Layers',
          id: 'layers',
          children: null,
        },
        {
          label: 'Distort',
          id: 'distort',
          children: null,
        },
        {
          label: 'Generate',
          id: 'generate',
          children: null,
        },
        {
          label: 'Conversion',
          id: 'conversion',
          children: null,
        },
        {
          label: 'Geometry',
          id: 'geometry',
          children: null,
        },
        {
          label: 'Coloring',
          id: 'coloring',
          children: null,
        },
      ],
    },
  ],
};

/** Static mock constraints so the WorkflowInput.test.tsx can use it too */
const testConstraints: ConstraintType[] = [
  {
    id: 'ite_m',
    description: 'If we use module parameter_1, then use parameter_2 subsequently.',
    parameterTypes: [ParameterType.Tool, ParameterType.Tool],
  },
  {
    id: 'itn_m',
    description: 'If we use module parameter_1, then do not use parameter_2 subsequently.',
    parameterTypes: [ParameterType.Tool, ParameterType.Tool],
  },
  {
    id: 'depend_m',
    description: 'If we use module parameter_1, then we must have used parameter_2 prior to it.',
    parameterTypes: [ParameterType.Tool, ParameterType.Tool],
  },
  {
    id: 'next_m',
    description: 'If we use module parameter_1, then use parameter_2 as a next module in the sequence.',
    parameterTypes: [ParameterType.Tool, ParameterType.Tool],
  },
  {
    id: 'prev_m',
    description: 'If we use module parameter_1, then we must have used parameter_2 as a previous module in the sequence.',
    parameterTypes: [ParameterType.Tool, ParameterType.Tool],
  },
  {
    id: 'use_m',
    description: 'Use module parameter_1 in the solution.',
    parameterTypes: [ParameterType.Tool],
  },
  {
    id: 'nuse_m',
    description: 'Do not use module parameter_1 in the solution.',
    parameterTypes: [ParameterType.Tool],
  },
  {
    id: 'last_m',
    description: 'Use parameter_1 as last module in the solution.',
    parameterTypes: [ParameterType.Tool],
  },
  {
    id: 'use_t',
    description: 'Use type parameter_1 in the solution.',
    parameterTypes: [ParameterType.Data],
  },
  {
    id: 'gen_t',
    description: 'Generate type parameter_1 in the solution.',
    parameterTypes: [ParameterType.Data],
  },
  {
    id: 'nuse_t',
    description: 'Do not use type parameter_1 in the solution.',
    parameterTypes: [ParameterType.Data],
  },
  {
    id: 'ngen_t',
    description: 'Do not generate type parameter_1 in the solution.',
    parameterTypes: [ParameterType.Data],
  },
  {
    id: 'use_ite_t',
    description: 'If we have used data type parameter_1, then use type parameter_2 subsequently.',
    parameterTypes: [ParameterType.Data, ParameterType.Data],
  },
  {
    id: 'gen_ite_t',
    description: 'If we have generated data type parameter_1, then generate type parameter_2 subsequently.',
    parameterTypes: [ParameterType.Data, ParameterType.Data],
  },
  {
    id: 'use_itn_t',
    description: 'If we have used data type parameter_1, then do not use type parameter_2 subsequently.',
    parameterTypes: [ParameterType.Data, ParameterType.Data],
  },
  {
    id: 'gen_itn_t',
    description: 'If we have generated data type parameter_1, then do not generate type parameter_2 subsequently.',
    parameterTypes: [ParameterType.Data, ParameterType.Data],
  },
];

const listedTestData = ontologyToList(testData);

const listedTestTools = ontologyToList(testTools)[0].splice(1);

export { testData, testTools, testConstraints, listedTestData, listedTestTools };
