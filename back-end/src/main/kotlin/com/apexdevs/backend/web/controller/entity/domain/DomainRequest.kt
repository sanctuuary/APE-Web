/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

/**
 * Class to send basic domain data to front-end
 * @param id the unique id of the domain
 * @param title name of the domain
 * @param topics list of the topics the domain belongs to
 * @param description the description of the domain
 */
data class DomainRequest(val id: String, val title: String, val topics: List<String>, val description: String)
