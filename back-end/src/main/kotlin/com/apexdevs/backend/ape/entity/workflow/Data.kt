/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape.entity.workflow

import org.json.JSONObject
/**
 * Class to parse incoming JSON from the front-end
 * into a class that is easier to handle in the back-end
 * @param taxonomyRoots a map that uses the taxonomy dimensions to format the data e.g. ["type"->"Image","Format"->"PNG"]
 */
data class Data(val taxonomyRoots: MutableMap<String, String>) {

    fun toJSONObject(): JSONObject {
        val jsonObject = JSONObject()
        taxonomyRoots.forEach { entry ->
            jsonObject.put(entry.key, entry.value)
        }
        return jsonObject
    }
}
