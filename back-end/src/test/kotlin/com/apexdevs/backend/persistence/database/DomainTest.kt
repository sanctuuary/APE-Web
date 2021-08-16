/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.repository.DomainRepository
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@DataMongoTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DisplayName("Database Domain tests")
class DomainTest(@Autowired val domainRepository: DomainRepository) {
    private val domainList = List<ObjectId>(10) { ObjectId.get() }

    @BeforeAll
    fun `Domain insertion test`() {
        for ((n, domainId) in domainList.withIndex()) {
            // Insert new domain with an Id from the domainList
            domainRepository.insert(
                Domain(
                    domainId, "TestDomain $n", "TestDescription", "domain/$domainId/",
                    DomainVisibility.Public,
                    "Test", "Test", listOf("Test"), true
                )
            )
        }
    }

    @Test
    fun `Domain search test`() {
        val results = domainRepository.findAllById(domainList)

        // Assert that exactly the same amount of domains were inserted and found as intended
        assertEquals(domainList.count(), results.count())
    }

    @Test
    fun `Domain collection listing test`() {
        // Assert that a group query
        assertTrue(domainRepository.count() >= domainList.count())
    }

    @Test
    fun `Domain path is id test`() {
        val domain = Domain("title", "description", DomainVisibility.Public, "Test", "Test", listOf("Test"), true)

        assert(domain.localPath == "domain/${domain.id}/")
    }
}
