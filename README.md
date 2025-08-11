# NYC Elevator Complaints Duration Chart

An interactive visualization of elevator complaint resolution durations across New York City using Svelte, Plotly.js, and D3.js.

## Features

- **Interactive Bar Chart**: Horizontal bar chart showing complaint duration by address
- **Hover Details**: Rich tooltips showing duration, creation date, address, and borough
- **Borough Color Coding**: Each borough has a distinct color for easy identification
- **Click for Details**: Click on any bar to see comprehensive complaint information
- **Responsive Design**: Works on desktop and mobile devices
- **Statistics Dashboard**: Summary cards showing key metrics

## Data Source

The chart visualizes data from `deduped_complaints_with_details - deduped_complaints_with_details.csv.csv`, which contains:
- Duration of elevator complaints
- Creation dates
- Addresses
- Borough information
- Complaint types and status

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Use

1. **Hover over bars** to see quick details about each complaint
2. **Click on any bar** to see comprehensive information in a popup
3. **Use the chart controls** to zoom, pan, or reset the view
4. **View statistics** below the chart for key insights

## Chart Features

- **Duration Axis**: X-axis shows resolution time in hours
- **Address Labels**: Y-axis shows building addresses
- **Color Legend**: Borough-based color coding
- **Interactive Elements**: Hover effects and click events
- **Responsive Layout**: Adapts to different screen sizes

## Data Processing

The application:
- Filters out invalid duration entries
- Converts duration strings to hours
- Sorts complaints by duration (longest first)
- Groups by borough for color coding
- Provides hover and click interactions

## Technologies Used

- **Svelte**: Modern reactive framework
- **Plotly.js**: Interactive charting library
- **D3.js**: Data manipulation and CSV parsing
- **Vite**: Fast build tool and dev server

## File Structure

```
├── src/
│   └── App.svelte          # Main Svelte component
├── index-chart.html        # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## Troubleshooting

- **CSV not loading**: Ensure the CSV file is in the correct location
- **Chart not rendering**: Check browser console for JavaScript errors
- **Dependencies issues**: Run `npm install` to reinstall packages

## Customization

You can modify the chart by editing `src/App.svelte`:
- Change colors in the borough color mapping
- Adjust chart dimensions and margins
- Modify hover templates and click events
- Add new chart types or visualizations
