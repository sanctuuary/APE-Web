package com.apexdevs.backend.web.controller.routing

import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.database.entity.RunParameters
import com.apexdevs.backend.persistence.exception.GlobalRunParametersNotFoundException
import com.apexdevs.backend.web.controller.entity.runparameters.RunParametersDetails
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import java.util.logging.Logger

@RestController
@RequestMapping("/runparameters")
class RunParametersController(private val runParametersOperation: RunParametersOperation) {
    /**
     * Returns the global run parameters settings
     * @return The run parameters settings
     */
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/")
    fun getRunGlobalParameters(): RunParametersDetails {
        return try {
            val runParameters = runParametersOperation.getGlobalRunParameters()
            runParametersOperation.getRunParametersDetails(runParameters)
        } catch (exc: Exception) {
            when (exc) {
                is GlobalRunParametersNotFoundException -> {
                    // Global run parameters settings didn't exist before, create it with default settings
                    log.info("No global run parameters settings found: creating them using default values.")
                    runParametersOperation.getRunParametersDetails(
                        runParametersOperation.createRunParameters(RunParameters())
                    )
                }
                else ->
                    throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "", exc)
            }
        }
    }

    companion object {
        val log: Logger = Logger.getLogger("ApiAdminController_Logger")
    }
}
