// System Design Terms - 52 cards
import type { TabooWord } from "../../../types/taboo";

export const systemDesignTabooList: TabooWord[] = [
  {
    index: 1,
    word: "Load Balancer",
    taboo: ["Traffic", "Distribute", "Server", "Request", "Round Robin"],
    explanation:
      "A system that distributes incoming network traffic across multiple servers to ensure reliability and availability.",
    category: "System Design",
  },
  {
    index: 2,
    word: "Microservices",
    taboo: ["Architecture", "Service", "Distributed", "API", "Monolith"],
    explanation:
      "An architecture where an application is built as small, independent services that communicate over APIs.",
    category: "System Design",
  },
  {
    index: 3,
    word: "Scalability",
    taboo: ["Growth", "Horizontal", "Vertical", "Performance", "Capacity"],
    explanation:
      "The ability of a system to handle growing amounts of work by adding resources.",
    category: "System Design",
  },
  {
    index: 4,
    word: "Caching",
    taboo: ["Redis", "Memory", "Fast", "Database", "Performance"],
    explanation:
      "Storing frequently accessed data in fast storage to reduce latency and load on the main system.",
    category: "System Design",
  },
  {
    index: 5,
    word: "Database Sharding",
    taboo: ["Partition", "Horizontal", "Split", "Distributed", "Scale"],
    explanation:
      "Splitting a database into smaller pieces called shards, each stored on a different server.",
    category: "System Design",
  },
  {
    index: 6,
    word: "Content Delivery Network",
    taboo: ["Cache", "Edge", "Fast", "Distributed", "Static"],
    explanation:
      "A network of servers distributed globally to deliver content faster to users.",
    category: "System Design",
  },
  {
    index: 7,
    word: "Message Queue",
    taboo: ["Kafka", "RabbitMQ", "Async", "Publish", "Subscribe"],
    explanation:
      "A system that allows services to communicate asynchronously by passing messages through a buffer.",
    category: "System Design",
  },
  {
    index: 8,
    word: "API Gateway",
    taboo: ["Route", "Entry", "Request", "Proxy", "Endpoint"],
    explanation:
      "A server that acts as the single entry point for client requests, routing them to the right services.",
    category: "System Design",
  },
  {
    index: 9,
    word: "Rate Limiting",
    taboo: ["API", "Request", "Quota", "Restrict", "Control"],
    explanation:
      "Restricting the number of requests a client can make to an API within a given time window.",
    category: "System Design",
  },
  {
    index: 10,
    word: "Consistent Hashing",
    taboo: ["Ring", "Node", "Distribute", "Algorithm", "Scale"],
    explanation:
      "A technique for distributing data across nodes that minimizes reassignment when nodes are added or removed.",
    category: "System Design",
  },
  {
    index: 11,
    word: "CAP Theorem",
    taboo: ["Brewer", "Trade-off", "Distributed", "Database", "Network"],
    explanation:
      "The principle that a distributed system can only guarantee two of consistency, availability, and partition tolerance at once.",
    category: "System Design",
  },
  {
    index: 12,
    word: "Eventual Consistency",
    taboo: ["Distributed", "Sync", "Time", "Replicas", "Converge"],
    explanation:
      "A model where replicated data will become consistent over time, though not immediately.",
    category: "System Design",
  },
  {
    index: 13,
    word: "Database Replication",
    taboo: ["Copy", "Master", "Slave", "Sync", "Backup"],
    explanation:
      "Copying data from one database server to others to improve availability and fault tolerance.",
    category: "System Design",
  },
  {
    index: 14,
    word: "Horizontal Scaling",
    taboo: ["Add", "Server", "Instance", "Distributed", "Out"],
    explanation: "Adding more machines to a system to handle increased load.",
    category: "System Design",
  },
  {
    index: 15,
    word: "Vertical Scaling",
    taboo: ["CPU", "RAM", "Upgrade", "Hardware", "Up"],
    explanation:
      "Increasing the resources of a single machine, such as CPU or RAM, to handle more load.",
    category: "System Design",
  },
  {
    index: 16,
    word: "Reverse Proxy",
    taboo: ["Nginx", "Forward", "Server", "Request", "Backend"],
    explanation:
      "A server that intercepts client requests and forwards them to backend servers on their behalf.",
    category: "System Design",
  },
  {
    index: 17,
    word: "Service Discovery",
    taboo: ["Registry", "Find", "Locate", "Microservices", "Consul"],
    explanation:
      "The automatic detection of services and their network locations in a distributed system.",
    category: "System Design",
  },
  {
    index: 18,
    word: "Circuit Breaker",
    taboo: ["Fail", "Timeout", "Retry", "Pattern", "Fallback"],
    explanation:
      "A pattern that stops requests to a failing service to prevent cascading failures.",
    category: "System Design",
  },
  {
    index: 19,
    word: "Idempotency",
    taboo: ["Same", "Result", "Retry", "Request", "Safe"],
    explanation:
      "The property where performing the same operation multiple times produces the same result.",
    category: "System Design",
  },
  {
    index: 20,
    word: "Database Indexing",
    taboo: ["Fast", "Query", "Search", "Performance", "B-Tree"],
    explanation:
      "Creating data structures that speed up data retrieval operations in a database.",
    category: "System Design",
  },
  {
    index: 21,
    word: "Distributed Lock",
    taboo: ["Mutex", "Coordination", "Sync", "Redis", "ZooKeeper"],
    explanation:
      "A mechanism to ensure only one process accesses a shared resource at a time across multiple nodes.",
    category: "System Design",
  },
  {
    index: 22,
    word: "Event Sourcing",
    taboo: ["Log", "History", "State", "Events", "Replay"],
    explanation:
      "Storing all changes to application state as a sequence of events rather than the current state.",
    category: "System Design",
  },
  {
    index: 23,
    word: "Proxy Server",
    taboo: ["Gateway", "Nginx", "Request", "Intermediate", "Between"],
    explanation:
      "An intermediary server that handles requests between clients and other servers.",
    category: "System Design",
  },
  {
    index: 24,
    word: "Saga Pattern",
    taboo: [
      "Transaction",
      "Distributed",
      "Microservices",
      "Rollback",
      "Orchestration",
    ],
    explanation:
      "A pattern for managing long-running transactions across microservices by breaking them into a sequence of smaller steps that can each be rolled back if needed.",
    category: "System Design",
  },
  {
    index: 25,
    word: "Two-Phase Commit",
    taboo: ["Transaction", "Distributed", "Prepare", "Commit", "Coordinator"],
    explanation:
      "A protocol that ensures all nodes in a distributed transaction either commit or roll back together.",
    category: "System Design",
  },
  {
    index: 26,
    word: "Write-Ahead Log",
    taboo: ["Durability", "Crash", "Recovery", "Database", "Commit"],
    explanation:
      "A log that records changes before they are applied to a database, ensuring durability.",
    category: "System Design",
  },
  {
    index: 27,
    word: "Gossip Protocol",
    taboo: ["Spread", "Rumor", "Distributed", "Node", "Communication"],
    explanation:
      "A peer-to-peer communication method where nodes share information with random neighbors.",
    category: "System Design",
  },
  {
    index: 28,
    word: "Quorum",
    taboo: ["Majority", "Vote", "Consensus", "Replicas", "Agreement"],
    explanation:
      "The minimum number of nodes that must agree for a distributed operation to succeed.",
    category: "System Design",
  },
  {
    index: 29,
    word: "Leader Election",
    taboo: ["Raft", "Paxos", "Consensus", "Distributed", "Coordinator"],
    explanation:
      "The process by which distributed nodes select one node to coordinate actions.",
    category: "System Design",
  },
  {
    index: 30,
    word: "Heartbeat",
    taboo: ["Alive", "Ping", "Health", "Monitor", "Check"],
    explanation:
      "A periodic signal sent between systems to confirm they are still running and connected.",
    category: "System Design",
  },
  {
    index: 31,
    word: "Back Pressure",
    taboo: ["Flow", "Control", "Slow", "Consumer", "Queue"],
    explanation:
      "A mechanism where a downstream system signals an upstream system to slow down data flow.",
    category: "System Design",
  },
  {
    index: 32,
    word: "Bulkhead Pattern",
    taboo: ["Isolation", "Failure", "Resource", "Partition", "Resilience"],
    explanation:
      "Isolating components of a system so a failure in one does not cascade to others.",
    category: "System Design",
  },
  {
    index: 33,
    word: "Sidecar Pattern",
    taboo: ["Container", "Proxy", "Kubernetes", "Service", "Mesh"],
    explanation:
      "Deploying a helper container alongside a main service container to handle cross-cutting concerns.",
    category: "System Design",
  },
  {
    index: 34,
    word: "Database Partitioning",
    taboo: ["Shard", "Split", "Horizontal", "Vertical", "Range"],
    explanation:
      "Dividing a database into distinct segments to improve performance and manageability.",
    category: "System Design",
  },
  {
    index: 35,
    word: "Read Replica",
    taboo: ["Database", "Copy", "Master", "Query", "Scale"],
    explanation:
      "A copy of a database that handles read queries to reduce load on the primary database.",
    category: "System Design",
  },
  {
    index: 36,
    word: "Write-Through Cache",
    taboo: ["Update", "Database", "Sync", "Consistency", "Store"],
    explanation:
      "A caching strategy where data is written to both the cache and main storage simultaneously.",
    category: "System Design",
  },
  {
    index: 37,
    word: "Write-Back Cache",
    taboo: ["Lazy", "Async", "Database", "Performance", "Delay"],
    explanation:
      "A caching strategy where data is written to the cache first and synced to storage later.",
    category: "System Design",
  },
  {
    index: 38,
    word: "Sticky Session",
    taboo: ["Affinity", "User", "Server", "State", "Cookie"],
    explanation:
      "Routing a user's requests to the same server throughout their session.",
    category: "System Design",
  },
  {
    index: 39,
    word: "Stateless",
    taboo: ["Storage", "Memory", "Server", "Session", "Scalable"],
    explanation:
      "A design where each request contains all the information needed to process it, with no server-side session.",
    category: "System Design",
  },
  {
    index: 40,
    word: "Stateful",
    taboo: ["Remember", "Session", "Memory", "Server", "Sticky"],
    explanation:
      "A design where the server maintains session data about the client between requests.",
    category: "System Design",
  },
  {
    index: 41,
    word: "Latency",
    taboo: ["Delay", "Time", "Response", "Slow", "Fast"],
    explanation:
      "The time delay between sending a request and receiving a response.",
    category: "System Design",
  },
  {
    index: 42,
    word: "Throughput",
    taboo: ["Rate", "Request", "Second", "Capacity", "Volume"],
    explanation:
      "The amount of data or number of requests a system can process in a given time period.",
    category: "System Design",
  },
  {
    index: 43,
    word: "Fault Tolerance",
    taboo: ["Resilience", "Failure", "Recovery", "Redundancy", "Availability"],
    explanation:
      "A system's ability to continue operating correctly even when components fail.",
    category: "System Design",
  },
  {
    index: 44,
    word: "High Availability",
    taboo: ["Uptime", "Redundancy", "Failure", "99.9%", "Reliable"],
    explanation:
      "A system design that minimizes downtime and ensures continuous operation.",
    category: "System Design",
  },
  {
    index: 45,
    word: "Single Point of Failure",
    taboo: ["Bottleneck", "Risk", "Redundancy", "Availability", "Critical"],
    explanation:
      "A component whose failure would cause the entire system to stop working.",
    category: "System Design",
  },
  {
    index: 46,
    word: "Database Connection Pool",
    taboo: ["Reuse", "Limit", "Connections", "Performance", "Resource"],
    explanation:
      "A cache of database connections reused to reduce the overhead of opening new connections.",
    category: "System Design",
  },
  {
    index: 47,
    word: "Denormalization",
    taboo: ["Redundancy", "Performance", "Join", "Read", "Optimize"],
    explanation:
      "Intentionally introducing redundancy into a database to improve read performance.",
    category: "System Design",
  },
  {
    index: 48,
    word: "Normalization",
    taboo: ["Redundancy", "Tables", "Relations", "Form", "Optimize"],
    explanation:
      "Organizing a database to reduce redundancy and improve data integrity.",
    category: "System Design",
  },
  {
    index: 49,
    word: "Time to Live",
    taboo: ["Expire", "Cache", "Duration", "Timeout", "Delete"],
    explanation:
      "A setting that defines how long data or a packet is valid before being discarded.",
    category: "System Design",
  },
  {
    index: 50,
    word: "Webhook",
    taboo: ["Callback", "HTTP", "Event", "Notify", "Push"],
    explanation:
      "An HTTP callback that sends data to a URL when a specific event occurs.",
    category: "System Design",
  },
  {
    index: 51,
    word: "Polling",
    taboo: ["Check", "Request", "Interval", "Update", "Repeatedly"],
    explanation:
      "Repeatedly checking a source for new data at regular intervals.",
    category: "System Design",
  },
  {
    index: 52,
    word: "Long Polling",
    taboo: ["Hold", "Request", "Server", "Response", "Timeout"],
    explanation:
      "A technique where the server holds a request open until new data is available, then responds.",
    category: "System Design",
  },
];
