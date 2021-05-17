/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape

import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.filesystem.FileService
import com.apexdevs.backend.persistence.filesystem.FileTypes
import nl.uu.cs.ape.sat.APE
import nl.uu.cs.ape.sat.configuration.APECoreConfig
import org.springframework.stereotype.Component

/**
 * Class that will create an instantiation of ape and store it in an map based on the userID
 * @param fileService interface for filesystem operations
 */
@Component
class ApeRequestFactory(val fileService: FileService, val runParametersOperation: RunParametersOperation) {

    private val activeApeRequests = mutableMapOf<String, ApeRequest>()

    /**
     * method to make an instantiation of APERequest and store it in the collection based on the userID
     * @param userID id of the user that is currently logged in
     * @param domain the domain that has been requested
     * @return The ApeRequest instance associated with the user
     */
    fun getApeRequest(userID: String, domain: Domain? = null): ApeRequest {
        domain?.let { it ->
            if (!activeApeRequests.containsKey(userID)) {
                val ape = createNewApeInstance(domain)

                val apeRequest = ApeRequest(it, fileService.rootLocation, ape, runParametersOperation)

                activeApeRequests[userID] = apeRequest
                return apeRequest
            }

            if (activeApeRequests[userID]!!.domain != it) {
                // If the user requests another domain but already has an active ApeRequest
                removeApeRequest(userID)
                return getApeRequest(userID, it)
            }
            return activeApeRequests[userID]!!
        }
        activeApeRequests[userID]?.let { return it } ?: throw NullPointerException("User has not requested a domain yet")
    }

    /**
     * Creates a new instance of APE
     * @param domain the domain APE needs to find workflows for
     * @return a new instance of APE
     */
    fun createNewApeInstance(domain: Domain): APE {
        val ontology = fileService.loadFile(domain.id, FileTypes.Ontology)
        val toolsAnnotation = fileService.loadFile(domain.id, FileTypes.ToolsAnnotations)
        val core = APECoreConfig(
            ontology,
            domain.ontologyPrefixIRI,
            domain.toolsTaxonomyRoot,
            domain.dataDimensionsTaxonomyRoots,
            toolsAnnotation,
            domain.strictToolsAnnotations
        )
        return APE(core)
    }

    /**
     * method to remove the APERequest based on the userID
     * @param userID id of the user that is currently logged in
     */
    fun removeApeRequest(userID: String) {
        activeApeRequests.remove(userID)
    }
}
