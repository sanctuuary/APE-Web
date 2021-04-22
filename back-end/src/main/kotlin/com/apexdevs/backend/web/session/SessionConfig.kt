/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.session

import com.apexdevs.backend.ape.ApeRequestFactory
import org.springframework.context.annotation.Configuration
import java.util.Date
import java.util.logging.Logger
import javax.servlet.http.HttpSessionEvent
import javax.servlet.http.HttpSessionListener

/**
 * Configuration for the session manager
 */
@Configuration
class SessionConfig(val apeRequestFactory: ApeRequestFactory) : HttpSessionListener {

    override fun sessionCreated(se: HttpSessionEvent) {
        log.info(String.format("Session created at: %s", Date()))
        super.sessionCreated(se)
    }

    /**
     * When the session is destroyed, remove the ApeRequest instance from the factory
     */
    override fun sessionDestroyed(event: HttpSessionEvent) {
        log.info(String.format("Session is destroyed at: %s", Date()))
        apeRequestFactory.removeApeRequest(event.session.id)
    }

    companion object {
        private val log = Logger.getLogger("Session Logger")
    }
}
