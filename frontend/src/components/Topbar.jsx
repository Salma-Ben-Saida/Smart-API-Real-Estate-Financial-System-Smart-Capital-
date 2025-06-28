import './style.css';
import logo from './logo.png'
import FTopbar from './fTopbar';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="logo"><img src={logo} alt="SmartCapital Logo" className="logo-img" /></div>
      <input type="text" placeholder="Search..." className="search-bar" />
    </div>
  );
}
