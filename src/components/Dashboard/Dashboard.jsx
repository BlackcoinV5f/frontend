// src/components/Dashboard/Dashboard.jsx
import React from 'react'
import UserInfoCard from './UserInfoCard'
import StatsCard from './StatsCard'
import TransactionHistory from './TransactionHistory'
import ReferralSection from './ReferralSection'
import MyActions from './MyActions'

const Dashboard = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* User Info */}
      <div className="col-span-1">
        <UserInfoCard />
      </div>

      {/* Stats */}
      <div className="col-span-1 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard title="Points" value="1200" icon="star" />
        <StatsCard title="Wallet" value="₿ 0.042" icon="wallet" />
      </div>

      {/* My Actions */}
      <div className="col-span-1 xl:col-span-3">
        <MyActions />
      </div>

      {/* Transactions */}
      <div className="col-span-1 md:col-span-2">
        <TransactionHistory />
      </div>

      {/* Referrals */}
      <div className="col-span-1">
        <ReferralSection />
      </div>
    </div>
  )
}

export default Dashboard
