# Payroll Checker

This Next.js application parses CSV timecard data, groups entries by agent and date, and displays them in an interactive table.

## Getting Started

If you're new to development, you'll need to install Node.js and npm (Node Package Manager) first. You can download them from [https://nodejs.org/](https://nodejs.org/).

Once you have Node.js and npm installed, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/your-repository.git
```

(Replace `https://github.com/your-username/your-repository.git` with the actual repository URL.)

2. **Navigate to the project directory:**

```bash
cd your-repository
```

(Replace `your-repository` with the name of the cloned directory.)

3. **Install dependencies:**

```bash
npm install
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open in browser:** Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

6. **Paste CSV Data:** Paste your timecard data in CSV format into the textarea and click "Process CSV".

## Features

- Parses timecard data from CSV input.
- Groups entries by agent and date.
- Displays entries in a sortable table.
- Provides separate tabs for each agent.
- Highlights logons, logoffs, and auxiliary reasons.
- Calculates and displays durations.
- **New:** Improved error handling for CSV parsing.
- **New:** Enhanced user interface with `Combobox` for agent selection.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- date-fns (for date formatting)
- Papa Parse (for CSV parsing)
- Lodash (for utility functions)

## Project Structure

- **`src/app`:** Contains the main application logic and pages.
    - `page.tsx`: Renders the TimecardView component.
- **`src/components`:** Reusable UI components.
    - `TimeCardView.tsx`: Core component for processing and displaying timecard data.
    - `ui/tabs.tsx`:  Provides the tabbed interface.
- **`src/lib`:** Utility functions and helpers.
- **`public`:** Static assets.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
