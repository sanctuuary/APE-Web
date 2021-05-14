package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * RunParameters document for storing in the database.
 * They define the upper limit of the run parameter values when running APE.
 *
 * @param id unique identifier
 * @param minLength the highest allowed minimum step value
 * @param maxLength the highest allowed maximum step value
 * @param maxDuration the highest allowed maximum run duration value
 * @param solutions the highest allowed number of solutions value
 */
@Document
class RunParameters(@Id val id: ObjectId, var minLength: Int, var maxLength: Int, var maxDuration: Int, var solutions: Int) {
    /**
     * Constructor to create RunParameters using default values
     */
    constructor() :
        this(ObjectId.get(), 30, 30, 600, 100)

    /**
     * Constructor to create RunParameters using custom values
     * @param minLength the highest allowed minimum step value
     * @param maxLength the highest allowed maximum step value
     * @param maxDuration the highest allowed maximum run duration value
     * @param solutions the highest allowed number of solutions value
     */
    constructor(minLength: Int, maxLength: Int, maxDuration: Int, solutions: Int) :
        this(ObjectId.get(), minLength, maxLength, maxDuration, solutions)
}
