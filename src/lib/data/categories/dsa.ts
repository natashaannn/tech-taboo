// Data Structures & Algorithms Terms - 52 cards
import type { TabooWord } from "../../../types/taboo";

export const dsaTabooList: TabooWord[] = [
  {
    index: 1,
    word: "Array",
    taboo: ["List", "Index", "Element", "Collection", "Sequence"],
    explanation:
      "A collection of elements stored in contiguous memory, accessible by index.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 2,
    word: "Linked List",
    taboo: ["Node", "Pointer", "Chain", "Next", "Head"],
    explanation:
      "A sequence of nodes where each node holds data and a pointer to the next node.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 3,
    word: "Stack",
    taboo: ["Push", "Pop", "Last in First out", "Top", "Queue"],
    explanation:
      "A data structure that follows last-in, first-out order for adding and removing elements.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 4,
    word: "Queue",
    taboo: ["Stack", "Behind", "First in First out", "Line", "Front"],
    explanation:
      "A data structure that follows first-in, first-out order for adding and removing elements.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 5,
    word: "Hash Table",
    taboo: ["Map", "Dictionary", "Key", "Value", "Bucket"],
    explanation:
      "A data structure that maps keys to values using a hash function for fast lookups.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 6,
    word: "Binary Tree",
    taboo: ["Node", "Root", "Left", "Right", "Child"],
    explanation:
      "A tree where each node has at most two children, referred to as left and right.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 7,
    word: "Graph",
    taboo: ["Vertex", "Edge", "Node", "Network", "Connection"],
    explanation:
      "A collection of nodes connected by edges, used to model relationships and networks.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 8,
    word: "Heap",
    taboo: ["Sort", "Binary", "Parent", "Child", "Min"],
    explanation:
      "A tree-based structure where each parent is greater or lesser than its children, used in priority queues.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 9,
    word: "Trie",
    taboo: ["Prefix", "Tree", "String", "Search", "Dictionary"],
    explanation:
      "A tree structure used for efficient storage and retrieval of strings, commonly used in search.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 10,
    word: "Binary Search",
    taboo: ["Sorted", "Divide", "Half", "Middle", "Compare"],
    explanation:
      "An algorithm that finds an element in a sorted array by repeatedly halving the search range.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 11,
    word: "Bubble Sort",
    taboo: ["Swap", "Adjacent", "Compare", "Iterate", "Simple"],
    explanation:
      "A simple sorting algorithm that repeatedly swaps adjacent elements that are in the wrong order.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 12,
    word: "Merge Sort",
    taboo: ["Divide", "Conquer", "Combine", "Recursive", "Split"],
    explanation:
      "A divide-and-conquer sorting algorithm that splits, sorts, and merges arrays recursively.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 13,
    word: "Quick Sort",
    taboo: ["Pivot", "Partition", "Divide", "Conquer", "Fast"],
    explanation:
      "A fast sorting algorithm that partitions an array around a pivot element.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 14,
    word: "Insertion Sort",
    taboo: ["Shift", "Place", "Sorted", "Compare", "Simple"],
    explanation:
      "A sorting algorithm that builds the sorted list one element at a time by inserting each into its correct position.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 15,
    word: "Selection Sort",
    taboo: ["Minimum", "Swap", "Find", "Unsorted", "Simple"],
    explanation:
      "A sorting algorithm that repeatedly finds the minimum element and places it in order.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 16,
    word: "Breadth-First Search",
    taboo: ["Queue", "Level", "Graph", "Traverse", "Node"],
    explanation:
      "A graph traversal algorithm that explores all neighbors level by level.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 17,
    word: "Depth-First Search",
    taboo: ["Stack", "Recursive", "Graph", "Traverse", "Backtrack"],
    explanation:
      "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 18,
    word: "Dijkstra's Algorithm",
    taboo: ["Shortest", "Path", "Graph", "Weight", "Distance"],
    explanation:
      "An algorithm that finds the shortest path between nodes in a weighted graph.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 19,
    word: "In-Place Algorithm",
    taboo: ["Memory", "Space", "Constant", "Extra", "Modify"],
    explanation:
      "An algorithm that transforms data using only a small, constant amount of extra space.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 20,
    word: "Greedy Algorithm",
    taboo: ["Local", "Optimal", "Choice", "Best", "Heuristic"],
    explanation:
      "An approach that makes the locally optimal choice at each step to find a global solution.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 21,
    word: "Backtracking",
    taboo: ["Recursive", "Try", "Undo", "Solution", "Explore"],
    explanation:
      "A problem-solving technique that explores all possibilities and abandons paths that fail.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 22,
    word: "Divide and Conquer",
    taboo: ["Split", "Recursive", "Combine", "Subproblem", "Merge"],
    explanation:
      "A strategy that breaks a problem into smaller subproblems, solves them, and combines results.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 23,
    word: "Recursion",
    taboo: ["Function", "Call", "Itself", "Base", "Stack"],
    explanation:
      "A technique where a function calls itself to solve smaller instances of the same problem.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 24,
    word: "Big O Notation",
    taboo: ["Complexity", "Time", "Space", "Asymptotic", "Performance"],
    explanation:
      "A mathematical notation describing how an algorithm's time or space grows with input size.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 25,
    word: "Pointer",
    taboo: ["Memory", "Address", "Reference", "Variable", "Location"],
    explanation:
      "A variable that stores the memory address of another variable.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 26,
    word: "Doubly Linked List",
    taboo: ["Node", "Previous", "Next", "Chain", "Bidirectional"],
    explanation:
      "A linked list where each node has pointers to both the next and previous nodes.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 27,
    word: "Circular Queue",
    taboo: ["Ring", "Buffer", "Wrap", "First in First out", "Front"],
    explanation:
      "A queue where the last position wraps around to connect back to the first position.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 28,
    word: "Priority Queue",
    taboo: ["Heap", "Order", "Importance", "VIP", "Highest"],
    explanation:
      "A data structure where each element has a priority and higher-priority elements are served first.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 29,
    word: "Time Complexity",
    taboo: ["Big O", "Runtime", "Performance", "Speed", "Efficiency"],
    explanation:
      "A measure of how the running time of an algorithm scales with the size of its input.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 30,
    word: "Red-Black Tree",
    taboo: ["Balanced", "Binary", "Color", "Property", "Self"],
    explanation:
      "A self-balancing binary search tree that maintains balance through color properties.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 31,
    word: "B-Tree",
    taboo: ["Balanced", "Multi", "Database", "Disk", "Keys"],
    explanation:
      "A self-balancing tree structure optimized for reading and writing large blocks of data.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 32,
    word: "Segment Tree",
    taboo: ["Range", "Query", "Interval", "Update", "Binary"],
    explanation:
      "A tree structure used to efficiently answer range queries and update values in an array.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 33,
    word: "Memoization",
    taboo: ["Cache", "Dynamic", "Store", "Remember", "Optimize"],
    explanation:
      "An optimization technique that stores results of expensive function calls to avoid recomputation.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 34,
    word: "Disjoint Set",
    taboo: ["Union", "Find", "Connected", "Component", "Merge"],
    explanation:
      "A data structure that tracks elements partitioned into non-overlapping groups, supporting union and find.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 35,
    word: "Topological Sort",
    taboo: [
      "Directed Acyclic Graph",
      "Order",
      "Node",
      "Dependencies",
      "Linear",
    ],
    explanation:
      "A linear ordering of nodes in a directed acyclic graph where each node comes before its dependents.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 36,
    word: "Minimum Spanning Tree",
    taboo: ["Graph", "Kruskal", "Prim", "Edge", "Weight"],
    explanation:
      "A subset of edges in a graph that connects all vertices with the minimum total weight.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 37,
    word: "AVL Tree",
    taboo: ["Balanced", "Binary", "Rotation", "Height", "Self"],
    explanation:
      "A self-balancing binary search tree that maintains balance by tracking height differences.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 38,
    word: "Least Recently Used Cache",
    taboo: ["Database", "Eviction", "HashMap", "Doubly", "Linked"],
    explanation:
      "A cache eviction policy that removes the item that was used least recently.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 39,
    word: "Knapsack Problem",
    taboo: ["Dynamic", "Optimal", "Weight", "Value", "Capacity"],
    explanation:
      "A classic optimization problem of selecting items with maximum value within a weight limit.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 40,
    word: "Traveling Salesman Problem",
    taboo: ["Shortest", "Route", "Visit", "Cities", "Graph"],
    explanation:
      "Finding the shortest possible route that visits every city exactly once and returns to the start.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 41,
    word: "Two Pointers",
    taboo: ["Technique", "Array", "Left", "Right", "Move"],
    explanation:
      "A technique using two indices that move through data from different positions to solve problems efficiently.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 42,
    word: "Sliding Window",
    taboo: ["Curtain", "Subarray", "Range", "Move", "Optimize"],
    explanation:
      "A technique that moves a fixed-size window across data to solve range-based problems efficiently.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 43,
    word: "Kadane's Algorithm",
    taboo: ["Maximum", "Subarray", "Sum", "Dynamic", "Contiguous"],
    explanation:
      "An algorithm for finding the maximum sum contiguous subarray in linear time.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 44,
    word: "Binary Search Tree",
    taboo: ["Ordered", "Left", "Right", "Search", "Insert"],
    explanation:
      "A binary tree where left children are smaller and right children are larger than the parent.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 45,
    word: "Hashing",
    taboo: ["Function", "Key", "Table", "Collision", "Map"],
    explanation:
      "Converting data of any size into a fixed-size value using a hash function.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 46,
    word: "Collision Resolution",
    taboo: ["Chaining", "Probing", "Hash", "Bucket", "Conflict"],
    explanation:
      "Techniques for handling two keys that hash to the same index in a hash table.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 47,
    word: "Radix Sort",
    taboo: ["Digit", "Counting", "Compare", "Linear", "Bucket"],
    explanation:
      "A non-comparative sorting algorithm that sorts integers digit by digit.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 48,
    word: "Counting Sort",
    taboo: ["Frequency", "Range", "Compare", "Linear", "Integer"],
    explanation:
      "A sorting algorithm that counts occurrences of each value to determine sorted positions.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 49,
    word: "Bucket Sort",
    taboo: ["Distribute", "Range", "Bins", "Scatter", "Gather"],
    explanation:
      "A sorting algorithm that distributes elements into buckets and sorts each bucket individually.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 50,
    word: "Heap Sort",
    taboo: ["Binary", "Min", "Priority", "Extract", "Max"],
    explanation:
      "A comparison-based sorting algorithm that uses a heap data structure to sort elements.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 51,
    word: "Bloom Filter",
    taboo: ["Probabilistic", "Hash", "Recommend", "Positive", "Filter"],
    explanation:
      "A space-efficient probabilistic data structure used to test whether an element is in a set.",
    category: "Data Structures & Algorithms",
  },
  {
    index: 52,
    word: "Suffix Array",
    taboo: ["String", "Index", "Text", "Search", "Pattern"],
    explanation:
      "An array of all suffixes of a string sorted lexicographically, used for fast string searches.",
    category: "Data Structures & Algorithms",
  },
];
