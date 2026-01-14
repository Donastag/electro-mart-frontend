import { GoogleGenAI } from "@google/genai";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Queue system to prevent rate limiting
const requestQueue: Array<() => Promise<void>> = [];
let isProcessing = false;
const RATE_LIMIT_DELAY = 4000;

const processQueue = async () => {
  if (isProcessing) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const task = requestQueue.shift();
    if (task) {
      await task();
      await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  isProcessing = false;
};

// Initialize Gemini AI
const getGeminiClient = () => {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
};

// Generate product image
export async function generateProductImage(productName: string): Promise<string | null> {
  return new Promise((resolve) => {
    const task = async () => {
      try {
        const ai = getGeminiClient();

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `Professional studio product photography of ${productName}, isolated on a clean white background, high resolution, commercial advertisement style, cinematic lighting, 4k.` }],
          },
          config: { imageConfig: { aspectRatio: "1:1" } }
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            resolve(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }
        if (!foundImage) resolve(null);

      } catch (error: any) {
        console.warn(`Generation failed/skipped for ${productName}.`);
        resolve(null);
      }
    };

    requestQueue.push(task);
    processQueue();
  });
};

// Generate text embeddings using Gemini
export async function generateEmbedding(text: string): Promise<number[] | null> {
  try {
    const ai = getGeminiClient();

    const result = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: [{ role: 'user', parts: [{ text }] }],
    });

    if (result.embeddings?.[0]?.values) {
      return result.embeddings[0].values;
    }
    return null;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

// Generate combined text for product embedding
export const generateProductEmbeddingText = (product: {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}): string => {
  const parts = [
    product.name,
    product.description || '',
    product.category || '',
  ];

  if (product.tags && product.tags.length > 0) {
    parts.push(product.tags.join(' '));
  }

  return parts.filter(Boolean).join(' ').trim();
};

// Create/update product embeddings in database
export async function createProductEmbedding(
  productId: string,
  embedding: number[],
  contentType: string = 'combined'
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping embedding creation');
    return false;
  }

  try {
    const vectorString = `[${embedding.join(',')}]`;

    const { error } = await supabase
      .from('product_embeddings')
      .upsert({
        product_id: productId,
        embedding: vectorString,
        content_type: contentType,
      });

    if (error) {
      console.error('Embedding creation error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Embedding upsert failed:', error);
    return false;
  }
}

// Process and embed all products (for initial setup)
export async function processAllProductsForEmbeddings(): Promise<{ success: number; failed: number }> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping product embedding processing');
    return { success: 0, failed: 0 };
  }

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        categories (
          name
        ),
        tags
      `)
      .eq('is_active', true);

    if (error || !products) {
      console.error('Failed to fetch products:', error);
      return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        const text = generateProductEmbeddingText({
          name: product.name,
          description: product.description || '',
          category: product.categories?.name,
          tags: product.tags,
        });

        if (text) {
          const embedding = await generateEmbedding(text);
          if (embedding) {
            const created = await createProductEmbedding(product.id, embedding);
            if (created) {
              success++;
            } else {
              failed++;
            }
          } else {
            failed++;
          }
        } else {
          failed++;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.error(`Failed to process product ${product.id}:`, err);
        failed++;
      }
    }

    return { success, failed };
  } catch (error) {
    console.error('Batch embedding processing failed:', error);
    return { success: 0, failed: 1 };
  }
}

// Semantic search interface
export interface SemanticSearchResult {
  product_id: string;
  similarity: number;
  product_name: string;
  product_description: string;
  category_name: string;
  price: number;
}

// Semantic product search
export async function semanticSearch(query: string, limit: number = 20): Promise<SemanticSearchResult[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping semantic search');
    return [];
  }

  try {
    // Generate embedding for the query
    const embedding = await generateEmbedding(query);
    if (!embedding) return [];

    // Convert to PostgreSQL vector format
    const vectorString = `[${embedding.join(',')}]`;

    // Call the database function
    const { data, error } = await supabase.rpc('search_products_semantic', {
      query_embedding: vectorString,
      match_threshold: 0.1,
      max_results: limit,
    });

    if (error) {
      console.error('Semantic search error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Semantic search failed:', error);
    return [];
  }
}

// Recommendation interface
export interface ProductRecommendation {
  product_id: string;
  product_name: string;
  product_description: string;
  category_name: string;
  price: number;
  similarity: number;
}

// Get product recommendations
export async function getProductRecommendations(productId: string, limit: number = 10): Promise<ProductRecommendation[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, skipping product recommendations');
    return [];
  }

  try {
    const { data, error } = await supabase.rpc('get_product_recommendations', {
      base_product_id: productId,
      max_results: limit,
      similarity_threshold: 0.5,
    });

    if (error) {
      console.error('Recommendation error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Recommendations failed:', error);
    return [];
  }
}

// Chatbot conversation interface
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Customer support chatbot
export async function chatWithAssistant(
  messages: ChatMessage[],
  context?: {
    customerName?: string;
    currentPage?: string;
    cartItems?: any[];
  }
): Promise<string> {
  try {
    const ai = getGeminiClient();

    // Build context
    let systemPrompt = `You are Elecro.Mart AI assistant, helping customers with their e-commerce questions.
You specialize in electronics, gadgets, and consumer products.
Be helpful, friendly, and knowledgeable about tech products.
Keep responses concise but informative.`;

    if (context) {
      systemPrompt += `\n\nCustomer context:
- Customer: ${context.customerName || 'Not logged in'}
- Current page: ${context.currentPage || 'Unknown'}
- Cart items: ${context.cartItems ? context.cartItems.length : 0}`;

      if (context.cartItems && context.cartItems.length > 0) {
        systemPrompt += `\n- Cart products: ${context.cartItems.map(item => item.product.name).join(', ')}`;
      }
    }

    // Build conversation history
    const conversationParts = [{ text: systemPrompt }];

    messages.forEach(msg => {
      conversationParts.push({
        text: `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}`,
      });
    });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: conversationParts }],
    });

    const candidates = response?.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text || '';
    return text || "I apologize, but I'm unable to provide an answer right now. Please contact our support team.";
  } catch (error) {
    console.error('Chat error:', error);
    return "I'm experiencing technical difficulties. Please try again or contact our support team.";
  }
}

// Generate product description enhancement
export async function enhanceProductDescription(productName: string, existingDescription?: string): Promise<string | null> {
  try {
    const ai = getGeminiClient();

    const prompt = `Create an engaging, informative product description for: ${productName}

${existingDescription ? `Existing description: ${existingDescription}` : 'No existing description available'}

Write a compelling 2-3 sentence product description that highlights key features, benefits, and value proposition.
Focus on quality, performance, and customer satisfaction.
Keep it professional and suitable for e-commerce.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const candidates = response?.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text || '';

    return text?.trim() || null;
  } catch (error) {
    console.error('Description enhancement error:', error);
    return null;
  }
}

// Generate product tags for better categorization
export async function generateProductTags(productName: string, description: string): Promise<string[]> {
  try {
    const ai = getGeminiClient();

    const prompt = `Generate 5-8 relevant keywords/tags for this product that would improve discoverability:

Product: ${productName}
Description: ${description}

Return only the keywords separated by commas, no explanations or quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const candidates = response?.candidates;
    const text = candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (text) {
      return text.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0)
        .slice(0, 8);
    }

    return [];
  } catch (error) {
    console.error('Tag generation error:', error);
    return [];
  }
}
