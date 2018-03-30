import * as React from 'react'

interface Props {
  icon: string
  style?: Object
}

const MaterialIcon: React.SFC<Props> = ({ icon, style }) => {
  return (
    <i className="material-icons" style={{ ...style, display: 'block' }}>
      {icon}
    </i>
  )
}

export default MaterialIcon
