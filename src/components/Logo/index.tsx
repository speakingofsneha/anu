 // Props interface for the LordIcon component
 interface Props {
  color?: string; // Color of the LordIcon
  size?: number; // Size of the LordIcon
  strokeWidth?: number; // Stroke width of the LordIcon
}

// LordIcon component function
function Logo({ color, size = 24, strokeWidth = 4 }: Props) {
  return (
     // Container for the LordIcon
    <div
      className="pointer-events-none aspect-square"
      style={{
        height: size,
        width: size,
      }}
    >
       {/* SVG element for the LordIcon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={color ?? "currentColor"}
        viewBox="0 0 24 24"
        strokeWidth={strokeWidth}
        stroke={color ?? "currentColor"}
        className="size-6"
        style={{
          height: '100%',
          width: '100%'
        }}
      >
        {/* Path element defining the shape of the LordIcon */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    </div>
  );
}

export default Logo;  // Export the LordIcon component
