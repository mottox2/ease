import * as React from 'react'

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  icon: string
}

const MaterialIcon: React.SFC<Props> = props => {
  /* tslint:disable */
  const { icon, ...defaultProps } = props
  return (
    <i className="material-icons" {...defaultProps}>
      {icon}
    </i>
  )
}

export default MaterialIcon
