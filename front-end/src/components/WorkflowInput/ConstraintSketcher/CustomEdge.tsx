/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ArrowHeadType, getBezierPath, getMarkerEnd } from 'react-flow-renderer';
import React from 'react';
import { Position } from 'react-flow-renderer/dist/types';
import styles from './ConstraintSketcher.module.scss';

/**
 * Props interface for {@link CustomEdge}. The edge has a circle with a plus
 * in the middle.
 */
interface CustomEdgeProps {
  /** The id of the edge */
  id: string;
  // Not sure what these following props do
  /** Used for the bezier path */
  sourceX: number;
  /** Used for the bezier path */
  sourceY: number;
  /** Used for the bezier path */
  targetX: number;
  /** Used for the bezier path */
  targetY: number;
  /** Used for the bezier path */
  sourcePosition: Position;
  /** Used for the bezier path */
  targetPosition: Position;
  /** The data for the custom node */
  data: {
    /** The onAdd function to add a new node on the edge */
    onAdd: (id: string) => void;
  };
  /** The end marker of the edge */
  arrowHeadType: ArrowHeadType;
  /** The id of the end marker */
  markerEndId: string;
  /** The styling property */
  style: any;
}

/**
 * Custom edge component for {@link ConstraintSketcher}.
 * @deprecated found a better way to handle onClick and label got centered
 * by default edge.
 */
function CustomEdge(props: CustomEdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    arrowHeadType,
    markerEndId,
    style,
  } = props;

  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  // Bind the id to the onAdd function
  const onAdd = () => {
    data.onAdd(id);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        strokeDasharray="10,10"
        className={styles.CustomEdge}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: '12px' }}
          startOffset="50%"
          textAnchor="middle"
          onClick={onAdd}
        >
          +
        </textPath>
      </text>
    </>
  );
}

export default CustomEdge;
