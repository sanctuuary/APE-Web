/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape

import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.filesystem.FileService
import io.mockk.every
import io.mockk.mockk
import io.mockk.spyk
import nl.uu.cs.ape.sat.APE
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.assertThrows

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApeRequestFactoryTest() {

    private val storageService = mockk<FileService>()
    private val runParametersOperation = mockk<RunParametersOperation>()

    private var apeRequestFactory = spyk(ApeRequestFactory(storageService, runParametersOperation))

    private val test = "Test"

    private val domain = Domain(test, test, test, DomainVisibility.Public, test, test, listOf(test), true)

    private val ape = mockk<APE>()

    @BeforeAll
    fun setUp() {
        every { apeRequestFactory.createNewApeInstance(any()) } returns ape
        every { storageService.rootLocation } returns mockk()
    }

    /**
     * Method: getApeRequest()
     */
    @Test
    fun `retrieve new ape request`() {
        val apeRequestTest = apeRequestFactory.getApeRequest(test, domain)
        assertEquals(domain, apeRequestTest.domain)
        assertEquals(apeRequestTest, apeRequestFactory.getApeRequest(test))
    }

    /**
     * Method: getApeRequest()
     */
    @Test
    fun `retrieve active ape request other domain`() {
        val apeRequestTest = apeRequestFactory.getApeRequest(test, domain)
        assertEquals(domain, apeRequestTest.domain)
        val otherDomain = mockk<Domain>()
        assertEquals(otherDomain, apeRequestFactory.getApeRequest(test, otherDomain).domain)
    }

    /**
     * Method: getApeRequest()
     */
    @Test
    fun `retrieve active ape request`() {
        val apeRequestTest = apeRequestFactory.getApeRequest(test, domain)
        assertEquals(apeRequestTest, apeRequestFactory.getApeRequest(test))
        assertEquals(apeRequestTest, apeRequestFactory.getApeRequest(test, domain))
    }

    /**
     * Method: getApeRequest()
     */
    @Test
    fun `null pointer non-existing ape request`() {
        assertThrows<NullPointerException> { apeRequestFactory.getApeRequest("Undefined") }
    }

    /**
     * Method: getApeRequest()
     */
    @Test
    fun removeApeRequest() {
        apeRequestFactory.getApeRequest(test, domain)
        assertEquals(Unit, apeRequestFactory.removeApeRequest(test))
    }
}
