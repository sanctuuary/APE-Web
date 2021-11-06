/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence

import com.apexdevs.backend.persistence.database.DatabaseTestConfig
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainAccess
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserDomainAccess
import com.apexdevs.backend.persistence.database.entity.UserStatus
import com.apexdevs.backend.persistence.exception.DomainNotFoundException
import com.apexdevs.backend.persistence.exception.UserAccessException
import com.apexdevs.backend.web.controller.entity.domain.DomainUploadRequest
import io.mockk.spyk
import org.bson.types.ObjectId
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.junit.jupiter.api.fail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension

@ExtendWith(SpringExtension::class)
@DataMongoTest
@ContextConfiguration(classes = [DatabaseTestConfig::class, DomainOperation::class])
@DisplayName("Database DomainOperation DataMongo integration tests")
class DomainOperationIntegrationTest(@Autowired val domainOperation: DomainOperation) {
    /**
     * Create, store and return a new user for tests
     */
    private fun provideTestUser(): User {
        val userId: ObjectId = ObjectId.get()
        val user = User(userId, "$userId@test.com", "123", "test", UserStatus.Approved)
        domainOperation.userRepository.insert(user)

        return user
    }

    /**
     * Create domain with domain operation and return for tests
     */
    private fun provideTestDomain(ownerId: ObjectId): Domain {
        val domain = spyk(
            Domain(
                "MyTestDomain",
                "My test domain description",
                DomainVisibility.Private,
                "Test",
                "Test",
                listOf("Test"),
                true
            )
        )
        domainOperation.createDomain(domain, ownerId)

        return domain
    }

    /**
     * Method: createDomain
     */
    @Test
    fun `Domain create operation test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)

        // Check if domain exists and if access is given
        val domainResult = domainOperation.domainRepository.findById(domain.id)

        if (domainResult.isEmpty)
            fail("Domain is not created")

        val userAccessList = domainOperation.userDomainAccessRepository.findByDomainId(spyk(domainResult.get()).id)

        // Check if all user access to domain contains valid DomainAccess values
        for (userAccess in userAccessList) {
            // assert(userAccess.domainId != null && userAccess.user != null)
            assert(userAccess.access != DomainAccess.Revoked)
        }
    }

    /**
     * Method: getDomain
     */
    @Test
    fun `Domain get operation test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)

        // Retrieve domain, no exception should be thrown
        domainOperation.getDomain(domain.id)
    }

    /**
     * Method: getDomainAccess
     */
    @Test
    fun `Get domain user access rights test`() {
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)

        assert(domainOperation.getDomainAccess(owner, domain) == DomainAccess.Owner)
    }

    /**
     * Method: getDomain
     */
    @Test
    fun `Domain get operation exception test`() {
        // Initial state
        val owner = provideTestUser()
        provideTestDomain(owner.id)

        // Ensure that exception is thrown when requesting unknown domain
        Assertions.assertThrows(DomainNotFoundException::class.java) {
            domainOperation.getDomain(ObjectId.get())
        }
    }

    /**
     * Method: saveDomain
     */
    @Test
    fun `Domain save operation test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)

        // Make copy of domain and edit values
        val domainCopy = spyk(
            domain.copy(
                name = "testName123",
                description = "testDescription123",
                localPath = "/domain/testPath123",
                visibility = DomainVisibility.Public
            )
        )

        // Save domain changes
        domainOperation.saveDomain(domainCopy, owner.id)

        // Retrieve current domain from database
        val domainResult = domainOperation.domainRepository.findById(domain.id)

        // Changes should be stored
        assert(domainCopy == domainResult.get())
    }

    /**
     * Method: saveDomain
     */
    @Test
    fun `Domain save not authorized test`() {
        // Initial state
        val user = provideTestUser()
        val secondUser = provideTestUser()
        val thirdUser = provideTestUser()

        val domain = provideTestDomain(user.id)

        // Give second user read access to domain
        domainOperation.userDomainAccessRepository.insert(UserDomainAccess(secondUser.id, domain.id, DomainAccess.Read))

        // Make copy of domain and edit values
        val domainCopy = spyk(
            domain.copy(
                name = "testName123",
                description = "testDescription123",
                localPath = "/domain/testPath123",
                visibility = DomainVisibility.Public
            )
        )

        // Attempt to save domain with read-only user
        Assertions.assertThrows(UserAccessException::class.java) {
            domainOperation.saveDomain(domainCopy, secondUser.id)
        }

        // Attempt to save domain with no-access user
        Assertions.assertThrows(UserAccessException::class.java) {
            domainOperation.saveDomain(domainCopy, thirdUser.id)
        }

        val domainResult = domainOperation.domainRepository.findById(domain.id)

        // Changes should not be stored
        assert(domain == domainResult.get())
    }

    /**
     * Method: saveDomain
     */
    @Test
    fun `Domain set user access overload test`() {
        // Initial state
        val owner = provideTestUser()
        val user = provideTestUser()
        val domain = provideTestDomain(owner.id)

        // Allow r/w access to user
        domainOperation.setUserAccess(domain, user.id, DomainAccess.ReadWrite)

        // Make copy and changes values
        val domainCopy = spyk(
            domain.copy(
                name = "testName123",
                description = "testDescription123",
                localPath = "/domain/testPath123",
                visibility = DomainVisibility.Public
            )
        )

        // Save domain changes
        domainOperation.saveDomain(domainCopy, owner.id)

        // Retrieve current domain from database
        val domainResult = domainOperation.domainRepository.findById(domain.id)

        // Changes should be stored
        assert(domainCopy == domainResult.get())
    }

    /**
     * Method: archiveDomain
     */
    @Test
    fun `Archive domain test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)

        // Archive domain
        domainOperation.archiveDomain(domain, owner.id)

        val domainResult = domainOperation.domainRepository.findById(domain.id)

        assert(domainResult.get().visibility == DomainVisibility.Archived)
    }

    /**
     * Method: archiveDomain
     */
    @Test
    fun `Archive domain unauthorized test`() {
        // Initial state
        val owner = provideTestUser()

        // Get all domain access without owner, and zip them together with users
        val accessList = DomainAccess.values().filter { it != DomainAccess.Owner }
        val users = List(DomainAccess.values().size - 1) { provideTestUser() }
        val userAccessList = (users zip accessList)

        val domain = provideTestDomain(owner.id)

        // Insert domain access per user
        for (userAccess in userAccessList)
            domainOperation.userDomainAccessRepository.insert(UserDomainAccess(userAccess.first.id, domain.id, userAccess.second))

        // Attempt archive with user other than owner
        for (userAccess in userAccessList)
            Assertions.assertThrows(UserAccessException::class.java) { domainOperation.archiveDomain(domain, userAccess.first.id) }

        // Check if domain was not altered
        val domainResult = domainOperation.domainRepository.findById(domain.id)

        // Ensure that domain was not archived
        assert(domainResult.get().visibility != DomainVisibility.Archived)
    }

    /**
     * Method: updateDomain
     */
    @Test
    fun `Update domain test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)
        // Changes to the domain
        var changes = DomainUploadRequest("Test", null, null, null, null, listOf(), DomainVisibility.Private, true)
        // Update the domain
        domainOperation.updateDomain(domain, owner.id, changes)
        // Retrieve updated domain
        var domainResult = domainOperation.domainRepository.findById(domain.id).get()

        Assertions.assertEquals("Test", domainResult.name)
        Assertions.assertEquals(DomainVisibility.Private, domainResult.visibility)

        // Repeat
        changes = DomainUploadRequest("GeoGMT", null, null, null, null, listOf(), DomainVisibility.Public, true)

        domainOperation.updateDomain(domain, owner.id, changes)

        domainResult = domainOperation.domainRepository.findById(domain.id).get()

        Assertions.assertEquals("GeoGMT", domainResult.name)
        Assertions.assertEquals(DomainVisibility.Public, domainResult.visibility)
    }

    /**
     * Method: updateDomain
     */
    @Test
    fun `Update domain unauthorized test`() {
        // Initial state
        val owner = provideTestUser()
        val domain = provideTestDomain(owner.id)
        // Changes to the domain
        val changes = DomainUploadRequest("Test", "Test", listOf(ObjectId.get()), "Test", "Test", null, null, true)

        // Get all domain access lower than ReadWrite, and zip them together with users
        val accessList = DomainAccess.values().filter { it < DomainAccess.ReadWrite }
        val users = List(DomainAccess.values().size - 1) { provideTestUser() }
        val userAccessList = (users zip accessList)

        // Insert domain access per user
        for (userAccess in userAccessList)
            domainOperation.userDomainAccessRepository.insert(UserDomainAccess(userAccess.first.id, domain.id, userAccess.second))

        // Attempt update with user that has lower access than ReadWrite
        for (userAccess in userAccessList)
            Assertions.assertThrows(UserAccessException::class.java) { domainOperation.updateDomain(domain, userAccess.first.id, changes) }

        // Need a fresh domain, since the the changes are made to a domain before it is saved to the DB
        val newDomain = provideTestDomain(owner.id)
        val domainResult = domainOperation.domainRepository.findById(domain.id).get()

        Assertions.assertEquals(newDomain.name, domainResult.name)
        Assertions.assertEquals(newDomain.visibility, domainResult.visibility)
    }
}
