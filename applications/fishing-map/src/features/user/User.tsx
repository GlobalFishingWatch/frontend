import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserData } from './user.slice'

function User() {
  const userData = useSelector(selectUserData)
  if (!userData) return null

  return (
    <div>
      <h3>User information</h3>
      <p>{userData.firstName}</p>
      {/* <p>{userData.lastName}</p> */}
      <p>{userData.email}</p>
    </div>
  )
}

export default User
