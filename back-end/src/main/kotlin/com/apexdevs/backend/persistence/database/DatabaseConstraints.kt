/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.persistence.database

import com.apexdevs.backend.persistence.database.entity.User
import com.apexdevs.backend.persistence.database.entity.UserAdmin
import org.springframework.data.domain.Sort
import org.springframework.data.mongodb.core.MongoTemplate
import org.springframework.data.mongodb.core.index.Index
import org.springframework.data.mongodb.core.indexOps

/**
 * Database indices, ensures entries can be found quickly with these parameters
 */
object DatabaseConstraints {
    fun applyIndices(template: MongoTemplate) {
        template.indexOps<User>().ensureIndex(Index("email", Sort.Direction.ASC))
        template.indexOps<UserAdmin>().ensureIndex(Index("userId", Sort.Direction.ASC))
    }
}
