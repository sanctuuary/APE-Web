/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONArray
import org.json.JSONObject

/**
 *  total config which APE(Request) needs to generate a workflow
 */
data class TotalConfig(
    private val ontologyPath: String = "",
    private val ontologyPrefix: String,
    private val toolsTaxonomyRoot: String,
    private val dataDimensionsTaxonomyRoots: List<String>,
    private val toolAnnotationsPath: String = "",
    private val strictToolAnnotations: Boolean,
    private val constraintsPath: String = "",
    private val timeOut: Int,
    private val solutionsDirPath: String = "",
    private val solutionMinLength: Int,
    private val solutionMaxLength: Int,
    private val maxSolutionsToReturn: Int,
    private val noExecutionScripts: Int = 0,
    private val noWorkflowImages: Int = 0,
    private val toolSeqRepeat: Boolean = false,
    private val inputs: List<Data> = emptyList(),
    private val outputs: List<Data> = emptyList(),
    private val debugMode: Boolean = false,
    private val useWorkflowInput: String = "all",
    private val useGeneratedData: String = "all"
) {
    fun toJSONObject(): JSONObject {
        val json = JSONObject()
        json.put("ontology_path", ontologyPath)
        json.put("ontologyPrefixIRI", ontologyPrefix)
        json.put("toolsTaxonomyRoot", toolsTaxonomyRoot)
        json.put("dataDimensionsTaxonomyRoots", dataDimensionsTaxonomyRoots)
        json.put("tool_annotations_path", toolAnnotationsPath)
        json.put("strict_tool_annotations", strictToolAnnotations)
        json.put("constraints_path", constraintsPath)
        json.put("timeout_sec", timeOut)
        json.put("solutions_dir_path", solutionsDirPath)

        val lengths = JSONObject().accumulate("min", solutionMinLength).accumulate("max", solutionMaxLength)
        json.put("solution_length", lengths)
        json.put("solutions", maxSolutionsToReturn)
        json.put("number_of_execution_scripts", noExecutionScripts)
        json.put("number_of_generated_graphs", noWorkflowImages)
        json.put("tool_seq_repeat", toolSeqRepeat)

        if (inputs.isNotEmpty())
            json.put("inputs", xput(inputs))

        if (outputs.isNotEmpty())
            json.put("outputs", xput(outputs))

        json.put("debug_mode", debugMode)
        json.put("use_workflow_input", useWorkflowInput)
        json.put("use_all_generated_data", useGeneratedData)
        return json
    }

    // helper function for filling input/output arrays
    private fun xput(inoutput: List<Data>): JSONArray {
        val xput = JSONArray()
        for (data in inoutput) {
            val tempJson = JSONObject()
            data.taxonomyRoots.forEach { entry ->
                val valueArray = JSONArray()
                valueArray.put(entry.value)
                tempJson.put(entry.key, valueArray)
            }
            xput.put(tempJson)
        }
        return xput
    }
}
