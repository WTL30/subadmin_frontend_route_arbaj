"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  MdTrendingUp,
  MdAccessTime,
  MdLocalGasStation,
  MdAttachMoney,
} from "react-icons/md"

export default function TripAnalytics({ gpsData }) {
  const [timeRange, setTimeRange] = useState("today")

  const analytics = {
    totalTrips: gpsData.filter((cab) => cab.tripId).length,
    totalDistance: gpsData.reduce((sum, cab) => sum + cab.distanceTraveled, 0),
    avgSpeed: Math.round(
      gpsData.reduce((sum, cab) => sum + cab.speed, 0) / gpsData.length
    ),
    fuelEfficiency: 12.5, // km/l
    revenue: 15420, // Mock revenue
    activeHours: 8.5,
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Trip Analytics</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Trips</p>
              <p className="text-xl font-bold text-white">{analytics.totalTrips}</p>
            </div>
            <MdTrendingUp className="text-green-400" size={24} />
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Distance</p>
              <p className="text-xl font-bold text-white">{analytics.totalDistance.toFixed(1)} km</p>
            </div>
            <MdTrendingUp className="text-blue-400" size={24} />
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Speed</p>
              <p className="text-xl font-bold text-white">{analytics.avgSpeed} km/h</p>
            </div>
            <MdAccessTime className="text-purple-400" size={24} />
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fuel Efficiency</p>
              <p className="text-xl font-bold text-white">{analytics.fuelEfficiency} km/l</p>
            </div>
            <MdLocalGasStation className="text-yellow-400" size={24} />
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-xl font-bold text-white">₹{analytics.revenue.toLocaleString()}</p>
            </div>
            <MdAttachMoney className="text-green-400" size={24} />
          </div>
        </motion.div>

        <motion.div className="p-4 bg-gray-700 rounded-lg" whileHover={{ scale: 1.02 }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Hours</p>
              <p className="text-xl font-bold text-white">{analytics.activeHours}h</p>
            </div>
            <MdAccessTime className="text-orange-400" size={24} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
