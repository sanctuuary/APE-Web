/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * Data class to represent the workflow output
 * @param id the location of the solution in the solutionsList from APE
 * @param inputTypeStates the input types required for the workflow
 * @param outputTypeStates the output types at the end of the workflow
 * @param tools the tools that produce the workflow
 */
data class WorkflowOutput(val id: Int, val inputTypeStates: List<ParsedTypeNode>?, val outputTypeStates: List<ParsedTypeNode>, val tools: List<ParsedModuleNode>)
