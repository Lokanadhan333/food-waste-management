import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <h3 className="footer-brand">
            Food<span className="brand-accent">Share</span>
          </h3>
          <p>Sharing surplus food, reducing waste, feeding lives.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/donate">Donate Food</Link>
          <Link to="/find-food">Find Food</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} FoodShare. Built to fight food waste.</p>
      </div>
    </footer>
  );
}
