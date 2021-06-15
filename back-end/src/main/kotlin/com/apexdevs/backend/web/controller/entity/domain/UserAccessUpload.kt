package com.apexdevs.backend.web.controller.entity.domain

import com.apexdevs.backend.persistence.database.entity.DomainAccess
import org.bson.types.ObjectId

/**
 * Object to allow the front-end to set the access level of a user in a domain.
 * @param userId The id of the user who will receive access.
 * @param access The access level the user gets.
 */
class UserAccessUpload(val userId: ObjectId, val access: DomainAccess)
