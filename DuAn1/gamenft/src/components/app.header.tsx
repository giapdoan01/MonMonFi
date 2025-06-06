"use client";

import Link from "next/link";
import "../components/header.css";

export default function Navbar() {
  return (
    <nav >
      <div className="container-fluid">
        <Link href="/" >
            <img src="/img/LoGoMonfi.png" alt="Logo" className="logo"/>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Marketplace" className="nav-link">
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Fight" className="nav-link">
                Fight
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
