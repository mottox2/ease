import * as React from 'react'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  icon: string
}

const MaterialIcon: React.SFC<Props> = props => {
  /* tslint:disable */
  const { icon, style, ...defaultProps } = props
  return (
    <i className="material-icons" {...defaultProps} style={{ ...style, display: 'block' }}>
      {icon}
    </i>
  )
}

export default MaterialIcon
