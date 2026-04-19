// AI Terms - 38 cards
import type { TabooWord } from "../../../types/taboo";

export const aiTabooList: TabooWord[] = [
  // start of variety pack
  {
    index: 1,
    word: "Agent",
    taboo: ["AI", "Autonomous", "Task", "LLM", "Action"],
    explanation:
      "A system that can perceive its environment and take actions to achieve specific goals independently.",
    category: "AI",
  },
  {
    index: 2,
    word: "Neural Network",
    taboo: ["Deep Learning", "Layer", "Neurons", "Weights", "Training"],
    explanation:
      "A computing system inspired by the human brain that learns patterns from examples.",
    category: "AI",
  },
  {
    index: 3,
    word: "Chain-of-Thought",
    taboo: ["AI", "Reasoning", "Prompt", "LLM", "Step"],
    explanation:
      "A technique where a system breaks down complex problems into intermediate steps before reaching a conclusion.",
    category: "AI",
  },
  {
    index: 4,
    word: "Hallucination",
    taboo: ["Model", "False", "Output", "Error", "LLM"],
    explanation:
      "When an AI system generates information that sounds plausible but is actually incorrect or fabricated.",
    category: "AI",
  },
  {
    index: 5,
    word: "Computer Vision",
    taboo: ["Image", "Recognition", "AI", "Model", "Analyze"],
    explanation:
      "Technology that enables computers to understand and interpret visual information from the world.",
    category: "AI",
  },
  {
    index: 6,
    word: "Natural Language Processing",
    taboo: ["Text", "Model", "Understand", "Linguistics", "Speech"],
    explanation:
      "The field of enabling computers to understand, interpret, and generate human language.",
    category: "AI",
  },
  {
    index: 7,
    word: "Deep Learning",
    taboo: ["Neural", "Network", "AI", "Model", "Complex"],
    explanation:
      "A subset of machine learning using multiple layers to progressively extract higher-level features from raw input.",
    category: "AI",
  },
  {
    index: 8,
    word: "Large Language Model",
    taboo: ["AI", "GPT", "Brain", "Copilot", "Claude"],
    explanation:
      "A massive system trained on vast amounts of text that can understand and generate human-like responses.",
    category: "AI",
  },
  {
    index: 9,
    word: "Diffusion Model",
    taboo: ["AI", "Image", "Generation", "Stable", "Noise"],
    explanation:
      "A type of generative system that creates images by gradually removing random noise.",
    category: "AI",
  },
  {
    index: 10,
    word: "Training Data",
    taboo: ["Dataset", "Model", "Learning", "Examples", "Labels"],
    explanation:
      "The collection of examples used to teach a machine learning system how to perform a task.",
    category: "AI",
  },
  {
    index: 11,
    word: "Prompt Engineering",
    taboo: ["AI", "Input", "Instruction", "LLM", "Query"],
    explanation:
      "The practice of crafting effective instructions to get desired outputs from AI systems.",
    category: "AI",
  },
  {
    index: 12,
    word: "Embedding",
    taboo: ["AI", "Vector", "Representation", "Model", "Similarity"],
    explanation:
      "A way of converting words or concepts into numerical representations that capture their meaning.",
    category: "AI",
  },
  {
    index: 13,
    word: "Fine-tuning",
    taboo: ["AI", "Model", "Training", "Weights", "Better"],
    explanation:
      "Adapting a pre-trained system to perform better on a specific task by continuing its learning process.",
    category: "AI",
  },
  {
    index: 14,
    word: "Speech-to-Text",
    taboo: ["AI", "Transcription", "Audio", "Model", "Voice"],
    explanation:
      "Technology that converts spoken words into written text automatically.",
    category: "AI",
  },
  {
    index: 15,
    word: "GPT-4",
    taboo: ["OpenAI", "Model", "LLM", "AI", "Text"],
    explanation:
      "A powerful language system developed by OpenAI capable of understanding and generating human-like text.",
    category: "AI",
  },
  {
    index: 16,
    word: "Retrieval Augmented Generation",
    taboo: ["Document", "AI", "Search", "Context", "LLM"],
    explanation:
      "A technique that enhances AI responses by first retrieving relevant information from external sources.",
    category: "AI",
  },
  {
    index: 17,
    word: "HuggingFace",
    taboo: ["AI", "Models", "Transformers", "Library", "Community"],
    explanation:
      "An open-source platform for sharing, discovering, and using machine learning models and datasets.",
    category: "AI",
  },
  {
    index: 18,
    word: "Inference",
    taboo: ["Prediction", "Model", "Output", "Runtime", "Deploy"],
    explanation:
      "Running a trained AI model on new data to produce predictions or outputs.",
    category: "AI",
  },
  {
    index: 19,
    word: "Diffusers",
    taboo: ["AI", "Image", "Library", "Stable", "HuggingFace"],
    explanation:
      "A library for running diffusion-based AI image generation models.",
    category: "AI",
  },
  {
    index: 20,
    word: "Llama",
    taboo: ["Meta", "AI", "Model", "LLM", "Open Source"],
    explanation:
      "A family of open-source large language models released by Meta.",
    category: "AI",
  },
  {
    index: 21,
    word: "Machine Vision",
    taboo: ["Image", "Processing", "Analysis", "Recognition", "AI"],
    explanation:
      "AI systems that interpret and understand visual information from images or video.",
    category: "AI",
  },
  {
    index: 22,
    word: "Midjourney",
    taboo: ["AI", "Image", "Generation", "Prompt", "Art"],
    explanation: "An AI tool that generates images from text descriptions.",
    category: "AI",
  },
  {
    index: 23,
    word: "Multimodal",
    taboo: ["AI", "Text", "Image", "Audio", "Model"],
    explanation:
      "An AI system that can process and understand multiple types of input, such as text, images, and audio together.",
    category: "AI",
  },
  {
    index: 24,
    word: "DALL-E",
    taboo: ["OpenAI", "Image", "Generation", "AI", "Prompt"],
    explanation:
      "OpenAI's AI model that creates images from text descriptions.",
    category: "AI",
  },
  {
    index: 25,
    word: "Anthropic",
    taboo: ["AI", "Claude", "Company", "Safety", "LLM"],
    explanation:
      "An AI safety company and the creator of the Claude AI assistant.",
    category: "AI",
  },
  {
    index: 26,
    word: "Edge AI",
    taboo: ["Device", "Inference", "Local", "Model", "IoT"],
    explanation:
      "Running AI models locally on devices rather than sending data to the cloud.",
    category: "AI",
  },
  {
    index: 27,
    word: "Prompt Injection",
    taboo: ["AI", "Attack", "Security", "Vulnerability", "Exploit"],
    explanation:
      "An attack where malicious input is crafted to manipulate an AI model's behavior.",
    category: "AI",
  },
  {
    index: 28,
    word: "Claude",
    taboo: ["Anthropic", "AI", "Chatbot", "LLM", "Text"],
    explanation:
      "An AI assistant created by Anthropic, designed to be helpful, harmless, and honest.",
    category: "AI",
  },
  {
    index: 29,
    word: "Self-Attention",
    taboo: ["AI", "Transformer", "Weights", "Focus", "Model"],
    explanation:
      "A mechanism that lets a model weigh the importance of different parts of its input when processing each element.",
    category: "AI",
  },
  {
    index: 30,
    word: "Small Language Model",
    taboo: ["Llama", "Compact", "Phi", "AI", "Efficient"],
    explanation:
      "A compact AI language model designed to run efficiently with fewer computing resources.",
    category: "AI",
  },
  {
    index: 31,
    word: "Gemini",
    taboo: ["Google", "AI", "Model", "LLM", "Chatbot"],
    explanation:
      "Google's family of multimodal AI models capable of understanding text, images, and more.",
    category: "AI",
  },
  {
    index: 32,
    word: "Stable Diffusion",
    taboo: ["AI", "Image", "Model", "Generation", "Open Source"],
    explanation:
      "An open-source AI model that generates images from text prompts.",
    category: "AI",
  },
  {
    index: 33,
    word: "Synthetic Data",
    taboo: ["AI", "Fake", "Generated", "Training", "Model"],
    explanation:
      "Artificially generated data used to train or test AI models instead of real-world data.",
    category: "AI",
  },
  {
    index: 34,
    word: "Diffusion Pipeline",
    taboo: ["AI", "Image", "Generation", "Steps", "Model"],
    explanation:
      "A sequence of steps used in AI image generation models to progressively create images from noise.",
    category: "AI",
  },
  {
    index: 35,
    word: "Transformer",
    taboo: ["AI", "Model", "Attention", "Neural", "Network"],
    explanation:
      "A neural network architecture using attention mechanisms that is foundational to modern AI models.",
    category: "AI",
  },
  {
    index: 36,
    word: "Vector Database",
    taboo: ["Embedding", "AI", "Similarity", "Search", "Index"],
    explanation:
      "A database optimized for storing and searching high-dimensional vector embeddings.",
    category: "AI",
  },
  {
    index: 37,
    word: "Voice Assistant",
    taboo: ["Siri", "Speech", "Recognition", "Alexa", "Help"],
    explanation:
      "AI-powered software that understands spoken commands and responds verbally.",
    category: "AI",
  },
  {
    index: 38,
    word: "Voice Cloning",
    taboo: ["AI", "Speech", "Synthesis", "Imitate", "Audio"],
    explanation:
      "An AI technique that replicates a specific person's voice from audio samples.",
    category: "AI",
  },
  // end of variety pack
  {
    index: 39,
    word: "Overfitting",
    taboo: ["Model", "Training", "Generalize", "Bias", "Variance"],
    explanation:
      "When a model learns training data too precisely and performs poorly on new, unseen data.",
    category: "AI",
  },
  {
    index: 40,
    word: "Underfitting",
    taboo: ["Model", "Training", "Simple", "Bias", "Variance"],
    explanation:
      "When a model is too simple to capture patterns in the data, resulting in poor performance.",
    category: "AI",
  },
  {
    index: 41,
    word: "Zero-Shot Learning",
    taboo: ["AI", "Model", "Unseen", "Prompt", "Examples"],
    explanation:
      "The ability of a model to handle tasks it was never explicitly trained on.",
    category: "AI",
  },
  {
    index: 42,
    word: "Few-Shot Learning",
    taboo: ["AI", "Model", "Examples", "Prompt", "Training"],
    explanation:
      "Training an AI model to learn a new task from only a handful of examples.",
    category: "AI",
  },
  {
    index: 43,
    word: "One-Shot Learning",
    taboo: ["AI", "Model", "Example", "Single", "Training"],
    explanation:
      "An AI technique where a model learns to recognize something from a single example.",
    category: "AI",
  },
  {
    index: 44,
    word: "Transfer Learning",
    taboo: ["Model", "Pretrained", "Adapt", "Fine-tune", "Reuse"],
    explanation:
      "Reusing a model trained on one task as a starting point for a different task.",
    category: "AI",
  },
  {
    index: 45,
    word: "Supervised Learning",
    taboo: ["AI", "Labels", "Training", "Classification", "Regression"],
    explanation:
      "Training an AI model using labeled input-output pairs so it learns to map inputs to correct answers.",
    category: "AI",
  },
  {
    index: 46,
    word: "Unsupervised Learning",
    taboo: ["AI", "Clustering", "Training", "Unlabeled", "Pattern"],
    explanation:
      "Training an AI model on data without labels, letting it discover patterns on its own.",
    category: "AI",
  },
  {
    index: 47,
    word: "Classification",
    taboo: ["Model", "Category", "Label", "Predict", "Type"],
    explanation:
      "An AI task of assigning input data into predefined categories or classes.",
    category: "AI",
  },
  {
    index: 48,
    word: "Model Evaluation",
    taboo: ["Testing", "Metrics", "Performance", "Accuracy", "Validation"],
    explanation:
      "Measuring how well an AI model performs on unseen data using metrics like accuracy.",
    category: "AI",
  },
  {
    index: 49,
    word: "Bias in AI",
    taboo: ["Fairness", "Model", "Discrimination", "Ethics", "Unfair"],
    explanation:
      "Systematic errors in AI outputs caused by skewed training data or flawed design choices.",
    category: "AI",
  },
  {
    index: 50,
    word: "Batch Normalization",
    taboo: ["Layer", "Training", "Neural", "Network", "Normalize"],
    explanation:
      "A technique that stabilizes neural network training by normalizing inputs within each layer.",
    category: "AI",
  },
  {
    index: 51,
    word: "Activation Function",
    taboo: ["Neural", "Network", "ReLU", "Sigmoid", "Layer"],
    explanation:
      "A mathematical function that determines whether a neuron should fire in a neural network.",
    category: "AI",
  },
  {
    index: 52,
    word: "Gradient Descent",
    taboo: ["Optimization", "Training", "Minimize", "Loss", "Learning"],
    explanation:
      "An optimization algorithm that iteratively adjusts model weights to minimize prediction errors.",
    category: "AI",
  },
];
