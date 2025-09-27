# Interactive 3D Portfolio

This is an interactive 3D portfolio website designed to showcase projects and skills in a visually engaging manner. The application is built with a modern tech stack, featuring a 3D scene, dynamic animations, and a responsive user interface.

## 🚀 Core Technologies

- **React:** A JavaScript library for building user interfaces.
- **Three.js (@react-three/fiber):** A powerful 3D graphics library for creating and displaying animated 3D computer graphics in a web browser.
- **GSAP (GreenSock Animation Platform):** A robust JavaScript library for creating high-performance animations.
- **TailwindCSS:** A utility-first CSS framework for rapid UI development.
- **Vite:** A fast build tool and development server.
- **TypeScript:** A statically typed superset of JavaScript.

## ✨ Features

- **Interactive 3D Scene:** A central 3D scene that includes a custom-loaded model. See `src/components/Scene.tsx`.
- **Dynamic Camera Control:** The camera position changes dynamically based on the user's navigation through different sections of the portfolio. Implemented in `src/components/Scene.tsx`.
- **Particle System:** An ambient particle effect that adds depth and visual appeal to the scene. See `src/components/Particles.tsx`.
- **Custom Mouse Effect:** A custom cursor that provides visual feedback when hovering over interactive elements. See `src/components/MouseEffect.tsx`.
- **Responsive Navigation:** A collapsible sidebar for easy navigation that adapts to different screen sizes. See `src/components/Buttons.tsx`.
- **Offline Support:** A service worker caches static assets, allowing the site to work offline. See `src/serviceWorker.ts`.

## 📂 Project Structure

```
/
├── public/
│   └── Template.glb      # 3D model asset
├── src/
│   ├── assets/           # Static assets like images and fonts
│   ├── components/       # Reusable React components
│   │   ├── Buttons.tsx
│   │   ├── MouseEffect.tsx
│   │   ├── Particles.tsx
│   │   └── Scene.tsx
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point of the application
│   └── serviceWorker.ts  # Service worker for PWA features
├── index.html
├── package.json
└── README.md
```

## 🛠 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (or your preferred package manager like Yarn or pnpm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## 📜 Available Scripts

In the project directory, you can run the following commands:

-   **`npm run dev`**
    Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser. The page will reload if you make edits.

-   **`npm run build`**
    Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

-   **`npm run preview`**
    Serves the production build locally to preview it before deployment.

-   **`npm run lint`**
    Lints the source code using ESLint to find and fix problems in your code.

-   **`npm run typecheck`**
    Runs the TypeScript compiler to check for type errors without emitting files.

-   **`npm run test`**
    Runs the test suite using Vitest.

-   **`npm run test:watch`**
    Runs the tests in interactive watch mode.

-   **`npm run test:coverage`**
    Generates a test coverage report.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improving the project, please feel free to create an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).