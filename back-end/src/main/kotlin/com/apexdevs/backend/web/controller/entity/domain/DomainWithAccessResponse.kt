/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.domain

/**
 * Class to send domain data with user access information to front-end
 * @param id unique domain identifier
 * @param title recognisable name of the domain
 * @param description information about the domain
 * @param visibility indicates if domain is visible to other users
 * @param topics list of topics to which the domain relates
 * @param userId requesting user whose access is mentioned for the domain
 * @param access the access rights on the domain granted to the requesting user
 */
data class DomainWithAccessResponse(val id: String, val title: String, val description: String, val visibility: String, val topics: List<String>, val userId: String, val access: String)
