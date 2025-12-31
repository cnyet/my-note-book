#!/bin/bash

# AI Life Assistant - Start Development Servers

echo "🚀 Starting AI Life Assistant Development Servers..."
echo ""

# Check if virtual environment is activated
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Virtual environment not activated"
    echo "Activating venv..."
    source venv/bin/activate
fi

# Start Backend API Server
echo "📡 Starting Backend API Server (Port 8000)..."
python3 -m uvicorn api.server:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:8000/api/status > /dev/null; then
    echo "   ✅ Backend API is running at http://localhost:8000"
else
    echo "   ⚠️  Backend API may not be running properly"
fi

echo ""

# Start Frontend Development Server
echo "🎨 Starting Frontend Development Server (Port 3000)..."
cd web-app
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ Servers started!"
echo ""
echo "📍 Access points:"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   - Backend: Check terminal output"
echo "   - Frontend: Check terminal output"
echo "   - Auth Events: logs/auth_events.log"
echo ""

# Keep script running
wait
