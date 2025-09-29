type MenuIconProps = React.SVGProps<SVGSVGElement>;
export function MenuIcon(props: MenuIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export function MountainIcon(props: MenuIconProps) {
  return (
    <svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <circle
        cx={100}
        cy={100}
        r={80}
        stroke="#6464FF"
        strokeWidth={10}
        fill="none"
        strokeDasharray={251.2}
        strokeDashoffset={50}
      />
      <text
        x="50%"
        y="50%"
        fontSize={60}
        fontWeight="bold"
        fill="#6464FF"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {"$"}
      </text>
    </svg>
  );
}
