const LogoIcon = () => (
    <svg
        width="120"
        height="48"
        viewBox="0 0 60 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <!-- Document --> */}
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10,9 9,9 8,9"></polyline>

        {/* <!-- Arrow --> */}
        <path d="M22 12h12" strokeWidth="1.5"></path>
        <path d="M31 9l3 3-3 3" strokeWidth="1.5"></path>

        {/* <!-- Calendar --> */}
        <rect x="38" y="4" width="18" height="16" rx="2" ry="2"></rect>
        <line x1="42" y1="2" x2="42" y2="6"></line>
        <line x1="50" y1="2" x2="50" y2="6"></line>
        <line x1="38" y1="9" x2="56" y2="9"></line>
        <circle cx="42" cy="12" r="1" fill="currentColor"></circle>
        <circle cx="46" cy="12" r="1" fill="currentColor"></circle>
        <circle cx="50" cy="12" r="1" fill="currentColor"></circle>
        <circle cx="42" cy="16" r="1" fill="currentColor"></circle>
        <circle cx="46" cy="16" r="1" fill="currentColor"></circle>
    </svg>
)

export default LogoIcon;