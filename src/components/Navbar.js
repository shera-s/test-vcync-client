import 'bootstrap/dist/js/bootstrap.js';
import 'flag-icon-css/css/flag-icons.min.css'
import i18next from 'i18next'
import './Navbar.css'

const Navbar = () => {
  const languages = [
    {
      code: "en",
      name: "English",
      country_code: "gb",
    },
    {
      code: "ar",
      name: "العربية",
      country_code: "sa",
    },
  ];

  return (
    <nav className="container lang_contain">
    <div className="d-flex justify-content-end">

      <div className="dropdown">
        <button
          className="btn btn-link dropdown-toggle"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
        <i className="bi bi-globe"></i>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
          {languages.map(({ code, name, country_code }) => {
            return (
              <li key={country_code}>
                <button className="dropdown-item" onClick={()=>i18next.changeLanguage(code)}>
                <span className={`flag-icon flag-icon-${country_code} mx-2`}></span>
                {name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    </nav>
  );
};

export default Navbar;
