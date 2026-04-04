// Cybersecurity Terms - 52 cards
import type { TabooWord } from "../../../types/taboo";

export const cybersecurityTabooList: TabooWord[] = [
  {
    index: 1,
    word: "Zero Trust",
    taboo: ["Security", "Model", "Verify", "Never", "Network"],
    explanation:
      "A security model that requires verification for every access request, regardless of location.",
    category: "Cybersecurity",
  },
  {
    index: 2,
    word: "Penetration Testing",
    taboo: ["Pentest", "Hacking", "Security", "Vulnerability", "Ethical"],
    explanation:
      "Authorized simulated attacks on systems to find security weaknesses.",
    category: "Cybersecurity",
  },
  {
    index: 3,
    word: "Social Engineering",
    taboo: ["Manipulation", "Trick", "Human", "Phishing", "Deceive"],
    explanation:
      "Manipulating people into revealing confidential information or performing actions.",
    category: "Cybersecurity",
  },
  {
    index: 4,
    word: "Two-Factor Authentication",
    taboo: ["2FA", "MFA", "Code", "SMS", "Verify"],
    explanation:
      "A security process requiring two different forms of identification to access an account.",
    category: "Cybersecurity",
  },
  {
    index: 5,
    word: "Ransomware",
    taboo: ["Encrypt", "Malware", "Payment", "Bitcoin", "Lock"],
    explanation:
      "Malicious software that encrypts files and demands payment for their release.",
    category: "Cybersecurity",
  },
  {
    index: 6,
    word: "DDoS Attack",
    taboo: ["Distributed", "Denial", "Service", "Overwhelm", "Traffic"],
    explanation:
      "Overwhelming a system with traffic from multiple sources to make it unavailable.",
    category: "Cybersecurity",
  },
  {
    index: 7,
    word: "SQL Injection",
    taboo: ["Database", "Attack", "Query", "Vulnerability", "Code"],
    explanation:
      "Inserting malicious code into database queries to access or manipulate data.",
    category: "Cybersecurity",
  },
  {
    index: 8,
    word: "Cross-Site Scripting",
    taboo: ["XSS", "JavaScript", "Injection", "Browser", "Attack"],
    explanation:
      "Injecting malicious scripts into websites viewed by other users.",
    category: "Cybersecurity",
  },
  {
    index: 9,
    word: "Man-in-the-Middle",
    taboo: ["MITM", "Intercept", "Eavesdrop", "Attack", "Between"],
    explanation:
      "Secretly intercepting and possibly altering communication between two parties.",
    category: "Cybersecurity",
  },
  {
    index: 10,
    word: "Brute Force Attack",
    taboo: ["Password", "Guess", "Try", "Crack", "Attempt"],
    explanation:
      "Trying many passwords or keys until the correct one is found.",
    category: "Cybersecurity",
  },
  {
    index: 11,
    word: "Zero-Day Exploit",
    taboo: ["Vulnerability", "Unknown", "Patch", "Attack", "Unpatched"],
    explanation:
      "An attack that exploits a previously unknown software vulnerability.",
    category: "Cybersecurity",
  },
  {
    index: 12,
    word: "Honeypot",
    taboo: ["Trap", "Decoy", "Attackers", "Monitor", "Fake"],
    explanation: "A decoy system designed to attract and detect attackers.",
    category: "Cybersecurity",
  },
  {
    index: 13,
    word: "Intrusion Detection System",
    taboo: ["IDS", "Monitor", "Alert", "Network", "Threat"],
    explanation:
      "Software that monitors networks for suspicious activity and alerts administrators.",
    category: "Cybersecurity",
  },
  {
    index: 14,
    word: "Security Operations Center",
    taboo: ["SOC", "Monitor", "Team", "Incident", "Response"],
    explanation:
      "A centralized unit that monitors and analyzes security across an organization.",
    category: "Cybersecurity",
  },
  {
    index: 15,
    word: "Threat Intelligence",
    taboo: ["Information", "Attackers", "Analysis", "Indicators", "Feed"],
    explanation:
      "Information about potential or current attacks that helps organizations defend themselves.",
    category: "Cybersecurity",
  },
  {
    index: 16,
    word: "Security Information and Event Management",
    taboo: ["SIEM", "Logs", "Analysis", "Correlation", "Alert"],
    explanation:
      "Software that aggregates and analyzes security data from across an organization.",
    category: "Cybersecurity",
  },
  {
    index: 17,
    word: "Least Privilege",
    taboo: ["Access", "Minimum", "Permission", "Rights", "Need"],
    explanation:
      "Giving users only the minimum access rights needed to perform their job.",
    category: "Cybersecurity",
  },
  {
    index: 18,
    word: "Defense in Depth",
    taboo: ["Layers", "Multiple", "Security", "Strategy", "Redundant"],
    explanation:
      "Using multiple layers of security controls to protect resources.",
    category: "Cybersecurity",
  },
  {
    index: 19,
    word: "Attack Surface",
    taboo: ["Exposure", "Vulnerability", "Entry", "Points", "Risk"],
    explanation:
      "All possible points where an unauthorized user could enter or extract data from a system.",
    category: "Cybersecurity",
  },
  {
    index: 20,
    word: "Privilege Escalation",
    taboo: ["Exploit", "Permissions", "Admin", "Rights", "Gain"],
    explanation:
      "Gaining higher access rights than originally granted, often through exploits.",
    category: "Cybersecurity",
  },
  {
    index: 21,
    word: "Backdoor",
    taboo: ["Hidden", "Access", "Secret", "Entry", "Bypass"],
    explanation:
      "A hidden method of bypassing normal authentication to access a system.",
    category: "Cybersecurity",
  },
  {
    index: 22,
    word: "Rootkit",
    taboo: ["Malware", "Hide", "Stealth", "Admin", "Detect"],
    explanation:
      "Malicious software designed to hide its presence and maintain privileged access.",
    category: "Cybersecurity",
  },
  {
    index: 23,
    word: "Trojan Horse",
    taboo: ["Malware", "Disguise", "Legitimate", "Hidden", "Virus"],
    explanation:
      "Malicious software disguised as legitimate software to trick users into installing it.",
    category: "Cybersecurity",
  },
  {
    index: 24,
    word: "Spyware",
    taboo: ["Monitor", "Track", "Collect", "Malware", "Privacy"],
    explanation:
      "Software that secretly monitors and collects user information without consent.",
    category: "Cybersecurity",
  },
  {
    index: 25,
    word: "Keylogger",
    taboo: ["Record", "Keyboard", "Password", "Type", "Monitor"],
    explanation:
      "Software or hardware that records every keystroke made on a computer.",
    category: "Cybersecurity",
  },
  {
    index: 26,
    word: "Botnet",
    taboo: ["Zombies", "Network", "Infected", "Control", "DDoS"],
    explanation:
      "A network of infected computers controlled remotely to perform malicious tasks.",
    category: "Cybersecurity",
  },
  {
    index: 27,
    word: "Command and Control",
    taboo: ["C2", "Server", "Botnet", "Remote", "Malware"],
    explanation:
      "Infrastructure used by attackers to communicate with and control compromised systems.",
    category: "Cybersecurity",
  },
  {
    index: 28,
    word: "Exploit Kit",
    taboo: ["Automated", "Vulnerability", "Attack", "Tool", "Malware"],
    explanation:
      "Automated tools that scan for and exploit known vulnerabilities.",
    category: "Cybersecurity",
  },
  {
    index: 29,
    word: "Advanced Persistent Threat",
    taboo: ["APT", "Targeted", "Long-term", "Nation", "Sophisticated"],
    explanation:
      "A prolonged and targeted cyberattack where attackers gain and maintain access.",
    category: "Cybersecurity",
  },
  {
    index: 30,
    word: "Indicator of Compromise",
    taboo: ["IOC", "Evidence", "Breach", "Forensic", "Sign"],
    explanation:
      "Pieces of evidence that indicate a system has been compromised.",
    category: "Cybersecurity",
  },
  {
    index: 31,
    word: "Security Audit",
    taboo: ["Assessment", "Review", "Compliance", "Check", "Evaluate"],
    explanation:
      "A systematic evaluation of an organization's security measures and policies.",
    category: "Cybersecurity",
  },
  {
    index: 32,
    word: "Vulnerability Assessment",
    taboo: ["Scan", "Weaknesses", "Security", "Identify", "Test"],
    explanation:
      "Identifying and classifying security weaknesses in systems and networks.",
    category: "Cybersecurity",
  },
  {
    index: 33,
    word: "Patch Management",
    taboo: ["Update", "Fix", "Vulnerability", "Deploy", "Software"],
    explanation:
      "The process of identifying, testing, and installing software updates to fix vulnerabilities.",
    category: "Cybersecurity",
  },
  {
    index: 34,
    word: "Endpoint Security",
    taboo: ["Device", "Protection", "Antivirus", "Laptop", "Phone"],
    explanation: "Protecting devices that connect to a network from threats.",
    category: "Cybersecurity",
  },
  {
    index: 35,
    word: "Network Segmentation",
    taboo: ["Divide", "Isolate", "Separate", "VLAN", "Zones"],
    explanation:
      "Dividing a network into smaller segments to improve security and performance.",
    category: "Cybersecurity",
  },
  {
    index: 36,
    word: "Air Gap",
    taboo: ["Isolated", "Offline", "Disconnect", "Physical", "Separate"],
    explanation:
      "Physical isolation of a computer or network from unsecured networks.",
    category: "Cybersecurity",
  },
  {
    index: 37,
    word: "Security Token",
    taboo: ["Device", "Authentication", "Hardware", "Key", "Generate"],
    explanation:
      "A physical device used to authenticate users and generate one-time passwords.",
    category: "Cybersecurity",
  },
  {
    index: 38,
    word: "Biometric Authentication",
    taboo: ["Fingerprint", "Face", "Iris", "Physical", "Scan"],
    explanation: "Using unique physical characteristics to verify identity.",
    category: "Cybersecurity",
  },
  {
    index: 39,
    word: "Public Key Infrastructure",
    taboo: ["PKI", "Certificate", "Encryption", "Digital", "Authority"],
    explanation:
      "A framework for managing digital certificates and public-key encryption.",
    category: "Cybersecurity",
  },
  {
    index: 40,
    word: "Digital Signature",
    taboo: ["Verify", "Authentic", "Certificate", "Sign", "Cryptographic"],
    explanation:
      "A mathematical scheme for verifying the authenticity and integrity of digital messages.",
    category: "Cybersecurity",
  },
  {
    index: 41,
    word: "Hashing",
    taboo: ["Algorithm", "One-way", "MD5", "SHA", "Digest"],
    explanation:
      "Converting data into a fixed-size string of characters that can't be reversed.",
    category: "Cybersecurity",
  },
  {
    index: 42,
    word: "Salt",
    taboo: ["Random", "Password", "Hash", "Security", "Add"],
    explanation:
      "Random data added to passwords before hashing to make them more secure.",
    category: "Cybersecurity",
  },
  {
    index: 43,
    word: "Sandbox",
    taboo: ["Isolated", "Test", "Environment", "Safe", "Malware"],
    explanation:
      "An isolated environment for safely testing suspicious files or code.",
    category: "Cybersecurity",
  },
  {
    index: 44,
    word: "Whitelisting",
    taboo: ["Allow", "Approved", "List", "Permit", "Authorized"],
    explanation:
      "Only allowing approved applications or users to access a system.",
    category: "Cybersecurity",
  },
  {
    index: 45,
    word: "Blacklisting",
    taboo: ["Block", "Deny", "List", "Banned", "Prohibited"],
    explanation:
      "Blocking known malicious applications, IP addresses, or users.",
    category: "Cybersecurity",
  },
  {
    index: 46,
    word: "Security Baseline",
    taboo: ["Standard", "Configuration", "Minimum", "Requirements", "Policy"],
    explanation: "Minimum security requirements that all systems must meet.",
    category: "Cybersecurity",
  },
  {
    index: 47,
    word: "Incident Response Plan",
    taboo: ["Breach", "Procedure", "Emergency", "Steps", "Playbook"],
    explanation:
      "A documented process for handling security incidents and breaches.",
    category: "Cybersecurity",
  },
  {
    index: 48,
    word: "Forensic Analysis",
    taboo: ["Investigation", "Evidence", "Digital", "Crime", "Examine"],
    explanation:
      "Examining digital evidence to understand and investigate security incidents.",
    category: "Cybersecurity",
  },
  {
    index: 49,
    word: "Security Awareness Training",
    taboo: ["Education", "Employees", "Phishing", "Learn", "Program"],
    explanation:
      "Teaching employees about security threats and best practices.",
    category: "Cybersecurity",
  },
  {
    index: 50,
    word: "Data Loss Prevention",
    taboo: ["DLP", "Protect", "Leak", "Monitor", "Sensitive"],
    explanation:
      "Tools and processes to prevent sensitive data from leaving the organization.",
    category: "Cybersecurity",
  },
  {
    index: 51,
    word: "Encryption at Rest",
    taboo: ["Stored", "Data", "Disk", "Protected", "Secure"],
    explanation: "Encrypting data when it's stored on disk or other media.",
    category: "Cybersecurity",
  },
  {
    index: 52,
    word: "Encryption in Transit",
    taboo: ["Network", "HTTPS", "TLS", "Communication", "Transfer"],
    explanation: "Encrypting data as it travels across networks.",
    category: "Cybersecurity",
  },
  {
    index: 53,
    word: "Security Hardening",
    taboo: ["Strengthen", "Configure", "Reduce", "Attack", "Surface"],
    explanation:
      "Reducing a system's vulnerability by removing unnecessary services and applying security measures.",
    category: "Cybersecurity",
  },
  {
    index: 54,
    word: "Threat Modeling",
    taboo: ["Analysis", "Identify", "Risks", "Assess", "Diagram"],
    explanation:
      "Identifying potential threats to a system and determining countermeasures.",
    category: "Cybersecurity",
  },
];
