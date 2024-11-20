# Payroll Checker

This Next.js application parses CSV timecard data, groups entries by agent and date, and displays them in an interactive table.

## Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open in browser:** Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

4. **Paste CSV Data:** Paste your timecard data in CSV format into the textarea and click "Process CSV".


## Features

- Parses timecard data from CSV input.
- Groups entries by agent and date.
- Displays entries in a sortable table.
- Provides separate tabs for each agent.
- Highlights logons, logoffs, and auxiliary reasons.
- Calculates and displays durations.


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
