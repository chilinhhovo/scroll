<script>
  import { onMount } from 'svelte';
  import Plotly from 'plotly.js-dist';
  import * as d3 from 'd3';
  
  let chartContainer;
  let chartData = [];
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      await loadData();
      createChart();
    } catch (err) {
      error = err.message;
      loading = false;
    }
  });
  
  async function loadData() {
    try {
      const response = await fetch('/deduped_complaints_with_details - deduped_complaints_with_details.csv.csv');
      const csvText = await response.text();
      
      // Parse CSV using D3
      const parsedData = d3.csvParse(csvText);
      
      // Filter out rows with invalid duration and convert duration to hours
      chartData = parsedData
        .filter(row => row.duration && row.duration !== '0:00:00' && row['Created Date'] && row['Incident Address'])
        .map(row => {
          const duration = parseDuration(row.duration);
          const createdDate = new Date(row['Created Date']);
          const address = row['Incident Address'];
          
          return {
            duration: duration,
            createdDate: createdDate,
            address: address,
            borough: row.Borough || 'Unknown',
            complaintType: row['Complaint Type'] || 'Unknown',
            status: row.Status || 'Unknown'
          };
        })
        .filter(row => row.duration > 0) // Only include valid durations
        .sort((a, b) => b.duration - a.duration); // Sort by duration descending
      
      loading = false;
    } catch (err) {
      throw new Error('Failed to load CSV data: ' + err.message);
    }
  }
  
  function parseDuration(durationStr) {
    if (!durationStr || durationStr === '0:00:00') return 0;
    
    // Handle different duration formats
    const parts = durationStr.split(':');
    if (parts.length === 3) {
      // Format: HH:MM:SS
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      return hours + (minutes / 60) + (seconds / 3600);
    } else if (parts.length === 2) {
      // Format: MM:SS
      const minutes = parseInt(parts[0]) || 0;
      const seconds = parseInt(parts[1]) || 0;
      return (minutes / 60) + (seconds / 3600);
    }
    
    return 0;
  }
  
  function createChart() {
    if (!chartContainer || chartData.length === 0) return;
    
    // Prepare data for Plotly
    const trace = {
      x: chartData.map(d => d.duration),
      y: chartData.map(d => d.address),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: chartData.map(d => {
          // Color by borough
          const colors = {
            'BRONX': '#ff6b6b',
            'BROOKLYN': '#4ecdc4',
            'MANHATTAN': '#45b7d1',
            'QUEENS': '#96ceb4',
            'STATEN ISLAND': '#feca57'
          };
          return colors[d.borough] || '#95a5a6';
        }),
        line: {
          color: '#2c3e50',
          width: 1
        }
      },
      text: chartData.map(d => 
        `Duration: ${d.duration.toFixed(1)} hours<br>` +
        `Created: ${d.createdDate.toLocaleDateString()}<br>` +
        `Address: ${d.address}<br>` +
        `Borough: ${d.borough}`
      ),
      textposition: 'none',
      hoverinfo: 'text',
      hovertemplate: 
        '<b>%{text}</b><br>' +
        '<extra></extra>'
    };
    
    const layout = {
      title: {
        text: 'Elevator Complaint Resolution Duration by Address',
        font: { size: 24, color: '#2c3e50' }
      },
      xaxis: {
        title: 'Duration (hours)',
        titlefont: { size: 16, color: '#2c3e50' },
        tickfont: { size: 12, color: '#2c3e50' },
        gridcolor: '#ecf0f1'
      },
      yaxis: {
        title: 'Address',
        titlefont: { size: 16, color: '#2c3e50' },
        tickfont: { size: 10, color: '#2c3e50' },
        gridcolor: '#ecf0f1'
      },
      plot_bgcolor: '#ffffff',
      paper_bgcolor: '#ffffff',
      margin: { l: 200, r: 50, t: 80, b: 80 },
      height: 800,
      showlegend: false,
      hovermode: 'closest'
    };
    
    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
      displaylogo: false
    };
    
    Plotly.newPlot(chartContainer, [trace], layout, config);
    
    // Add click event for more details
    chartContainer.on('plotly_click', function(data) {
      const point = data.points[0];
      const index = point.pointIndex;
      const complaint = chartData[index];
      
      alert(
        `Complaint Details:\n\n` +
        `Address: ${complaint.address}\n` +
        `Duration: ${complaint.duration.toFixed(1)} hours\n` +
        `Created Date: ${complaint.createdDate.toLocaleDateString()}\n` +
        `Borough: ${complaint.borough}\n` +
        `Status: ${complaint.status}\n` +
        `Type: ${complaint.complaintType}`
      );
    });
  }
</script>

<main>
  <div class="container">
    <h1>NYC Elevator Complaints Duration Analysis</h1>
    
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading elevator complaints data...</p>
      </div>
    {:else if error}
      <div class="error">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button on:click={() => window.location.reload()}>Retry</button>
      </div>
    {:else}
      <div class="chart-info">
        <p>Showing {chartData.length} elevator complaints with duration data. Hover over bars to see details.</p>
        <div class="legend">
          <h3>Borough Colors:</h3>
          <div class="legend-items">
            <span class="legend-item"><span class="color-box" style="background-color: #ff6b6b;"></span> Bronx</span>
            <span class="legend-item"><span class="color-box" style="background-color: #4ecdc4;"></span> Brooklyn</span>
            <span class="legend-item"><span class="color-box" style="background-color: #45b7d1;"></span> Manhattan</span>
            <span class="legend-item"><span class="color-box" style="background-color: #96ceb4;"></span> Queens</span>
            <span class="legend-item"><span class="color-box" style="background-color: #feca57;"></span> Staten Island</span>
          </div>
        </div>
      </div>
      
      <div class="chart-container">
        <div bind:this={chartContainer} class="plotly-chart"></div>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>Total Complaints</h3>
          <p class="stat-number">{chartData.length}</p>
        </div>
        <div class="stat-card">
          <h3>Average Duration</h3>
          <p class="stat-number">{(chartData.reduce((sum, d) => sum + d.duration, 0) / chartData.length).toFixed(1)}h</p>
        </div>
        <div class="stat-card">
          <h3>Longest Wait</h3>
          <p class="stat-number">{Math.max(...chartData.map(d => d.duration)).toFixed(1)}h</p>
        </div>
        <div class="stat-card">
          <h3>Most Affected Borough</h3>
          <p class="stat-number">
            {(() => {
              const boroughCounts = {};
              chartData.forEach(d => {
                boroughCounts[d.borough] = (boroughCounts[d.borough] || 0) + 1;
              });
              return Object.entries(boroughCounts).sort((a, b) => b[1] - a[1])[0][0];
            })()}
          </p>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f8f9fa;
    color: #2c3e50;
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #2c3e50;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .loading {
    text-align: center;
    padding: 60px 20px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #ecf0f1;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error {
    text-align: center;
    padding: 40px 20px;
    background-color: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    margin: 20px 0;
  }
  
  .error button {
    background-color: #e53e3e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 15px;
    font-size: 16px;
  }
  
  .error button:hover {
    background-color: #c53030;
  }
  
  .chart-info {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .chart-info p {
    margin-bottom: 15px;
    font-size: 16px;
    color: #4a5568;
  }
  
  .legend h3 {
    margin-bottom: 10px;
    font-size: 14px;
    color: #2c3e50;
  }
  
  .legend-items {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #4a5568;
  }
  
  .color-box {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    margin-right: 8px;
    border: 1px solid #ddd;
  }
  
  .chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .plotly-chart {
    width: 100%;
    height: 800px;
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 30px;
  }
  
  .stat-card {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .stat-card h3 {
    color: #4a5568;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 15px;
    }
    
    h1 {
      font-size: 2rem;
    }
    
    .stats {
      grid-template-columns: 1fr;
    }
    
    .plotly-chart {
      height: 600px;
    }
  }
</style>
