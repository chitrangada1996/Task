
# TaskMate - Task Management MVP

TaskMate is a minimal, fast task management MVP for product managers. It combines the simplicity of Linear with the flexible workspace of Notion, built with React, TypeScript, and Tailwind CSS.

## Features

-   **Kanban Board:** A drag-and-drop board with customizable columns.
-   **Command Palette:** Quickly search and navigate tasks and pages with `Cmd/Ctrl+K`.
-   **Task Details:** View and edit task details in a clean modal.
-   **Local Persistence:** Your board state is automatically saved to your browser's `localStorage`.
-   **Keyboard First:** Designed for speed with extensive keyboard shortcuts.

## Tech Stack

-   **Framework:** React 18 + TypeScript + Vite
-   **Styling:** Tailwind CSS
-   **Drag & Drop:** `@dnd-kit`
-   **Fuzzy Search:** `fuse.js`
-   **Icons:** `lucide-react`

---

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/taskmate.git
    cd taskmate
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be running at `http://localhost:5173`.

---

## Keyboard Shortcuts

| Shortcut          | Action                              |
| ----------------- | ----------------------------------- |
| `Cmd/Ctrl + K`    | Open Command Palette                |
| `Esc`             | Close Modal or Command Palette      |
| `Arrow Up/Down`   | Navigate items in Command Palette   |
| `Enter`           | Select item or open focused task    |

---

## LocalStorage Persistence

This application uses the browser's `localStorage` to persist the state of the Kanban board. All data is stored locally on your machine under the key `taskmate_board_v1`. Clearing your browser's site data will reset the board.

---

## Future Backend Integration (e.g., Firebase)

The current version uses a mock API located in `src/services/api.ts`. This file is designed to be easily swappable with a real backend service.

To switch to a Firebase backend:

1.  **Set up a Firebase project** and enable Firestore.
2.  **Install the Firebase SDK:** `npm install firebase`.
3.  **Replace the contents of `src/services/api.ts`:**
    -   Initialize the Firebase app.
    -   Update the `fetchTasks`, `updateTask`, etc., functions to interact with your Firestore collections instead of mock data.
    -   Ensure the functions continue to return Promises with data in the same format (`Task[]`, `Task`, etc.).

The rest of the application is decoupled from the data source and will work seamlessly with the new API service.
