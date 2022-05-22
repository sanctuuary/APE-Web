/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONArray
import org.json.JSONObject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class RunConfigTest {

    @Test
    fun toJSONObject() {
        val min = 1
        val max = 10
        val noSol = 100
        val map = mutableMapOf<String, String>()
        map["Test"] = "Test"
        val data = listOf(Data(map))
        val runConfig = RunConfig(solutionMinLength = min, solutionMaxLength = max, maxSolutionsToReturn = noSol, inputs = data, outputs = data)
        val jsonRunConfig = runConfig.toJSONObject()
        val json = JSONObject()
        val lengths = JSONObject().accumulate("min", min).accumulate("max", max)

        val inputJsonArray = JSONArray()
        for (entry in data) {
            val tempJson = JSONObject()
            entry.taxonomyRoots.forEach { type ->
                val array = JSONArray()
                array.put(type.value)
                tempJson.put(type.key, array)
            }
            inputJsonArray.put(tempJson)
        }

        json.put("solution_length", lengths)
        json.put("inputs", inputJsonArray)
        json.put("outputs", inputJsonArray)
        json.put("solutions", "$noSol")
        json.put("number_of_execution_scripts", "0")
        json.put("number_of_generated_graphs", "0")
        json.put("shared_memory", true)
        json.put("debug_mode", false)
        json.put("use_workflow_input", "all")
        json.put("use_all_generated_data", "all")
        json.put("tool_seq_repeat", false)
        json.put("timeout_sec", 10)
        assertEquals(json.toString(), jsonRunConfig.toString())
    }
}
