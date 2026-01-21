export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 15 15" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M7.5 0V7.5M7.5 7.5V15M7.5 7.5H0M7.5 7.5H15" 
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
  )
}

