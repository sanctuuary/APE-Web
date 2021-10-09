/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { useState } from 'react';
import { message, TreeSelect } from 'antd';
import { OntologyNode } from '@models/workflow/Workflow';

const { TreeNode } = TreeSelect;

/**
 * The separator character, used to make the unique keys in {@link collapse}.
 * Warning: this string needs to be unique and can't be included in any node
 * label, otherwise a lookup will fail.
 */
const separator: string = '\n';

/**
 * Props interface for {@link OntologyTreeSelect}
 */
interface OntologyTreeSelectProps {
  /** The ontology to turn into a TreeSelect */
  ontology: OntologyNode;
  /** The current value */
  value: { type: string, label: string, id: string };
  /** Set the label in the parent component */
  setValue: (value: { type: string, label: string, id: string }) => void;
  /** The placeholder text for the TreeSelect */
  placeholder: string;
}

/**
 * Collapse the ontology node into TreeNode options for a TreeSelect
 * @param node - the node to collapse
 * @param parents - the keys of the parents, to form a unique key
 * @param query - the query that should be filtered on
 * @return - A TreeNode of the node and all children as child components
 */
function collapse(node: OntologyNode, query: string = '', parents: string[] = []) {
  // Concat the node to the parents in a new copy
  const route = parents.concat([node.label]);
  // Make it into a string
  const joinedString = route.join(separator);

  // List of children nodes, only assign if node.children isn't null
  let childrenNodes;
  if (node.children !== null) {
    childrenNodes = node.children.map((child: OntologyNode) => collapse(child, query, route));
  }

  /*
   * Check if the childrenNodes aren't null or if the current node has the query in its path.
   * Look in the path, so if a parent node has the query, the children get included as well.
   * If so: return a TreeNode of this node with its children.
   * If not: return null, meaning that this node shouldn't be in the list of options.
   */
  return childrenNodes || joinedString.toLowerCase().includes(query) ? (
    <TreeNode value={joinedString} key={joinedString} title={node.label}>
      {
        childrenNodes
      }
    </TreeNode>
  ) : null;
}

/**
 * Search recursively in the tree for a node with the given label. Stack the labels
 * of the parents, and when the node is found return a string the labels joined by
 * {@link separator}. If the label is not in the tree, return null.
 * @param label - The label we are looking for.
 * @param node - The current node that is being searched. Set this to the root
 * to search in the entire tree.
 * @param parents - A list of labels of the parent nodes.
 * @return - A joined string of the parent labels.
 */
function searchInTree(label: string, node: OntologyNode, parents: string[] = []) {
  const path = parents.concat([node.label]);

  if (node.label === label) {
    return path.join(separator);
  }

  let output: string = null;
  if (node.children !== null) {
    /*
     * Iterate over the children and call SearchInTree on them and store
     * the value in output. If the return value is not null, it means we
     * have found the node and can stop iterating.
     */
    node.children.some((child) => {
      output = searchInTree(label, child, path);
      return output !== null;
    });
  }
  return output;
}

/**
 * Ontology Tree Select component. Transforms the ontology root
 * into a antd TreeSelect component, folding the nodes into TreeNodes.
 * Includes a filter function and hierarchical dropdown menu. If a
 * value can not be found in the tree, set it to empty.
 */
function OntologyTreeSelect(props: OntologyTreeSelectProps) {
  const { ontology, value, setValue, placeholder } = props;

  /**
   * Find the path to the value node in the ontology.
   */
  const findPath = () => {
    /*
     * For the initial path: find the node in the tree with that corresponds
     * to the label. If the tree has duplicates, return the first one it finds.
     */
    let result: string = null;
    if (value.label !== null) {
      result = searchInTree(value.label, ontology);
    }

    return result;
  };

  /*
   * Store the path to the node in the hooks. The actual value gets updated
   * by onChange, so this is a copy that is better to work with in this environment.
   */
  const [path, setPath]: [string, (value: string) => void] = useState(findPath());

  /*
   * This check is here to see if the path needs updating. When the OntologyTreeSelect
   * already had a value and gets changed from the outside, the path will not end with
   * value.label so reset the path. The same goes for when the OntologyTreeSelect was
   * instantiated, but didn't receive a value yet. The path will be null, but the value
   * might be non-null. Reset the path in that case too.
   */
  if ((path && !path.endsWith(value.label)) || (!path && value.label)) {
    const result = findPath();
    if (result) {
      setPath(result);
    } else {
      // Result is null, meaning that the label couldn't be found. Empty the value.
      message.error(`Node with label ${value.label} could not be found in the tree`);
      setValue({ label: undefined, type: undefined, id: undefined });
    }
  }

  /**
   * Translate the key back into a tool and call the onChange function.
   * @param key - the key, build up by joining the parent labels.
   */
  const onChange = (key: string): void => {
    if (key === undefined) {
      // If the key is undefined (meaning that the value is being cleared), empty the value
      setValue({ label: undefined, type: undefined, id: undefined });
      setPath(null);
    } else {
      // Walk through the tree and go to the node given by splitting the key

      // Split the key up by its separator
      const parts: string[] = key.split(separator);

      // Start at the top of the tree
      let node: OntologyNode = ontology;

      // Remove the first part, since it is the root node
      parts.splice(0, 1);

      // For each subsequent part of the chain, go into the child node
      parts.forEach((part) => {
        node = node.children.find((child) => child.label === part);
      });

      // Set the value to the node value
      setValue({ id: node.id, label: node.label, type: ontology.id });
      setPath(key);
    }
  };

  // Hooks for the data in the TreeSelect. Initial value is the unfiltered tree.
  const [tree, setTree] = useState(collapse(ontology));

  /**
   * On search function. Filter the ontology tree on a query. Set the
   * data for the TreeSelect accordingly.
   * @param query - the string to filter on.
   */
  const onSearch = (query: string) => setTree(collapse(ontology, query.toLowerCase()));

  /*
   * The values of the tree have to be unique, so they are joined strings
   * of all the parent ids (e.g. Tool/Coloring/Levels/mild_contrast).
   */
  return (
    <TreeSelect
      data-testid="OntologyTreeSelect"
      style={{ width: '100%' }}
      showSearch
      value={path}
      placeholder={placeholder}
      allowClear
      onChange={onChange}
      onSearch={onSearch}
      treeDefaultExpandedKeys={[ontology.label]}
    >
      { tree }
    </TreeSelect>
  );
}

export default OntologyTreeSelect;
