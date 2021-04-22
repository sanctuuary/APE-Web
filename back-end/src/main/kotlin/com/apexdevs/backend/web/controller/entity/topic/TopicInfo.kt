/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.web.controller.entity.topic

/**
 * Topic info (safe) for transmission to the front-end
 *
 * @param id id of the topic
 * @param name name of the topic
 */
data class TopicInfo(val id: String, val name: String)
