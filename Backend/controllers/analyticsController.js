import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// get date range for different periods
const getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate = now;
  
  // Set time to end of current day to avoid timezone issues
  now.setHours(23, 59, 59, 999);
  
  switch (period) {
    case 'daily':
      // Show data for the past 7 days (including today)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6); // 6 days ago + today = 7 days total
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'weekly':
      // Show data for the past 4 weeks
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 28); // 4 weeks
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      // Show data for the past 12 months
      startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'yearly':
      // Show data for the past 5 years
      startDate = new Date(now.getFullYear() - 4, 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
  }
  
  return { startDate, endDate };
};

const formatDateForPeriod = (date, period) => {
  const d = new Date(date);
  switch (period) {
    case 'yearly':
      return d.getFullYear().toString();
    case 'monthly':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    default:
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
};

// Get orders overview data
const getOrdersOverview = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get all orders for the period
    const orders = await orderModel.find({
      createdAt: { 
        $gte: startDate,
        $lte: endDate 
      }
    }).select('status createdAt').lean();

    // Process data in JavaScript instead of aggregation
    const totalOrders = orders.length;
    
    // Count orders by status
    const ordersByStatus = {};
    orders.forEach(order => {
      const status = order.status || 'Unknown';
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    // Convert to array format
    const ordersByStatusArray = Object.entries(ordersByStatus).map(([status, count]) => ({
      _id: status,
      count
    }));

    // Create trend data - only show days with actual orders
    const trendData = {};
    orders.forEach(order => {
      const dateKey = formatDateForPeriod(order.createdAt, period);
      trendData[dateKey] = (trendData[dateKey] || 0) + 1;
    });

    const ordersTrend = Object.entries(trendData)
      .map(([date, count]) => ({ _id: date, count }))
      .sort((a, b) => a._id.localeCompare(b._id));

    res.json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus: ordersByStatusArray,
        ordersTrend,
        period,
        dateRange: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error("Error in getOrdersOverview:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching orders overview",
      error: error.message 
    });
  }
};

// Get revenue data 
const getRevenueData = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    // Get all orders for the period
    const orders = await orderModel.find({
      createdAt: { 
        $gte: startDate,
        $lte: endDate 
      }
    }).select('amount payment createdAt').lean();

    // Calculate totals in JavaScript
    let totalRevenue = 0;
    let paidRevenue = 0;
    let totalOrders = orders.length;
    let paidOrders = 0;
    const trendData = {};

    orders.forEach(order => {
      const amount = order.amount || 0;
      const isPaid = order.payment === true;
      
      totalRevenue += amount;
      if (isPaid) {
        paidRevenue += amount;
        paidOrders++;
      }

      // Trend data - only create entries for days with actual orders
      const dateKey = formatDateForPeriod(order.createdAt, period);
      if (!trendData[dateKey]) {
        trendData[dateKey] = {
          revenue: 0,
          paidRevenue: 0,
          orders: 0,
          paidOrders: 0
        };
      }
      trendData[dateKey].revenue += amount;
      trendData[dateKey].orders += 1;
      if (isPaid) {
        trendData[dateKey].paidRevenue += amount;
        trendData[dateKey].paidOrders += 1;
      }
    });

    // Convert trend data to array
    const revenueTrend = Object.entries(trendData)
      .map(([date, data]) => ({ _id: date, ...data }))
      .sort((a, b) => a._id.localeCompare(b._id));

    res.json({
      success: true,
      data: {
        totalRevenue,
        paidRevenue,
        totalOrders,
        paidOrders,
        averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
        paidAverageOrderValue: paidOrders > 0 ? Math.round((paidRevenue / paidOrders) * 100) / 100 : 0,
        revenueTrend,
        period,
        dateRange: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error("Error in getRevenueData:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching revenue data",
      error: error.message 
    });
  }
};

// Get customer analytics
const getCustomerAnalytics = async (req, res) => {
  try {
     const { period = 'daily' } = req.query;
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    // Get all users
    const allUsers = await userModel.find({}).select('createdAt').lean();
    const totalUsers = allUsers.length;

    // Count new users
    let newUsersThisMonth = 0;
    let newUsersLastMonth = 0;
    let usersWithoutCreatedAt = 0;
    const growthData = {};

    allUsers.forEach(user => {
      if (!user.createdAt) {
        usersWithoutCreatedAt++;
        return;
      }

      const userDate = new Date(user.createdAt);
      
      // Count monthly users
      if (userDate >= startOfMonth) {
        newUsersThisMonth++;
      } else if (userDate >= startOfLastMonth && userDate < startOfMonth) {
        newUsersLastMonth++;
      }

      // Growth trend - only show days with actual new users
      const daysBack = period === 'daily' ? 7 : 30;
      const daysAgo = new Date(now.getTime() - (daysBack - 1) * 24 * 60 * 60 * 1000);
      daysAgo.setHours(0, 0, 0, 0);
      
      if (userDate >= daysAgo) {
        const dateKey = formatDateForPeriod(userDate, 'daily');
        growthData[dateKey] = (growthData[dateKey] || 0) + 1;
      }
    });

    // Get active users (users who placed orders this month)
    const activeUserIds = await orderModel.distinct('userId', {
      createdAt: { $gte: startOfMonth }
    });
    const activeUsers = activeUserIds.length;

    // Get returning customers (users with more than 1 order)
    const orderCounts = await orderModel.aggregate([
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 }
        }
      }
    ]);
    
    const returningCustomers = orderCounts.filter(user => user.orderCount > 1).length;

    // Convert growth data to array
    const customerGrowth = Object.entries(growthData)
      .map(([date, newUsers]) => ({ _id: date, newUsers }))
      .sort((a, b) => a._id.localeCompare(b._id));

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth,
        newUsersLastMonth,
        usersWithoutCreatedAt,
        activeUsers,
        returningCustomers,
        customerGrowth,
        note: usersWithoutCreatedAt > 0 ? `${usersWithoutCreatedAt} users don't have createdAt field` : null
      }
    });
  } catch (error) {
    console.error("Error in getCustomerAnalytics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching customer analytics",
      error: error.message 
    });
  }
};

// Get top metrics 
const getTopMetrics = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get all orders for this month
    const orders = await orderModel.find({
      createdAt: { $gte: startOfMonth }
    }).select('items').lean();

    // Process items data
    const itemStats = {};
    const categoryStats = {};

    // Get all food items for reference
    const allFoods = await foodModel.find({}).select('_id name category image description').lean();
    const foodMap = {};
    allFoods.forEach(food => {
      foodMap[food._id.toString()] = food;
    });

    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const foodId = item.foodId?.toString();
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const revenue = quantity * price;

          // Item stats
          if (!itemStats[foodId]) {
            const foodInfo = foodMap[foodId];
            itemStats[foodId] = {
              _id: foodId,
              name: item.name || foodInfo?.name || 'Unknown Item',
              price: price,
              totalQuantity: 0,
              totalRevenue: 0,
              image: item.image || foodInfo?.image || null,
              category: foodInfo?.category || 'Unknown',
              description: foodInfo?.description || ''
            };
          }
          itemStats[foodId].totalQuantity += quantity;
          itemStats[foodId].totalRevenue += revenue;

          // Category stats
          const category = foodMap[foodId]?.category || 'Unknown';
          if (!categoryStats[category]) {
            categoryStats[category] = {
              _id: category,
              totalQuantity: 0,
              totalRevenue: 0,
              uniqueItems: new Set()
            };
          }
          categoryStats[category].totalQuantity += quantity;
          categoryStats[category].totalRevenue += revenue;
          categoryStats[category].uniqueItems.add(foodId);
        });
      }
    });

    // Convert to arrays and sort
    const topSellingItems = Object.values(itemStats)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10)
      .map(item => ({
        ...item,
        totalRevenue: Math.round(item.totalRevenue * 100) / 100
      }));

    const topCategories = Object.values(categoryStats)
      .map(cat => ({
        _id: cat._id,
        totalQuantity: cat.totalQuantity,
        totalRevenue: Math.round(cat.totalRevenue * 100) / 100,
        uniqueItems: cat.uniqueItems.size
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        topSellingItems,
        topCategories
      }
    });
  } catch (error) {
    console.error("Error in getTopMetrics:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching top metrics",
      error: error.message 
    });
  }
};

// Get dashboard summary 
const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Get today's orders
    const todayOrders = await orderModel.find({
      createdAt: { 
        $gte: startOfToday,
        $lte: now 
      }
    }).select('amount payment').lean();

    // Get month's orders
    const monthOrders = await orderModel.find({
      createdAt: { 
        $gte: startOfMonth,
        $lte: now 
      }
    }).select('amount payment').lean();

    // Calculate today's stats
    let todayTotalRevenue = 0;
    let todayPaidRevenue = 0;
    todayOrders.forEach(order => {
      const amount = order.amount || 0;
      todayTotalRevenue += amount;
      if (order.payment === true) {
        todayPaidRevenue += amount;
      }
    });

    // Calculate month's stats
    let monthTotalRevenue = 0;
    let monthPaidRevenue = 0;
    monthOrders.forEach(order => {
      const amount = order.amount || 0;
      monthTotalRevenue += amount;
      if (order.payment === true) {
        monthPaidRevenue += amount;
      }
    });

    // Get other counts
    const totalCustomers = await userModel.countDocuments();
    const totalFoodItems = await foodModel.countDocuments();
    const pendingOrders = await orderModel.countDocuments({
      status: { $in: ["Food Processing", "Out for delivery"] }
    });

    // Get payment stats
    const allOrders = await orderModel.find({}).select('payment amount').lean();
    const paymentStats = { true: { count: 0, totalAmount: 0 }, false: { count: 0, totalAmount: 0 } };
    
    allOrders.forEach(order => {
      const isPaid = order.payment === true;
      const key = isPaid.toString();
      paymentStats[key].count++;
      paymentStats[key].totalAmount += order.amount || 0;
    });

    const paymentStatsArray = Object.entries(paymentStats).map(([paid, data]) => ({
      _id: paid === 'true',
      count: data.count,
      totalAmount: Math.round(data.totalAmount * 100) / 100
    }));

    res.json({
      success: true,
      data: {
        todayOrders: todayOrders.length,
        todayRevenue: Math.round(todayTotalRevenue * 100) / 100,
        todayPaidRevenue: Math.round(todayPaidRevenue * 100) / 100,
        monthOrders: monthOrders.length,
        monthRevenue: Math.round(monthTotalRevenue * 100) / 100,
        monthPaidRevenue: Math.round(monthPaidRevenue * 100) / 100,
        totalCustomers,
        totalFoodItems,
        pendingOrders,
        paymentStats: paymentStatsArray,
        dateRange: {
          today: { start: startOfToday, end: now },
          month: { start: startOfMonth, end: now }
        }
      }
    });
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching dashboard summary",
      error: error.message 
    });
  }
};

export {
  getOrdersOverview,
  getRevenueData,
  getCustomerAnalytics,
  getTopMetrics,
  getDashboardSummary
};