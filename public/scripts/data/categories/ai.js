// AI Terms - 38 cards
export const aiTabooList = [
  // start of variety pack
  { index: 1, word: "Agent", taboo: ["AI", "Autonomous", "Task", "LLM", "Action"], explanation: "A system that can perceive its environment and take actions to achieve specific goals independently." },
  { index: 2, word: "Neural Network", taboo: ["Deep Learning", "Layer", "Neurons", "Weights", "Training"], explanation: "A computing system inspired by the human brain that learns patterns from examples." },
  { index: 3, word: "Chain-of-Thought", taboo: ["AI", "Reasoning", "Prompt", "LLM", "Step"], explanation: "A technique where a system breaks down complex problems into intermediate steps before reaching a conclusion." },
  { index: 4, word: "Hallucination", taboo: ["Model", "False", "Output", "Error", "LLM"], explanation: "When an AI system generates information that sounds plausible but is actually incorrect or fabricated." },
  { index: 5, word: "Computer Vision", taboo: ["Image", "Recognition", "AI", "Model", "Analyze"], explanation: "Technology that enables computers to understand and interpret visual information from the world." },
  { index: 6, word: "Natural Language Processing (NLP)", taboo: ["Text", "Model", "Understand", "Linguistics", "Speech"], explanation: "The field of enabling computers to understand, interpret, and generate human language." },
  { index: 7, word: "Deep Learning", taboo: ["Neural", "Network", "AI", "Model", "Complex"], explanation: "A subset of machine learning using multiple layers to progressively extract higher-level features from raw input." },
  { index: 8, word: "Large Language Model", taboo: ["AI", "GPT", "Brain", "Copilot", "Claude"], explanation: "A massive system trained on vast amounts of text that can understand and generate human-like responses." },
  { index: 9, word: "Diffusion Model", taboo: ["AI", "Image", "Generation", "Stable", "Noise"], explanation: "A type of generative system that creates images by gradually removing random noise." },
  { index: 10, word: "Training Data", taboo: ["Dataset", "Model", "Learning", "Examples", "Labels"], explanation: "The collection of examples used to teach a machine learning system how to perform a task." },
  { index: 11, word: "Prompt Engineering", taboo: ["AI", "Input", "Instruction", "LLM", "Query"], explanation: "The practice of crafting effective instructions to get desired outputs from AI systems." },
  { index: 12, word: "Embedding", taboo: ["AI", "Vector", "Representation", "Model", "Similarity"], explanation: "A way of converting words or concepts into numerical representations that capture their meaning." },
  { index: 13, word: "Fine-tuning", taboo: ["AI", "Model", "Training", "Weights", "Better"], explanation: "Adapting a pre-trained system to perform better on a specific task by continuing its learning process." },
  { index: 14, word: "Speech-to-Text", taboo: ["AI", "Transcription", "Audio", "Model", "Voice"], explanation: "Technology that converts spoken words into written text automatically." },
  { index: 15, word: "GPT-4", taboo: ["OpenAI", "Model", "LLM", "AI", "Text"], explanation: "A powerful language system developed by OpenAI capable of understanding and generating human-like text." },
  { index: 16, word: "Retrieval Augmented Generation (RAG)", taboo: ["Document", "AI", "Search", "Context", "LLM"], explanation: "A technique that enhances AI responses by first retrieving relevant information from external sources." },
  // end of variety pack
  { index: 17, word: "HuggingFace", taboo: ["AI", "Models", "Transformers", "Library", "Community"] },
  { index: 18, word: "Inference", taboo: ["Prediction", "Model", "Output", "Runtime", "Deploy"] },
  { index: 19, word: "Diffusers", taboo: ["AI", "Image", "Library", "Stable", "HuggingFace"] },
  { index: 20, word: "Llama", taboo: ["Meta", "AI", "Model", "LLM", "Open Source"] },
  { index: 21, word: "Machine Vision", taboo: ["Image", "Processing", "Analysis", "Recognition", "AI"] },
  { index: 22, word: "Midjourney", taboo: ["AI", "Image", "Generation", "Prompt", "Art"] },
  { index: 23, word: "Multimodal", taboo: ["AI", "Text", "Image", "Audio", "Model"] },
  { index: 24, word: "DALL-E", taboo: ["OpenAI", "Image", "Generation", "AI", "Prompt"] },
  { index: 25, word: "Anthropic", taboo: ["AI", "Claude", "Company", "Safety", "LLM"] },
  { index: 26, word: "Edge AI", taboo: ["Device", "Inference", "Local", "Model", "IoT"] },
  { index: 27, word: "Prompt Injection", taboo: ["AI", "Attack", "Security", "Vulnerability", "Exploit"] },
  { index: 28, word: "Claude", taboo: ["Anthropic", "AI", "Chatbot", "LLM", "Text"]},
  { index: 29, word: "Self-Attention", taboo: ["AI", "Transformer", "Weights", "Focus", "Model"] },
  { index: 30, word: "Small Language Model", taboo: ["Llama", "Compact", "Phi", "AI", "Efficient"] },
  { index: 31, word: "Gemini", taboo: ["Google", "AI", "Model", "LLM", "Chatbot"] },
  { index: 32, word: "Stable Diffusion", taboo: ["AI", "Image", "Model", "Generation", "Open Source"] },
  { index: 33, word: "Synthetic Data", taboo: ["AI", "Fake", "Generated", "Training", "Model"] },
  { index: 34, word: "Diffusion Pipeline", taboo: ["AI", "Image", "Generation", "Steps", "Model"] },
  { index: 35, word: "Transformer", taboo: ["AI", "Model", "Attention", "Neural", "Network"] },
  { index: 36, word: "Vector Database", taboo: ["Embedding", "AI", "Similarity", "Search", "Index"] },
  { index: 37, word: "Voice Assistant", taboo: ["Siri", "Speech", "Recognition", "Alexa", "Help"] },
  { index: 38, word: "Voice Cloning", taboo: ["AI", "Speech", "Synthesis", "Imitate", "Audio"] }
];

aiTabooList.forEach(item => {
  item.category = "AI";
});
