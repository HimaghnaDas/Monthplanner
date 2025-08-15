# 📅 Month View Task Planner

A beautiful, interactive monthly task planner built with React and TypeScript. Plan, organize, and track your tasks with an intuitive drag-and-drop calendar interface.

![Month Task Planner](https://img.shields.io/badge/React-18.0+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)

## 🚀 Live Demo
<img width="950" height="801" alt="image" src="https://github.com/user-attachments/assets/a6256102-dc54-4611-9e71-7691b0ebbc46" />

**[View Live Demo](https://monthplanner.vercel.app/)**

## ✨ Features

### 🎯 Task Management
- **Create Tasks**: Click and drag across calendar days to create new tasks
- **Edit Tasks**: Double-click any task to modify its details
- **Move Tasks**: Drag tasks to different dates effortlessly
- **Resize Tasks**: Adjust task duration by dragging the edges

### 🏷️ Task Categories
- **📋 To Do** - New tasks that need to be started
- **⚡ In Progress** - Tasks currently being worked on
- **👀 Review** - Tasks pending review or approval
- **✅ Completed** - Finished tasks

### 🔍 Smart Filtering
- **Search**: Find tasks quickly by name
- **Category Filter**: Show/hide tasks by category
- **Time Range**: Filter by upcoming weeks (1, 2, or 3 weeks)

### 🎨 Modern UI/UX
- **Beautiful Gradients**: Eye-catching color schemes for each category
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works perfectly on desktop and mobile
- **Intuitive Interactions**: Drag-and-drop functionality
- **Today Highlighting**: Current date is clearly marked

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: CSS
- **Icons**: Lucide React
- **Date Handling**: Custom utility functions
- **State Management**: React Hooks (useState, useCallback, useMemo)

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HimaghnaDas/Monthplanner.git
cd task-planner
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npm start
# or
yarn start
```

4. **Open your browser**
Navigate to `http://localhost:5173` to see the application.

## 📖 Usage Guide

### Creating Tasks
1. Click and drag across one or more calendar days
2. Release to open the task creation modal
3. Enter task name and select category
4. Click "Create Task" to save

### Managing Tasks
- **Edit**: Double-click any task to modify
- **Move**: Single-click and drag tasks to new dates
- **Resize**: Hover over task edges and drag to adjust duration

### Filtering Tasks
- Use the search bar to find specific tasks
- Toggle categories on/off using checkboxes
- Select time range filters to focus on upcoming tasks

## 🎨 Customization


## 🏗️ Project Structure

```
src/
├── components/
│   ├── MonthViewTaskPlanner.tsx    # Main component
|   |__ MonthViewTaskPlanner.css
|
├── types/
│   └── index.ts                    # TypeScript type definitions
|── utils/
    └── dateUtils.ts                # Date manipulation utilities
    |__ taskUtils.ts
```

