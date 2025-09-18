// Chart configuration utilities

// Date formatting utility function
export const formatDateLabel = (dateString, period) => {
  // Handle different date formats from backend
  let date;
  
  // If it's already a year (e.g., "2024")
  if (typeof dateString === 'string' && dateString.length === 4 && !isNaN(dateString)) {
    return dateString;
  }
  
  // If it's in YYYY-MM format for monthly
  if (typeof dateString === 'string' && dateString.includes('-') && dateString.split('-').length === 2) {
    const [year, month] = dateString.split('-');
    date = new Date(year, month - 1, 1);
  } else {
    // Regular date parsing
    date = new Date(dateString);
  }
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if can't parse
  }
  
  switch(period) {
    case 'daily':
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
   case 'weekly':
  // Calculate week number within the current month
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const pastDaysOfMonth = (date - startOfMonth) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfMonth + startOfMonth.getDay() + 1) / 7);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-Week ${weekNumber}`;
    case 'monthly':
      return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    case 'yearly':
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString('en-IN');
  }
};

// Shared utility function for grouping data by period
export const groupDataByPeriod = (data, period) => {
  if (period !== 'weekly') return data;
  
  const groupedData = {};
  
  data.forEach(item => {
    const date = new Date(item.date);
    const weekLabel = formatDateLabel(date, 'weekly');
    
    if (!groupedData[weekLabel]) {
      groupedData[weekLabel] = {
        date: weekLabel,
        value: 0,
        count: 0,
        revenue: 0,
        total: 0,
        customers: 0
      };
    }
    
    // Handle different data structures
    groupedData[weekLabel].value += item.value || 0;
    groupedData[weekLabel].count += item.count || 0;
    groupedData[weekLabel].revenue += item.revenue || 0;
    groupedData[weekLabel].total += item.total || 0;
    groupedData[weekLabel].customers += item.customers || 0;
  });
  
  return Object.values(groupedData).sort((a, b) => {
    // Parse the date format: "YYYY-MM-Week X"
    const parseWeekLabel = (label) => {
      const parts = label.split('-Week ');
      const [year, month] = parts[0].split('-');
      const week = parseInt(parts[1]);
      return { year: parseInt(year), month: parseInt(month), week };
    };
    
    const weekA = parseWeekLabel(a.date);
    const weekB = parseWeekLabel(b.date);
    
    // Sort by year, then month, then week
    if (weekA.year !== weekB.year) return weekA.year - weekB.year;
    if (weekA.month !== weekB.month) return weekA.month - weekB.month;
    return weekA.week - weekB.week;
  });
};

// Helper function to ensure all 4 weeks are shown for each month
export const fillMissingWeeks = (data, period) => {
  if (period !== 'weekly' || !data.length) return data;
  
  const filledData = [];
  const monthsSet = new Set();
  
  // Collect all unique months from the data
  data.forEach(item => {
    const parts = item.date.split('-Week ');
    const monthKey = parts[0]; // "YYYY-MM"
    monthsSet.add(monthKey);
  });
  
  // For each month, ensure all 4 weeks are present
  Array.from(monthsSet).sort().forEach(monthKey => {
    for (let week = 1; week <= 4; week++) {
      const weekLabel = `${monthKey}-Week ${week}`;
      const existingData = data.find(item => item.date === weekLabel);
      
      if (existingData) {
        filledData.push(existingData);
      } else {
        // Add missing week with zero values
        filledData.push({
          date: weekLabel,
          value: 0,
          count: 0,
          revenue: 0,
          total: 0,
          customers: 0
        });
      }
    }
  });
  
  return filledData;
};

// Helper function to format week labels for display
export const formatWeekLabelForDisplay = (weekLabel) => {
  // Convert "2024-09-Week 1" to "Sep'24 - Week 1"
  const parts = weekLabel.split('-Week ');
  const [year, month] = parts[0].split('-');
  const weekNum = parts[1];
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[parseInt(month) - 1];
  const shortYear = year.slice(-2);
  
  return `${monthName}'${shortYear} - Week ${weekNum}`;
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, weight: 600 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 600 },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context) {
          const value = context.parsed.y;
          if (context.dataset.label.includes('Revenue')) {
            return `${context.dataset.label}: ₹${value.toLocaleString()}`;
          } else {
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        },
        title: function(context) {
          const label = context[0].label;
          return `Period: ${label}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        font: { size: 11 },
        maxRotation: 45
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        font: { size: 11 },
        callback: function(value) {
          return '₹' + value.toLocaleString();
        }
      }
    }
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 5,
      hoverRadius: 8,
      hitRadius: 10
    }
  }
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 500
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 600 },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context) {
          const value = context.parsed.y;
          if (context.dataset.label.includes('Revenue')) {
            return `${context.dataset.label}: ₹${value.toLocaleString()}`;
          } else {
            return `${context.dataset.label}: ${value.toLocaleString()}`;
          }
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { size: 11 }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: { size: 11 }
      }
    }
  }
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: 500
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: { size: 14, weight: 600 },
      bodyFont: { size: 12 },
      cornerRadius: 8,
      padding: 12,
      callbacks: {
        label: function(context) {
          const value = context.parsed;
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '60%'
};

// Image utility function
export const getImageUrl = (foodImage, url) => {
  // If no image data, return null to show fallback div
  if (!foodImage || foodImage === null || foodImage === undefined) {
    return null;
  }
  
  // If it's a full URL (Cloudinary), use it directly
  if (typeof foodImage === 'string' && foodImage.startsWith('http')) {
    // Ensure HTTPS and add optimization if it's Cloudinary
    if (foodImage.includes('cloudinary.com')) {
      const secureUrl = foodImage.replace('http://', 'https://');
      // Add optimization
      if (!secureUrl.includes('/w_60')) {
        const optimizedUrl = secureUrl.replace('/upload/', '/upload/w_60,h_60,c_fill,f_auto,q_auto/');
        return optimizedUrl;
      }
      return secureUrl;
    }
    return foodImage;
  }
  
  // If it's a local file path that starts with /uploads/, construct server URL
  if (typeof foodImage === 'string' && foodImage.startsWith('/uploads/')) {
    const fullUrl = `${url}${foodImage}`;
    return fullUrl;
  }
  
  // If it's a local file path without /uploads/, add it
  if (typeof foodImage === 'string' && foodImage.length > 0) {
    const fullUrl = `${url}/uploads/${foodImage}`;
    return fullUrl;
  }
  
  // No valid image found
  return null;
};