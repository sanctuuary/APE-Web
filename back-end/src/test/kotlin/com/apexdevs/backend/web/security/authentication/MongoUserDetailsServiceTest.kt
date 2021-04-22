/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security.authentication

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserStatus
import io.mockk.every
import io.mockk.mockk
import org.bson.types.ObjectId
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@SpringBootTest
internal class MongoUserDetailsServiceTest {
    @Test
    fun `Assert user details service returns unapproved user`() {
        // create test data
        val user = User(ObjectId.get(), "user@test.test", "test", "test", UserStatus.Pending)

        val details = getUserDetails(user, false)

        // do account assertions
        assert(details.username == user.email)
        assert(details.password == user.password)
        assert(details.isEnabled)
        assert(details.isAccountNonLocked)
        assert(details.isAccountNonExpired)
        assert(details.isCredentialsNonExpired)
        assert(details.authorities.size == 1)
        assert(details.authorities.contains(SimpleGrantedAuthority("ROLE_UNAPPROVED")))
    }

    @Test
    fun `Assert user details service returns approved user`() {
        // create test data
        val user = User(ObjectId.get(), "user@test.test", "test", "test", UserStatus.Approved)

        val details = getUserDetails(user, false)

        // do account assertions
        assert(details.username == user.email)
        assert(details.password == user.password)
        assert(details.isEnabled)
        assert(details.isAccountNonLocked)
        assert(details.isAccountNonExpired)
        assert(details.isCredentialsNonExpired)
        assert(details.authorities.size == 1)
        assert(details.authorities.contains(SimpleGrantedAuthority("ROLE_USER")))
    }

    @Test
    fun `Assert user details service returns admin user`() {
        // create test data
        val user = User(ObjectId.get(), "admin@test.test", "test", "test", UserStatus.Approved)

        val details = getUserDetails(user, true)

        // do account assertions
        assert(details.username == user.email)
        assert(details.password == user.password)
        assert(details.isEnabled)
        assert(details.isAccountNonLocked)
        assert(details.isAccountNonExpired)
        assert(details.isCredentialsNonExpired)
        assert(details.authorities.size == 2)
        assert(details.authorities.contains(SimpleGrantedAuthority("ROLE_USER")))
        assert(details.authorities.contains(SimpleGrantedAuthority("ROLE_ADMIN")))
    }

    @Test
    fun `Assert user details service returns disabled user`() {
        // create test data
        val user = User(ObjectId.get(), "user@test.test", "test", "test", UserStatus.Revoked)

        val details = getUserDetails(user, false)

        // do account assertions
        assert(details.username == user.email)
        assert(details.password == user.password)
        assert(!details.isEnabled)
        assert(details.isAccountNonLocked)
        assert(details.isAccountNonExpired)
        assert(details.isCredentialsNonExpired)
        assert(details.authorities.size == 1)
        assert(details.authorities.contains(SimpleGrantedAuthority("ROLE_UNAPPROVED")))
    }

    /**
     * Returns user details from MongoUserDetailsService with mock userOperation
     */
    private fun getUserDetails(user: User, isAdmin: Boolean): UserDetails {
        // create mocks
        val userOperation = mockk<UserOperation>()

        // set mock returns
        every { userOperation.getByEmail(any()) } returns
            user

        every { userOperation.userIsAdmin(any()) } returns
            isAdmin

        // create test instance
        val detailsService = MongoUserDetailsService(userOperation)

        // test method
        return detailsService.loadUserByUsername(user.email)
    }
}
