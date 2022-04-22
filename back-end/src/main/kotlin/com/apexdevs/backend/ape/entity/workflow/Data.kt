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

/**
 * Construct a list of Data objects from JSON data.
 * @param json The JSON data.
 * @return A list of Data objects constructed from the given JSON data.
 */
fun dataListFromJSON(json: ArrayList<LinkedHashMap<String, ArrayList<String>>>): List<Data> {
    val result = mutableListOf<Data>()
    json.forEach { linkedHashMap ->
        val mutableMap: MutableMap<String, String> = LinkedHashMap()
        linkedHashMap.forEach { entry ->
            mutableMap[entry.key] = entry.value[0]
        }
        result.add(Data(mutableMap))
    }
    return result
}
