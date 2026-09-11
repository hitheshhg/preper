import {
  AIProvider,
  GenerateQuestionsParams,
  GeneratedQuestion,
  EvaluateAnswerParams,
  AnswerEvaluationResult,
  EvaluateInterviewParams,
  FullInterviewEvaluationResult,
  AnalyzeResumeParams,
  ResumeAnalysisResult,
} from './provider';

export class MockAIProvider implements AIProvider {
  public readonly name = 'Prepr Simulation Engine (Local Mock)';
  public readonly isSimulated = true;

  async generateQuestions(params: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
    const roleNormalized = params.role.toLowerCase();
    
    // Curated questions based on role
    if (roleNormalized.includes('data') || roleNormalized.includes('machine learning') || roleNormalized.includes('ai')) {
      return [
        {
          order: 1,
          question: 'How do you handle severe class imbalance in a classification dataset, and how do you evaluate model performance beyond raw accuracy?',
          category: 'Machine Learning',
          expectedConcepts: ['SMOTE', 'F1-Score / PR-AUC', 'Class weights', 'Cost-sensitive learning', 'Stratified sampling'],
        },
        {
          order: 2,
          question: 'Explain the bias-variance tradeoff. If a deep neural network achieves 99% training accuracy but 68% validation accuracy, what interventions would you test first?',
          category: 'Model Architecture & Tuning',
          expectedConcepts: ['Overfitting', 'L1/L2 Regularization', 'Dropout', 'Data augmentation', 'Early stopping'],
        },
        {
          order: 3,
          question: 'Describe how you would design an end-to-end real-time feature store and batch scoring pipeline in production.',
          category: 'MLOps & Systems',
          expectedConcepts: ['Latency requirements', 'Point-in-time correctness', 'Kafka/Redis', 'Feast / Feature store', 'Drift monitoring'],
        },
      ].slice(0, params.count);
    }

    if (roleNormalized.includes('product') || roleNormalized.includes('manager')) {
      return [
        {
          order: 1,
          question: 'How would you measure the success of a newly introduced AI-powered recommendation feature on our candidate dashboard?',
          category: 'Product Analytics',
          expectedConcepts: ['North star metric', 'Adoption rate', 'A/B testing', 'Guardrail metrics', 'Retention impact'],
        },
        {
          order: 2,
          question: 'Walk me through how you prioritize feature requests when engineering capacity is constrained by 50% due to technical debt resolution.',
          category: 'Prioritization & Strategy',
          expectedConcepts: ['RICE / Kano framework', 'Stakeholder alignment', 'Opportunity sizing', 'Strategic roadmap'],
        },
        {
          order: 3,
          question: 'Tell me about a time when user interview feedback contradicted your quantitative product metrics. How did you resolve the conflict?',
          category: 'User Research & Decision Making',
          expectedConcepts: ['Root cause synthesis', 'Segmented behavioral cohorts', 'Usability validation', 'Pivot criteria'],
        },
      ].slice(0, params.count);
    }

    // Default: Software Engineering / System Design
    return [
      {
        order: 1,
        question: `How would you design a distributed rate-limiting service capable of handling 500,000 requests per second across multi-region clusters?`,
        category: 'System Design',
        expectedConcepts: ['Token Bucket / Sliding Window', 'Redis cluster / Memcached', 'Race conditions & Lua scripts', 'Eventual consistency', 'Fail-open vs fail-closed'],
      },
      {
        order: 2,
        question: `Explain how the Node.js event loop handles microtasks versus macrotasks. What happens when a process invokes process.nextTick in a recursive loop?`,
        category: 'Runtime Internals',
        expectedConcepts: ['Call stack', 'Event loop phases', 'Microtask queue starvation', 'Promise resolution', 'setImmediate vs setTimeout'],
      },
      {
        order: 3,
        question: `Discuss the database isolation levels in PostgreSQL. What specific concurrency anomaly does Serializable isolation prevent that Repeatable Read does not?`,
        category: 'Database Engineering',
        expectedConcepts: ['Dirty reads', 'Non-repeatable reads', 'Phantom reads', 'Serialization anomaly / Write skew', 'SSI (Serializable Snapshot Isolation)'],
      },
      {
        order: 4,
        question: `Describe a situation where you had to debug a production memory leak in a high-throughput microservice. What tooling and methodology did you use?`,
        category: 'Production Engineering & Troubleshooting',
        expectedConcepts: ['Heap snapshots', 'Allocation profiling', 'Garbage collection metrics', 'Unbounded caches / event listeners', 'Reproducible load testing'],
      },
    ].slice(0, params.count);
  }

  async evaluateAnswer(params: EvaluateAnswerParams): Promise<AnswerEvaluationResult> {
    const wordCount = params.userAnswer.trim().split(/\s+/).length;
    
    if (wordCount < 10) {
      return {
        score: 35,
        feedback: 'The response is too brief to adequately demonstrate technical depth or clear understanding of the core concepts.',
        strengths: ['Identified the prompt topic'],
        weaknesses: ['Lack of concrete technical detail', 'No mention of architectural trade-offs', 'Insufficient explanation of mechanics'],
        idealAnswerStructure: '1. Direct definition and core mechanism\n2. Concrete architecture or implementation example\n3. Trade-offs and boundary failure conditions\n4. Real-world mitigation strategy',
        followUpQuestion: 'Could you expand on the underlying mechanism and provide a specific scenario where this approach might fail?',
      };
    }

    // Realistic substantive evaluation
    const score = Math.min(95, Math.max(68, Math.floor(70 + (wordCount / 10))));
    return {
      score,
      feedback: `Strong conceptual foundation. You addressed the primary considerations for ${params.category}, demonstrating clear intuition for systems-level engineering. Adding more explicit failure mode analysis would make the response outstanding.`,
      strengths: [
        'Structured problem decomposition',
        'Clear terminology aligned with industry standards',
        'Demonstrated practical contextual awareness',
      ],
      weaknesses: [
        'Could elaborate further on edge-case telemetry and monitoring',
        'Latency implications under distributed partitions could be emphasized more',
      ],
      idealAnswerStructure: 'State architectural goals -> Detail the protocol/data structures -> Analyze throughput and storage footprint -> Address disaster recovery and network partitions',
      followUpQuestion: 'How would your design behave under a 10x sudden traffic spike or network split between data centers?',
    };
  }

  async evaluateInterview(params: EvaluateInterviewParams): Promise<FullInterviewEvaluationResult> {
    return {
      overallScore: 82,
      technicalScore: 84,
      communicationScore: 80,
      structureScore: 83,
      problemSolvingScore: 85,
      confidenceScore: 78,
      strengths: [
        'Consistently applied structured problem-solving principles (STAR / Framework approach)',
        'Demonstrated deep familiarity with distributed systems paradigms and modern design patterns',
        'Proactively communicated trade-offs between latency, complexity, and operational cost',
      ],
      weaknesses: [
        'Tendency to dive into low-level implementation before clarifying volume boundaries',
        'Could include more concrete monitoring metrics (SLIs/SLOs) in production considerations',
      ],
      actionableRecommendations: [
        'Spend the first 60 seconds explicitly scoping constraints (QPS, storage, availability SLAs)',
        'Reference specific industry incident postmortems when discussing failure resilience',
        'Practice concise high-level synthesis before drilling down into component mechanics',
      ],
    };
  }

  async analyzeResume(params: AnalyzeResumeParams): Promise<ResumeAnalysisResult> {
    return {
      overallScore: 81,
      atsScore: 86,
      clarityScore: 82,
      structureScore: 85,
      relevanceScore: 79,
      skillsDetected: {
        technical: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL', 'REST APIs', 'Microservices'],
        soft: ['Technical Leadership', 'Cross-Functional Collaboration', 'Agile Delivery', 'Mentorship'],
        tools: ['Git', 'GitHub Actions', 'AWS', 'Prisma', 'Datadog', 'Kubernetes'],
      },
      missingSkills: [
        'Distributed tracing (OpenTelemetry / Jaeger)',
        'Explicit CI/CD pipeline automation metrics',
        'System capacity planning formulas',
      ],
      experienceInsights: [
        'Bullet points demonstrate strong technical verbs (Engineered, Architected, Optimized).',
        'Quantifiable impact metrics (latency reductions, QPS milestones) are present in top roles.',
        'Older experience blocks have lower metric density and would benefit from XYZ-formatted accomplishment statements.',
      ],
      actionableRecommendations: [
        'Format bullet points using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]"',
        'Add a dedicated Core Competencies section at the top formatted for modern ATS parsers',
        'Explicitly state scale metrics (e.g., active daily users, data volume processed, infrastructure cost savings)',
      ],
      improvedBullets: [
        {
          original: 'Responsible for optimizing database queries and backend services for our dashboard.',
          improved: 'Architected composite indexing and Redis read-through caching for PostgreSQL backend, reducing p99 API query latency from 850ms to 42ms under 20k RPS load.',
          impactDelta: '+95% latency reduction, demonstrable scale proof',
        },
        {
          original: 'Built the microservices architecture for client authentication and user data.',
          improved: 'Engineered stateless JWT authentication microservice with Argon2id password hashing and RBAC, supporting 150k+ active candidate sessions with zero security regressions.',
          impactDelta: 'Quantified scale, security rigour, and architectural clarity',
        },
      ],
    };
  }
}
