/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.exception

import org.bson.types.ObjectId

class TopicNotFoundException(val topicId: ObjectId, message: String) : RuntimeException(message)
