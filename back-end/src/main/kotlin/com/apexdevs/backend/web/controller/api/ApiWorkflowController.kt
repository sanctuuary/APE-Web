/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.api

import com.apexdevs.backend.ape.ApeRequestFactory
import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.ape.entity.workflow.InputData
import com.apexdevs.backend.ape.entity.workflow.Ontology
import com.apexdevs.backend.ape.entity.workflow.RunConfig
import com.apexdevs.backend.ape.entity.workflow.TotalConfig
import com.apexdevs.backend.ape.entity.workflow.WorkflowOutput
import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.exception.RunParametersExceedLimitsException
import com.apexdevs.backend.persistence.exception.SynthesisFlagException
import com.apexdevs.backend.persistence.filesystem.FileTypes
import com.apexdevs.backend.persistence.filesystem.StorageService
import org.json.JSONObject
import org.springframework.core.io.Resource
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import javax.servlet.http.HttpSession

/**
 * Class for handling the Api calls coming from the front-end
 * all Ajax calls for the workflow should be made through here
 *
 * @param apeRequestFactory factory that maintains the ApeRequest instances
 * @param storageService handles filesystem operations
 * @param userOperation operates on database user information
 */
@RestController
@RequestMapping("/api/workflow")
class ApiWorkflowController(
    val apeRequestFactory: ApeRequestFactory,
    val storageService: StorageService,
    val userOperation: UserOperation
) {
    /**
     * @Return: workflow input and output data
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/data")
    fun getWorkflowData(session: HttpSession): Ontology {
        try {
            return apeRequestFactory.getApeRequest(session.id).dataOntology
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * @return: list of the constraints of a domain, each containing its ID, description and expected parameters
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/constraints")
    fun getConstraintData(session: HttpSession): List<Constraint> {
        try {
            return apeRequestFactory.getApeRequest(session.id).constraints
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * @return: workflow tool data
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/tools")
    fun getToolData(session: HttpSession): Ontology {
        try {
            return apeRequestFactory.getApeRequest(session.id).toolsOntology
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * @Return: workflow demo-config as a resource
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/useCaseConfig")
    fun getUseCaseConfig(@AuthenticationPrincipal user: User?, session: HttpSession): ResponseEntity<Resource> {
        try {
            val userResult = user?.let { userOperation.getByEmail(it.username) }
            val apeRequest = apeRequestFactory.getApeRequest(session.id)
            return storageService.loadFileAsResponse(apeRequest.domain.id, FileTypes.UseCaseRunConfig, userResult)
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * @Return: workflow demo-config as a resource
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/useCaseConstraints")
    fun getUseCaseConstraint(@AuthenticationPrincipal user: User?, session: HttpSession): ResponseEntity<Resource> {
        try {
            val userResult = user?.let { userOperation.getByEmail(it.username) }
            val apeRequest = apeRequestFactory.getApeRequest(session.id)
            return storageService.loadFileAsResponse(apeRequest.domain.id, FileTypes.UseCaseConstraints, userResult)
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * @param inputData
     * @return: JSON with the resulting workflow formatted as ResultingWorkflow entity
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/run")
    fun runAPEComputation(@AuthenticationPrincipal user: User?, @RequestBody inputData: InputData, session: HttpSession): MutableList<WorkflowOutput> {
        try {
            if (inputData.solutions > 100) {
                user?.let {
                    val userResult = userOperation.getByEmail(it.username)
                    if (userResult.status != UserStatus.Approved)
                        throw IllegalArgumentException("Not enough rights for provided run parameters")
                } ?: throw IllegalArgumentException("Not enough rights for provided run parameters")
            }

            val apeRequest = apeRequestFactory.getApeRequest(session.id)

            val runConfig = RunConfig(
                solutionMinLength = inputData.minLength,
                solutionMaxLength = inputData.maxLength,
                maxSolutionsToReturn = inputData.solutions,
                maxDuration = inputData.maxDuration,
                inputs = inputData.input,
                outputs = inputData.expectedOutput
            )

            storageService.storeConstraint(apeRequest.domain.id, FileTypes.Constraints, inputData.constraints)

            return apeRequest.getWorkflows(runConfig)
        } catch (exc: Exception) {
            when (exc) {
                is IllegalArgumentException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough rights for provided run parameters", exc)
                is RunParametersExceedLimitsException ->
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, exc.message, exc)
                is SynthesisFlagException ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, exc.getFriendlyMessage(), exc)
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    /**
     * The user can send a configuration and is then returned as a zip containing the configuration
     * @param inputData
     * @return an response entity containing the Response entity with the resource
     */
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/config")
    fun getRunConfig(@RequestBody inputData: InputData, session: HttpSession): ResponseEntity<Resource> {
        try {
            val apeRequest = apeRequestFactory.getApeRequest(session.id)
            val resourceMap = mutableMapOf<String, ByteArray>()

            val totalConfig = TotalConfig(
                ontologyPrefix = apeRequest.domain.ontologyPrefixIRI,
                toolsTaxonomyRoot = apeRequest.domain.toolsTaxonomyRoot,
                dataDimensionsTaxonomyRoots = apeRequest.domain.dataDimensionsTaxonomyRoots,
                strictToolAnnotations = apeRequest.domain.strictToolsAnnotations,
                timeOut = inputData.maxDuration,
                solutionMinLength = inputData.minLength,
                solutionMaxLength = inputData.maxLength,
                maxSolutionsToReturn = inputData.solutions,
                inputs = inputData.input,
                outputs = inputData.expectedOutput
            )
            val totalConfigJson = totalConfig.toJSONObject()
            resourceMap["run_config.json"] = totalConfigJson.toString(4).toByteArray()

            inputData.constraints?.let {
                // Main JSON body
                val constraintJSON = JSONObject()
                // Array with all provided constraints
                val constraintsArray = mutableListOf<JSONObject>()
                // For every constraint provided add it to the array of constraints
                it.forEach { constraint ->
                    constraintsArray.add(constraint.toJSONObject())
                }
                constraintJSON.put("constraints", constraintsArray)

                resourceMap["constraints.json"] = constraintJSON.toString(4).toByteArray()
            }

            return storageService.resourcesToZip(resourceMap, "user_config")
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
        }
    }

    /**
     * Converts the provided solutions into a CWL script
     * @param solutionId wanted solution's id to download as cwl via path variable
     * @return a CWL script of requested solution
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/cwl/{solutionId}")
    fun getSolutionCwl(session: HttpSession, @PathVariable solutionId: List<Int>): ResponseEntity<Resource> {
        try {
            val solutionConverter: (Int) -> ByteArray = { id -> apeRequestFactory.getApeRequest(session.id).generateCwl(id) }
            return storageService.indexToResponseEntity(solutionId, solutionConverter, "cwl", "workflow_CWL")
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Converts the provided solutions into a bash script
     * @param solutionId wanted solution's id to download as bash via path variable
     * @return a bash script of requested solution
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/bash/{solutionId}")
    fun getSolutionBash(session: HttpSession, @PathVariable solutionId: List<Int>): ResponseEntity<Resource> {
        try {
            val solutionConverter: (Int) -> ByteArray = { id -> apeRequestFactory.getApeRequest(session.id).generateBash(id) }
            return storageService.indexToResponseEntity(solutionId, solutionConverter, "sh", "workflow_bash_script")
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * Converts the provided solutions into a PNG
     * @param solutionId wanted solution's id to download as cwl via path variable
     * @return a png file of requested solution
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/png/{solutionId}")
    fun getSolutionPNG(session: HttpSession, @PathVariable solutionId: List<Int>): ResponseEntity<Resource> {
        try {
            val solutionConverter: (Int) -> ByteArray = { id -> apeRequestFactory.getApeRequest(session.id).generatePNG(id) }
            return storageService.indexToResponseEntity(solutionId, solutionConverter, "png", "workflow_image")
        } catch (exc: Exception) {
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
