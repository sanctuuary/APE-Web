package com.apexdevs.backend.persistence.database.entity

import org.bson.types.ObjectId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

/**
 * RunParameters document for storing in the database.
 * They define the upper limit of the run parameter values when running APE.
 *
 * @param id unique identifier
 * @param minSteps the highest allowed minimum step value
 * @param maxSteps the highest allowed maximum step value
 * @param maxDuration the highest allowed maximum run duration value
 * @param numberOfSolutions the highest allowed number of solutions value
 */
@Document
class RunParameters(@Id val id: ObjectId, var minSteps: Int, var maxSteps: Int, var maxDuration: Int, var numberOfSolutions: Int) {
    /**
     * Constructor to create RunParameters using default values
     */
    constructor() :
        this(ObjectId.get(), 30, 30, 600, 100)

    /**
     * Constructor to create RunParameters using custom values
     * @param minSteps the highest allowed minimum step value
     * @param maxSteps the highest allowed maximum step value
     * @param maxDuration the highest allowed maximum run duration value
     * @param numberOfSolutions the highest allowed number of solutions value
     */
    constructor(minSteps: Int, maxSteps: Int, maxDuration: Int, numberOfSolutions: Int) :
        this(ObjectId.get(), minSteps, maxSteps, maxDuration, numberOfSolutions)
}
