const axios = require('axios')

exports.getTodayRevenue = async (socket, cafeId) => {
  try {
    const res = await axios.get(`/get_total_revenue_by_day/${cafeId}`)
    socket.emit("TodayRevenue", res.revenue)
    return res.revenue
  } catch (error) {
    console.error(`Error: ${error.code}`)
  }
}