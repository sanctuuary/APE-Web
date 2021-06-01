/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
package com.apexdevs.backend.ape

import com.apexdevs.backend.ape.entity.workflow.Constraint
import com.apexdevs.backend.ape.entity.workflow.InputData
import com.apexdevs.backend.ape.entity.workflow.Ontology
import com.apexdevs.backend.ape.entity.workflow.OntologyNode
import com.apexdevs.backend.ape.entity.workflow.ParsedModuleNode
import com.apexdevs.backend.ape.entity.workflow.ParsedTypeNode
import com.apexdevs.backend.ape.entity.workflow.RunConfig
import com.apexdevs.backend.ape.entity.workflow.WorkflowOutput
import com.apexdevs.backend.persistence.RunParametersOperation
import com.apexdevs.backend.persistence.database.entity.Domain
import com.apexdevs.backend.persistence.database.entity.DomainVisibility
import com.apexdevs.backend.persistence.database.entity.RunParameters
import io.mockk.every
import io.mockk.mockk
import nl.uu.cs.ape.sat.APE
import nl.uu.cs.ape.sat.constraints.ConstraintTemplate
import nl.uu.cs.ape.sat.constraints.ConstraintTemplateParameter
import nl.uu.cs.ape.sat.core.implSAT.SATsolutionsList
import nl.uu.cs.ape.sat.core.solutionStructure.ModuleNode
import nl.uu.cs.ape.sat.core.solutionStructure.SolutionWorkflow
import nl.uu.cs.ape.sat.core.solutionStructure.TypeNode
import nl.uu.cs.ape.sat.models.AllModules
import nl.uu.cs.ape.sat.models.AllTypes
import nl.uu.cs.ape.sat.models.enums.SynthesisFlag
import nl.uu.cs.ape.sat.models.logic.constructs.TaxonomyPredicate
import nl.uu.cs.ape.sat.utils.APEDomainSetup
import org.json.JSONObject
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import java.nio.file.Path

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApeRequestTest {

    private val ape = mockk<APE>()
    private val mockDomainSetup = mockk<APEDomainSetup>()
    private val mockPath = mockk<Path>()
    private val runParametersOperation = mockk<RunParametersOperation>()
    private val domain = Domain("test", "test", "test", DomainVisibility.Public, "test", "test", listOf("test"), true)

    private val inputData = InputData(
        input = listOf(),
        expectedOutput = listOf(),
        constraints = listOf(),
        maxDuration = 1,
        maxLength = 1,
        minLength = 1,
        solutions = 1
    )

    private val apeRequest = ApeRequest(domain, mockPath, ape, runParametersOperation)

    @Test
    fun getWorkflows() {
        val mockSolutionList = mockk<SATsolutionsList>()
        val mockSolutionWorkflow = mockk<SolutionWorkflow>()
        val mockTypeNode = mockk<TypeNode>()
        val mockModuleNode = mockk<ModuleNode>()
        val mockConfig = mockk<RunConfig>()
        val mockJSON = mockk<JSONObject>()

        every { ape.runSynthesis(any<JSONObject>()) } returns mockSolutionList
        every { mockConfig.toJSONObject() } returns mockJSON
        every { mockJSON.put(any(), any<String>()) } returns mockJSON
        every { mockPath.resolve(any<String>()) } returns mockPath
        every { mockPath.toString() } returns "Test"
        every { mockSolutionList.numberOfSolutions } returns 1
        every { mockSolutionList.get(any()) } returns mockSolutionWorkflow
        every { mockSolutionList.flag } returns SynthesisFlag.NONE
        every { mockSolutionWorkflow.moduleNodes.size } returns 1
        every { mockSolutionWorkflow.workflowInputTypeStates } returns listOf(mockTypeNode)
        every { mockSolutionWorkflow.workflowOutputTypeStates } returns listOf(mockTypeNode)
        every { mockSolutionWorkflow.moduleNodes } returns listOf(mockModuleNode)
        every { mockTypeNode.nodeID } returns "Test"
        every { mockTypeNode.nodeLabel } returns "Test"
        every { mockModuleNode.nodeID } returns "Test"
        every { mockModuleNode.nodeLabel } returns "Test"
        every { mockModuleNode.inputTypes } returns listOf(mockTypeNode)
        every { mockModuleNode.outputTypes } returns listOf(mockTypeNode)
        every { runParametersOperation.getGlobalRunParameters() } returns RunParameters()
        every { mockConfig.solutionMinLength } returns 30
        every { mockConfig.solutionMaxLength } returns 30
        every { mockConfig.maxDuration } returns 600
        every { mockConfig.maxSolutionsToReturn } returns 100

        val expectedInOutStates = listOf(ParsedTypeNode("Test", "Test"))
        val expectedModule = listOf(ParsedModuleNode("Test", "Test", expectedInOutStates, expectedInOutStates))
        val expected = mutableListOf(WorkflowOutput(0, expectedInOutStates, expectedInOutStates, expectedModule))
        assertEquals(expected, apeRequest.getWorkflows(mockConfig))
    }

    @Test
    fun `error when solutions not found`() {
        val mockSolutionList = mockk<SATsolutionsList>()
        val mockSolutionWorkflow = mockk<SolutionWorkflow>()
        val mockConfig = mockk<RunConfig>()
        val mockJSON = mockk<JSONObject>()

        every { ape.runSynthesis(any<JSONObject>()) } returns mockSolutionList
        every { mockConfig.toJSONObject() } returns mockJSON
        every { mockJSON.put(any(), any<String>()) } returns mockJSON
        every { mockPath.resolve(any<String>()) } returns mockPath
        every { mockPath.toString() } returns "Test"
        every { mockSolutionList.numberOfSolutions } returns 1
        every { mockSolutionList.get(any()) } returns mockSolutionWorkflow
        every { mockSolutionList.flag } returns SynthesisFlag.NONE
        every { mockSolutionWorkflow.moduleNodes.size } returns 0
        every { runParametersOperation.getGlobalRunParameters() } returns RunParameters()
        every { mockConfig.solutionMinLength } returns 30
        every { mockConfig.solutionMaxLength } returns 30
        every { mockConfig.maxDuration } returns 600
        every { mockConfig.maxSolutionsToReturn } returns 100

        val expected = mutableListOf<WorkflowOutput>()
        assertEquals(expected, apeRequest.getWorkflows(mockConfig))
    }

    @Test
    fun dataOntologyTest() {
        val mockTaxonomyPredicate = mockk<TaxonomyPredicate>()
        val mockSubTaxonomyPredicate = mockk<TaxonomyPredicate>()
        every { mockTaxonomyPredicate.predicateLabel } returns "Test"
        every { mockTaxonomyPredicate.predicateID } returns "Test"
        every { mockTaxonomyPredicate.subPredicates } returns setOf(mockSubTaxonomyPredicate)
        every { mockSubTaxonomyPredicate.predicateLabel } returns "Test"
        every { mockSubTaxonomyPredicate.predicateID } returns "Test"
        every { mockSubTaxonomyPredicate.subPredicates } returns null

        val mockAllTypes = mockk<AllTypes>()
        every { ape.domainSetup } returns mockDomainSetup
        every { mockDomainSetup.allTypes } returns mockAllTypes
        every { mockAllTypes.rootPredicates } returns listOf(mockTaxonomyPredicate)

        val expected = Ontology(mutableListOf(OntologyNode("Test", "Test", mutableListOf(OntologyNode("Test", "Test", null)))))
        assertEquals(expected, apeRequest.dataOntology)
    }

    @Test
    fun toolsOntologyTest() {
        val mockTaxonomyPredicate = mockk<TaxonomyPredicate>()
        val mockSubTaxonomyPredicate = mockk<TaxonomyPredicate>()
        every { mockTaxonomyPredicate.predicateLabel } returns "Test"
        every { mockTaxonomyPredicate.predicateID } returns "Test"
        every { mockTaxonomyPredicate.subPredicates } returns setOf(mockSubTaxonomyPredicate)
        every { mockSubTaxonomyPredicate.predicateLabel } returns "Test"
        every { mockSubTaxonomyPredicate.predicateID } returns "Test"
        every { mockSubTaxonomyPredicate.subPredicates } returns setOf<TaxonomyPredicate>()

        val mockAllModules = mockk<AllModules>()
        every { ape.domainSetup } returns mockDomainSetup
        every { mockDomainSetup.allModules } returns mockAllModules
        every { mockAllModules.rootPredicates } returns listOf(mockTaxonomyPredicate)

        val expected = Ontology(mutableListOf(OntologyNode("Test", "Test", mutableListOf(OntologyNode("Test", "Test", null)))))
        assertEquals(expected, apeRequest.toolsOntology)
    }

    @Test
    fun getConstraints() {
        val mockConstraint = mockk<ConstraintTemplate>()
        val mockTemplates = listOf(mockConstraint)
        val mockParamData = mockk<ConstraintTemplateParameter>()
        val mockParamTool = mockk<ConstraintTemplateParameter>()
        val mockParamUndefined = mockk<ConstraintTemplateParameter>()

        every { ape.constraintTemplates } returns mockTemplates
        every { mockConstraint.parameters } returns listOf(mockParamData, mockParamTool, mockParamUndefined)
        every { mockParamData.parameterTemplateTypes[any()].type } returns "type"
        every { mockParamTool.parameterTemplateTypes[any()].type } returns "abstract module"
        every { mockParamUndefined.parameterTemplateTypes[any()].type } returns "undefined module"
        every { mockConstraint.constraintID } returns "Test"
        every { mockConstraint.description } returns "Test"

        val expectedParams = listOf("data", "tool", "undefined module")
        val expected = listOf(Constraint("Test", "Test", expectedParams))
        assertEquals(expected, apeRequest.constraints)
    }

    @Test
    fun getterTests() {
        assertEquals(domain, apeRequest.domain)
        assertEquals(ape, apeRequest.ape)
    }
}
