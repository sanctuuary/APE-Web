/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Constraint, ParameterType, Tool } from '@models/workflow/Workflow';
import { Sketch } from './ConstraintSketcher';
import styles from './ConstraintSketcher.module.less';

/**
 * Convert the sketch into an array of constraints.
 * @param sketch - the sketch to convert
 */
export function translateSketch(sketch: Sketch): Constraint[] {
  const constraints: Constraint[] = [];

  /**
   * Add an use_m constraint to the constraint list.
   * @param tool - The tool value.
   */
  const use = (tool: Tool): void => {
    constraints.push({
      constraintType: {
        id: 'use_m',
        description: 'Use module parameter_1 in the solution.',
        parameterTypes: [ParameterType.Tool],
      },
      parameters: [tool],
    });
  };

  /**
   * Add an ite_m constraint to the constraint list.
   * @param tool1 - The first tool in the order
   * @param tool2 - The second tool in the order
   */
  const order = (tool1: Tool, tool2: Tool): void => {
    constraints.push({
      constraintType: {
        id: 'ite_m',
        description: 'If we use module parameter_1, then use parameter_2 subsequently.',
        parameterTypes: [ParameterType.Tool, ParameterType.Tool],
      },
      parameters: [tool1, tool2],
    });
  };

  // Filter the nodes by their type and if the tool is valid
  const filteredTools = sketch.tools.filter((tool) => tool.id !== undefined);

  /*
   * For each node in the filtered list, make it into a use constraint.
   * Also check for the next node and add an order constraint.
   */
  if (filteredTools.length > 0) {
    use(filteredTools[0]);
    for (let i = 1; i < filteredTools.length; i += 1) {
      order(filteredTools[i - 1], filteredTools[i]);
    }
  }

  return constraints;
}

/** Props interface for {@link SketchTranslation} */
interface SketchTranslationProps {
  /** The sketch to translate */
  sketch: Sketch;
}

/**
 * Sketch translation component.
 * @return a div element with the translated sketch. If the sketch is
 * empty, return null.
 */
function SketchTranslation(props: SketchTranslationProps) {
  const { sketch } = props;

  // If the sketch is undefined, return null
  if (!sketch) {
    return null;
  }

  // Translate the sketch to a list of constraints
  const translation: Constraint[] = translateSketch(sketch);

  // If the translation is empty, return null
  if (translation.length === 0) {
    return null;
  }

  const uses = [];
  const orders = [];

  // Sort the translation by uses and orders
  translation.forEach((constraint) => {
    if (constraint.constraintType.id === 'use_m') {
      const tool = constraint.parameters[0] as Tool;

      uses.push(
        <p id={styles.Constraint} key={constraint.constraintType.id}>
          <span id={styles.ConstraintPart} className={styles.Use}>use</span>
          <span id={styles.ConstraintPart} className={styles.Value}>{tool.label}</span>
        </p>,
      );
    } else if (constraint.constraintType.id === 'ite_m') {
      const tool1 = constraint.parameters[0] as Tool;
      const tool2 = constraint.parameters[1] as Tool;

      orders.push(
        <p id={styles.Constraint} key={constraint.constraintType.id}>
          <span id={styles.ConstraintPart} className={styles.Use}>use</span>
          <span id={styles.ConstraintPart} className={styles.Value}>{tool2.label}</span><br />
          <span id={styles.ConstraintPart} className={styles.Use}>after</span>
          <span id={styles.ConstraintPart} className={styles.Value}>{tool1.label}</span>
        </p>,
      );
    }
  });

  return (
    <div className={styles.Translation}>
      { uses }
      { orders }
    </div>
  );
}

export default SketchTranslation;
