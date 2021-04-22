/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.security.response

import org.springframework.boot.web.error.ErrorAttributeOptions
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import org.springframework.web.context.request.WebRequest

/**
 * Filters exception error messages in production environment
 *
 * @param environment contains application properties
 */
@Component
class FilteredErrorAttributes(val environment: Environment) : DefaultErrorAttributes() {
    /**
     * Retrieves error attributes for request, removes message contents in production environment
     * @param webRequest the request to get attribute information from
     * @param options defines which attributes should be added
     */
    override fun getErrorAttributes(webRequest: WebRequest?, options: ErrorAttributeOptions?): MutableMap<String, Any> {
        // retrieve attributes from super class
        val attribs = super.getErrorAttributes(webRequest, options)

        if (environment.activeProfiles.contains("prod")) {
            // remove message for security
            attribs.remove("message")
        }

        return attribs
    }
}
