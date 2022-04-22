/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class DomainRequestTest {

    private val test = "Test"
    private val topicList = listOf(test)
    private val ownerName = "TestUser"
    private val domainVerificationResult = DomainVerificationResult(true, true, null)
    private val domainRequest = DomainRequest(
        ObjectId.get().toHexString(),
        test,
        topicList,
        test,
        false,
        ownerName,
        domainVerificationResult,
    )

    @Test
    fun getTitle() {
        assertEquals(test, domainRequest.title)
    }

    @Test
    fun getTopics() {
        assertEquals(topicList, domainRequest.topics)
    }

    @Test
    fun getVerification() {
        assertEquals(domainVerificationResult, domainRequest.verification)
    }
}
