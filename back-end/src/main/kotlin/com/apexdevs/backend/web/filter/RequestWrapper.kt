/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.filter

import javax.servlet.ServletRequest
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletRequestWrapper

/**
 * Removes scripting from content received or sent
 */
class RequestWrapper(servletRequest: ServletRequest) : HttpServletRequestWrapper(servletRequest as HttpServletRequest?) {
    /**
     when there are parameters in the request this function will be called
     it will get sanitize all parameters
     */
    override fun getParameterValues(parameter: String): Array<String?>? {
        val values = super.getParameterValues(parameter) ?: return null
        val count = values.size
        val encodedValues = arrayOfNulls<String>(count)
        for (i in 0 until count) {
            encodedValues[i] = cleanXSS(values[i])
        }
        return encodedValues
    }

    override fun getParameter(parameter: String): String? {
        val value = super.getParameter(parameter) ?: return null
        return cleanXSS(value)
    }

    override fun getHeader(name: String): String? {
        val value = super.getHeader(name) ?: return null
        return cleanXSS(value)
    }

    /**
     Function to sanitize the string based on Regex values
     */
    private fun cleanXSS(valueToClean: String): String {
        var value = valueToClean
        value = value.replace("eval\\((.*)\\)".toRegex(), "")
        value = value.replace("[\"'][\\s]*javascript:(.*)[\"']".toRegex(), "\"\"")
        value = value.replace("(?i)<script.*?>.*?<script.*?>".toRegex(), "")
        value = value.replace("(?i)<script.*?>.*?</script.*?>".toRegex(), "")
        value = value.replace("(?i)<.*?javascript:.*?>.*?</.*?>".toRegex(), "")
        value = value.replace("(?i)<.*?\\s+on.*?>.*?</.*?>".toRegex(), "")
        return value
    }
}
