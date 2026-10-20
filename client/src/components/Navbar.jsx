import { NavLink, Link } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/donate', label: 'Donate Food' },
  { to: '/find-food', label: 'Find Food' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-leaf" aria-hidden="true">🌿</span>
          Food<span className="brand-accent">Share</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/donate" className="btn btn-primary nav-cta">
          Donate Food
        </Link>
      </div>
    </header>
  );
}
