#!/bin/bash

# Quick AI Tutor Test Script
# Run this after backend is started

echo "🤖 Testing AI Tutor with detailed lesson content..."
echo ""

# Test 1: Research methods (should work - in scope)
echo "📝 Test 1: Asking about user research methods..."
curl -X POST http://localhost:4000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Explain user research methods to me",
    "lessonId": "2",
    "learnerId": "1",
    "sessionId": "test-session"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 2: Prototyping example (should work - in scope)
echo "📝 Test 2: Asking for prototyping examples..."
curl -X POST http://localhost:4000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Give me an example of prototyping",
    "lessonId": "3",
    "learnerId": "1",
    "sessionId": "test-session",
    "intent": "example"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 3: Off-topic question (should reject)
echo "📝 Test 3: Asking off-topic question (should reject)..."
curl -X POST http://localhost:4000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the weather today?",
    "lessonId": "1",
    "learnerId": "1",
    "sessionId": "test-session"
  }' | jq '.'

echo ""
echo "---"
echo ""

# Test 4: Assignment question
echo "📝 Test 4: Asking about assignment..."
curl -X POST http://localhost:4000/api/tutor/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How should I approach the Design Reflection assignment?",
    "lessonId": "1",
    "learnerId": "1",
    "sessionId": "test-session"
  }' | jq '.'

echo ""
echo "✅ AI Tutor tests completed!"
