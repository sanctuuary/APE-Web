/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database.collection

import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.database.repository.DomainRepository
import com.apexdevs.backend.persistence.database.repository.UserDomainAccessRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test

@DisplayName("Database DomainCollection tests")
class DomainCollectionTest {
    /**
     * Method: getPublicDomains
     */
    @Test
    fun `Assert find public domains returns correctly`() {
        // create mocks
        val domainRepository = mockk<DomainRepository>()
        val userDomainAccessRepository = mockk<UserDomainAccessRepository>()

        // create instance
        val domainCollection = DomainCollection(domainRepository, userDomainAccessRepository)

        // create test data
        val testDomains = getTestDomains(10)

        // set mock returns
        every { domainRepository.findAllByVisibility(DomainVisibility.Public) } returns
            testDomains

        // perform method
        val domainResult = domainCollection.getPublicDomains()

        assert(domainResult.isNotEmpty())
        assert(domainResult.size == testDomains.size)
        assert(domainResult.distinct().containsAll(testDomains))
    }

    /**
     * Method: getDomainsByUserAndAccess
     */
    @Test
    fun `Assert get domains by user and access returns correctly`() {
        // create mocks
        val domainRepository = mockk<DomainRepository>()
        val userDomainAccessRepository = mockk<UserDomainAccessRepository>()

        // create instance
        val domainCollection = DomainCollection(domainRepository, userDomainAccessRepository)

        // create test data
        val user = getTestUser()
        val userDomainAccessTest = getTestUserDomainAccess(user, listOf(DomainAccess.ReadWrite, DomainAccess.Read, DomainAccess.Owner, DomainAccess.Revoked), 4)
        val userDomainAccessTestFiltered = userDomainAccessTest.filter {
            domainAccess ->
            domainAccess.access == DomainAccess.ReadWrite || domainAccess.access == DomainAccess.Read
        }

        // set mock returns
        every { userDomainAccessRepository.findAllByUserIdAndAccess(user.id, DomainAccess.Read) } returns
            userDomainAccessTest.filter { domainAccess -> domainAccess.access == DomainAccess.Read }

        every { userDomainAccessRepository.findAllByUserIdAndAccess(user.id, DomainAccess.ReadWrite) } returns
            userDomainAccessTest.filter { domainAccess -> domainAccess.access == DomainAccess.ReadWrite }

        // perform method
        val userDomainAccessResult = domainCollection.getDomainsByUserAndAccess(user, listOf(DomainAccess.ReadWrite, DomainAccess.Read))

        assert(userDomainAccessResult.isNotEmpty())
        assert(userDomainAccessResult.size == userDomainAccessTestFiltered.size)
        assert(userDomainAccessResult.distinct().containsAll(userDomainAccessTestFiltered))
    }

    /**
     * Returns a list of test domains
     */
    private fun getTestDomains(count: Int): List<Domain> {
        return List(count) {
            index ->
            Domain(
                "testDomain$index",
                "testDescription$index",
                DomainVisibility.Public,
                "prefix",
                "root",
                listOf("root1", "root2"),
                false
            )
        }
    }

    /**
     * Returns a test user
     */
    private fun getTestUser(): User {
        return User("user@test.test", "test", "testUser", UserStatus.Approved)
    }

    /**
     * Returns a list of user domain access objects
     * @param count is amount of domains per access level included
     */
    private fun getTestUserDomainAccess(user: User, domainAccessLevels: List<DomainAccess>, count: Int): List<UserDomainAccess> {
        val domains = getTestDomains(count)
        return domainAccessLevels.map { access -> List(count) { index -> UserDomainAccess(user.id, domains[index].id, access) } }.flatten()
    }
}
