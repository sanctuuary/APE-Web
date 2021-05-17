package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.entity.RunParameters
import com.apexdevs.backend.persistence.database.repository.RunParametersRepository
import com.apexdevs.backend.persistence.exception.RunParametersNotFoundException
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import org.bson.types.ObjectId
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.Optional

@DisplayName("Database RunParametersOperation tests")
class RunParametersOperationTest {
    /**
     * Method: createRunParameters
     */
    @Test
    fun `Assert create run parameters inserts correct values`() {
        // create mocks
        val runParametersRepository = mockk<RunParametersRepository>()

        // create instance with mocks
        val runParametersOperation = RunParametersOperation(runParametersRepository)

        // set mocking returns and captures
        val runParametersSlot = slot<RunParameters>()
        every { runParametersRepository.insert(capture(runParametersSlot)) } answers
            { runParametersSlot.captured }

        // perform method
        val runParameters = RunParameters()
        runParametersOperation.createRunParameters(runParameters)

        // check results
        assert(runParametersSlot.isCaptured)
        assert(runParametersSlot.captured == runParameters)
    }

    /**
     * Method: getRunParameters
     */
    @Test
    fun `Assert get run parameters returns correct run parameters`() {
        // create mocks
        val runParametersRepository = mockk<RunParametersRepository>()

        // create instance with mocks
        val runParametersOperation = RunParametersOperation(runParametersRepository)

        // set mocking returns and captures
        val runParameters = RunParameters()
        every { runParametersRepository.findById(any()) } returns
            Optional.of(runParameters)

        val returned = runParametersOperation.getRunParameters(runParameters.id)

        // check results
        assert(returned == runParameters)
    }

    /**
     * Method: getRunParameters
     */
    @Test
    fun `Assert get run parameters throws if not found`() {
        // create mocks
        val runParametersRepository = mockk<RunParametersRepository>()

        // create instance with mocks
        val runParametersOperation = RunParametersOperation(runParametersRepository)

        // set mocking returns and captures
        val runParameters = RunParameters()
        every { runParametersRepository.findById(any()) } returns
            Optional.empty()

        assertThrows<RunParametersNotFoundException> {
            runParametersOperation.getRunParameters(runParameters.id)
        }
    }

    /**
     * Method: getGlobalRunParameters
     */
    @Test
    fun `Assert get global run parameters returns correct run parameters`() {
        // create mocks
        val runParametersRepository = mockk<RunParametersRepository>()

        // create instance with mocks
        val runParametersOperation = RunParametersOperation(runParametersRepository)

        // set mocking returns and captures
        val runParameters1 = RunParameters(ObjectId.get(), 100, 100, 6000, 100)
        val runParameters2 = RunParameters()
        every { runParametersRepository.findAll() } returns
            listOf(runParameters1, runParameters2)

        // perform method
        val returned = runParametersOperation.getGlobalRunParameters()

        // check results
        assert(returned == runParameters1)
        assert(returned != runParameters2)
    }
}
