/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import WorkflowData from '@models/workflow/WorkflowVisualizerData';

const TestWorkflow: WorkflowData = {
  id: 0,
  inputTypeStates: [
    { id: 'JPG,Image_MemT0.0', label: 'JPG, Image' },
  ],
  outputTypeStates: [
    { id: 'PNG,Image_MemT2.0', label: 'PNG, Image' },
    { id: 'BMP,Image_MemT1.0', label: 'BMP, Image' },
  ],
  tools: [
    { id: 'to_bitmap_Tool1',
      label: 'to_bitmap',
      inputTypes: [
        { id: 'JPG,Image_MemT0.0', label: 'JPG, Image' },
      ],
      outputTypes: [
        { id: 'BMP,Image_MemT1.0', label: 'BMP, Image' },
      ] },
    { id: 'hue_Tool2',
      label: 'hue',
      inputTypes: [
        { id: 'JPG,Image_MemT0.0', label: 'JPG, Image' },
      ],
      outputTypes: [
        { id: 'PNG,Image_MemT2.0', label: 'PNG, Image' },
      ] },
  ],
};

export default TestWorkflow;
