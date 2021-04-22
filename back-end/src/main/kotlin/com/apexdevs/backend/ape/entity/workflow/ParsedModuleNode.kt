/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

/**
 * Data class that represents the Modules/Tools in a front-end friendly manner
 * @param id the internal id as represented in APE
 * @param label a front-end friendly label
 * @param inputTypes the input types required for the module
 * @param inputTypes the resulting types produced by the module
 */
data class ParsedModuleNode(val id: String, val label: String, val inputTypes: List<ParsedTypeNode>, val outputTypes: List<ParsedTypeNode>)
