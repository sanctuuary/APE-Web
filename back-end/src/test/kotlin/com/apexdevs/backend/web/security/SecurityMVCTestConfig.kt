/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.provisioning.InMemoryUserDetailsManager

/**
 * Security test configuration with routing imported
 */
@TestConfiguration
@EnableWebSecurity
@EnableAutoConfiguration
@Import(SecurityHttpConfig::class)
class SecurityMVCTestConfig {
    @Bean
    @Primary
    fun userDetailsService(): UserDetailsService {
        val basicUser = User.withUsername("user@test.test").password("test").roles("USER").build()
        val adminUser = User.withUsername("admin@test.test").password("test").roles("ADMIN").build()

        return InMemoryUserDetailsManager(listOf(basicUser, adminUser))
    }
}
