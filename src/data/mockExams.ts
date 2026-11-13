import { Exam, ProctorStudentSession } from '../types/exam';

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'exam-cs-301',
    code: 'CS-301',
    title: 'Advanced Algorithms & Complexity Analysis',
    department: 'Computer Science',
    instructor: 'Prof. Arthur Vance',
    instructorRole: 'Chair of Theoretical Computer Science',
    date: 'Available Today',
    timeWindow: '08:00 - 23:59 UTC',
    durationMinutes: 75,
    totalMarks: 115,
    questionCount: 16,
    status: 'available',
    proctoringMode: 'Strict Invigilation',
    passingScore: 70,
    instructions: [
      'This examination consists of 15 objective MCQ questions and 1 comprehensive descriptive synthesis question.',
      'Calculators and offline scratchpads within the interface are permitted.',
      'Navigating outside the examination window triggers automatic proctor logging.',
      'Ensure a steady internet connection. Responses are synchronized automatically with local fallback.'
    ],
    questions: [
      {
        id: 1,
        section: 'Asymptotic Analysis',
        type: 'single_choice',
        marks: 6,
        prompt: 'What is the tightest upper bound time complexity of solving the recurrence T(n) = 2T(n/2) + O(n log n) using the Master Theorem or Akra-Bazzi method?',
        options: [
          'O(n log n)',
          'O(n (log n)²)',
          'O(n²)',
          'O(n√n)'
        ],
        correctOptionIndices: [1],
        explanation: 'By the extended Master Theorem case 2, when f(n) = Θ(n^(log_b a) * log^k n) where a=2, b=2, log_2 2 = 1 and k=1, the solution is T(n) = Θ(n * log^(k+1) n) = Θ(n (log n)²).'
      },
      {
        id: 2,
        section: 'Graph Algorithms',
        type: 'single_choice',
        marks: 6,
        prompt: 'Consider a directed graph with negative edge weights but no negative cycles. Which algorithm is best suited for computing single-source shortest paths efficiently?',
        options: [
          "Dijkstra's Algorithm with Fibonacci Heap",
          'Bellman-Ford Algorithm',
          "Floyd-Warshall All-Pairs Algorithm",
          "Kruskal's Minimum Spanning Tree"
        ],
        correctOptionIndices: [1],
        explanation: "Bellman-Ford runs in O(V * E) time and safely supports negative edge weights without suffering from infinite loops, provided there are no negative cycles."
      },
      {
        id: 3,
        section: 'Dynamic Programming',
        type: 'single_choice',
        marks: 7,
        prompt: 'In the 0/1 Knapsack problem with n items and maximum capacity W, what is the standard dynamic programming runtime and state space requirement?',
        options: [
          'O(n · W) time and O(W) auxiliary space',
          'O(2^n) time and O(n) auxiliary space',
          'O(n log W) time and O(n) auxiliary space',
          'O(W log n) time and O(W²) space'
        ],
        correctOptionIndices: [0],
        explanation: 'The standard tabulation matrix is size (n+1) x (W+1), requiring O(n · W) time. Since each row only depends on the previous row, space can be optimized to O(W).'
      },
      {
        id: 4,
        section: 'Code Analysis & Invariants',
        type: 'code_snippet',
        marks: 8,
        prompt: 'Analyze the following partition implementation. What is the return value when arr = [10, 80, 30, 90, 40, 50, 70] and pivot is the last element (70)?',
        codeSnippet: `int partition(int arr[], int low, int high) {
    int pivot = arr[high]; // 70
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}`,
        options: [
          'Index 3 (value 50 placed at index 3)',
          'Index 4 (value 70 placed at index 4)',
          'Index 5 (value 70 placed at index 5)',
          'Index 2 (value 40 placed at index 2)'
        ],
        correctOptionIndices: [1],
        explanation: 'Elements smaller than 70 are [10, 30, 40, 50] (4 elements). They will occupy indices 0, 1, 2, and 3. The pivot 70 is placed at index i+1 = 4.'
      },
      {
        id: 5,
        section: 'Complexity Classes (P vs NP)',
        type: 'single_choice',
        marks: 7,
        prompt: 'Which of the following problems is known to be solvable in deterministic polynomial time (P)?',
        options: [
          '3-SAT Boolean Satisfiability',
          '2-SAT Boolean Satisfiability',
          'Hamiltonian Cycle on Directed Graph',
          'Subset Sum Problem'
        ],
        correctOptionIndices: [1],
        explanation: '2-SAT can be solved in linear time O(V + E) by constructing an implication graph and finding strongly connected components using Tarjan or Kosaraju.'
      },
      {
        id: 6,
        section: 'Balanced Trees',
        type: 'single_choice',
        marks: 6,
        prompt: 'In a Red-Black Tree, what is the maximum possible height of a tree containing n internal nodes?',
        options: [
          'log₂(n + 1)',
          '2 · log₂(n + 1)',
          '1.44 · log₂(n + 2)',
          '3 · log₂(n)'
        ],
        correctOptionIndices: [1],
        explanation: 'Because every simple path from root to leaf has the same black height and red nodes cannot have red children, the longest path is at most twice the shortest path: 2 · log₂(n + 1).'
      },
      {
        id: 7,
        section: 'Amortized Analysis',
        type: 'single_choice',
        marks: 7,
        prompt: 'Using the potential method on a dynamic array that doubles its size when full, what is the amortized cost per append operation?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(√n)'
        ],
        correctOptionIndices: [0],
        explanation: 'With potential function Φ = 2k - m (where k is current elements and m is table capacity), amortized cost per append is constant O(1).'
      },
      {
        id: 8,
        section: 'Divide & Conquer',
        type: 'single_choice',
        marks: 7,
        prompt: 'Strassen’s matrix multiplication algorithm computes the product of two n × n matrices in which asymptotic time complexity?',
        options: [
          'O(n³)',
          'O(n^2.807)',
          'O(n² log n)',
          'O(n^2.373)'
        ],
        correctOptionIndices: [1],
        explanation: "Strassen's algorithm uses 7 multiplications instead of 8 for 2x2 blocks: T(n) = 7T(n/2) + O(n²), yielding O(n^(log₂ 7)) ≈ O(n^2.8074)."
      },
      {
        id: 9,
        section: 'Network Flow',
        type: 'single_choice',
        marks: 7,
        prompt: 'According to the Max-Flow Min-Cut theorem, the maximum value of an s-t flow in a capacitated network is always equal to:',
        options: [
          'The sum of capacities of all outgoing edges from source s',
          'The minimum capacity among all s-t cuts in the network',
          'The average capacity of all augmenting paths',
          'The bottleneck edge capacity of the longest path'
        ],
        correctOptionIndices: [1],
        explanation: 'The Max-Flow Min-Cut theorem proves that the maximum flow passing through a network equals the minimum capacity across all cuts separating the source and sink.'
      },
      {
        id: 10,
        section: 'String Matching',
        type: 'code_snippet',
        marks: 7,
        prompt: 'In the Knuth-Morris-Pratt (KMP) failure table (π array) for the pattern "ABABCAB", what is the value of π[6] (for the full pattern)?',
        codeSnippet: `Pattern:  A  B  A  B  C  A  B
Index:    0  1  2  3  4  5  6
Prefix:   A  AB ABA ABAB ...`,
        options: [
          '2 ("AB")',
          '0 (None)',
          '1 ("A")',
          '3 ("ABA")'
        ],
        correctOptionIndices: [0],
        explanation: 'The longest proper prefix that is also a suffix of "ABABCAB" is "AB" of length 2 ("AB" at start and "AB" at end).'
      },
      {
        id: 11,
        section: 'Greedy Algorithms',
        type: 'multiple_choice',
        marks: 7,
        prompt: 'Which of the following statements about Huffman Coding are TRUE? (Select all that apply)',
        options: [
          'It produces an optimal prefix-free binary encoding for known symbol frequencies.',
          'Characters with higher frequency are assigned longer codewords.',
          'The Huffman tree can be constructed in O(n log n) time using a priority queue.',
          'The average codeword length is strictly bounded by Shannon entropy H(X) and H(X) + 1.'
        ],
        correctOptionIndices: [0, 2, 3],
        explanation: 'Characters with higher frequency receive shorter codewords to minimize expected code length. All other statements are standard theorems of Huffman codes.'
      },
      {
        id: 12,
        section: 'Disjoint Set Union',
        type: 'single_choice',
        marks: 6,
        prompt: 'With both union by rank and path compression heuristics enabled, m operations on n elements in a Disjoint Set (Union-Find) take:',
        options: [
          'O(m log n)',
          'O(m · α(n)) where α is the inverse Ackermann function',
          'O(n · log* n)',
          'O(m + n²)'
        ],
        correctOptionIndices: [1],
        explanation: 'Tarjan proved that combining union by rank with path compression yields a tight bound of O(m · α(n)), virtually linear in practice.'
      },
      {
        id: 13,
        section: 'Approximation Algorithms',
        type: 'single_choice',
        marks: 7,
        prompt: 'For the metric Traveling Salesperson Problem (TSP) satisfying the triangle inequality, Christofides algorithm achieves what approximation ratio?',
        options: [
          '2.0-approximation',
          '1.5-approximation (3/2)',
          'ln(n)-approximation',
          '1.25-approximation'
        ],
        correctOptionIndices: [1],
        explanation: "Christofides' algorithm combines an MST with a minimum-weight perfect matching on odd-degree vertices to achieve a 3/2 (1.5) approximation factor."
      },
      {
        id: 14,
        section: 'Randomized Algorithms',
        type: 'single_choice',
        marks: 7,
        prompt: 'What is the expected number of comparisons made by Randomized QuickSort when sorting an array of n distinct elements?',
        options: [
          '2n ln n ≈ 1.386 n log₂ n',
          '0.5 n²',
          'n log₂ n',
          '3n ln n'
        ],
        correctOptionIndices: [0],
        explanation: 'By linearity of expectation and indicator variables, the expected comparisons is 2n ln n ≈ 1.386 n log₂ n.'
      },
      {
        id: 15,
        section: 'Graph Traversal',
        type: 'single_choice',
        marks: 6,
        prompt: 'In a depth-first search tree of a directed graph, an edge (u, v) is classified as a BACK EDGE if and only if:',
        options: [
          'v is an ancestor of u in the DFS tree',
          'v is a descendant of u in the DFS tree',
          'v has already been fully explored and is marked black',
          'v is in a different unconnected subtree'
        ],
        correctOptionIndices: [0],
        explanation: 'Back edges connect a vertex u to an ancestor v in the DFS tree, indicating the presence of a cycle in a directed graph.'
      },
      {
        id: 16,
        section: 'Algorithmic Synthesis & Proofs (Descriptive)',
        type: 'descriptive',
        marks: 15,
        prompt: 'Design an efficient algorithm to detect whether a directed, weighted graph contains an arbitrary negative cycle. Explain your algorithm’s invariant, edge-relaxation steps, and state both the worst-case asymptotic time complexity and auxiliary space requirement.',
        options: [],
        correctOptionIndices: [],
        explanation: 'Evaluated by Faculty Examiner based on algorithmic rigor, invariant correctness, and complexity derivation.',
        modelAnswer: '1. Theoretical Framework: Utilize the Bellman-Ford shortest-path algorithm or SPFA relaxation algorithm.\n2. Invariant: After k iterations of relaxing all |E| edges, dist[v] holds the length of the shortest path from source s to v containing at most k edges.\n3. Cycle Detection Condition: In a simple graph with |V| vertices, any simple path has at most |V|-1 edges. Perform a |V|-th relaxation iteration over all edges (u,v). If for any edge dist[v] > dist[u] + weight(u, v), then a negative-weight cycle exists and is reachable.\n4. Complexity: Time complexity is O(|V| · |E|), Auxiliary space is O(|V|) for the distance and predecessor arrays.',
        maxWords: 350
      }
    ]
  },
  {
    id: 'exam-math-240',
    code: 'MATH-240',
    title: 'Linear Algebra & Vector Spaces',
    department: 'Mathematics',
    instructor: 'Prof. Helena Rostova',
    instructorRole: 'Professor of Pure Mathematics',
    date: 'Available Today',
    timeWindow: '10:00 - 22:00 UTC',
    durationMinutes: 60,
    totalMarks: 75,
    questionCount: 10,
    status: 'available',
    proctoringMode: 'Standard Proctored',
    passingScore: 50,
    instructions: [
      'Standard digital examination under institutional proctoring.',
      'Scratch calculation sheet available in top right console.',
      'All matrix dimensions and eigenvalue questions use real vector fields ℝ^n.'
    ],
    questions: [
      {
        id: 1,
        section: 'Eigenvalues & Diagonalization',
        type: 'single_choice',
        marks: 7,
        prompt: 'Let A be an n × n symmetric real matrix. Which of the following is guaranteed by the Spectral Theorem?',
        options: [
          'All eigenvalues are real and A is orthogonally diagonalizable.',
          'All eigenvalues are positive and det(A) > 0.',
          'A has at least one zero eigenvalue.',
          'The eigenvectors are all unit vectors with integer entries.'
        ],
        correctOptionIndices: [0],
        explanation: 'The Spectral Theorem states that every real symmetric matrix has exclusively real eigenvalues and can be factored as A = Q Λ Q^T where Q is orthogonal.'
      },
      {
        id: 2,
        section: 'Subspaces & Rank-Nullity',
        type: 'single_choice',
        marks: 8,
        prompt: 'For a linear transformation T: ℝ⁷ → ℝ⁴, if the dimension of the null space (kernel) is 3, what is the dimension of the range (image)?',
        options: [
          '4',
          '3',
          '7',
          '1'
        ],
        correctOptionIndices: [0],
        explanation: 'By the Rank-Nullity Theorem: dim(Domain) = dim(Kernel) + dim(Range). Thus 7 = 3 + dim(Range) => dim(Range) = 4.'
      }
    ]
  },
  {
    id: 'exam-ds-405',
    code: 'DS-405',
    title: 'Distributed Systems & Consensus Protocols',
    department: 'Computer Science',
    instructor: 'Dr. Marcus Thorne',
    instructorRole: 'Associate Professor, Systems Architecture',
    date: 'Thursday, Nov 14',
    timeWindow: '14:00 - 16:30 UTC',
    durationMinutes: 90,
    totalMarks: 100,
    questionCount: 20,
    status: 'scheduled',
    proctoringMode: 'Strict Invigilation',
    passingScore: 65,
    instructions: [
      'Covers Raft, Paxos, Vector Clocks, Byzantine Fault Tolerance and CAP theorem trade-offs.',
      'Examination portal unlocks exactly 10 minutes prior to scheduled start.'
    ],
    questions: []
  },
  {
    id: 'exam-ee-210',
    code: 'EE-210',
    title: 'Digital Signal Processing & Fourier Analysis',
    department: 'Electrical Engineering',
    instructor: 'Prof. Linus Chen',
    instructorRole: 'Head of Signals & Communications Lab',
    date: 'Monday, Nov 18',
    timeWindow: '09:00 - 11:30 UTC',
    durationMinutes: 90,
    totalMarks: 100,
    questionCount: 18,
    status: 'scheduled',
    proctoringMode: 'Webcam & Screen Lock',
    passingScore: 60,
    instructions: [
      'Formula reference sheet will be provided directly in the interface sidebar.',
      'Sampling theorem, Z-transform and FFT decimation-in-time problems included.'
    ],
    questions: []
  },
  {
    id: 'exam-cs-204',
    code: 'CS-204',
    title: 'Operating Systems Architecture & Kernel Internals',
    department: 'Computer Science',
    instructor: 'Prof. Arthur Vance',
    instructorRole: 'Chair of Systems',
    date: 'Completed Oct 28',
    timeWindow: 'Submitted at 11:42 UTC',
    durationMinutes: 90,
    totalMarks: 100,
    questionCount: 20,
    status: 'completed',
    proctoringMode: 'Strict Invigilation',
    passingScore: 60,
    studentScore: 94,
    studentGrade: 'A',
    studentPercentile: 96,
    studentCompletedDate: 'October 28, 2026',
    instructions: [],
    questions: [
      {
        id: 1,
        section: 'Virtual Memory',
        type: 'single_choice',
        marks: 5,
        prompt: 'In a 64-bit architecture with 4KB page sizes, how many bits of the virtual address are reserved for the page offset?',
        options: ['12 bits', '16 bits', '20 bits', '32 bits'],
        correctOptionIndices: [0],
        explanation: 'Because 4KB = 2¹² bytes, the lower 12 bits of the address specify the offset within the page.'
      },
      {
        id: 2,
        section: 'Concurrency & Synchronization',
        type: 'single_choice',
        marks: 5,
        prompt: 'Which condition is NOT one of Coffman’s four necessary conditions for deadlock?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Preemptive Priority Inversion',
          'Circular Wait'
        ],
        correctOptionIndices: [2],
        explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.'
      }
    ]
  },
  {
    id: 'exam-ai-401',
    code: 'AI-401',
    title: 'Foundations of Machine Learning & Optimization',
    department: 'Data Systems',
    instructor: 'Dr. Maya Patel',
    instructorRole: 'Principal Investigator, Neural Computing',
    date: 'Completed Nov 02',
    timeWindow: 'Submitted at 16:15 UTC',
    durationMinutes: 80,
    totalMarks: 100,
    questionCount: 16,
    status: 'completed',
    proctoringMode: 'Strict Invigilation',
    passingScore: 60,
    studentScore: 88,
    studentGrade: 'A-',
    studentPercentile: 89,
    studentCompletedDate: 'November 02, 2026',
    instructions: [],
    questions: [
      {
        id: 1,
        section: 'Gradient Optimization',
        type: 'single_choice',
        marks: 6,
        prompt: 'What primary problem does Adam optimizer address compared to standard SGD with momentum?',
        options: [
          'Adaptive per-parameter learning rates using first and second moments of gradients',
          'Guaranteed convergence to global minima for non-convex functions',
          'Elimination of backpropagation calculation',
          'Zero memory footprint'
        ],
        correctOptionIndices: [0],
        explanation: 'Adam computes individual adaptive learning rates for different parameters from estimates of first and second moments of the gradients.'
      }
    ]
  }
];

export const MOCK_PROCTOR_SESSIONS: ProctorStudentSession[] = [
  {
    id: 'st-01',
    studentName: 'Elena Vance',
    studentId: 'CS-2024-8841',
    examCode: 'CS-301',
    answeredCount: 12,
    totalQuestions: 15,
    timeRemainingMinutes: 42,
    status: 'active',
    webcamStatus: 'connected',
    lastActivity: 'Answered Q12 · 45s ago'
  },
  {
    id: 'st-02',
    studentName: 'Julian Sterling',
    studentId: 'CS-2024-8119',
    examCode: 'CS-301',
    answeredCount: 14,
    totalQuestions: 15,
    timeRemainingMinutes: 38,
    status: 'active',
    webcamStatus: 'connected',
    lastActivity: 'Flagged Q8 for review · 2m ago'
  },
  {
    id: 'st-03',
    studentName: 'Kavita Sundaram',
    studentId: 'CS-2024-8904',
    examCode: 'CS-301',
    answeredCount: 8,
    totalQuestions: 15,
    timeRemainingMinutes: 44,
    status: 'warning',
    webcamStatus: 'flagged',
    lastActivity: 'Tab focus lost briefly (1x) · 3m ago'
  },
  {
    id: 'st-04',
    studentName: 'Mateo Morales',
    studentId: 'CS-2024-8772',
    examCode: 'CS-301',
    answeredCount: 15,
    totalQuestions: 15,
    timeRemainingMinutes: 19,
    status: 'submitted',
    webcamStatus: 'connected',
    lastActivity: 'Submitted examination · 6m ago'
  },
  {
    id: 'st-05',
    studentName: 'Zara Al-Mansoor',
    studentId: 'CS-2024-8349',
    examCode: 'CS-301',
    answeredCount: 11,
    totalQuestions: 15,
    timeRemainingMinutes: 41,
    status: 'active',
    webcamStatus: 'connected',
    lastActivity: 'Viewing Q10 · 1m ago'
  }
];
