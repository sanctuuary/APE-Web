/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONArray
import org.json.JSONObject

/**
 * Data class that represents a constraint received from the front-end
 * @param id the id of the internal constraint that ape uses
 * @param description the description of the constraint
 * @param parameterTypes used to send to front-end which type the parameters needs to be for the constraint
 * @param parameters a list of data that is required for the specified constraint
 */
data class Constraint(
    val id: String,
    val description: String? = null,
    val parameterTypes: List<String>? = null,
    val parameters: List<Data>? = null,
    val formula: String? = null
) {
    fun toJSONObject(): JSONObject {
        // Each constraint is an object
        val constraintJSON = JSONObject()
        // Add the id of the constraint
        constraintJSON.put("constraintid", id)

        if (parameters != null) {
            // The parameters are a JSON Array
            val constraintParams = JSONArray()
            // For every provided parameter add it to the array
            parameters.forEach { param ->
                // Create the object for the parameters
                val taxonomyJSONObject = JSONObject()
                param.taxonomyRoots.forEach { taxonomyRoot ->
                    // The value of the object is an array
                    val taxonomyValueArray = JSONArray()
                    // Insert the value into the array
                    taxonomyValueArray.put(taxonomyRoot.value)
                    // Insert the identifier along with its values
                    taxonomyJSONObject.put(taxonomyRoot.key, taxonomyValueArray)
                }
                constraintParams.put(taxonomyJSONObject)
            }
            constraintJSON.put("parameters", constraintParams)
        }

        if (formula != null) {
            constraintJSON.put("formula", formula)
        }

        return constraintJSON
    }
}

/**
 * Construct a list of Constraint object from JSON data.
 * @param json The JSON data.
 * @return A list of Constraint objects constructed from the given JSON data.
 */
fun constraintsFromJSON(json: ArrayList<LinkedHashMap<String, Any>>): List<Constraint> {
    val result = mutableListOf<Constraint>()
    json.forEach { linkedHashmap ->
        val id: String = linkedHashmap["constraintid"] as String
        val parameters = dataListFromJSON(linkedHashmap["parameters"] as ArrayList<LinkedHashMap<String, ArrayList<String>>>)
        val formula: String? = linkedHashmap["formula"] as String?
        result.add(
            Constraint(
                id = id,
                parameters = parameters,
                formula = formula
            )
        )
    }
    return result
}
