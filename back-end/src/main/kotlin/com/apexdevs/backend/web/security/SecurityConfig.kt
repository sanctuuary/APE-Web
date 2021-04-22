/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.security.authentication.MongoUserDetailsService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.DelegatingPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

/**
 * Security configuration for Spring Security
 */
@Configuration
@EnableWebSecurity
class SecurityConfig {
    /**
     * User details service using Mongo ape database for credentials
     * @param userOperation (autowired)
     */
    @Bean
    fun userDetailsService(userOperation: UserOperation): UserDetailsService {
        return MongoUserDetailsService(userOperation)
    }

    /**
     * Password encoder for secure hashing, defaults to 'bcrypt'
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        val currentEncoder = "bcrypt"
        val encoders: Map<String, PasswordEncoder> = mapOf(
            // Add new password encoders here, this will maintain access to older passwords
            currentEncoder to BCryptPasswordEncoder()
        )

        return DelegatingPasswordEncoder(currentEncoder, encoders)
    }
}
