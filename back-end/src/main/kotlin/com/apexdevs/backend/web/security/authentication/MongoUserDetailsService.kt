/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security.authentication

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.persistence.database.entity.UserStatus
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

/**
 * Handles loading UserDetails for authentication from MongoDB
 *
 * @param userOperation is the safe operator for user data
 */
class MongoUserDetailsService(private val userOperation: UserOperation) : UserDetailsService {
    /**
     * Find user by email in MongoDB repository, return as User with roles
     * @param email is nullable username for authentication
     * @return User with UserDetails interface
     */
    override fun loadUserByUsername(email: String?): UserDetails {
        // if null, throw exception
        if (email == null)
            throw UsernameNotFoundException(email)

        // find user info by email
        val user = userOperation.getByEmail(email)
        val isActiveUser = user.status == UserStatus.Approved
        val isAdmin = userOperation.userIsAdmin(email)

        // build user for use with Spring Security, set disabled if account is revoked
        val builder = User.withUsername(user.email)
            .password(user.password)
            .disabled(user.status == UserStatus.Revoked)

        return if (!isActiveUser)
            builder.roles("UNAPPROVED").build() // unapproved user
        else if (!isAdmin)
            builder.roles("USER").build() // approved user
        else
            builder.roles("USER", "ADMIN").build() // admin user
    }
}
