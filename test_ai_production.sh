#!/bin/bash

# Test AI Tutor on Railway production
BACKEND_URL="https://group-04-project-production.up.railway.app"

echo "🌐 Testing AI Tutor on Production (Railway)..."
echo "Backend: $BACKEND_URL"
echo ""

# Test 1: Research methods
echo "📝 Test 1: User research methods..."
curl -X POST $BACKEND_URL/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Explain empathy mapping and journey mapping",
    "lessonId": "2",
    "learnerId": "1",
    "sessionId": "prod-test"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 2: Prototyping
echo "📝 Test 2: Prototyping methods..."
curl -X POST $BACKEND_URL/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the different types of prototypes I can use?",
    "lessonId": "3",
    "learnerId": "1",
    "sessionId": "prod-test",
    "intent": "example"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 3: Design Systems
echo "📝 Test 3: Design systems..."
curl -X POST $BACKEND_URL/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is atomic design methodology?",
    "lessonId": "4",
    "learnerId": "1",
    "sessionId": "prod-test"
  }' | jq '.'

echo ""
echo "✅ Production AI Tutor tests completed!"
