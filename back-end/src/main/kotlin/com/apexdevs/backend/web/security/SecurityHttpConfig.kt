/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security

import com.apexdevs.backend.persistence.UserOperation
import com.apexdevs.backend.web.filter.UsernamePasswordAPIFilter
import com.apexdevs.backend.web.security.authentication.UsernamePasswordAPISuccessHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.BeanIds
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

/**
 * HTTP Security configuration, sets access rules for URL's and enables/disables security features
 */
@Configuration
class SecurityHttpConfig(val userDetailsService: UserDetailsService, val passwordEncoder: PasswordEncoder, val userOperation: UserOperation) : WebSecurityConfigurerAdapter() {
    /**
     * Expose top-level authentication manager bean into current bean space
     */
    @Bean(name = [BeanIds.AUTHENTICATION_MANAGER])
    override fun authenticationManagerBean(): AuthenticationManager {
        return super.authenticationManagerBean()
    }

    /**
     * Explicitly declare authentication builder with current user details service and password encoder
     */
    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder)
        auth.eraseCredentials(true)
    }

    /**
     * Configure authentication filter for API authentication
     */
    private fun authenticationFilter(): UsernamePasswordAPIFilter {
        val filter = UsernamePasswordAPIFilter()
        filter.setFilterProcessesUrl("/api/user/login")
        filter.setAuthenticationManager(authenticationManagerBean())
        filter.setAuthenticationSuccessHandler(UsernamePasswordAPISuccessHandler(userOperation))
        filter.setContinueChainBeforeSuccessfulAuthentication(true)
        filter.usernameParameter = "username"
        filter.passwordParameter = "password"

        return filter
    }

    /**
     * Enable default form login, permit access to specified paths for specified roles, authenticate the rest
     * @param http is the HTTPSecurity object to apply the rules to
     * TODO: enable CSRF in production build
     */
    override fun configure(http: HttpSecurity) {
        http
            // always create session to track APE API instance usage
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.ALWAYS).and()
            .anonymous().and()
            // disable CSRF for Postman
            .csrf().disable()
            .cors().and()
            // add all pages to security layer
            .antMatcher("/**")

            // manage page/api authorization
            .authorizeRequests()

            // public pages
            .antMatchers(HttpMethod.GET, "/login").permitAll() // Temporary default login
            .antMatchers(HttpMethod.GET, "/domain", "/domain/**", "/workflow/**").permitAll()
            .antMatchers(HttpMethod.GET, "/topic", "/topic/**").permitAll()
            .antMatchers(HttpMethod.GET, "/user/**").hasAnyRole("USER", "UNAPPROVED")
            .antMatchers(HttpMethod.GET, "/user/").hasRole("ADMIN")
            .antMatchers(HttpMethod.GET, "/api/domain/with-user-access").hasRole("USER")
            .antMatchers(HttpMethod.GET, "/api/workflow/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/domain/download/**").permitAll()
            .antMatchers(HttpMethod.PATCH, "/domain/**").hasRole("USER")
            .antMatchers(HttpMethod.GET, "/runparameters/**").permitAll()

            // public api paths
            .antMatchers(HttpMethod.POST, "/api/domain/upload").hasRole("USER")

            .antMatchers(HttpMethod.POST, "/api/workflow/**").permitAll()
            .antMatchers(HttpMethod.POST, "/api/user/login", "/api/user/register").permitAll()
            .antMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
            .antMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")

            // the rest is authenticated
            .and()
            .authorizeRequests().anyRequest().authenticated()

            // make default alert-like login for Postman compatibility
            .and()
            .addFilterAt(authenticationFilter(), UsernamePasswordAuthenticationFilter::class.java)

            .logout()
            .logoutUrl("/api/user/logout").permitAll()
            .logoutSuccessHandler(HttpStatusReturningLogoutSuccessHandler(HttpStatus.OK))
    }

    /**
     * Configure CORS for API usage from other domains
     * src: https://stackoverflow.com/questions/40418441/spring-security-cors-filter
     * TODO: disable CORS for final production build
     */
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("*")
        configuration.allowedMethods = listOf(
            "HEAD",
            "GET", "POST", "PUT", "DELETE", "PATCH"
        )
        // setAllowCredentials(true) is important, otherwise:
        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
        configuration.allowCredentials = true
        // setAllowedHeaders is important! Without it, OPTIONS preflight request
        // will fail with 403 Invalid CORS request
        configuration.allowedHeaders = listOf("Authorization", "Cache-Control", "Content-Type")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
