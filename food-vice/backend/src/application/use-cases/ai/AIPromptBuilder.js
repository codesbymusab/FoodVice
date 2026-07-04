function formatRestaurantsForPrompt(restaurants) {
  return restaurants.map((restaurant) => ({
    id: restaurant._id,
    name: restaurant.name || "",
    cuisines: Array.isArray(restaurant.cuisines)
      ? restaurant.cuisines
      : restaurant.cuisines
      ? [restaurant.cuisines]
      : [],
    priceCategory: restaurant.priceCategory || "",
    distanceKm:
      typeof restaurant.distKm === "number"
        ? Number(restaurant.distKm.toFixed(2))
        : restaurant.distKm || null,
    avgOverall:
      typeof restaurant.avgOverall === "number"
        ? Number(restaurant.avgOverall.toFixed(1))
        : restaurant.avgOverall || null,
    description: restaurant.description || restaurant.name || "",
  }))
}

function buildRecommendationsPrompt(payload) {
  if (!payload || typeof payload.query !== "string") {
    throw new Error("recommendations payload requires query")
  }

  const location = payload.location || {}
  const locationText = `lat:${location.lat || "unknown"}, lon:${location.lon || "unknown"}`
  const restaurants = formatRestaurantsForPrompt(
    Array.isArray(payload.restaurants) ? payload.restaurants : []
  )

  return `You are a restaurant recommendation assistant.
Use the user query and the provided nearby restaurant context to select the best matches.
Respond only with valid JSON and nothing else.

User query: ${payload.query}
Location: ${locationText}
Restaurants: ${JSON.stringify(restaurants)}

Return exactly an array of 3 restaurant objects.
Each object must include:
- id: restaurant id
- name: the restaurant name
- reason: natural user friendly explaining why it matches the user query of 1-2 lines that can be shown to user 
- distanceKm: distance in kilometers
- cuisine: comma-separated cuisine list or main cuisine
- priceCategory

Output example:
[{id:"...","name":"...","reason":"...","distanceKm":1.2,"cuisine":"...","priceCategory":"..."}]`
}

function buildSummaryPrompt(payload) {
  if (!payload || typeof payload.restaurantName !== "string") {
    throw new Error("summary payload requires restaurantName")
  }

  const reviews = Array.isArray(payload.reviews) ? payload.reviews : []
  const reviewSummaryInput = reviews.map((review) => ({
    text: review.text || "",
    rating: review.overallRating || null,
    author: review.user?.name || review.user?.username || "anonymous",
  }))

  return `You are a restaurant review summarizer.
Summarize the restaurant reviews into a single JSON object with verdict, pros, and cons.
Respond strictly with valid JSON and no markdown.

Restaurant: ${payload.restaurantName}
Reviews: ${JSON.stringify(reviewSummaryInput)}

Return exactly one object with these keys:
- verdict: a short overall summary
- pros: an array of positive highlights
- cons: an array of negative points or limitations

Output example:
{"verdict":"...","pros":["..."],"cons":["..."]}`
}

function buildChatPrompt(payload) {
  if (!payload || !Array.isArray(payload.messages)) {
    throw new Error("chat payload requires messages")
  }

  const location = payload.location || {}
  const restaurants = formatRestaurantsForPrompt(
    Array.isArray(payload.restaurants) ? payload.restaurants : []
  )
  const conversation = payload.messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n")

  return `You are a local restaurant assistant.
Use the nearby restaurant context and the conversation history to answer the user's question.
Always respond with valid JSON only.

Location: lat:${location.lat || "unknown"}, lon:${location.lon || "unknown"}
Nearby restaurants: ${JSON.stringify(restaurants)}
Conversation:
${conversation}

Return exactly one object with a single field:
{"response":"..."}`
}

function buildPrompt(type, payload) {
  switch (type) {
    case "recommendations":
      return buildRecommendationsPrompt(payload)
    case "summary":
      return buildSummaryPrompt(payload)
    case "chat":
      return buildChatPrompt(payload)
    default:
      throw new Error(`Unsupported prompt type: ${type}`)
  }
}

module.exports = { buildPrompt }
