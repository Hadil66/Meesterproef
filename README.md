# Tauro - Meeting Room Booking Dashboard

![Nuxt](https://img.shields.io/badge/Nuxt-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![v--calendar](https://img.shields.io/badge/v--calendar-007BFF?style=for-the-badge)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-21759B?style=for-the-badge&logo=wordpress&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

The Tauro dashboard enables office renters to easily book meeting rooms within their shared workspace. The entire project was guided by a core principle: simplicity. By focusing on a clean and intuitive user interface, it ensures a frictionless and user-friendly experience for every renter.

This project is a functional prototype demonstrating this concept.
[Live Demo](stage.100leiden.nl)

![Tauro Mockup](https://github.com/user-attachments/assets/59e18c7f-4946-49a7-b519-862784776c92)

---
## Key features
- Interactive calendar view powered by v-calendar.
- Simple, modal-based booking system.
- Real-time availability fetched from a headless WordPress backend.
- Clean, component-based architecture with Nuxt 3.

---
## Tech Stack

*   **Frontend:** Nuxt 3 
*   **Calendar:** [v-calendar](https://vcalendar.io/)
*   **Styling:** Sass
*   **Backend:** WordPress (Headless CMS)

---

## Local Development

Follow these steps to run the project locally.
### 1. Environment Setup
This project requires a connection to a WordPress backend. Create a .env file in the root of the project and add the following variable:
```bash
NUXT_PUBLIC_WP_API_URL="https://stage.100leiden.nl/wp-json"
```

### 2. Install Dependencies

```bash
# Using your preferred package manager
npm install
# or pnpm install / yarn install
```

### 2. Start the Development Server

This will start the server on `http://localhost:3000`.

```bash
npm run dev
# or pnpm dev / yarn dev
```

### 3. Build for Production

This command builds the application for deployment.

```bash
npm run build
# or pnpm build / yarn build 
```

### 4. Preview Production Build

This command lets you preview the production build locally.

```bash
npm run preview
# or pnpm preview / yarn preview / bun run preview
```

---


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
