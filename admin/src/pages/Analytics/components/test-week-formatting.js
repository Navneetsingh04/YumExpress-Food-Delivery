// Test file to demonstrate the new month-wise weekly formatting
import { formatDateLabel, groupDataByPeriod, fillMissingWeeks, formatWeekLabelForDisplay } from './chartUtils.js';

// Sample data that might come from the backend
const sampleData = [
  { date: '2024-09-01', count: 10 },
  { date: '2024-09-05', count: 15 },
  { date: '2024-09-10', count: 20 },
  { date: '2024-09-15', count: 25 },
  { date: '2024-09-20', count: 18 },
  { date: '2024-09-25', count: 22 },
  { date: '2024-10-02', count: 30 },
  { date: '2024-10-08', count: 35 },
  { date: '2024-10-15', count: 28 },
];

console.log('=== Testing Month-wise Weekly Grouping ===');

// Transform data to expected format
const transformedData = sampleData.map(item => ({
  date: item.date,
  count: item.count
}));

console.log('1. Original data:', transformedData);

// Group by weekly period
const groupedData = groupDataByPeriod(transformedData, 'weekly');
console.log('2. Grouped by weeks:', groupedData);

// Fill missing weeks to show all 4 weeks per month
const filledData = fillMissingWeeks(groupedData, 'weekly');
console.log('3. With all 4 weeks filled:', filledData);

// Format labels for display
const displayLabels = filledData.map(item => formatWeekLabelForDisplay(item.date));
console.log('4. Display labels:', displayLabels);

console.log('=== Expected Output ===');
console.log('You should see labels like:');
console.log('- Sep\'24 - Week 1');
console.log('- Sep\'24 - Week 2'); 
console.log('- Sep\'24 - Week 3');
console.log('- Sep\'24 - Week 4');
console.log('- Oct\'24 - Week 1');
console.log('- Oct\'24 - Week 2');
console.log('- Oct\'24 - Week 3');
console.log('- Oct\'24 - Week 4');