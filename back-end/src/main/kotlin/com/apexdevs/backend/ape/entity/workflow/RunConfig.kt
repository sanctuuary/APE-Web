/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONArray
import org.json.JSONObject

/**
 *  run config which APE(Request) needs to generate a workflow
 *  @param solutionMinLength minimum length of the solutions
 *  @param solutionMaxLength maximum length of the solutions
 *  @param maxSolutionsToReturn maximum number of solutions
 *  @param inputs the input data provided
 *  @param outputs the expected output provided
 *  @param noExecutionScripts Required APE parameter, not user-defined
 *  @param noWorkflowImages Required APE parameter, not user-defined
 *  @param sharedMemory Required APE parameter, not user-defined
 *  @param debugMode Required APE parameter, not user-defined
 *  @param toolSeqRepeat Required APE parameter, not user-defined
 *  @param useWorkflowInput Required APE parameter, not user-defined
 *  @param useGeneratedData Required APE parameter, not user-defined
 *  @param constraints The list of constraints provided
 *  @param maxDuration The maximum amount of time ape is allowed to run its computation, in seconds
 */
data class RunConfig(
    val solutionMinLength: Int,
    val solutionMaxLength: Int,
    val maxSolutionsToReturn: Int,
    private val inputs: List<Data> = emptyList(),
    private val outputs: List<Data> = emptyList(),
    private val noExecutionScripts: Int = 0,
    private val noWorkflowImages: Int = 0,
    private val sharedMemory: Boolean = true,
    private val debugMode: Boolean = false,
    private val toolSeqRepeat: Boolean = false,
    private val useWorkflowInput: String = "all",
    private val useGeneratedData: String = "all",
    private val constraints: List<Constraint>? = null,
    val maxDuration: Int = 10
) {
    fun toJSONObject(): JSONObject {
        val json = JSONObject()
        val lengths = JSONObject().accumulate("min", solutionMinLength).accumulate("max", solutionMaxLength)

        if (inputs.isNotEmpty())
            json.put("inputs", xput(inputs))

        if (outputs.isNotEmpty())
            json.put("outputs", xput(outputs))

        // TODO does not integrate with APE yet
        if (!constraints.isNullOrEmpty()) {
            val constraintJSON = JSONArray()
            constraints.forEach { constraint ->
                constraintJSON.put(constraint.toJSONObject())
            }
            json.accumulate("constraints", constraintJSON)
        }

        json.put("solution_length", lengths)
        json.put("max_solutions", "$maxSolutionsToReturn")
        json.put("number_of_execution_scripts", "$noExecutionScripts")
        json.put("number_of_generated_graphs", "$noWorkflowImages")
        json.put("shared_memory", sharedMemory)
        json.put("debug_mode", debugMode)
        json.put("use_workflow_input", useWorkflowInput)
        json.put("use_all_generated_data", useGeneratedData)
        json.put("tool_seq_repeat", toolSeqRepeat)
        json.put("timeout_sec", maxDuration)

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
