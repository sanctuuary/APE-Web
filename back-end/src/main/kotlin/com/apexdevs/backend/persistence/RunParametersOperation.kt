package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.RunParameters
import com.apexdevs.backend.persistence.database.repository.RunParametersRepository
import com.apexdevs.backend.persistence.exception.GlobalRunParametersNotFoundException
import com.apexdevs.backend.persistence.exception.RunParametersNotFoundException
import com.apexdevs.backend.web.controller.entity.runparameters.RunParametersDetails
import org.bson.types.ObjectId
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Component

/**
 * Performs run parameters operations on the database
 * @param runParametersRepository (autowired)
 */
@Component
class RunParametersOperation(val runParametersRepository: RunParametersRepository) {
    /**
     * Create new run parameters
     * @param runParameters run parameters to add to the database
     * @throws DuplicateKeyException if the key already exists
     * @return The created run parameters
     */
    @Throws(DuplicateKeyException::class)
    fun createRunParameters(runParameters: RunParameters): RunParameters {
        try {
            return runParametersRepository.insert(runParameters)
        } catch (exception: DuplicateKeyException) {
            throw DuplicateKeyException("These run parameters already exist")
        }
    }

    /**
     * Retrieves the run parameters by id and throws an exception if not found.
     * @param id the id of the run parameters
     * @throws RunParametersNotFoundException if the run parameters are not found
     * @return RunParameters that match the id
     */
    @Throws(RunParametersNotFoundException::class)
    fun getRunParameters(id: ObjectId): RunParameters {
        val result = runParametersRepository.findById(id)

        if (result.isEmpty)
            throw RunParametersNotFoundException(this, id, "Requested run parameters were not found")

        return result.get()
    }

    /**
     * Update the given run parameters
     * @param runParameters The new run parameters to save in the database
     * @return The saved run parameters
     */
    fun updateRunParameters(runParameters: RunParameters): RunParameters {
        return runParametersRepository.save(runParameters)
    }

    /**
     * Returns run parameters information
     * @param runParameters to retrieve information from
     */
    fun getRunParametersDetails(runParameters: RunParameters): RunParametersDetails {
        return RunParametersDetails(
            runParameters.id.toHexString(),
            runParameters.minSteps.toString(),
            runParameters.maxSteps.toString(),
            runParameters.maxDuration.toString(),
            runParameters.numberOfSolutions.toString()
        )
    }

    /**
     * Get the global run parameters settings
     * @throws GlobalRunParametersNotFoundException when the global run parameters settings could not be found
     * @return The global run parameters settings
     */
    fun getGlobalRunParameters(): RunParameters {
        val list = runParametersRepository.findAll()
        if (list.isEmpty()) {
            throw GlobalRunParametersNotFoundException(this, "Global run parameters could not be found")
        }
        return list.first()
    }
}
