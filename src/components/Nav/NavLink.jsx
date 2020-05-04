import React from 'react'
import {
  Link,
  useRouteMatch,
} from 'react-router-dom'

const iconMap = {
  home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`,
  chart: `<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>`,
  report: `<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>`,
}

const NavLink = ({ path, label, icon }) => {  
  let match = useRouteMatch({
    path: path,
    exact: true,
  })

  return (
    <>
    <Link className={match && match.path === path ? "nav-link active" : "nav-link"} to={path}>
      {icon && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home" dangerouslySetInnerHTML={{__html: iconMap[icon]}}></svg>}
      {label}
    </Link>
    </>
  )
}

export default NavLink
